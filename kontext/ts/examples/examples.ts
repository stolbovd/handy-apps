import "kontext/examples/modules";
import {SelectEntity} from "kontext/components/select";
import {famNameSec, getProperty, sd, Uri} from "kontext/sd/sd";
import {AppModel, REST, WindowFileable} from "kontext/sd/appmodel";
import {FileOpenEvent, FileProgressEvent, ID, idToNumber, IEntity} from "kontext/sd/types";
import {ListControlGetPage} from "kontext/sd/entitylists";
import {EntityControlList, IEntityOptions} from "kontext/sd/entities";
import {AllBindings, applyBindingsToNode, bindingHandlers, Computed, observable, Observable, ObservableArray, observableArray, pureComputed, tasks, utils} from "knockout";

declare let entityId: number;
declare let app: Examples;
declare let document: Document;
declare let window: WindowFileable;

declare function escape (s: string): string;

interface PersonProjection extends IEntity { //simple
	family: string
	name: string
	secName: string
	username: string
	email: string
	birthday: string
	famIO: string
}

export interface TeacherProjection extends IEntity { //simple
	person: PersonProjection
}

class Game {
	petya: Player = new Player(this, "Петя");
	vasya: Player = new Player(this, "Вася");
	
	constructor (public stones: number, public count: number) {
		if (stones >= 1 && stones <= 25) {
			this.stones = stones;
		} else {
			throw new Error("кол-во камней должно быть от 1 до 25");
		}
		do {
			if (this.petya.go()) break;
			if (this.vasya.go()) break;
		} while (true);
	}
	
	multiply (): void {
		this.stones *= this.count;
	}
	
	add (): void {
		this.stones += this.count;
	}
	
	checkWin (): boolean {
		return this.stones >= 26;
	}
	
	printWinner () {
		//ToDo print Winner
	}
}

class Player {
	constructor (public game: Game, public name: string) {
		this.game = game;
		this.name = name;
	}
	
	go (): boolean {
		if (Math.random() < 0.5) {
			this.game.add();
		} else {
			this.game.multiply();
		}
		return this.game.checkWin();
	}
}

let game = new Game(12, 4);
game.printWinner();

class Chosen {
	private list = [{
		id: 0, name: "valuevaluevaluevalue1", type: "type1"
	}, {
		id: 1, name: "valuevaluevaluevalue2", type: "type2"
	}, {
		id: 2, name: "valuevaluevaluevalue3", type: "type3"
	}, {
		id: 3, name: "valuevaluevaluevalue4", type: "type1"
	}, {
		id: 4, name: "valuevaluevaluevalue5", type: "type2"
	}, {
		id: 5, name: "valuevaluevaluevalue6", type: "type2"
	}];
	selected = observableArray([this.list[2]]);
	select = new SelectEntity({});
	
	constructor () {
		this.select.setList(this.list);
	}
}

class OptGroup {
	private list = observableArray([{
		type: "type1", values: observableArray([{
			id: 0, name: "valuevaluevaluevalue1"
		}, {
			id: 3, name: "valuevaluevaluevalue4"
		}])
	}, {
		type: "type2", values: observableArray([{
			id: 1, name: "valuevaluevaluevalue2"
		}, {
			id: 4, name: "valuevaluevaluevalue5"
		}, {
			id: 5, name: "valuevaluevaluevalue6"
		}])
	}, {
		type: "type3", values: observableArray([{id: 2, name: "valuevaluevaluevalue3"}])
	}]);
	selected = observableArray([this.list()[1].values()[2]]);
}

class Select {
	teacher: Observable<TeacherProjection> = observable(
			<TeacherProjection><unknown>{id: 10, person: null}
	);
	teacherFamIO = pureComputed(() => {
		return getProperty(this.teacher, "person.famIO", "");
	});
	teachers = new SelectEntity({
		uri: new Uri([REST, "teachers/projections/simple"]),
		optionsText: "person.famIO",
		getList: true,
		value: {owner: this, association: "teacher"},
		filter: (entity) => getProperty<boolean>(entity, "person.enabled")
	});
}

bindingHandlers.inputInt = {
	init: (element: HTMLInputElement, valueAccessor: () => number, allBindings: AllBindings) => {
		bindingHandlers.value.init(element, valueAccessor, allBindings);
		$(element).addClass("input-int form-control").attr({"type": "number", "min": 0});
		$(element).on("click", () => $(element).trigger("select"));
	}, update: (element: HTMLInputElement, valueAccessor: () => number, allBindings: AllBindings, viewModel: any) => {
		bindingHandlers.value.update(element, valueAccessor);
		let value = utils.unwrapObservable(valueAccessor());
		applyBindingsToNode(element, {style: {"opacity": value == 0 ? 0.4 : 1}}, viewModel);
	}
};
bindingHandlers.hasSelectedFocus = {
	init: function (element: HTMLElement, valueAccessor: () => boolean,
			allBindingsAccessor: AllBindings) {
		bindingHandlers["hasfocus"].init(element, valueAccessor, allBindingsAccessor);
	}, update: function (element: any, valueAccessor: () => boolean) {
		bindingHandlers["hasfocus"].update(element, valueAccessor);
		let selected = utils.unwrapObservable(valueAccessor());
		if (selected) element.select();
	}
};

class Person extends EntityControlList<PersonProjection> {
	options (): IEntityOptions {
		return {
			attributes: ["id", "family", "name", "secName", "username", "email", "birthday"],
			name: "учащийся",
			genitive: "учащегося",
			urlEntity: "persons",
			projection: "simple"
		}
	}
	
	fio: Computed<string> = pureComputed(() => famNameSec(this.entys.family(),
			this.entys.name(),
			this.entys.secName()));
}

class FileOpen {
	handleFileSelect (evt: FileOpenEvent): void {
		let file = evt.target.files[0];
		let parser = new DOMParser();
		let reader = new FileReader();
		reader.onload = (evt: FileProgressEvent): void => {
			let xmlDoc: XMLDocument = parser.parseFromString(<string>evt.target.result, "text/xml");
			(<HTMLElement>document.getElementById("xmlContent")).innerHTML
					= `<p style="font-family:monospace">${evt.target.result}</p>`;
		};
		reader.readAsText(file);
		(<HTMLElement>document.getElementById("list")).innerHTML
				= `<strong>${file.name}</strong> (${file.type || "n/a"}) - ${file.size} байт`;
	}
	
	constructor () {
		if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
			sd.warning("Этот броузер не поддерживает открытие файлов!");
		}
		(<HTMLElement>document.getElementById("files")).addEventListener("change",
				this.handleFileSelect,
				false);
	}
}

class Examples extends AppModel {
	chosen = new Chosen();
	optgroup = new OptGroup();
	select = new Select();
	persons = new ListControlGetPage<PersonProjection, Person>(Person);
	xmlFiles = new FileOpen();
	isChanged = observable(false);
	
	connect () {
		this.persons.listGet.getSize = () => 20;
		this.persons.listGet.restGetList();
		window.onbeforeunload = () => app.isChanged() ? "Изменено" : undefined;
	}
}

console.log(`entityId: ${entityId}`);
new Examples();
tasks.schedule(() => console.log("task"));
let shedule = (callback: () => void, delay: number) => {
	setTimeout(() => {
		callback();
		shedule(callback, delay);
	}, delay);
};
//shedule(() => console.log("shedule task"), 1000);
setInterval(() => console.log("interval"), 1000 * 60 * 10);
//function loop() {
//	tasks.schedule(loop);
//}
//loop();