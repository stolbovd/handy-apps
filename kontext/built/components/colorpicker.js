define(["require", "exports", "kontext/sd/sd", "knockout", "colorPicker"], function (require, exports, sd_1, knockout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    knockout_1.bindingHandlers.colorPicker = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            // initialize datepicker with some optional options
            element.classList.add("form-control");
            var parentNode = $(element.parentNode);
            parentNode.addClass("colorpicker-component");
            var options = allBindingsAccessor().colorPickerOptions || {};
            $(element.parentNode).colorpicker(options);
            element.value = knockout_1.utils.unwrapObservable(valueAccessor());
            //@ts-ignore
            knockout_1.utils.registerEventHandler($(element.parentNode).colorpicker(), "changeColor", function (event) {
                var value = valueAccessor();
                if (knockout_1.isObservable(value)) {
                    value((event.color) ? event.color.toHex() : null);
                }
                else {
                    sd_1.sd.error("colorPicker должен быть Observable");
                }
            });
        }, update: function (element, valueAccessor) {
            return $(element.parentNode).colorpicker("setValue", knockout_1.utils.unwrapObservable(valueAccessor()));
        }
    };
});
