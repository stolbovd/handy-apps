import "flotPie"
import {Map, MapNumKey} from "kontext/sd/types";
import {AppModel} from "kontext/sd/appmodel";
import {isEmpty} from "kontext/sd/sd";
import {bindingHandlers, utils} from "knockout";
import plotOptions = jquery.flot.plotOptions;

interface AppWithFlotPie extends AppModel {
	flotPie: FlotPie
}

export interface IGradeData {
	label: string
	data: number
	color: string
}

declare let app: AppWithFlotPie;

export class FlotPie {
	options: plotOptions;
	gradeData: IGradeData[];
	gradeRange: MapNumKey<number>
	
	constructor (options: Map<any>, gradeData: IGradeData[], gradeRange: MapNumKey<number>) {
		this.options = options;
		this.gradeData = gradeData;
		this.gradeRange = gradeRange;
	}
	
	getDataValueByRange (data: IGradeData[], range: number): number {
		if (range in this.gradeRange && (data[this.gradeRange[range]] != undefined)) {
			return data[this.gradeRange[range]].data;
		}
		else {
			return 0;
		}
	}
	
	setDataValueByRange (data: IGradeData[], range: number, value: number): void {
		if (range in this.gradeRange) {
			let index = this.gradeRange[range];
			if (data[index] == undefined) data[index] = $.extend({}, this.gradeData[index]);
			data[index].data = value;
		}
	}
	
	incrementDataValueByRange (data: IGradeData[], range: number, value: number): void {
		let oldValue = this.getDataValueByRange(data, range);
		if (isEmpty(oldValue)) {
			oldValue = 0;
		}
		this.setDataValueByRange(data, range, oldValue + value)
	}
}

bindingHandlers.gradePie = {
	init: (el: any) => {
		$(el).addClass("flot-chart-pie-content");
	}, update: (el: any, valueAccessor: () => any) => {
		let data = utils.unwrapObservable(valueAccessor());
		$(el).prop("disabled", (data.length == 0));
		if (data.length > 0) {
			let plotData: IGradeData[] = [];
			data.forEach((element: IGradeData) => {
				plotData.push(element);
			});
			$.plot(el, plotData, app.flotPie.options);
		}
	}
};
