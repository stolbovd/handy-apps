import "jquery";
import "sweetalert";
import {Deferreds, sd} from "kontext/sd/sd";
import {IEntity} from "kontext/sd/types";
import {AllBindings, applyBindings, applyBindingsToNode, BindingContext, bindingHandlers, isObservable, isObservableArray, observable, Observable, observableArray, pureComputed, unwrap, utils, virtualElements} from "knockout";

export const RESTData: string = "rest/data";
export const REST: string = "rest";
export const LOG: string = "log";
declare let window: IWindow;
declare let app: AppModel;

export interface WindowFileable extends Window {
	Blob: FileList
	File: File
	FileReader: FileReader
	FileList: FileList
}

export interface IWindow extends Window {
	app: AppModel
	onload: () => void;
	print: () => void;
}

export abstract class AppDecorator<TApp extends AppModel> {
	app: TApp;
	
	constructor (app: TApp) {
		this.app = app;
	}
}

class LogClickEvent {
	date: string;
	
	constructor (public method: string, public elementText: string) {
		this.method = method;
		this.elementText = elementText;
		this.date = (new Date()).toTimeString().substr(0, 5);
	}
	
	toString (): string {
		return `${this.date}:${this.method}:${this.elementText} `;
	}
}

class LogEvents {
	eventsLog: LogClickEvent[] = [];
	
	constructor (public delay: number, run?: boolean) {
		window.addEventListener("beforeunload", () => app.logClikEvents.send(true));
		if (run) {
			this.run();
		}
	}
	
	push (method: string, elementText: string) {
		this.eventsLog.push(new LogClickEvent(method, elementText))
	}
	
	send (isUnload?: boolean) {
		let eventsLog = app.logClikEvents.eventsLog;
		if (eventsLog.length > 0) {
			let message = "";
			if (isUnload) {
				for (let event of eventsLog) {
					message += event.toString();
				}
			}
			else {
				while (eventsLog.length > 0) {
					message += (<LogClickEvent>eventsLog.shift()).toString();
				}
			}
			sd.request("POST", "/log/clicks", {data: message});
		}
	}
	
	run () {
		setInterval(this.send.bind(this), this.delay);
	}
}

export class DefferedsLadda extends Deferreds {
	constructor () {
		super("ladda");
	}
	
	onAdd () {
		app.ladda(true);
	}
	
	functionDone () {
		app.ladda(false);
	}
}

export class AppModel {
	ladda: Observable<boolean> = observable(false);
	deferreds: Deferreds = new Deferreds("app");
//	header: string | undefined = $("meta[name='_csrf_header']").attr("content");
//	token: string | undefined = $("meta[name='_csrf']").attr("content");
	logClikEvents = new LogEvents(1000 * 20, true);
	
	onbeforeunload (isConfirm: boolean) {
		window.onbeforeunload = <() => any>(isConfirm ? () => "Данные не сохранены" : null);
	}
	
	constructor () {
//		$(document).ajaxSend((e: JQuery.TriggeredEvent, xhr: JQuery.jqXHR) => {
//			xhr.setRequestHeader("Content-type", "application/json");
//			if (this.header && this.token) xhr.setRequestHeader(this.header, this.token);
//		});
		this.init();
	}
	
	connect () {
		this.postConnect();
	}
	
	postConnect (deferreds?: Deferreds) {
	}
	
	init () {
		window.app = this;
		this.deferreds.done(() => {
			applyBindings(app);
			app.connect();
		});
	}
}

export class ShowAppMode {
	[key: string]: any
	
	mode: Observable<string> = observable("");
	last: string;
	
	constructor (modes: string[]) {
		for (let mode of modes) {
			(<any>this)["is" + mode] = pureComputed(() => this.mode() === mode);
			(<any>this)["show" + mode] = () => {
				this.last = this.mode();
				this.mode(mode);
			}
		}
		this.mode(modes[0]);
	}
	
	switch (mode: string): void {
		if (this["is" + mode]()) this["show" + this.last](); else this["show" + mode]();
	}
}

export function hasChanged (observable: Observable): void {
	if (isObservable(observable)) {
		if (isObservableArray(observable)) {
			let data = observable();
			observable([]);
			observable(data);
		}
		else {
			(<any>observable).valueHasMutated();
		}
	}
}

export function sdSwal (action: string, entity: string, callback?: (isConfirm: boolean) => any) {
	sweetAlert({
		title: "Подтвердите",
		text: "Вы действительно желаете " + action + " " + entity + "?",
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "Да, " + action + "!",
		cancelButtonText: "Отмена",
		animation: false
	}, callback);
}

// ToDo реализовать заполнение атрибутов в формате "person.name"
// ToDo и автоматическое создание функций observable() или observableArray() в зависимости от типа атрибута
export function fillApp (attributes: string[], objFrom: any, objTo: any) {
	if (objTo === undefined) objTo = window.app;
	if (objFrom === undefined) objFrom = {};
	for (let attribute of attributes) {
		if (objFrom[attribute] === undefined) objFrom[attribute] = null;
		let from = objFrom[attribute];
		if (Array.isArray(from)) from = from.slice();
		if (objTo[attribute] === undefined) {
			objTo[attribute] = (Array.isArray(from)) ? observableArray(from) : observable(from);
			objTo[attribute].attributeName = attribute;
		}
		else if (typeof objTo[attribute] === "function") {
			objTo[attribute](from);
		}
		else {
			objTo[attribute] = from;
		}
	}
}

