import * as toastr from "toastr";
import {ID, idToString, IEntity, Map} from "kontext/sd/types";
import {isObservable, Observable} from "knockout";

declare let app: any;
export const momentFormat = "YYYY-MM-DDTHH:mm:ss";

//PART numbers
export function round (value: number, precision: number) {
	return Math.round(value * 10 ** precision) / 10 ** precision;
}

//PART Arrays
export function getArrayElementByAttr<T extends Map<any>> (array: T[],
		value: any,
		property: string): T | undefined {
	for (let element of array) if (getProperty(element, property) == value) return element;
	return undefined;
}

export function getArrayElementById<T> (array: T[], id: ID): T | undefined {
	return getArrayElementByAttr(array, id, "id");
}

export function arrayRemove<T> (array: Array<T>, predicat: (element: T) => boolean): void {
	if (Array.isArray(array) && typeof predicat === "function") {
		for (let i = 0; i < array.length; i++) if (predicat(array[i])) {
			array.splice(i, 1);
			i--;
		}
	}
	else {
		console.log("array не является массивом в arrayRemove");
	}
}

export function isArrayEmpty (array: any[]): boolean {
	return !Array.isArray(array) || array.length === 0;
}

export function sort<T> (left: T, right: T, desc?: boolean): number {
	return left === right ? 0 : desc ? (left > right ? -1 : 1) : (left < right ? -1 : 1)
}

export function arrayObjectsSort<TObject extends Map<any>> (array: TObject[],
		attributes: string[]): TObject[] {
	return array.sort((left: TObject, right: TObject) => {
		for (let attribute of attributes) {
			let desc = false;
			if (attribute.substr(0, 1) == "!") {
				attribute = attribute.substr(1, attribute.length - 1);
				desc = true;
			}
			let compare = sort(getProperty(left, attribute, null),
					getProperty(right, attribute, null),
					desc);
			if (compare != 0) {
				return compare;
			}
		}
		return 0;
	});
}

export class MapEntity<TEntity extends IEntity> {
	entities: Map<TEntity> = {};
	
	push (entity: TEntity) {
		let id = idToString(entity.id);
		if (!this.entities.hasOwnProperty(id)) this.entities[id] = entity;
	}
	
	keys (): string[] {
		return Object.keys(this.entities);
	}
	
	values (): TEntity[] {
		let values: TEntity[] = [];
		for (let key of this.keys()) {
			values.push(this.entities[key]);
		}
		return values;
	}
	
	fill (data: TEntity[]): void {
		this.entities = {};
		if (!isArrayEmpty(data)) {
			for (let entity of data) {
				this.push(entity);
			}
		}
	}
	
	sortedValues (attributes: string[]): TEntity[] {
		return arrayObjectsSort(this.values(), attributes);
	}
}

