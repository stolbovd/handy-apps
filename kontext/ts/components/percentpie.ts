import "jquery";
import "peity";
import {bindingHandlers, utils} from "knockout";

bindingHandlers.percentPie = {
	init: (el: any) => {
		$(el).addClass("pie").css("display", "none");
	}, update: (element: HTMLElement, valueAccessor: () => any) => {
		element.textContent = utils.unwrapObservable(valueAccessor());
		//@ts-ignore
		$(element).peity("pie", {fill: ["#1ab394", "#d7d7d7", "#ffffff"]});
	}
};
