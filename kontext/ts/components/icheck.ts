import "jquery";
import "icheck";
import {bindingHandlers, utils} from "knockout";
bindingHandlers.iCheck = {
	init: (el: any, valueAccessor: () => any) => {
		// el.type = "checkbox";
		el.classList.add("i-checks");
		let elQ = $(el);
		elQ.iCheck({
			checkboxClass: "icheckbox_square-blue", radioClass: "iradio_square-blue"
		});
		elQ.parent().css("margin-top", "1px");
		el.style.opacity = null;
		let observable = valueAccessor();
		el.checked = observable();
		elQ.on("ifChanged", () => {
			observable(el.checked);
		});
	}, update: (el: any, valueAccessor: () => any) => {
		el.value = utils.unwrapObservable(valueAccessor());
		el.checked = (el.value === "true");
		$(el.parentElement).toggleClass("checked", el.checked);
	}
};
bindingHandlers.iCheckEnable = {
	update: (el: any, valueAccessor: () => any) => {
		$(el).iCheck(utils.unwrapObservable(valueAccessor()) ? "enable" : "disable");
	}
};
