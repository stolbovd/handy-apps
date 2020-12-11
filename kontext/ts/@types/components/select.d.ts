import "kontext/components/chosen";
import { Uri } from "kontext/sd/sd";
import { ID } from "kontext/sd/types";
import { Observable, ObservableArray, Subscription } from "knockout";
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
    empty?: any;
}
export declare class SelectEntity<TEntity> {
    entities: ObservableArray<TEntity>;
    isEntities: Observable<boolean>;
    options: SelectOptions<TEntity>;
    chosen: any;
    entity: TEntity | Observable<TEntity>;
    empty: TEntity | null;
    subscription: Subscription;
    constructor(options: SelectOptions<TEntity>);
    optionsText(entity: TEntity): string;
    setList(entities: TEntity[]): void;
    beforeSetList(entities: TEntity[]): void;
    postSetList(): void;
    getList(): void;
    connect(entities?: TEntity[]): void;
    getBy(value: any, property: string): any;
    filter(filter: Filter): TEntity[];
    uri(): Uri | undefined;
    onChange(newValue: TEntity, self: SelectEntity<TEntity>): void;
    setEntityById(id: ID): void;
}
