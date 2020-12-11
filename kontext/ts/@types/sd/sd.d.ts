/// <reference types="jquery" />
/// <reference types="toastr" />
/// <reference types="bootstrap-datepicker" />
/// <reference types="icheck" />
/// <reference types="bootstrap-colorpicker" />
/// <reference types="jquery-slimscroll" />
/// <reference types="bootstrap" />
import { ID, IEntity, Map } from "kontext/sd/types";
import { Observable } from "knockout";
export declare const momentFormat = "YYYY-MM-DDTHH:mm:ss";
export declare function round(value: number, precision: number): number;
export declare function getArrayElementByAttr<T extends Map<any>>(array: T[], value: any, property: string): T | undefined;
export declare function getArrayElementById<T>(array: T[], id: ID): T | undefined;
export declare function arrayRemove<T>(array: Array<T>, predicat: (element: T) => boolean): void;
export declare function isArrayEmpty(array: any[]): boolean;
export declare function sort<T>(left: T, right: T, desc?: boolean): number;
export declare function arrayObjectsSort<TObject extends Map<any>>(array: TObject[], attributes: string[]): TObject[];
export declare class MapEntity<TEntity extends IEntity> {
    entities: Map<TEntity>;
    push(entity: TEntity): void;
    keys(): string[];
    values(): TEntity[];
    fill(data: TEntity[]): void;
    sortedValues(attributes: string[]): TEntity[];
}
export declare function capitalizeFirstLetter(str: string): string;
export declare function parseIntElseZero(parsedValue: string): number;
export declare function personFIO(person: {
    family: string;
    name: string;
    secName: string;
}): string;
export declare function famNameSec(family: string, name: string, secName: string): string;
export declare function enumToString(enumValue: any): string;
export declare function enumsToStrings(enums: any): any[];
export declare function getRegExp(str: string, regExp: string, argument: number): string | null;
export declare function simplifyString(str: any): string;
export declare function simplifyStringRussian(str: any): string;
export declare function wrapTag(html: string, tag: string): string;
export declare function htmlToDivJQ(html: string): any;
export declare function isEmpty(value: any): boolean;
export declare function nvl<T>(value: T, ifnull: T, callback?: (value: T) => T): T;
export declare function isProperty(objectVar: any, propertyString: string): boolean;
export declare function getProperty<T>(objectVar: any, propertyString: string, ifNull?: T): T;
export declare function tryGetProperty(objectVar: any, propertyString: string, ifError?: any, fail?: (error: any, ifError: any) => any): any;
export declare function getPropertyValue<T extends any>(objectVar: any, propertyString: string, ifNull: T): T;
export declare function setProperty<T extends any>(owner: any, association: string, value: T): void;
export declare namespace sd {
    import DoneCallback = JQuery.jqXHR.DoneCallback;
    import SuccessCallback = JQuery.Ajax.SuccessCallback;
    function fail(error: any): void;
    function get(uri: TUri, callback: DoneCallback, type?: string): JQueryPromise<any>;
    function post(url: TUri, data: string, callback: DoneCallback, type?: string): JQuery.jqXHR<any>;
    function deleteXHR(uri: TUri, callback?: SuccessCallback<any>): JQuery.jqXHR<any>;
    function putXHR(uri: TUri, data?: string, callback?: SuccessCallback<any>, type?: string): JQueryXHR;
    function put(uri: TUri, data?: string, callback?: SuccessCallback<any>, type?: string): JQueryPromise<any>;
    function request(method: string, uri: TUri, opt: any): XMLHttpRequest;
    function response(method: string, uri: TUri, data?: string | {}, contentType?: string, onLoad?: (request: XMLHttpRequest) => void): any;
    function uri(uri: string | string[] | Observable<string> | Uri, parameters?: {
        [key: string]: any;
    }): string;
    function frontendLog(type: string, message: string, title?: string): void;
    function getReport(uri: string, sendObjects: any, description: string): void;
    function success(message: string, title?: string, overrides?: ToastrOptions): JQuery;
    function info(message: string, title?: string, overrides?: ToastrOptions): JQuery;
    function warning(message: string, title?: string, overrides?: ToastrOptions): JQuery;
    function error(message: string, title?: string, overrides?: ToastrOptions): JQuery;
    function date(date?: TDate | string): SDate;
}
export declare type TDate = Date | null;
export declare class SDate {
    private readonly date;
    constructor(date?: TDate | string);
    get(): TDate;
    toISOString(): string;
    toLocaleDateString(): string;
    toRuLL(): string;
}
export declare function dateRuLL(date: TDate): string;
export declare type TUri = Uri | string;
export interface IUriSearch {
    path?: any[];
    find: string;
    parameters: any;
}
export declare type TUriParameters = {
    [key: string]: string | number;
};
export declare class Uri {
    private path;
    private parameters;
    constructor(paths: string | string[] | Observable<string> | Uri, parameters?: Map<any>);
    private setParameters;
    private setParameter;
    private addOnePath;
    private addPath;
    toString(): string;
    getPath(): string;
    getParameters(): TUriParameters;
    toFragment(fragment: string): string;
    withPath(pathAdd: string | any[] | ID): Uri;
    withParameter(parameter: string, parameterValue: any): Uri;
    withParameters(parameters: {
        [key: string]: any;
    }): Uri;
}
export declare class Deffered {
    name: string;
    deffered: JQueryDeferred<any>;
    constructor(name: string, deffered: JQueryDeferred<any>);
}
export declare class Deferreds {
    private deferreds;
    isDone: boolean;
    isLog: boolean;
    name: string;
    size(): number;
    add(name?: string): void;
    onAdd(): void;
    resolve(): void;
    functionDone(): void;
    private onDone;
    done(functionDone?: () => void): void;
    constructor(name?: string, isLog?: boolean);
}
export declare function watch(oObj: any, sProp: string): void;
export declare function clickElement(element: HTMLAnchorElement): HTMLAnchorElement;
