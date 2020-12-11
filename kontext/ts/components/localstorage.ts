import * as pako from "pako";
import {sd} from "../sd/sd";
import {observable, Observable} from "knockout";

declare let localStorage: Storage;

interface IFillOrLoad {
	localStorage: LStorage
	fill: (data: any) => void
	load: () => void
}

export class LStorage {
	isLoaded: Observable<boolean> = observable(false);
	
	constructor (public key: string) {
		this.setKey(key);
	}
	
	setKey (key: string) {
		this.key = "sd_" + key;
	}
	
	addKey (addText: string) {
		this.key += addText;
	}
	
	onLoad (data: any) {
		let ls = localStorage.getItem(this.key);
		if (!ls) {
			this.update(data);
		}
	}
	
	fillOrLoad (fill: (data: any) => void, load: () => void) {
		let ls = localStorage.getItem(this.key);
		if (ls) {
			fill(JSON.parse(pako.inflate(<string> ls, {to: "string"})));
		} else {
			load();
		}
	}
	
	update (data: any) {
		let pakoData = pako.deflate(JSON.stringify(data), {to: "string"});
		try {
			localStorage.setItem(this.key, pakoData);
			this.isLoaded(true);
		} catch (exception) {
			sd.frontendLog("LocalStorage",
					exception.message,
					`необходимо: ${pakoData.length} занято: ${LStorage.occupied()}`);
		}
	}
	
	remove (key?: string) {
		if (!key) {
			key = this.key;
		}
		localStorage.removeItem(key);
	}
	
	static occupied (): number {
		let occupied = 0;
		for (let key of Object.keys(localStorage)) {
			occupied += (<string> localStorage.getItem(key)).length;
		}
		return occupied;
	}
	
	static clear (): void {
		for (let key of Object.keys(localStorage)) {
			if (key.substr(0, 3) == "sd_")
				localStorage.removeItem(key);
		}
	}
}