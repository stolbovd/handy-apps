import "jquery";
import "chosen"
import {AllBindings, bindingHandlers, isObservable, Observable, unwrap} from "knockout";
// https://gist.github.com/tomazy/9800573
bindingHandlers.chosen = {
	init: (element: any, valueAccessor: () => any, allBindings: AllBindings): void => {
		element = $(element);
		element.attr("data-placeholder", "...");
		element.addClass("chosen-select");
		let options = unwrap(valueAccessor());
		if (typeof options !== "object") options = {};
		if (!options.hasOwnProperty("disable_search_threshold")) {
			options.disable_search_threshold = 9;
		}
		element.chosen(options);
		let binds: { options?: any[], foreach?: any[] } = allBindings();
		let list = (binds.options) ? binds.options : binds.foreach;
		if (isObservable(list)) {
			(<Observable>list).subscribe(() => element.trigger("chosen:updated"));
		}
	}
};
//NOTE Важен порядок! chosen должен быть последним 1. options или foreach: values,
// 2. selectedOptions: selected 3. chosen
// Пр.krlist select