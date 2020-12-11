import { Observable, ObservableArray, Subscription } from "knockout";
export declare type OnFilter = (newValues: any[]) => void;
export declare abstract class FilterEntity {
    filterList: FilterList;
    subscription: Subscription;
    selected: Observable;
    attribute: string;
    abstract match(entity: any): boolean;
    subscribe(onFilter?: OnFilter): void;
    setSelected(selectred: any): void;
    onSelect(newValue: any): void;
}
export declare abstract class FilterAttribute extends FilterEntity {
    constructor(attribute: string);
}
export declare abstract class FilterBoolean extends FilterEntity {
    selected: Observable<boolean>;
    abstract predicate(entity: any): boolean;
    match(entity: any): boolean;
    constructor(selected?: boolean);
}
export declare class FilterEntityRussianString extends FilterAttribute {
    selected: Observable;
    match(entity: any): boolean;
}
export declare class FilterEntitySelect<T> extends FilterAttribute {
    selected: ObservableArray<T>;
    values: ObservableArray<T>;
    notValue: T;
    isFillLock: boolean;
    onSelect(newValue: any): void;
    constructor(attribute: string, notValue?: T);
    match(entity: any): boolean;
    fill(entities: any[]): void;
}
export interface FilterAttributes {
    select?: string[];
    russianString?: string[];
    other?: FilterEntity[];
}
export declare class FilterList {
    private listContainer;
    private listAttribute;
    private entityAttribute;
    private attributes;
    select: FilterEntitySelect<string>[];
    russianString: FilterEntityRussianString[];
    other: FilterEntity[];
    filters(): FilterEntity[];
    match(entity: any): boolean;
    fill(entities?: any[]): void;
    find(): void;
    list(): any;
    subscribe(onFilter?: OnFilter): void;
    constructor(listContainer: any, // Control в котором содержится фильтруемый observableArray
    listAttribute: string, // атрибут с фильтруемым списком в list
    entityAttribute: any, // атрибут сущности в фильтруемом списке
    attributes: FilterAttributes);
}
