define(["require", "exports", "knockout", "jquery", "icheck"], function (require, exports, knockout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    knockout_1.bindingHandlers.iCheck = {
        init: function (el, valueAccessor) {
            // el.type = "checkbox";
            el.classList.add("i-checks");
            var elQ = $(el);
            elQ.iCheck({
                checkboxClass: "icheckbox_square-blue", radioClass: "iradio_square-blue"
            });
            elQ.parent().css("margin-top", "1px");
            el.style.opacity = null;
            var observable = valueAccessor();
            el.checked = observable();
            elQ.on("ifChanged", function () {
                observable(el.checked);
            });
        }, update: function (el, valueAccessor) {
            el.value = knockout_1.utils.unwrapObservable(valueAccessor());
            el.checked = (el.value === "true");
            $(el.parentElement).toggleClass("checked", el.checked);
        }
    };
    knockout_1.bindingHandlers.iCheckEnable = {
        update: function (el, valueAccessor) {
            $(el).iCheck(knockout_1.utils.unwrapObservable(valueAccessor()) ? "enable" : "disable");
        }
    };
});
