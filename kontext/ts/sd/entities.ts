import {AppModel, fillApp, RESTData, restoreObject, sdSwal} from "kontext/sd/appmodel";
import {ID, idToString, IEntity, Map} from "kontext/sd/types";
import {capitalizeFirstLetter, getProperty, isArrayEmpty, isEmpty, isProperty, sd, setProperty, TUri, Uri} from "kontext/sd/sd";
import {ListEntityControl, ListEntityControlEditable} from "kontext/sd/entitylists";
import {Computed, observable, Observable, ObservableArray, pureComputed} from "knockout";

declare let document: Document;
declare let app: AppModel;
declare let entityId: number;
export type UriData = string | number | ID | undefined;

export interface IEntityOptions {
	attributes: string[]
	name: string
	genitive?: string
	urlEntity?: string
	projection?: string
	sort?: string
	search?: string
	links?: Map<string>
	agregationLinks?: Map<string>
	formId?: string
}

export class EntitySubscribed implements Map<any> {
	[key: string]: Observable
	
	id: Observable<ID>;
}

type TObservable<T> = Observable<T> | ObservableArray<T>

//PART EntityControl interfaces
export interface EntityGettable<TEntity extends IEntity> extends EntityControl<TEntity> {
	controlGet: EntityGet<TEntity, EntityGettable<TEntity>>;
}

export interface EntityEditable<TEntity extends IEntity> extends EntityControl<TEntity> {
	controlEdit: EntityEdit<TEntity, EntityEditable<TEntity>>;
	
	beforePost? (entity: TEntity): void
	
	postCreate? (entity: TEntity): boolean
	
	postPut? (entity: TEntity): void
	
	postDelete? (): boolean
	
	postCancel? (): void
}

export interface EntityGettableAndEditable<TEntity extends IEntity> extends EntityEditable<TEntity> {
	controlGet: EntityGet<TEntity, EntityGettableAndEditable<TEntity>>;
}

export interface EntityListable<TEntity extends IEntity> extends EntityControl<TEntity> {
	controlList: EntityList<TEntity, EntityListable<TEntity>>;
}

export interface EntityListableAndEditable<TEntity extends IEntity> extends EntityEditable<TEntity> {
	controlList: EntityListEdit<TEntity, EntityListableAndEditable<TEntity>>;
	
	postCreate (entity: TEntity): boolean // должен возвращать controlList.postCreate(entity)
	postDelete (): boolean // должен возвращать controlList.postDelete()
	postCancel (): void // должен возвращать controlList.postCancel()
}

//PART main EntityControl data class
export abstract class EntityControl<TEntity extends IEntity> { // simple entity
	entity: TEntity;
	entys: EntitySubscribed = {id: observable(null)};
	id: Computed<ID> = pureComputed(() => this.entys.id());
	
	constructor (entity?: TEntity) {
		this.fill(entity);
	}
	
	abstract options (): IEntityOptions;
	
	attributes (): string[] {
		return <string[]>this.option("attributes");
	}
	
	fill (entity?: TEntity): void {
		entity = this.beforeFill(entity);
		if (entity) this.entity = entity;
		fillApp(this.attributes(), entity, this.entys);
		if (entity) this.postFill(entity);
	}
	
	restore (): TEntity {
		return restoreObject(this.attributes(), this.entys);
	}
	
	restoreChanges (): void {
		this.fill(this.entity);
	}
	
	beforeFill (entity?: TEntity): TEntity | undefined {
		return entity;
	}
	
	postFill (entity: TEntity): void {
	}
	
	option<T> (name: string, ifNull?: T): T {
		return getProperty(this.options, name, ifNull)
	}
	
	isAttribute (name: string): boolean {
		return isProperty(this.entys, name);
	}
	
	attribute (name: string): TObservable<any> {
		return getProperty(this.entys, name)
	}
	
	getAttributeValue (name: string): any {
		return getProperty(this.entys, name + "()")
	}
	
	oldAttribute (name: string): any {
		return getProperty(this.entity, name);
	}
}

