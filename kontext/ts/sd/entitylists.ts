import {AppModel, DefferedsLadda, RESTData} from "kontext/sd/appmodel";
import {EntityListable, EntityListableAndEditable} from "kontext/sd/entities";
import {Deferreds, getProperty, isArrayEmpty, isEmpty, IUriSearch, sd, Uri} from "kontext/sd/sd";
import {IEntity, Map} from "kontext/sd/types";
import {LStorage} from "kontext/components/localstorage";
import {Computed, observable, Observable, observableArray, ObservableArray, pureComputed} from "knockout";

declare let app: AppModel;
declare let entityId: number;

//PART ListEntityControl interfaces
export interface ListEntityControlEditable<TEntity extends IEntity, TControl extends EntityListableAndEditable<TEntity>> extends ListEntityControl<TEntity, TControl> {
	listEdit: ListEntityEdit<TEntity, TControl>;
}

export interface ListEntityControlGettable<TEntity extends IEntity, TControl extends EntityListable<TEntity>> extends ListEntityControl<TEntity, TControl> {
	listGet: ListEntityGet<TEntity, TControl>;
}

export interface ListEntityControlGetPageable<TEntity extends IEntity, TControl extends EntityListable<TEntity>> extends ListEntityControlGettable<TEntity, TControl> {
	listGet: ListEntityGetPage<TEntity, TControl>;
}

export interface ListEntityControlGetScrollable<TEntity extends IEntity, TControl extends EntityListable<TEntity>> extends ListEntityControlGetPageable<TEntity, TControl> {
	listGet: ListEntityGetScroll<TEntity, TControl>;
}

//Part ListEntityControl
export class ListEntityControl<TEntity extends IEntity, TControl extends EntityListable<TEntity>> { // list of
	entityOptions: TControl;
	entityControl: { new (entity?: TEntity): TControl; };
	entities: ObservableArray<TControl> = observableArray([]);
	isEmpty: Computed<boolean> = pureComputed(() => isArrayEmpty(this.entities()));
	
	constructor (entityControl: { new (entity: TEntity): TControl; }) {
		this.entityControl = entityControl;
	}
	
	createControl (entity?: TEntity): TControl {
		let entityControl: TControl = new this.entityControl(entity);
		entityControl.controlList.list = this;
		return entityControl;
	}
	
	print (): void {
		console.log(this.constructor);
		for (let control of this.entities()) console.log(control.toString());
	}
	
	getOption<T> (name: string, ifNull?: T): T {
		if (this.entityOptions === undefined) {
			this.entityOptions = this.createControl();
		}
		return this.entityOptions.option(name, ifNull);
	}
	
	push (entity: TEntity): void {// : TControl {
		this.entities.push(this.createControl(entity));
//		return entityControl;
	}
	
	last (): TControl {
		return this.entities()[this.entities().length - 1];
	}
	
	remove (entityControl: TControl): void {
		this.entities.remove(entityControl);
	}
	
	addList (entities: TEntity[]): void {
		this.beforeAddList(entities);
		if (!isArrayEmpty(entities)) {
			for (let entity of entities) this.push(entity);
		}
		this.postAddList(entities);
	}
	
	fillList (entities: TEntity[]): void {
		this.entities.removeAll();
		this.beforeFillList(entities);
		this.addList(entities);
		this.postFillList(entities);
	}
	
	restore (): TEntity[] {
		let entities = this.entities();
		let restoreEntities = [];
		for (let entity of entities) restoreEntities.push(entity.restore());
		return restoreEntities;
	}
	
	beforeAddList (entities: TEntity[]): void {
	}
	
	postAddList (entities: TEntity[]): void {
	}
	
	beforeFillList (entities: TEntity[]): void {
	}
	
	postFillList (entities: TEntity[]): void {
	}
}

//PART ListEntityControls Decorators
abstract class ListEntityDecorator<TEntity extends IEntity, TControl extends EntityListable<TEntity>> {
	listControl: ListEntityControl<TEntity, TControl>;
	
	constructor (listControl: ListEntityControl<TEntity, TControl>) {
		this.listControl = listControl;
	}
}

