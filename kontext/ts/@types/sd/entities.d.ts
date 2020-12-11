/// <reference types="jquery" />
import { ID, IEntity, Map } from "kontext/sd/types";
import { TUri, Uri } from "kontext/sd/sd";
import { ListEntityControl, ListEntityControlEditable } from "kontext/sd/entitylists";
import { Computed, Observable, ObservableArray } from "knockout";
export declare type UriData = string | number | ID | undefined;
export interface IEntityOptions {
    attributes: string[];
    name: string;
    genitive?: string;
    urlEntity?: string;
    projection?: string;
    sort?: string;
    search?: string;
    links?: Map<string>;
    agregationLinks?: Map<string>;
    formId?: string;
}
export declare class EntitySubscribed implements Map<any> {
    [key: string]: Observable;
    id: Observable<ID>;
}
declare type TObservable<T> = Observable<T> | ObservableArray<T>;
export interface EntityGettable<TEntity extends IEntity> extends EntityControl<TEntity> {
    controlGet: EntityGet<TEntity, EntityGettable<TEntity>>;
}
export interface EntityEditable<TEntity extends IEntity> extends EntityControl<TEntity> {
    controlEdit: EntityEdit<TEntity, EntityEditable<TEntity>>;
    beforePost?(entity: TEntity): void;
    postCreate?(entity: TEntity): boolean;
    postPut?(entity: TEntity): void;
    postDelete?(): boolean;
    postCancel?(): void;
}
export interface EntityGettableAndEditable<TEntity extends IEntity> extends EntityEditable<TEntity> {
    controlGet: EntityGet<TEntity, EntityGettableAndEditable<TEntity>>;
}
export interface EntityListable<TEntity extends IEntity> extends EntityControl<TEntity> {
    controlList: EntityList<TEntity, EntityListable<TEntity>>;
}
export interface EntityListableAndEditable<TEntity extends IEntity> extends EntityEditable<TEntity> {
    controlList: EntityListEdit<TEntity, EntityListableAndEditable<TEntity>>;
    postCreate(entity: TEntity): boolean;
    postDelete(): boolean;
    postCancel(): void;
}
export declare abstract class EntityControl<TEntity extends IEntity> {
    entity: TEntity;
    entys: EntitySubscribed;
    id: Computed<ID>;
    constructor(entity?: TEntity);
    abstract options(): IEntityOptions;
    attributes(): string[];
    fill(entity?: TEntity): void;
    restore(): TEntity;
    restoreChanges(): void;
    beforeFill(entity?: TEntity): TEntity | undefined;
    postFill(entity: TEntity): void;
    option<T>(name: string, ifNull?: T): T;
    isAttribute(name: string): boolean;
    attribute(name: string): TObservable<any>;
    getAttributeValue(name: string): any;
    oldAttribute(name: string): any;
}
declare abstract class EntityControlDecorator<TEntity extends IEntity, TControl extends EntityControl<TEntity>> {
    control: TControl;
    constructor(control: TControl);
}
export declare class EntityList<TEntity extends IEntity, TControl extends EntityListable<TEntity>> extends EntityControlDecorator<TEntity, TControl> {
    list: ListEntityControl<TEntity, TControl>;
    remove(): void;
    beforeRemove(): void;
    swalRemove(): void;
}
export declare class EntityGet<TEntity extends IEntity, TControl extends EntityGettable<TEntity>> extends EntityControlDecorator<TEntity, TControl> {
    appRest(): string;
    uri(): Uri;
    getUrlOne(id?: ID): Uri;
    getUrlGet(urlData: UriData): TUri;
    restGet(urlData?: UriData, postFill?: (entity: TEntity) => void): JQueryPromise<any>;
}
export declare class EntityEdit<TEntity extends IEntity, TControl extends EntityEditable<TEntity>> extends EntityControlDecorator<TEntity, TControl> {
    isEdit: Observable<boolean>;
    changes: Observable<Map<any>>;
    saveText: Computed<string>;
    isNew: Computed<boolean>;
    isChanged: Computed<boolean>;
    isEditable: Computed<boolean>;
    isDeletable: Computed<boolean>;
    isSaveable: Computed<boolean>;
    formId: Computed<string>;
    constructor(control: TControl);
    isValidity(): boolean;
    fillChange(): void;
    clearChanges(): void;
    restore(): TEntity;
    edit(): void;
    private restoreIdAndFill;
    save(): void;
    cancel(): void;
    deleteEntity(isNotAsk?: boolean): void;
    doPost(entity: TEntity, callBack: (entity: TEntity) => void): void;
    doPut(entity: TEntity, callBack: (entity: TEntity) => void): void;
    doDelete(callBack: () => void): void;
}
export declare class EntityListEdit<TEntity extends IEntity, TControl extends EntityListableAndEditable<TEntity>> extends EntityList<TEntity, TControl> {
    list: ListEntityControlEditable<TEntity, TControl>;
    postCreate(entity: TEntity): boolean;
    postDelete(): boolean;
    postCancel(): void;
}
export declare class EntityEditRest<TEntity extends IEntity, TControl extends EntityGettableAndEditable<TEntity>> extends EntityEdit<TEntity, TControl> {
    private linksForeach;
    restore(): TEntity;
    restoreJSON(): string;
    getUrlPut(id?: ID): TUri;
    getUrlPost(): TUri;
    getUrlDetete(): TUri;
    doPost(entity: TEntity, callBack: (entity: TEntity) => void): void;
    doPut(entity: TEntity, callBack: (entity: TEntity) => void): void;
    doDelete(callBack: () => void): void;
    saveAgregation(agregation: string): void;
    postSaveAgregation(request: XMLHttpRequest): void;
}
export declare abstract class EntityControlList<TEntity extends IEntity> extends EntityControl<TEntity> implements EntityListable<TEntity> {
    controlList: EntityList<TEntity, EntityControlList<TEntity>>;
}
export declare abstract class EntityControlGet<TEntity extends IEntity> extends EntityControl<TEntity> implements EntityGettable<TEntity> {
    controlGet: EntityGet<TEntity, EntityControlGet<TEntity>>;
}
export declare abstract class EntityControlEdit<TEntity extends IEntity> extends EntityControl<TEntity> implements EntityGettableAndEditable<TEntity> {
    controlGet: EntityGet<TEntity, EntityControlEdit<TEntity>>;
    controlEdit: EntityEditRest<TEntity, EntityControlEdit<TEntity>>;
}
export declare abstract class EntityControlListEdit<TEntity extends IEntity> extends EntityControlGet<TEntity> implements EntityListableAndEditable<TEntity> {
    controlEdit: EntityEdit<TEntity, EntityControlListEdit<TEntity>>;
    controlList: EntityListEdit<TEntity, EntityControlListEdit<TEntity>>;
    postCreate(entity: TEntity): boolean;
    postDelete(): boolean;
    postCancel(): void;
}
export declare abstract class EntityControlListEditRest<TEntity extends IEntity> extends EntityControlListEdit<TEntity> {
    controlGet: EntityGet<TEntity, EntityControlListEditRest<TEntity>>;
    controlEdit: EntityEditRest<TEntity, EntityControlListEditRest<TEntity>>;
}
export {};