//PART EntityControl Decorators
abstract class EntityControlDecorator<TEntity extends IEntity, TControl extends EntityControl<TEntity>> {
	control: TControl;
	
	constructor (control: TControl) {
		this.control = control;
	}
}

//ToDo добавить шаблон TListControl extends ListEntityControl<TEntity, TControl> и унаследовать от него list
export class EntityList<TEntity extends IEntity, TControl extends EntityListable<TEntity>> extends EntityControlDecorator<TEntity, TControl> {
	list: ListEntityControl<TEntity, TControl>;
	
	remove (): void {
		if (this.list) {
			this.beforeRemove();
			this.list.remove(this.control);
		}
	}
	
	beforeRemove (): void {
	}
	
	swalRemove (): void {
		sdSwal("удалить", this.control.option<string>("name"), this.remove);
	}
}

export class EntityGet<TEntity extends IEntity, TControl extends EntityGettable<TEntity>> extends EntityControlDecorator<TEntity, TControl> {
	appRest (): string {
		return RESTData;
	}
	
	uri (): Uri {
		let projection = this.control.option("projection");
		return new Uri([this.appRest(), this.control.option<string>("urlEntity")], (projection) ? {
			projection: projection
		} : undefined);
	}
	
	getUrlOne (id?: ID): Uri {
		return this.uri()
				.withPath((id === undefined ? this.control.id() : id) + "");
	}
	
	getUrlGet (urlData: UriData): TUri {
		switch (typeof urlData) {
			case "string":
				return <string>urlData;
			case "number":
				return this.getUrlOne(urlData);
			case "undefined":
				return this.getUrlOne(entityId);
			default:
				sd.info("Обратитесь к разработчику",
						"Непредусмотренный формат данных для URL: " + urlData);
				return "";
		}
	}
	
	restGet (urlData?: UriData, postFill?: (entity: TEntity) => void): JQueryPromise<any> {
		return sd.get(this.getUrlGet(urlData), (entity: TEntity) => {
			this.control.fill(entity);
			if (postFill) postFill(entity);
		});
	}
}

export class EntityEdit<TEntity extends IEntity, TControl extends EntityEditable<TEntity>> extends EntityControlDecorator<TEntity, TControl> {
	isEdit: Observable<boolean> = observable(false);
	changes: Observable<Map<any>> = observable({});
	saveText: Computed<string> = pureComputed(() => this.control.id() ?
			"сохранить" :
			"создать");
	isNew: Computed<boolean> = pureComputed(() => isEmpty(this.control.id()));
	isChanged: Computed<boolean> = pureComputed(() => {
		let isChanged = false;
		for (let attribute of this.control.attributes()) if (this.changes()[attribute]) {
			isChanged = true;
		}
		app.onbeforeunload(isChanged);
		return isChanged;
	}).extend({notify: "always"});
	isEditable: Computed<boolean> = pureComputed(() => !this.isEdit() && !this.isNew());
	isDeletable: Computed<boolean> = pureComputed(() => !this.isNew());
	isSaveable: Computed<boolean> = pureComputed(() => this.isChanged() &&
			this.isValidity());
	formId: Computed<string> = pureComputed(() => this.control.option<string>("formId"));
	
	constructor (control: TControl) {
		super(control);
		this.fillChange();
	}
	
	isValidity (): boolean {
		let formId = this.formId();
		if (!isEmpty(formId)) {
			let form = document!.getElementById(formId);
			if (!form) {
				throw new Error(`Форма ${formId} отсутствует на странице. Обратитесь к разработчику`);
			}
			return (<HTMLFormElement>form).checkValidity();
		}
		return true;
	}
	
