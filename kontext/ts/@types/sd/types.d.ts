import { Observable } from "knockout";
export declare type ID = number | string | null;
export interface Map<T> {
    [key: string]: T;
}
export interface MapNumKey<T> {
    [key: number]: T;
}
export declare type IdEntity = ID | Observable<ID>;
export interface IEntity extends Map<any> {
    id?: IdEntity;
}
export interface IEnum extends Map<any> {
    value: string;
}
export declare function idToString(id?: IdEntity): string;
export declare function idToNumber(id?: IdEntity): number;
export interface FilesElement extends Element {
    result: any;
    files: FileList;
}
export interface FileOpenEvent extends Event {
    target: FilesElement;
}
export interface FileProgressEvent extends ProgressEvent {
    target: FileReader;
}
export interface AggregateId extends IEntity {
    id: ID;
}
export interface SDFile extends IEntity {
    path: string;
}
