import "colorPicker";
import {sd} from "kontext/sd/sd";
import {AllBindings, bindingHandlers, isObservable, utils} from "knockout";

bindingHandlers.colorPicker = {
	init: (element: any,
			valueAccessor: () => any,
			allBindingsAccessor: AllBindings) => {
		// initialize datepicker with some optional options
		element.classList.add("form-control");
		let parentNode = $(element.parentNode);
		parentNode.addClass("colorpicker-component");
		let options = allBindingsAccessor().colorPickerOptions || {};
		$(element.parentNode).colorpicker(options);
		element.value = utils.unwrapObservable(valueAccessor());
		//@ts-ignore
		utils.registerEventHandler($(element.parentNode).colorpicker(),
				"changeColor", (event: any) => {
			let value = valueAccessor();
			if (isObservable(value)) {
				value((event.color) ? event.color.toHex() : null);
			} else {
				sd.error("colorPicker должен быть Observable");
			}
		});
	}, update: (element: any, valueAccessor: () => any) =>
		$(element.parentNode).colorpicker("setValue",  utils.unwrapObservable(valueAccessor()))
};