	fillChange (): void {
		let changes = this.changes();
		for (let attributeName of this.control.attributes()) {
			let attribute = this.control.attribute(attributeName);
			attribute.subscribe((newValue: any) => {
				let changes = this.changes();
				let oldValue = getProperty<any>(this.control, "entity." + attributeName, null);
				let isChange = false;
				if (oldValue != null && typeof oldValue === "object") {
					if (newValue ==
							null ||
							(Array.isArray(oldValue) && oldValue.length !== newValue.length))
					{
						isChange = true;
					}
					else {
						for (let i in oldValue) if (oldValue[i] != newValue[i]) {
							isChange = true;
							break;
						}
					}
				}
				else {
					isChange = (oldValue != newValue);
				}
				changes[attributeName] = isChange;
				this.changes(changes);
			}, attribute, "change");
			changes[attributeName] = false;
		}
		this.changes(changes);
	}
	
	clearChanges (): void {
		let changes = this.changes();
		for (let attribute in changes) changes[attribute] = false;
		this.changes(changes);
	}
	
	restore (): TEntity {
		return this.control.restore();
	}
	
	edit (): void {
		this.isEdit(true);
	}
	
	private restoreIdAndFill (entity: TEntity): TEntity {
		let newId = entity.id;
		if (!newId) {
			if (isProperty(entity, "_links.self.href")) {
				let self = getProperty<string>(entity, "_links.self.href");
				newId = parseInt(self.substr(self.lastIndexOf("/") + 1,
						self.length - self.lastIndexOf("/")));
			}
			else sd.error("ID сохраненной сущности не опознано (" + newId + ")",
					"обратитесь разработчику",
					{timeOut: 1000});
			entity = this.control.restore();
			entity.id = newId;
		}
		this.control.fill(entity);
		return entity;
	}
	
	save (): void {
		if (!this.isValidity()) {
			throw new Error("перед Сохранением проверьте значения помеченные красным!");
		}
		let entity = this.restore();
		let name = capitalizeFirstLetter(this.control.option<string>("name"));
		if (this.isNew()) {
			if (this.control.beforePost) this.control.beforePost(entity);
			this.doPost(entity, (entity: TEntity) => {
				entity = this.restoreIdAndFill(entity);
				let onHidden;
				if (this.control.postCreate ? this.control.postCreate(entity) : true) {
					onHidden = () => {
						app.onbeforeunload(false);
						location.href = sd.uri([<string>this.control.option("urlEntity"),
							idToString(<ID>entity.id)]);
					};
				}
				sd.success(name + " успешно создан(а,о)", "", {
					onHidden: onHidden, timeOut: 1000
				});
			});
		}
		else {
			this.doPut(entity, (entity: TEntity) => {
				entity = this.restoreIdAndFill(entity);
				this.clearChanges();
				if (this.control.postPut) this.control.postPut(entity);
				sd.success(name + " успешно сохранен(а,о)", "", {timeOut: 1500});
			});
		}
		this.isEdit(false);
	}
	
	cancel (): void {
		if (!this.isNew()) this.control.restoreChanges();
		this.isEdit(false);
		if (this.control.postCancel) this.control.postCancel();
	}
	
	deleteEntity (isNotAsk?: boolean): void {
		let doDelete = () => {
			this.doDelete(() => {
				let onHidden;
				if (this.control.postDelete ? this.control.postDelete() : true) {
					onHidden = () => {
						app.onbeforeunload(false);
						location.href = sd.uri(this.control.option<string>("urlEntity"));
					};
				}
				sd.warning(`${capitalizeFirstLetter(this.control.option<string>("name"))} удален(а,о)`,
						"",
						{onHidden: onHidden, timeOut: 1000});
			});
		};
		if (isNotAsk === true) {
			doDelete();
		}
		else {
			sdSwal("удалить", this.control.option<string>("genitive"), doDelete);
		}
	}
	
	doPost (entity: TEntity, callBack: (entity: TEntity) => void): void {
		callBack(entity);
	}
	
	doPut (entity: TEntity, callBack: (entity: TEntity) => void): void {
		callBack(entity);
	}
	
	doDelete (callBack: () => void): void {
		callBack();
	}
}

export class EntityListEdit<TEntity extends IEntity, TControl extends EntityListableAndEditable<TEntity>> extends EntityList<TEntity, TControl> {
	list: ListEntityControlEditable<TEntity, TControl>;
	
