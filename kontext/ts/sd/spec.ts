import "jasmineMatchers";
import {AppDecorator, AppModel, IWindow} from "kontext/sd/appmodel";
import {isObservable} from "knockout";

declare let app: AppModelSpec;
declare let window: IWindow;
export type IDone = () => void;

export function expectArraySize (array: any[], length: number): void {
	expect(array).not.toBeNull();
	expect(Array.isArray(array)).toBeTruthy();
	expect(array.length).toEqual(length);
}

export function expectArrayEqual (array: any[], expected: any[]): void {
	expectArraySize(array, expected.length);
	for (let index in expected) expect(array[index]).toBe(expected[index]);
}

export class Spec<TApp extends AppModel> extends AppDecorator<TApp> {
	constructor (app: TApp) {
		super(app);
		this.app.onbeforeunload(false);
		this.app.deferreds.add("spec");
	}
	
	init (done: IDone): void {
		let postConnect = app.postConnect;
		app.postConnect = () => {
			postConnect.bind(app);
			expect(isObservable(app.ladda)).toBeTruthy();
			done();
		};
		app.deferreds.resolve();
	}
}

export class AppModelSpec extends AppModel {
	spec: Spec<AppModel>;
	
	constructor () {
		super();
		this.spec = new Spec<AppModel>(this);
	}
}

export function runSpec (): void {
	if (window) window.onload();
}