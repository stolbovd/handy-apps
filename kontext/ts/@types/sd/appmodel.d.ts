import "jquery";
import "sweetalert";
import { Deferreds } from "kontext/sd/sd";
import { Observable } from "knockout";
export declare const RESTData: string;
export declare const REST: string;
export declare const LOG: string;
export interface WindowFileable extends Window {
    Blob: FileList;
    File: File;
    FileReader: FileReader;
    FileList: FileList;
}
export interface IWindow extends Window {
    app: AppModel;
    onload: () => void;
    print: () => void;
}
export declare abstract class AppDecorator<TApp extends AppModel> {
    app: TApp;
    constructor(app: TApp);
}
declare class LogClickEvent {
    method: string;
    elementText: string;
    date: string;
    constructor(method: string, elementText: string);
    toString(): string;
}
declare class LogEvents {
    delay: number;
    eventsLog: LogClickEvent[];
    constructor(delay: number, run?: boolean);
    push(method: string, elementText: string): void;
    send(isUnload?: boolean): void;
    run(): void;
}
export declare class DefferedsLadda extends Deferreds {
    constructor();
    onAdd(): void;
    functionDone(): void;
}
export declare class AppModel {
    ladda: Observable<boolean>;
    deferreds: Deferreds;
    logClikEvents: LogEvents;
    onbeforeunload(isConfirm: boolean): void;
    constructor();
    connect(): void;
    postConnect(deferreds?: Deferreds): void;
    init(): void;
}
export declare class ShowAppMode {
    [key: string]: any;
    mode: Observable<string>;
    last: string;
    constructor(modes: string[]);
    switch(mode: string): void;
}
export declare function hasChanged(observable: Observable): void;
export declare function sdSwal(action: string, entity: string, callback?: (isConfirm: boolean) => any): void;
export declare function fillApp(attributes: string[], objFrom: any, objTo: any): void;
export declare function restoreObject(attributes: string[], objFrom: any): any;
export {};