//PART обработка строк
export function capitalizeFirstLetter (str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function parseIntElseZero (parsedValue: string) { //ToDo переименовать sd.parseInt в sd.parseIntElseZero
	let intValue = parseInt(parsedValue);
	if (isNaN(intValue)) intValue = 0;
	return intValue;
}

export function personFIO (person: { family: string, name: string, secName: string }): string {
	return person == null ? "" : famNameSec(person.family, person.name, person.secName);
}

export function famNameSec (family: string, name: string, secName: string) {
	return family +
			(isEmpty(name) ?
					"" :
					(" " + name + ((secName == null || secName === "") ? "" : " " + secName)));
}

export function enumToString (enumValue: any): string {
	return enumValue.replace("_", " ");
}

export function enumsToStrings (enums: any) {
	return Object.keys(enums)
			.map((key: string | number) => enums[<number>key])
			.filter(key => typeof key === "string");
}

export function getRegExp (str: string, regExp: string, argument: number): string | null {
	if (str == null) {
		return null;
	}
	let resultArray = str.match(regExp);
	return (resultArray == null || resultArray.length < argument) ?
			null :
			resultArray[argument - 1];
}

export function simplifyString (str: any): string {
	let simplifyString = str + "";
	return simplifyString.replace(" ", "").toLowerCase();
}

export function simplifyStringRussian (str: any): string {
	let russianString = simplifyString(str);
	let replaces: Map<string> = {
		"ё": "е",
		"e": "е",
		"o": "о",
		"p": "р",
		"a": "а",
		"h": "н",
		"t": "т",
		"k": "к",
		"x": "х",
		"b": "в",
		"m": "м"
	};
	for (let symbol in replaces) russianString = russianString.replace(symbol, replaces[symbol]);
	return russianString;
}

export function wrapTag (html: string, tag: string): string {
	return `<${tag}>` + html + `</${tag}>`;
}

export function htmlToDivJQ (html: string) {
	return $.fn.append.apply($("<div>"), $(html));
}

//PART обработка пустых значений
export function isEmpty (value: any): boolean {
	return (!value);
}

export function nvl<T> (value: T, ifnull: T, callback?: (value: T) => T): T {
	if (value == null) {
		return ifnull;
	}
	else {
		if (callback) {
			return callback(value);
		}
		else {
			return value;
		}
	}
}

//PART обработка свойств объекта
export function isProperty (objectVar: any, propertyString: string): boolean {
	return getProperty(objectVar, propertyString, "#Netданных") !== "#Netданных";
}

export function getProperty<T> (objectVar: any, propertyString: string, ifNull?: T): T {
	if (typeof objectVar === "function") objectVar = objectVar();
	if (ifNull === undefined && objectVar == null) {
		throw new Error("Ошибка в sd.getProperty(): objectVar не определен");
	}
	else {
		if (propertyString != null && objectVar != null && typeof objectVar === "object") {
			if (typeof propertyString !== "string") {
				throw new Error("Ошибка в sd.getProperty(): propertyString не является строкой: " +
						typeof propertyString);
			}
			else {
				if (propertyString !== "") {
					let propertyList = propertyString.split(".");
					for (let prop of propertyList) {
						let property = prop.trim();
						let isFunction = (property.substr(property.length - 2, 2) === "()");
						if (isFunction) property = property.substr(0, property.length - 2);
						if (property in objectVar) {
							if (isFunction) {
								if (typeof objectVar[property] === "function") {
									objectVar = objectVar[property]();
								}
								else {
									throw new Error("Ошибка в sd.getProperty(): " +
											property +
											" в выражении " +
											propertyString +
											" не является функцией: по факту " +
											typeof objectVar[property]);
								}
							}
							else {
								objectVar = objectVar[property];
							}
						}
						else {
							objectVar = undefined;
						}
						if (objectVar == null) {
							break
						}
					}
				}
			}
		}
	}
	return (ifNull === undefined) ? objectVar : (objectVar == null) ? ifNull : objectVar;
}

export function tryGetProperty (objectVar: any,
		propertyString: string,
		ifError?: any,
		fail?: (error: any, ifError: any) => any): any {
	if (typeof ifError === "function" && fail === undefined) {
		fail = ifError;
		ifError = undefined;
	}
	try {
		return getProperty(objectVar, propertyString, (fail === undefined) ? ifError : undefined);
	} catch (error) {
		if (typeof fail === "function") {
			return fail(error, ifError);
		}
		else {
			return ifError;
		}
	}
}

export function getPropertyValue<T extends any> (objectVar: any,
		propertyString: string,
		ifNull: T): T {
	let value = getProperty(objectVar, propertyString, ifNull);
	return (typeof value === "function") ? value() : value;
}

export function setProperty<T extends any> (owner: any, association: string, value: T): void {
	let property = getProperty<T>(owner, association);
	if (typeof property === "function") {
		property(value);
	}
	else {
		if (typeof owner === "function") owner = owner();
		owner[association] = value;
	}
}

export namespace sd {
//PART HTTP
	import DoneCallback = JQuery.jqXHR.DoneCallback;
	import SuccessCallback = JQuery.Ajax.SuccessCallback;
	
	export function fail (error: any): void {
		let response = (isProperty(error, "responseJSON")) ? (Array.isArray(error.responseJSON) ? {
			path: "Сообщение от сервера:",
			status: error.status,
			error: error.statusText,
			message: error.responseJSON.toString()
		} : error.responseJSON) : {
			path: "Неизвестная ошибка:",
			status: error.status,
			error: error.statusText,
			message: error.responseText
		};
		console.log(response.path +
				" " +
				response.status +
				" " +
				response.error +
				" " +
				response.message);
		if (typeof app == "object") app.ladda(false);
		let message = isEmpty(response.message) ?
				(response.status + " запрос не выполнен") :
				response.message;
		if (response.status < 400) {
			sd.warning(message);
		}
		else {
			sd.error(message);
		}
	}
	
	export function get (uri: TUri, callback: DoneCallback, type?: string): JQueryPromise<any> {
		if (uri instanceof Uri) uri = "" + uri;
		//@ts-ignore
		return $.get(uri, callback, type)
				.fail(fail);
	}
	
	export function post (url: TUri, data: string, callback: DoneCallback, type?: string) {
		if (url instanceof Uri) url = "" + url;
		if (type == null) type = "json";
		return $.post(url, data, callback, type)
				.fail(fail);
	}
	
	//ToDo переименовать sd.delete в sd.deleteXHR, т.к. delete зарегистрированное слово
	export function deleteXHR (uri: TUri, callback?: SuccessCallback<any>) {
		if (uri instanceof Uri) uri = "" + uri;
		return $.ajax({
			url: uri, type: "DELETE", success: callback
		}).fail(fail);
	}

// return jqXHR
	export function putXHR (uri: TUri,
			data?: string,
			callback?: SuccessCallback<any>,
			type?: string): JQueryXHR {
		if (uri instanceof Uri) uri = "" + uri;
		if (type == null) type = "json";
		return $.ajax({
			url: uri, method: "PUT", dataType: type, data: data, success: callback
		});
	}

// with standard .fail
	export function put (uri: TUri,
			data?: string,
			callback?: SuccessCallback<any>,
			type?: string): JQueryPromise<any> {
		return putXHR(uri, data, callback, type)
				.fail(fail);
	}
	
	/*
	 sd.request("get", "/rest/data/persons", {
	 function  onload (value) {uchGod = JSON.parse(value)},
	 function  onprogress (e) {console.log(Match.round(100 * e.loaded / e.total) + "% загружено")}});
	 sd.request("put", "/rest/data/klasses/50/klRuk", {
	 data: "/rest/data/teachers/9",
	 type: "text/uri-list",
	 function  onerror (err) {console.log("Ошибка: " + err.message)}});
	 
	 ManyToMany REST PUT
	 sd.request("put", "/rest/data/agregates/141/birds",
	 {data:"/rest/data/birds/1\n/rest/data/birds/2",
	 type:"text/uri-list",
	 onload:function(data) {
	 console.log(data)
	 }});
	 */
	export function request (method: string, uri: TUri, opt: any) {
		if (uri instanceof Uri) uri = "" + uri;
		let request = new XMLHttpRequest();
		let async = opt.hasOwnProperty("async") ? opt.async : true;
		request.open(method, uri, async);
		request.setRequestHeader("Content-Type", (opt.type) ? opt.type : "application/json");
		if (typeof app === "object") {
			request.setRequestHeader(app.header, app.token);
		}
		if (opt.onload) {
			request.onload = () => {
				if (request.status >= 200 && request.status < 400) opt.onload(request);
			};
		}
		if (opt.onprogress) {
			request.onprogress = (e) => {
				if (e.lengthComputable) opt.onprogress(e);
			};
			request.onloadend = (e) => {
				opt.onprogress(e);
			}
		}
		if (opt.onerror) {
			request.onerror = opt.onerror;
			request.onreadystatechange = () => {
				if (request.readyState === 4 && (request.status < 200 || request.status >= 400)) {
					opt.onerror(JSON.parse(request.response));
				}
			}
		}
		request.send((opt.data) ? opt.data : undefined);
		return request;
	}
	
	export function response (method: string,
			uri: TUri,
			data?: string | {},
			contentType?: string,
			onLoad?: (request: XMLHttpRequest) => void): any {
		if (typeof data === "object") data = JSON.stringify(data);
		return request(method, uri, {
			data: data,
			type: (contentType) ? contentType : "application/json",
			onload: (onLoad) ? onLoad : (request: XMLHttpRequest) => {
				console.log(JSON.parse(request.response));
			}
		});
	}
	
	export function uri (uri: string | string[] | Observable<string> | Uri,
			parameters?: { [key: string]: any }): string {
		return "" + new Uri(uri, parameters);
	}
	
	export function frontendLog (type: string, message: string, title?: string) {
		sd.request("POST", "/log/frontend", {
			data: JSON.stringify({
				type: type,
				uri: location.pathname +
						(location.href.indexOf("?") > -1 ?
								location.href.substr(location.href.indexOf("?")) :
								""),
				message: message,
				title: title
			})
		});
	}
	
	export function getReport (uri: string, sendObjects: any, description: string): void {
		app.ladda(true);
		let xhr = new XMLHttpRequest();
		xhr.open("POST", uri, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader(app.header, app.token);
		xhr.onreadystatechange = () => {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					let type = <string>xhr.getResponseHeader("Content-Type");
					let blob = new Blob([xhr.response], {type: type});
					let downloadUrl = URL.createObjectURL(blob);
					let filename = "";
					let disposition = xhr.getResponseHeader("Content-Disposition");
					if (disposition && disposition.indexOf("attachment") !== -1) {
						let filenameRegex = /filename[^;=\n]*=UTF-8''((['"]).*?\2|[^;\n]*)/;
						let matches = filenameRegex.exec(disposition);
						if (matches != null && matches[1]) {
							filename = matches[1].replace(/['"]/g, "");
						}
					}
					if (filename) {
						let a = document.createElement("a");
						a.href = downloadUrl;
						a.download = decodeURI(filename);
						document.body.appendChild(a);
						clickElement(a);
					}
					else {
						location.href = downloadUrl;
					}
					setTimeout(function () {
						URL.revokeObjectURL(downloadUrl);
					}, 100);
				}
				else if (xhr.status < 200 || xhr.status >= 400) {
					sd.error(`Документ "${description}" не сформирован. Обратитесь к разработчику. ${xhr.responseURL}`);
				}
			}
			app.ladda(false);
		};
		xhr.onerror = sd.fail.bind(sd.fail);
		xhr.responseType = "arraybuffer";
		xhr.send(JSON.stringify(sendObjects));
	}
	
	function doToastr (method: string,
			message: string,
			title?: string,
			overrides?: ToastrOptions): JQuery {
//		if (method != "success") frontendLog(method, message, title);
		//TODO заменить на Bootstrap4.toast
		//@ts-ignore
		let methodCall = toastr[method];
		if (title != undefined) {
			if (overrides) {
				return methodCall(message, title, overrides);
			}
			else {
				return methodCall(message, title);
			}
		}
		else {
			return methodCall(message);
		}
	}
	
	export function success (message: string, title?: string, overrides?: ToastrOptions): JQuery {
		return doToastr("success", message, title, overrides);
	}
	
	export function info (message: string, title?: string, overrides?: ToastrOptions): JQuery {
		return doToastr("info", message, title, overrides);
	}
	
	export function warning (message: string, title?: string, overrides?: ToastrOptions): JQuery {
		return doToastr("warning", message, title, overrides);
	}
	
	export function error (message: string, title?: string, overrides?: ToastrOptions): JQuery {
		return doToastr("error", message, title, overrides);
	}
	
	export function date (date?: TDate | string): SDate {
		return new SDate(date)
	}
}
export type TDate = Date | null;

export class SDate {
	private readonly date: TDate;
	
	constructor (date?: TDate | string) {
		if (date === null) {
			this.date = null;
			return;
		}
		if (date === undefined)
			date = new Date();
		if (date instanceof Date) {
			this.date = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
		}
		else if (typeof date === "string") {
			this.date = new Date(date);
		}
		else {
			sd.error(`Дата в неизвестном формате: ${date} ${typeof date}`);
			return;
		}
	}
	
	get (): TDate {
		return this.date;
	}
	
	toISOString (): string {
		return this.date instanceof Date ? this.date.toISOString() : "";
	}
	
	toLocaleDateString (): string {
		return this.date instanceof Date ? this.date.toLocaleDateString() : "";
	}
	
	toRuLL (): string {
		return dateRuLL(this.date);
	}
}

let monthsRu: string[] = ["января",
	"февраля",
	"марта",
	"апреля",
	"мая",
	"июня",
	"июля",
	"августа",
	"сентября",
	"октября",
	"ноября",
	"декабря"];

export function dateRuLL (date: TDate) {
	return (date) ? `${date.getDate()} ${monthsRu[date.getMonth()]} ${date.getFullYear()}` : "";
}

//PART прочие
export type TUri = Uri | string;

export interface IUriSearch {
	path?: any[]
	find: string
	parameters: any
}

export type TUriParameters = { [key: string]: string | number }

export class Uri { // Value Object by DDD
	// attributes
	private path: string = "";
	private parameters: TUriParameters = {};
	
	constructor (paths: string | string[] | Observable<string> | Uri, parameters?: Map<any>) {
		if (isEmpty(paths)) {
			throw new Error("Ошибка при инициализации Uri: uri не определен");
		}
		// constructor
		if (isObservable(paths)) {
			this.path += this.addPath((<Observable<string>>paths)());
		}
		else {
			if (paths instanceof Uri) {
				this.path += this.addPath(paths.getPath());
				this.setParameters(paths.getParameters());
			}
			else {
				this.path += this.addPath(<string | string[]>paths);
			}
		}
		if (parameters) this.setParameters(parameters);
	}
	
	// operations
	private setParameters (parameters: TUriParameters) {
		for (let parameter in parameters) if (parameters.hasOwnProperty(parameter)) {
			this.setParameter(parameter, parameters[parameter] + "");
		}
	}
	
	private setParameter (parameter: string, parameterValue: string) {
		if (isEmpty(parameter)) {
			throw new Error("Ошибка в Uri.setParameter(): parameter не определен");
		}
		if (isEmpty(parameterValue)) {
			delete this.parameters[parameter];
		}
		else {
			this.parameters[parameter] = parameterValue;
		}
	}
	
	private addOnePath (pathOne: string | ID): string {
		pathOne = pathOne + "";
		if (!isEmpty(pathOne)) {
			if (pathOne.substr(0, 1) === "/") pathOne = pathOne.substr(1, pathOne.length - 1);
			if (pathOne.substr(pathOne.length - 1, 1) === "/") {
				pathOne = pathOne.substr(0, pathOne.length - 1);
			}
			// path += (isEmpty(path) ? "" : "/") + path;
			pathOne = "/" + pathOne;
		}
		return pathOne;
	}
	
	private addPath (pathAdding: string | string[] | ID): string {
		let path = "";
		if (!isEmpty(pathAdding)) {
			if (Array.isArray(pathAdding)) {
				for (let part of pathAdding) path += this.addOnePath(part);
			}
			else {
				path += this.addOnePath(pathAdding);
			}
		}
		return path;
	}
	
	toString (): string {
		let uri = this.path;
		for (let parameter in this.parameters) if (this.parameters.hasOwnProperty(parameter)) {
			uri += (uri.indexOf("?") === -1) ? "?" : "&";
			uri += parameter + "=" + encodeURI(this.parameters[parameter] + "");
		}
		return uri;
	}
	
	getPath (): string {
		return this.path;
	}
	
	getParameters (): TUriParameters {
		return this.parameters;
	}
	
	toFragment (fragment: string): string { //ToDo Uri.fragmet переименовать в Uri.toFragment
		if (isEmpty(fragment)) {
			throw new Error("Ошибка в Uri.toFragment(): fragment не определен");
		}
		return this.toString() + "#" + fragment;
	}
	
	withPath (pathAdd: string | any[] | ID): Uri {
		if (isEmpty(pathAdd)) {
			throw new Error("Ошибка в Uri.withPath(): pathAdd не определен");
		}
		return new Uri(this.path + this.addPath(pathAdd), this.parameters);
	}
	
	withParameter (parameter: string, parameterValue: any): Uri {
		let parameters: { [key: string]: any } = {};
		parameters[parameter] = parameterValue;
		return this.withParameters(parameters);
	}
	
	withParameters (parameters: { [key: string]: any }): Uri {
		if (parameters == null) {
			throw new Error("Ошибка в Uri.withParameters(): parameters не определены");
		}
		return new Uri(this, parameters);
	}
}

export class Deffered {
	name: string;
	deffered: JQueryDeferred<any>;
	
	constructor (name: string, deffered: JQueryDeferred<any>) {
		this.name = name;
		this.deffered = deffered;
	}
}

export class Deferreds {
	private deferreds: Array<Deffered> = [];
	isDone = true;
	isLog = false;
	name: string;
	
	size (): number {
		return this.deferreds.length
	}
	
	add (name?: string) {
		this.onAdd();
		let deferred = new Deffered(name ?? this.deferreds.length + "", $.Deferred());
		$.when(deferred.deffered).done(() => this.onDone(deferred.name));
		this.deferreds.push(deferred);
		this.isDone = false;
		if (this.isLog) console.log(`${this.name}.${deferred.name} added (length = ${this.deferreds.length})`);
	}
	
	onAdd () {
	}
	
	resolve () {
		let deferred = this.deferreds.pop();
		if (deferred) {
			if (this.isLog) console.log(`${this.name}.${deferred.name} resolved (length = ${this.deferreds.length})`);
			deferred.deffered.resolve();
		}
		else {
			if (this.isLog) console.log(`${this.name} resolved but array is empty`);
		}
	}
	
	functionDone () {
	}
	
	private onDone (name: string) {
		if (this.deferreds.length === 0 && !this.isDone) {
			this.isDone = true;
			this.functionDone();
			if (this.isLog) console.log(`${this.name} done (last deferred was ${name})`);
		}
	}
	
	done (functionDone?: () => void) {
		if (functionDone !== undefined) this.functionDone = functionDone;
		this.add("byDone");
		for (let deferred of this.deferreds) $.when(deferred.deffered)
				.done(() => this.onDone(deferred.name));
		this.resolve();
	}
	
	constructor (name?: string, isLog?: boolean) {
		this.name = name ? name : "noname";
		this.isLog = isLog === undefined ? false : isLog;
	}
}

//http://stackoverflow.com/questions/11618278/how-to-break-on-property-change-in-chrome
export function watch (oObj: any, sProp: string) {
	let sPrivateProp = "$_" + sProp + "_$"; // to minimize the name clash risk
	oObj[sPrivateProp] = oObj[sProp];
	// overwrite with accessor
	Object.defineProperty(oObj, sProp, {
		get: () => {
			return oObj[sPrivateProp];
		}, set: (value) => {
			//console.log("setting " + sProp + " to " + value);
			debugger; // sets breakpoint
			oObj[sPrivateProp] = value;
		}
	});
}

export function clickElement (element: HTMLAnchorElement) {
	const evt = window.document.createEvent("MouseEvent");
	evt.initEvent("click", true, true);
	element.dispatchEvent(evt);
	return element;
}
