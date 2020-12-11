import { EntityListable, EntityListableAndEditable } from "kontext/sd/entities";
import { Deferreds, IUriSearch, Uri } from "kontext/sd/sd";
import { IEntity } from "kontext/sd/types";
import { LStorage } from "kontext/components/localstorage";
import { Computed, Observable, ObservableArray } from "knockout";
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
export declare class ListEntityControl<TEntity extends IEntity, TControl extends EntityListable<TEntity>> {
    entityOptions: TControl;
    entityControl: {
        new (entity?: TEntity): TControl;
    };
    entities: ObservableArray<TControl>;
    isEmpty: Computed<boolean>;
    constructor(entityControl: {
        new (entity: TEntity): TControl;
    });
    createControl(entity?: TEntity): TControl;
    print(): void;
    getOption<T>(name: string, ifNull?: T): T;
    push(entity: TEntity): void;
    last(): TControl;
    remove(entityControl: TControl): void;
    addList(entities: TEntity[]): void;
    fillList(entities: TEntity[]): void;
    restore(): TEntity[];
    beforeAddList(entities: TEntity[]): void;
    postAddList(entities: TEntity[]): void;
    beforeFillList(entities: TEntity[]): void;
    postFillList(entities: TEntity[]): void;
}
declare abstract class ListEntityDecorator<TEntity extends IEntity, TControl extends EntityListable<TEntity>> {
    listControl: ListEntityControl<TEntity, TControl>;
    constructor(listControl: ListEntityControl<TEntity, TControl>);
}
export declare class ListEntityGet<TEntity extends IEntity, TControl extends EntityListable<TEntity>> extends ListEntityDecorator<TEntity, TControl> {
    localStorage: LStorage;
    deferredsLadda: Deferreds;
    appRest(): string;
    getProjection(): string;
    getSort(): string;
    getUrlEntity(): string;
    getSearch(): IUriSearch;
    getSize(): number;
    getUrl(): Uri;
    restGetList(): void;
    fillList(entities: TEntity[]): void;
    fillOrLoad(): void;
    uri(): Uri;
}
export declare class ListEntityEdit<TEntity extends IEntity, TControl extends EntityListableAndEditable<TEntity>> extends ListEntityDecorator<TEntity, TControl> {
    creatingEntity: Observable<TControl | null>;
    isAddable: Computed<boolean>;
    isAddableEntity(): boolean;
    create(): void;
}
export declare class ListEntityGetPage<TEntity extends IEntity, TControl extends EntityListable<TEntity>> extends ListEntityGet<TEntity, TControl> {
    total: Observable<number | null>;
    page: Observable<number | null>;
    isLoaded: Computed<boolean>;
    isLoadedFull: Computed<boolean>;
    textLoaded: Computed<string>;
    textLoadNext: Computed<string>;
    infoNoData(): void;
    restGetList(): void;
    resetAndGet(): void;
}
export declare class ListEntityGetScroll<TEntity extends IEntity, TControl extends EntityListable<TEntity>> extends ListEntityGetPage<TEntity, TControl> {
    private scrollActive;
    constructor(listControl: ListEntityControl<TEntity, TControl>);
    isScrollActive(): boolean;
}
export declare class ListControlGet<TEntity extends IEntity, TControl extends EntityListable<TEntity>> extends ListEntityControl<TEntity, TControl> implements ListEntityControlGettable<TEntity, TControl> {
    listGet: ListEntityGet<TEntity, TControl>;
}
export declare class ListControlGetPage<TEntity extends IEntity, TControl extends EntityListable<TEntity>> extends ListEntityControl<TEntity, TControl> implements ListEntityControlGetPageable<TEntity, TControl> {
    listGet: ListEntityGetPage<TEntity, TControl>;
}
export declare class ListControlGetScroll<TEntity extends IEntity, TControl extends EntityListable<TEntity>> extends ListEntityControl<TEntity, TControl> implements ListEntityControlGetScrollable<TEntity, TControl> {
    listGet: ListEntityGetScroll<TEntity, TControl>;
}
export declare class ListControlEdit<TEntity extends IEntity, TControl extends EntityListableAndEditable<TEntity>> extends ListEntityControl<TEntity, TControl> implements ListEntityControlEditable<TEntity, TControl> {
    listEdit: ListEntityEdit<TEntity, TControl>;
}
export declare class ListControlGetEdit<TEntity extends IEntity, TControl extends EntityListableAndEditable<TEntity>> extends ListControlGet<TEntity, TControl> implements ListEntityControlEditable<TEntity, TControl> {
    listEdit: ListEntityEdit<TEntity, TControl>;
}
export {};
