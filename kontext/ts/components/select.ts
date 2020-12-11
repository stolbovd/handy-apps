import "kontext/components/chosen";
import {
	getProperty, getRegExp, isArrayEmpty, nvl, sd, setProperty, tryGetProperty,
	Uri
} from "kontext/sd/sd";
import {ID, Map} from "kontext/sd/types";
import {RESTData} from "kontext/sd/appmodel";
import {isObservable, observable, Observable, observableArray, ObservableArray, Subscription, utils} from "knockout";

export interface Value {
	owner: {};
	association: string;
	identity?: string;
}

export interface Filter {
	(entity: any): boolean;
}

export interface SelectOptions<TEntity> {
	optionsText?: string;
	chosen?: any;
	getList?: boolean;
	entities?: any[];
	uri?: Uri;
	value?: Value;
	filter?: Filter;
	onChange?: (newValue: any, self?: SelectEntity<TEntity>) => void;
	empty?: any
}

export class SelectEntity<TEntity> {
	entities: ObservableArray<TEntity> = observableArray([]);
	isEntities: Observable<boolean> = observable(false);
	options: SelectOptions<TEntity>;
	chosen: any;
	entity: TEntity | Observable<TEntity> = <TEntity>{};
	empty: TEntity | null = null;
	subscription: Subscription;
	
	constructor (options: SelectOptions<TEntity>) {
		this.options = (options) ? options : {};
		this.chosen = (this.options.chosen) ? this.options.chosen : {};
		let chosenDefault: any = {disable_search_threshold: 3, no_results_text: "не найдено"};
		for (let option in chosenDefault) if (!this.chosen[option]) {
			this.chosen[option] = chosenDefault[option];
		}
		if (!this.options.value) this.options.value = {owner: this, association: "entity"};
		//ToDo Важно!!! При использовании getList необходимо обернуть <select/> в <!-- ko if:isEntities -->
		if (options.getList) this.getList(); else if (options.entities) this.setList(options.entities);
		if (options.onChange) this.onChange = options.onChange;
	}
	
	//необходимо для объектных значений, например 'person.famIO',
	//вызывается с optionsText.bind($data)
	optionsText (entity: TEntity): string {
		return getProperty<string>(entity, <string>this.options.optionsText);
	}
	
	setList (entities: TEntity[]): void {
		this.beforeSetList(entities);
		if (this.options.filter) {
			entities = entities.filter(this.options.filter);
		}
		if (this.options.empty) {
			this.empty = this.options.empty;
			entities.unshift(<TEntity> this.empty);
		}
			this.connect(entities);
		this.postSetList();
	}
	
	beforeSetList (entities: TEntity[]): void {
	}
	
	postSetList (): void {
	}
	
	getList (): void {
		let uri = this.uri() + "";
		sd.get(uri, (entities) => {
			if (entities._embedded) {
				let urlEntity = getRegExp(uri, RESTData.split("/").join("\\/") + "\/(.*?)(\/|$)", 2);
				if (!urlEntity)
					throw Error("urlEntity не найден в Uri: " + uri);
				entities = entities._embedded[urlEntity];
			}
			this.setList(entities);
		});
	}
	
	connect (entities?: TEntity[]): void {
		if (this.options.value && entities && !isArrayEmpty(entities)) {
			if (this.subscription !== undefined) this.subscription.dispose();
			let owner = this.options.value.owner;
			let association = this.options.value.association;
			let connectingValue = getProperty(owner, association);
			let value: TEntity = <TEntity>utils.unwrapObservable(connectingValue);
			if (value != null && entities.indexOf(value) === -1) {
				let identity = (this.options.value.identity) ? this.options.value.identity : "id";
				let id = tryGetProperty(connectingValue, identity);
				if (id !== undefined) {
					for (let entity of entities) {
						if (id === (<any>entity)[identity]) {
							setProperty(owner, association, entity);
							break;
						}
					}
				}
			}
			this.entities(entities);
			this.isEntities(true);
			if (isObservable(connectingValue)) {
				this.subscription = (<Observable> connectingValue).subscribe((newValue: TEntity) => this.onChange(
						newValue,
						this));
			}
		}
	}
	
	getBy (value: any, property: string): any {
		let entities = this.entities();
		for (let entity of entities) if (getProperty(entity, property) === value) return entity;
		return null;
	}
	
	filter (filter: Filter): TEntity[] {
		return (this.entities().length > 0) ? this.entities().filter(filter) : [];
	}
	
	uri () {
		return this.options.uri;
	}
	
	onChange (newValue: TEntity, self: SelectEntity<TEntity>) {
	}
	
	setEntityById (id: ID) {
		let entity: Map<any> = {};
		entity[nvl(getProperty<string>(this.options, "value.identity"), "id")] = id;
		this.entity = observable(<TEntity>entity);
	}
}
