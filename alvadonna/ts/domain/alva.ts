import {AppModel} from "kontext/sd/appmodel";
import {computed, Computed, observable, Observable, observableArray, ObservableArray} from "knockout";
import {isEmpty, nvl, sd, Uri} from "kontext/sd/sd";
import {Map} from "kontext/sd/types";

declare let app: AlvaApp;

interface PointProjection {
	id: string,
	task: string,
	code: string,
	linkUrl: string,
	linkName: string,
	images: string[]
//ToDo	html: string
}

let emptyPoint = {
	"id": "", "task": "", "code": "", "linkUrl": "", "linkName": "", "images": [], "html": ""
}

class Point {
	code: Observable<string> = observable("");
	id: Observable<string> = observable("");
	images: string[] = [];
	isCode: Observable<boolean> = observable(true);
	isExpanded: Observable<boolean> = observable(false);
	isReady: Computed<boolean> = computed(() => app.pointIds[this.id()] <
			app.pointIds[app.lastPointId()] &&
			!this.isExpanded());
	point: PointProjection;
	
	constructor (point: PointProjection) {
		this.point = point;
		this.id(point.id);
		this.isCode(!isEmpty(point.code));
		point.images.forEach(image => this.images.push("img/" + image));
	}
	
	check (): void {
		if (this.codeSubstr(this.code()) == this.codeSubstr(this.point.code)) {
			sd.success(`Задание: ${this.point.task}`, `Ура! "${this.code()}" это правильный код`);
			app.nextPoint(this);
		}
		else {
			sd.warning("попробуйте снова", "неправильно");
		}
	}
	
	codeSubstr (code: string): string {
		return code.trim().substr(0, 5).toLowerCase();
	}
	
	active (): void {
		this.isExpanded(true);
		app.current(this);
		app.setLastPoint(this.id())
	}
	
	expand (): void {
		this.isExpanded(true);
	}
	
	onKeyUp (self: Point, event: KeyboardEvent): void {
		if (event.code == "Enter")
			self.check();
	}
}

class AlvaApp extends AppModel {
	points: ObservableArray<Point> = observableArray([]);
	pointIds: Map<number> = {};
	lastPointId: Observable<string> = observable(<string>nvl(localStorage.getItem("alva-last-point-id"), ""));
	current: Observable<Point> = observable(new Point(emptyPoint));
	isReady: Observable<boolean> = observable(false);
	readyHtml: string = "<h1>Поздравлем!!!</h1> <h2>Вы завершили квест</h2> <div class=\"row\">	<img src=\"img/congratulation.jpg\"></div>";
	
	connect () {
//		localStorage.setItem("alva-last-point-id", "start");
		let point: Point;
		sd.get("points.json", (data: PointProjection[]) => {
			let points: Point[] = [];
			for (let index in data) {
				let pointData: PointProjection = data[index];
				point = new Point(pointData);
				this.pointIds[pointData.id] = parseInt(index);
				if (isEmpty(this.lastPointId())) {
					this.lastPointId(pointData.id);
					localStorage.setItem("alva-last-point-id", pointData.id);
				}
				if (pointData.id == this.lastPointId()) {
					point.active();
				}
				points.push(point);
			}
			this.points(points);
		});
	}
	
	nextPoint (point: Point) {
		point.isExpanded(false);
		let pointIndex = this.pointIds[point.id()];
		if (pointIndex >= this.points().length - 1) {
			this.lastPointId("");
			this.isReady(true);
		} else if (pointIndex >= this.pointIds[this.lastPointId()])
		{
			this.points()[pointIndex + 1].active();
		}
	}
	
	setLastPoint (pointId: string) {
		if (isEmpty(this.lastPointId()) || this.pointIds[pointId] >= this.pointIds[this.lastPointId()]) {
			localStorage.setItem("alva-last-point-id", pointId);
			this.lastPointId(pointId);
		}
	}
	
	start (): void {
		this.points()[0].active();
		this.isReady(false);
	}
}

new AlvaApp();