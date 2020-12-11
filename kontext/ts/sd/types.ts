import {Observable} from "knockout";

export type ID = number | string | null

export interface Map<T> {
	[key: string]: T;
}

export interface MapNumKey<T> {
	[key: number]: T;
}

export type IdEntity = ID | Observable<ID>

export interface IEntity extends Map<any> {
	id?: IdEntity
}

export interface IEnum extends Map<any> {
	value: string
}

export function idToString (id?: IdEntity): string {
	return id + "";
}

export function idToNumber (id?: IdEntity): number {
	return parseInt(id + "");
}

export interface FilesElement extends Element {
	result: any
	files: FileList
}

export interface FileOpenEvent extends Event {
	target: FilesElement
}

export interface FileProgressEvent extends ProgressEvent {
	target: FileReader
}

export interface AggregateId extends IEntity {
	id: ID
}

//PART tools
export interface SDFile extends IEntity {
	path: string
}