export function restoreObject (attributes: string[], objFrom: any): any {
	if (objFrom === undefined) objFrom = window.app;
	let objTo: IEntity = {};
	for (let attribute of attributes) if (objFrom[attribute] === undefined) {
		sd.error("В копируемом объекте не найден атрибут " + attribute);
	}
	else {
		(<any>objTo)[attribute] = (typeof objFrom[attribute] === "function") ?
				objFrom[attribute]() :
				objFrom[attribute];
	}
	return objTo;
}

function makeTemplateValueAccessor (valueAccessor: () => any) {
	return () => {
		let values = utils.unwrapObservable(valueAccessor());
		if (values == null) {
			return;
		}
		let array = [];
		let keys = Object.keys(values);
		keys.sort();
		for (let key of keys) array.push({key: key, value: values[key]});
		return array;
	};
}

bindingHandlers.keyvalue = {
	init: (element: any, valueAccessor: () => any) => {
		return (<any>bindingHandlers["foreach"])["init"](element,
				makeTemplateValueAccessor(valueAccessor));
	},
	update: (element: any,
			valueAccessor: () => any,
			allBindings: AllBindings,
			viewModel: any,
			bindingContext: BindingContext) => {
		return (<any>bindingHandlers["foreach"])["update"](element,
				makeTemplateValueAccessor(valueAccessor),
				allBindings,
				viewModel,
				bindingContext);
	}
};
virtualElements.allowedBindings.keyvalue = true; //Чтобы работал support virtual elements <!-- ko keyvalue: ...
bindingHandlers.fileUri = {
	init: (element: any) => {
		$(element).attr("target", "_blank");
	}, update: (element: any, valueAccessor: () => any) => {
		(<any>bindingHandlers["attr"])["update"](element, () => {
			return {href: "/files/" + valueAccessor()}
		});
		(<any>bindingHandlers["text"])["update"](element, () => {
			let path = valueAccessor();
			if (typeof path !== "string") {
				return "";
			}
			let slashPosition = path.lastIndexOf("/");
			return path.substr(slashPosition + 1, path.length - slashPosition);
		});
	}
};
//<input type="checkbox" data-bind="iCheck: isIn"/>
bindingHandlers.ladda = {
	init: (element: HTMLElement,
			valueAccessor: () => boolean,
			allBindings: AllBindings,
			viewModel: any) => {
		if (element.tagName == "SPAN") {
			element.classList.add("spinner-border");
			(<HTMLElement>element.parentElement).classList.add("spinner-ladda");
		}
		else {
			$(element).prepend("<span class=\"spinner-border\"></span> ");
			element.classList.add("spinner-ladda");
		}
		applyBindingsToNode(element, {visible: valueAccessor()}, viewModel);
	}
};
// для изменяемого содержания вместо tooltip: {.., title: forecastGradeTooltip}
// делаем attr: {'data-original-title': forecastGradeTooltip}
bindingHandlers.tooltip = {
	init: (element: any, valueAccessor: () => any) => {
		let value = {...{placement: "left", container: "body"}, ...valueAccessor()};
		let jQElement = $(element);
		for (let attribute in value) {
			if (value.hasOwnProperty(attribute)) {
				jQElement.attr(`data-${attribute}`, value[attribute]);
			}
			else {
				jQElement.attr("data-placement", value);
			}
			jQElement.attr("disabled");
		}
		//@ts-ignore
		jQElement.tooltip();
		//NOTE если tooltip остается после уничтожения element в результате visible: true у
		//  родительских нод, повесить событие на ноду, уничтожающую .tooltip как в примере:
		//  codificator.ts RequirementEdit.constructor
		//	this.isEdit.subscribe((isEdit: boolean) => {
		//		if (!isEdit) $(".tooltip").remove()
		//	});
	}
};
/* Toggle visible elements inside <tr>
 <tr data-bind="tdToggle:">
 <td class="td-toggle">
 inside toggled tags
 OR
 <td>
 <tag class="tag-toggle">
 OR
 <td data-bind="tdToggle:>
 <tag class="tag-toggle">
 */
bindingHandlers.tdToggle = {
	init: (element: any) => {
		let jqElement = $(element);
		let labelToggle = () => {
			$(".td-toggle", jqElement).children().toggle();
			$(".tag-toggle", jqElement).toggle();
		};
		$(".td-toggle", jqElement).children().hide();
		$(".tag-toggle", jqElement).hide();
		jqElement.on("mouseover", labelToggle);
		jqElement.on("mouseout", labelToggle);
	}
};
bindingHandlers.textDate = {
	update: (el: any, valueAccessor: () => any) => {
		el.textContent = sd.date(utils.unwrapObservable(valueAccessor())).toLocaleDateString();
	}
};
// data-bind="debug: $data"
bindingHandlers.debug = {
	init: (element: any, valueAccessor: () => any) => {
		console.log("debug.init");
		console.log(unwrap(valueAccessor()));
	}, update: (element: any, valueAccessor: () => any) => {
		console.log("debug.update");
		console.log(unwrap(valueAccessor()));
	}
};
bindingHandlers.valueUpdated = {
	preprocess: (value: string,
			name: string,
			addBindingCallback: (name: string, value: string) => void): string => {
		addBindingCallback("value", value);
		addBindingCallback("valueUpdate", "'afterkeydown'");
		return value;
	}
};
bindingHandlers.clickl = {
	init: (element: any,
			valueAccessor: () => any,
			allBindingsAccessor: AllBindings,
			viewModel: any,
			bindingContext: BindingContext) => {
		let originalFunction = valueAccessor();
		applyBindingsToNode(element, {
			click: () => {
				let methodName = originalFunction.toString().match("(.*)return (.*) }");
				app.logClikEvents.push(methodName ? methodName[2] + ":" : "", element.innerText);
				originalFunction.call(viewModel, (<BindingContext>bindingContext).$data, element);
			}
		}, viewModel);
	}
};
