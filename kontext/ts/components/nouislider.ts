import * as noUiSlider from "nouislider";
import {bindingHandlers} from "knockout";
//ToDo деделать
// Пример отсюда https://stackoverflow.com/questions/38523943/knockout-nouislider-custom-binding-fluency
bindingHandlers.noUiSlider = {
	init: function (element: any, valueAccessor: () => any) {
		let params = valueAccessor();
		let rangeMin = (params.hasOwnProperty("rangeMin")) ? params.rangeMin : 0;
		let rangeMax = (params.hasOwnProperty("rangeMax")) ? params.rangeMax : 0;
		noUiSlider.create(element, {
			start: [1, 10000000], range: {
				"min": rangeMin, "max": rangeMax
			}, connect: true, step: 1,
		});
		element.noUiSlider.on("slide", (values: any, handle: number) => {
			let value = values[handle];
			if (handle) {
				params.maxValue(value);
			} else {
				params.minValue(value);
			}
		});
	}, update: function (element: any, valueAccessor: () => any) {
		let params = valueAccessor();
		let range = [params.minValue(), params.maxValue()];
		element.noUiSlider.set(range);
	}
};
