import "jquery";
import "datePicker";
import {sd} from "kontext/sd/sd";
import {AllBindings, bindingHandlers, isObservable, utils} from "knockout";

bindingHandlers.datePicker = {
	init: (element: any,
			valueAccessor: () => any,
			allBindingsAccessor: AllBindings) => {
		let $element = $(element);
		$element.addClass("form-control");
		let options = allBindingsAccessor().datePickerOptions || {};
		if (allBindingsAccessor().hasOwnProperty("shortDate") || options["format"] == null) {
			options["format"] = "dd.mm.yyyy";
		}
		options["language"] = "ru";
		$element.datepicker(options);
		$element.on("changeDate clearDate", (event: any) => {
			let value = valueAccessor();
			if (isObservable(value)) {
				value((event.date) ? sd.date(event.date).toISOString() : null);
			}
			else {
				sd.error("datePicker должен быть Observable");
			}
		});
	},
	update: (element: any, valueAccessor: () => any) => {
		let date = utils.unwrapObservable(valueAccessor());
		$(element).datepicker("update", date ? new Date(date) : null);
	}
};