export class ListEntityGet<TEntity extends IEntity, TControl extends EntityListable<TEntity>> extends ListEntityDecorator<TEntity, TControl> { // this REST GET list of entity
	localStorage: LStorage;
	deferredsLadda: Deferreds = new DefferedsLadda();
	
	appRest (): string {
		return RESTData;
	}
	
	getProjection (): string {
		return this.listControl.getOption("projection", "");
	}
	
	getSort (): string {
		return this.listControl.getOption("sort", "");
	}
	
	getUrlEntity (): string {
		return this.listControl.getOption("urlEntity", "");
	}
	
	getSearch (): IUriSearch {
		return {
			find: "", path: [], parameters: {}
		};
	}
	
	getSize (): number {
		return 200;
	}
	
	getUrl (): Uri {
		return this.uri();
	}
	
	restGetList (): void {
		this.deferredsLadda.add("restGetList");
		sd.get(this.getUrl(), (entities: any) => {
			if (entities._embedded) {
				entities = entities._embedded[this.listControl.getOption("urlEntity", "")];
			}
			this.fillList(entities);
			this.deferredsLadda.resolve();
		}).fail(this.deferredsLadda.resolve);
	}
	
	fillList (entities: TEntity[]): void {
		if (this.localStorage) {
			this.localStorage.onLoad(entities);
		}
		this.listControl.fillList(entities);
	}
	
	fillOrLoad () {
		if (this.localStorage) {
			this.localStorage.fillOrLoad(this.fillList.bind(this), this.restGetList.bind(this));
		}
		else {
			this.restGetList();
		}
	}
	
	uri (): Uri {
		let search = this.getSearch();
		let path = [this.appRest(), this.listControl.getOption<string>("urlEntity")]; // urlEntity
		// совпадает с Entity
		if (search.hasOwnProperty("find") && !isEmpty(search.find)) {
			path.push("search/" + search.find);
		} // search только для ListEntityGet
		if (search.hasOwnProperty("path")) {
			for (let part of getProperty<any[]>(search, "path")) path.push(part);
		}
		let parameters: Map<any> = {};
		let addParameter = (name: string, value: any) => {
			if (value != null) parameters[name] = value;
		};
		addParameter("projection", this.getProjection());
		addParameter("sort", this.getSort());
		addParameter("size", this.getSize());
		if (search.hasOwnProperty("parameters")) {
			for (let parameter in search.parameters) if (search.parameters.hasOwnProperty(parameter)) {
				addParameter(parameter, search.parameters[parameter]);
			}
		}
		return new Uri(path, parameters);
	}
}

export class ListEntityEdit<TEntity extends IEntity, TControl extends EntityListableAndEditable<TEntity>> extends ListEntityDecorator<TEntity, TControl> { // abstract
	creatingEntity: Observable<TControl | null> = observable(null);
	isAddable: Computed<boolean> = pureComputed(() => this.isAddableEntity() &&
			this.creatingEntity() ===
			null);
	
	isAddableEntity (): boolean {
		return true;
	}
	
	create (): void {
		let entityControl: TControl = this.listControl.createControl();
		entityControl.controlEdit.isEdit(true);
		this.listControl.entities.unshift(entityControl);
		this.creatingEntity(entityControl);
	}
}

export class ListEntityGetPage<TEntity extends IEntity, TControl extends EntityListable<TEntity>> extends ListEntityGet<TEntity, TControl> { // this REST GET list of entity
	total: Observable<number | null> = observable(null);
	//.extend({rateLimit: AppModel.prototype.rateLimit});
	page: Observable<number | null> = observable(null);
	isLoaded: Computed<boolean> = pureComputed(() => this.total() != null);
	isLoadedFull: Computed<boolean> = pureComputed(() => {
		return this.isLoaded() &&
				(<number>this.total() <= (<number>this.page() + 1) * this.getSize())
	});
	textLoaded: Computed<string> = pureComputed(() => {
		return this.isLoaded() ? this.listControl.entities().length + " из " + this.total() : "";
	});
	textLoadNext: Computed<string> = pureComputed(() => {
		if (this.isLoadedFull()) {
			return "";
		}
		if (!this.isLoaded()) {
			return "первые " + this.getSize();
		}
		let remain = <number>this.total() - (<number>this.page() + 1) * this.getSize();
		if (remain <= this.getSize()) {
			return "последние " + remain;
		}
		return "следующие " + this.getSize();
	});
	
