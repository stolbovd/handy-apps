import "jquery";
import {Map} from "kontext/sd/types";
import {AllBindings, bindingHandlers, utils} from "knockout";
//Popover, который отображается при наведении мышкой и остается по клику,
//необходимо в data-bind="popover: $data, pinOnClick: null"
export interface IPopoverPinned {
	popoverPinned: PopoverPinned
	
	popover (): any
}

export class PopoverPinned {
	isHover = true;
	
	enterShow () {
		if (this.isHover) {
			this.$element.popover("show");
		}
	}
	
	exitHide () {
		if (this.isHover) {
			this.$element.popover("hide");
		}
	}
	
	clickToggle () {
		if (this.isHover) {
			this.isHover = false;
			this.$element.off("mouseenter mouseleave");
		}
		else {
			this.isHover = true;
			this.bindHover();
		}
	}
	
	bindHover () {
		this.$element
				.on("mouseenter", this.enterShow.bind(this))
				.on("mouseleave", this.exitHide.bind(this));
	}
	
	constructor (public $element: JQuery, options: Map<any>) {
		this.bindHover();
		$element.popover({...options, ...{trigger: "manual"}})
				.on("click", this.clickToggle.bind(this));
	}
}

bindingHandlers.popover = {
	init: (element: any, valueAccessor: () => any, allBindings: AllBindings) => {
		bindingHandlers.value.init(element, valueAccessor, allBindings);
	}, update: (element: any, valueAccessor: () => any, allBindings: AllBindings) => {
		bindingHandlers.value.update(element, valueAccessor, allBindings);
		let value = utils.unwrapObservable(valueAccessor());
		if (value) {
			let data: IPopoverPinned;
			let options: Map<any>;
			if ((value.hasOwnProperty("data"))) {
				data = value.data;
				options = {...data.popover(), ...value};
			}
			else {
				data = value;
				options = data.popover();
			}
			let $element = $(element);
			if (options.hasOwnProperty("pinOnClick")) {
				data.popoverPinned = new PopoverPinned($element, options);
			}
			else {
				$element.popover(options);
//						.on("mouseenter", $element.popover("show"))
//						.on("mouseleave", $element.popover("hide"));
//				$element.popover("hide");
			}
		}
	}
};

export function popover (title: string, template: string, placement?: string): any {
	return {
		container: "body",
		toggle: "popover",
		trigger: "hover", //для отладки содержания manual
		sanitize: false,
		placement: placement == null ? "top" : placement, title: title, template: `
<div class="popover" role="tooltip">
<div class="arrow"></div>
<h3 class="popover-title"></h3>
<div class="popover-template-content">
${template}
</div>
</div>`
	}
}

/* Пример: krdetail.ts Task
popover () {
	let task: KrTaskProjection = this.task();
	let htmlReqs = "";
	let reqType = "";
	let requirement;
	if (isProperty(task, "requirements")) {
		for (let i in task.requirements) {
			requirement = task.requirements[i];
			if (reqType != requirement.type) {
				htmlReqs += `<h6>${reqTypes[requirement.type]}</h6>`;
				reqType = requirement.type;
			}
			htmlReqs += `<h5 class="font-normal">${app.htmlReq(requirement)}</h5>`;
		}
	}
	return popover(task.sname, `
<div class="text-success popover-task">${task.name}</div>
<div class="text-info">max, балл: <b>${task.weight}</b></div>
${htmlReqs}`)
}
*/