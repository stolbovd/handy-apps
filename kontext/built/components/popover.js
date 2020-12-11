var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define(["require", "exports", "knockout", "jquery"], function (require, exports, knockout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.popover = exports.PopoverPinned = void 0;
    var PopoverPinned = /** @class */ (function () {
        function PopoverPinned($element, options) {
            this.$element = $element;
            this.isHover = true;
            this.bindHover();
            $element.popover(__assign(__assign({}, options), { trigger: "manual" }))
                .on("click", this.clickToggle.bind(this));
        }
        PopoverPinned.prototype.enterShow = function () {
            if (this.isHover) {
                this.$element.popover("show");
            }
        };
        PopoverPinned.prototype.exitHide = function () {
            if (this.isHover) {
                this.$element.popover("hide");
            }
        };
        PopoverPinned.prototype.clickToggle = function () {
            if (this.isHover) {
                this.isHover = false;
                this.$element.off("mouseenter mouseleave");
            }
            else {
                this.isHover = true;
                this.bindHover();
            }
        };
        PopoverPinned.prototype.bindHover = function () {
            this.$element
                .on("mouseenter", this.enterShow.bind(this))
                .on("mouseleave", this.exitHide.bind(this));
        };
        return PopoverPinned;
    }());
    exports.PopoverPinned = PopoverPinned;
    knockout_1.bindingHandlers.popover = {
        init: function (element, valueAccessor, allBindings) {
            knockout_1.bindingHandlers.value.init(element, valueAccessor, allBindings);
        }, update: function (element, valueAccessor, allBindings) {
            knockout_1.bindingHandlers.value.update(element, valueAccessor, allBindings);
            var value = knockout_1.utils.unwrapObservable(valueAccessor());
            if (value) {
                var data = void 0;
                var options = void 0;
                if ((value.hasOwnProperty("data"))) {
                    data = value.data;
                    options = __assign(__assign({}, data.popover()), value);
                }
                else {
                    data = value;
                    options = data.popover();
                }
                var $element = $(element);
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
    function popover(title, template, placement) {
        return {
            container: "body",
            toggle: "popover",
            trigger: "hover",
            sanitize: false,
            placement: placement == null ? "top" : placement, title: title,
            template: "\n<div class=\"popover\" role=\"tooltip\">\n<div class=\"arrow\"></div>\n<h3 class=\"popover-title\"></h3>\n<div class=\"popover-template-content\">\n" + template + "\n</div>\n</div>"
        };
    }
    exports.popover = popover;
});
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