	postCreate (entity: TEntity): boolean {
		if (this.list && this.list.listEdit.creatingEntity() === this.control) {
			this.list.listEdit.creatingEntity(null);
		}
		return false;
	}
	
	postDelete (): boolean {
		if (this.list) {
			this.list.remove(this.control);
		}
		return false;
	}
	
	postCancel (): void {
		if (this.list != null && this.control.controlEdit.isNew()) {
			this.list.remove(this.control);
			this.list
					.listEdit
					.creatingEntity(null);
		}
	}
}

export class EntityEditRest<TEntity extends IEntity, TControl extends EntityGettableAndEditable<TEntity>> extends EntityEdit<TEntity, TControl> {
	private linksForeach (linksOption: string,
			linkHandler: (attribute: string, link: string) => void)
	{
		let links = this.control.option<Map<string>>(linksOption);
		if (links) {
			for (let attribute in links) if (links.hasOwnProperty(attribute)) {
				linkHandler(attribute, links[attribute]);
			}
			else {
				throw new Error(`в this.options.${linksOption} отсутствует атрибут ${attribute}`);
			}
		}
	}
	
	restore (): TEntity {
		let entity = super.restore();
		this.linksForeach("links", (attribute: string, link: string) => {
			let action;
			if (this.isNew() || this.control.oldAttribute(attribute) == null) {
				action = (entity[attribute] == null) ? "delete" : "link";
			}
			else {
				if (entity[attribute] != null) {
					action = (this.control.oldAttribute(attribute).id === entity[attribute].id) ?
							"delete" :
							"link";
				}
			}
			if (action === "delete") {
				delete entity[attribute];
			}
			else {
				if (action === "link") {
					setProperty(entity,
							attribute,
							sd.uri([link.indexOf("/") > -1 ? "" : RESTData,
								link,
								entity[attribute].id]));
				}
			}
		});
		this.linksForeach("agregationLinks", (attribute: string) => delete entity[attribute]);
		return entity;
	}
	
	restoreJSON (): string {
		return JSON.stringify(this.restore());
	}
	
	getUrlPut (id?: ID): TUri {
		return this.control.controlGet.getUrlOne(id).withParameters({projection: ""});
	}
	
	getUrlPost (): TUri {
		return this.control.controlGet.uri().withParameters({projection: ""});
	}
	
	getUrlDetete (): TUri {
		return this.control.controlGet.getUrlOne().withParameters({projection: ""});
	}
	
	doPost (entity: TEntity, callBack: (entity: TEntity) => void): void {
		sd.post(this.getUrlPost(), JSON.stringify(entity), callBack);
	}
	
	doPut (entity: TEntity, callBack: (entity: TEntity) => void): void {
		let changedLinks: string[] = [];
		this.linksForeach("links", (attribute: string, link: string) => {
			if (this.changes()[attribute]) changedLinks.push(attribute);
		});
		if (changedLinks.length === 0) {
			sd.put(this.getUrlPut(), JSON.stringify(entity), callBack);
		}
		else {
			let entityResult: TEntity = <TEntity>{};
			sd.put(this.getUrlPut(), JSON.stringify(entity), (result: TEntity) => {
				entityResult = result;
				let uri = this
						.control.controlGet
						.getUrlOne()
						.withParameters({projection: ""});
				
				function putLink (self: EntityEditRest<TEntity, TControl>) {
					let link = changedLinks.pop();
					if (link) sd.request("put", "" + uri.withPath(link), {
						data: entity[link], type: "text/uri-list", onload: () => {
							//@ts-ignore
							setProperty(entityResult, link, self.control.getAttributeValue(link));
							putLink(self);
						}, onerror: () => {
							//@ts-ignore
							sd.error("Ссылка не сохранена " + uri.withPath(link),
									"Обратитесь к разработчику",
									{timeOut: 2000});
							putLink(self);
						}
					}); else callBack(entityResult);
				}
				
				putLink(this);
			});
		}
	}
	
	doDelete (callBack: () => void): void {
		sd.deleteXHR(this.getUrlDetete(), callBack)
	}
	
