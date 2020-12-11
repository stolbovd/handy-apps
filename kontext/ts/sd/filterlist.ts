import {AppModel, hasChanged} from "kontext/sd/appmodel";
import {getProperty, isEmpty, simplifyStringRussian} from "kontext/sd/sd";
import {observable, Observable, observableArray, ObservableArray, Subscription} from "knockout";

declare let app: AppModel;
export type OnFilter = (newValues: any[]) => void

export abstract class FilterEntity {
	filterList: FilterList;
	subscription: Subscription;
	selected: Observable;
	attribute: string;
	
	abstract match (entity: any): boolean
	
	subscribe (onFilter?: OnFilter): void {
		if (this.subscription) {
			this.subscription.dispose();
		}
		if (onFilter) {
			this.subscription = this.selected.subscribe(onFilter);
			this.selected.extend({rateLimit: 50});
		}
	}
	
	setSelected (selectred: any) {
		this.selected(selectred);
	}
	
	onSelect (newValue: any) {
		this.filterList.fill();
	}
}

export abstract class FilterAttribute extends FilterEntity {
	constructor (attribute: string) {
		super();
		this.attribute = attribute;
	}
}

export abstract class FilterBoolean extends FilterEntity {
	selected: Observable<boolean>;
	
	abstract predicate (entity: any): boolean
	
	match (entity: any): boolean {
		return this.selected() ? this.predicate(entity) : true;
	}
	
	constructor (selected?: boolean) {
		super();
		this.selected = observable(selected == null ? false : selected);
		this.attribute = (<any> this.constructor).name;
	}
}

export class FilterEntityRussianString extends FilterAttribute {
	selected: Observable = observable("");
	
	match (entity: any): boolean {
		let value = simplifyStringRussian(this.selected());
		if (isEmpty(value)) return true;
		return simplifyStringRussian(getProperty(entity, this.attribute, ""))
				.indexOf(value) != -1;
	}
}

export class FilterEntitySelect<T> extends FilterAttribute {
	selected: ObservableArray<T> = observableArray([]);
	values: ObservableArray<T> = observableArray([]);
	notValue: T;
	isFillLock = false;
	
	onSelect (newValue: any): void {
		if (newValue.length > 0) {
			this.isFillLock = true;
		}
		super.onSelect(newValue);
	}
	
	constructor (attribute: string, notValue?: T) {
		super(attribute);
		this.notValue = <T>(notValue == undefined ? "нет" : notValue);
	}
	
	match (entity: any): boolean {
		if (this.selected().length == 0) return true;
		return this.selected.indexOf(getProperty<T>(entity, this.attribute, this.notValue)) > -1;
	}
	
	fill (entities: any[]): void {
		let values: any[] = [];
		for (let entity of entities) {
			let value = getProperty<T>(entity, this.attribute, this.notValue);
			if (values.indexOf(value) == -1) {
				values.push(value);
			}
		}
		values.sort((left: T, right: T) => left == this.notValue ?
				-1 :
				right == this.notValue ? 1 : left == right ? 0 : (left < right ? -1 : 1));
		this.values(values);
	}
}

export interface FilterAttributes {
	select?: string[]
	russianString?: string[]
	other?: FilterEntity[]
}

export class FilterList {
	select: FilterEntitySelect<string>[] = [];
	russianString: FilterEntityRussianString[] = [];
	other: FilterEntity[] = [];
	
	filters (): FilterEntity[] {
		return (<FilterEntity[]> this.select).concat(this.russianString).concat(this.other);
	}
	
	//Сущность проверяется на соответствие фильтру
	match (entity: any): boolean {
		for (let select of this.filters()) {
			if (!select.match(entity)) {
				return false;
			}
		}
		return true;
	}
	
	fill (entities?: any[]): void {
		let list: any[];
		if (entities != undefined) {
			list = entities;
		} else if (this.entityAttribute) {
			list = this.list()().map((element: any) => element[this.entityAttribute]);
		} else {
			list = this.list()();
		}
		list = list.filter((entity: any) => this.match(entity));
		let selects = this.select.concat((<FilterEntitySelect<any>[]> this.other)
				.filter(filter => filter instanceof FilterEntitySelect));
		for (let select of selects) {
			if (select.isFillLock) {
				select.isFillLock = false;
			} else {
				select.fill(list);
			}
		}
	}
	
	//Обновление фильтруемого списка
	find () {
		hasChanged(this.list());
	}
	
	list (): any {
		return this.listContainer[this.listAttribute];
	}
	
	subscribe (onFilter?: OnFilter) {
		for (let select of this.filters()) {
			select.subscribe(onFilter);
		}
	}
	
	constructor (private listContainer: any, // Control в котором содержится фильтруемый observableArray
			private listAttribute: string, // атрибут с фильтруемым списком в list
			private entityAttribute: any, // атрибут сущности в фильтруемом списке
			private attributes: FilterAttributes)
	{
		this.listContainer = listContainer;
		this.listAttribute = listAttribute;
		let i = 0;
		if (attributes.select) {
			for (let select of attributes.select) {
				this.select[i++] = new FilterEntitySelect<string>(select);
			}
		}
		i = 0;
		if (attributes.russianString) {
			for (let russianString of attributes.russianString) {
				this.russianString[i++] = new FilterEntityRussianString(russianString);
			}
		}
		if (attributes.other) {
			this.other = attributes.other;
		}
		for (let filter of this.filters()) {
			filter.filterList = this;
			filter.selected.subscribe((newValue: any) => {
				filter.onSelect.bind(filter);
				app.logClikEvents.push("filter:" + filter.attribute, newValue);
			});
		}
	}
}