	infoNoData (): void {
	}
	
	restGetList (): void {
		if (!this.isLoadedFull()) {
			let page = this.page();
			let newPage = page == null ? 0 : (page + 1);
			app.ladda(true);
			sd.get(this.getUrl()
					.withParameter("page", newPage), (entities) => {
				let content, pageable;
				let isAppRestData = this.appRest() === RESTData;
				if (isAppRestData && entities.hasOwnProperty("_embedded")) {
					content = entities._embedded[this.listControl.getOption("urlEntity", "")];
				}
				else {
					if (entities.hasOwnProperty("content")) {
						content = entities.content;
					}
					else {
						throw new Error("В результате запроса отсутствуют данные");
					}
				}
				if (isAppRestData && entities.hasOwnProperty("page")) {
					pageable = entities.page;
				}
				else {
					if (entities.hasOwnProperty("totalElements")) {
						pageable = entities;
					}
					else {
						throw new Error("В результате запроса отсутствует информация о страницах");
					}
				}
				this.total(pageable.totalElements);
				if (pageable.totalElements === 0) this.infoNoData();
				this.page(newPage);
				this.listControl.addList(content);
				app.ladda(false);
			}).fail(() => app.ladda(false));
		}
	}
	
	resetAndGet (): void {
		this.listControl.entities.removeAll();
		this.total(null);
		this.page(null);
		this.restGetList();
	}
}

export class ListEntityGetScroll<TEntity extends IEntity, TControl extends EntityListable<TEntity>> extends ListEntityGetPage<TEntity, TControl> { // this REST GET list of entity
	private scrollActive: boolean = true;
	constructor (listControl: ListEntityControl<TEntity, TControl>) {
		super(listControl);
		let scroll = () => {
			if (this.isScrollActive() && !this.isLoadedFull() &&
					window.pageYOffset +
					window.innerHeight >=
					(<number>$(document).height()) - 1)
			{
				this.scrollActive = false;
				window.onscroll = null;
				this.restGetList();
				setTimeout(() => {
					window.onscroll = scroll;
					this.scrollActive = true;
				}, 3000);
			}
		};
		window.onscroll = scroll;
	}
	
	isScrollActive (): boolean {
		return this.scrollActive;
	}
}

//PART ListEntityControl isReady LEGO classes
export class ListControlGet<TEntity extends IEntity, TControl extends EntityListable<TEntity>> extends ListEntityControl<TEntity, TControl> implements ListEntityControlGettable<TEntity, TControl> {
	listGet = new ListEntityGet<TEntity, TControl>(this);
}

export class ListControlGetPage<TEntity extends IEntity, TControl extends EntityListable<TEntity>> extends ListEntityControl<TEntity, TControl> implements ListEntityControlGetPageable<TEntity, TControl> {
	listGet = new ListEntityGetPage<TEntity, TControl>(this);
}

export class ListControlGetScroll<TEntity extends IEntity, TControl extends EntityListable<TEntity>> extends ListEntityControl<TEntity, TControl> implements ListEntityControlGetScrollable<TEntity, TControl> {
	listGet = new ListEntityGetScroll<TEntity, TControl>(this);
}

export class ListControlEdit<TEntity extends IEntity, TControl extends EntityListableAndEditable<TEntity>> extends ListEntityControl<TEntity, TControl> implements ListEntityControlEditable<TEntity, TControl> {
	listEdit = new ListEntityEdit<TEntity, TControl>(this);
}

export class ListControlGetEdit<TEntity extends IEntity, TControl extends EntityListableAndEditable<TEntity>> extends ListControlGet<TEntity, TControl> implements ListEntityControlEditable<TEntity, TControl> {
	listEdit = new ListEntityEdit<TEntity, TControl>(this);
}