	saveAgregation (agregation: string): void {
		let name = this.control.option("name");
		if (this.isNew()) {
			throw new Error("Сначала сохраните агрегат " + name);
		}
		if (this.control.attributes().indexOf(agregation) === -1) {
			throw new Error(agregation + " отсутствует в списке атрибутов агрегата " + name);
		}
		if (!this.control.isAttribute(agregation)) {
			throw new Error(agregation + " отсутствует в агрегате " + name);
		}
		let agregationLink = this.control.option<string>("agregationLinks." + agregation, "");
		if (isEmpty(agregationLink)) {
			throw new Error("ссылка на коллекцию " +
					agregation +
					" отсутствует в agregationLinks агрегата " +
					name);
		}
		let list: any[] = this.control.getAttributeValue(agregation);
		let uriList = "";
		let uri = new Uri([this.control.controlGet.appRest(), agregationLink]);
		if (!isArrayEmpty(list)) {
			for (let i in list) uriList += (i === "0" ? "" : "\n") +
					uri.withPath(getProperty<ID>(list[i], "id"));
		}
		uri = this
				.control.controlGet
				.getUrlOne()
				.withPath(agregation)
				.withParameters({projection: ""});
		sd.request("put", "" + uri, {
			data: uriList, type: "text/uri-list", onload: (request: XMLHttpRequest) => {
				this.postSaveAgregation(request);
				sd.success("Коллекция " + name + "." + agregation + " успешно сохранен(а,о)",
						"",
						{timeOut: 2000});
			}, onerror: sd.fail
		});
	}
	
	postSaveAgregation (request: XMLHttpRequest): void {
	}
}

//PART EntityControl isReady LEGO classes
export abstract class EntityControlList<TEntity extends IEntity> extends EntityControl<TEntity> implements EntityListable<TEntity> {
	controlList: EntityList<TEntity, EntityControlList<TEntity>> = new EntityList<TEntity, EntityControlList<TEntity>>(
			this);
}

export abstract class EntityControlGet<TEntity extends IEntity> extends EntityControl<TEntity> implements EntityGettable<TEntity> {
	controlGet: EntityGet<TEntity, EntityControlGet<TEntity>> = new EntityGet<TEntity, EntityControlGet<TEntity>>(
			this);
}

export abstract class EntityControlEdit<TEntity extends IEntity> extends EntityControl<TEntity> implements EntityGettableAndEditable<TEntity> {
	controlGet: EntityGet<TEntity, EntityControlEdit<TEntity>> = new EntityGet<TEntity, EntityControlEdit<TEntity>>(
			this);
	controlEdit: EntityEditRest<TEntity, EntityControlEdit<TEntity>> = new EntityEditRest<TEntity, EntityControlEdit<TEntity>>(
			this);
}

export abstract class EntityControlListEdit<TEntity extends IEntity> extends EntityControlGet<TEntity> implements EntityListableAndEditable<TEntity> {
	controlEdit: EntityEdit<TEntity, EntityControlListEdit<TEntity>> = new EntityEdit<TEntity, EntityControlListEdit<TEntity>>(
			this);
	controlList: EntityListEdit<TEntity, EntityControlListEdit<TEntity>> = new EntityListEdit<TEntity, EntityControlListEdit<TEntity>>(
			this);
	
	postCreate (entity: TEntity): boolean {
		return this.controlList.postCreate(entity);
	}
	
	postDelete (): boolean {
		return this.controlList.postDelete();
	}
	
	postCancel (): void {
		this.controlList.postCancel();
	}
}

export abstract class EntityControlListEditRest<TEntity extends IEntity> extends EntityControlListEdit<TEntity> {
	controlGet: EntityGet<TEntity, EntityControlListEditRest<TEntity>> = new EntityGet<TEntity, EntityControlListEditRest<TEntity>>(
			this);
	controlEdit: EntityEditRest<TEntity, EntityControlListEditRest<TEntity>> = new EntityEditRest<TEntity, EntityControlListEditRest<TEntity>>(
			this);
}

