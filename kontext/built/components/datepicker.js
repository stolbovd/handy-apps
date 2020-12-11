define(["require", "exports", "kontext/sd/sd", "knockout", "jquery", "datePicker"], function (require, exports, sd_1, knockout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    knockout_1.bindingHandlers.datePicker = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var $element = $(element);
            $element.addClass("form-control");
            var options = allBindingsAccessor().datePickerOptions || {};
            if (allBindingsAccessor().hasOwnProperty("shortDate") || options["format"] == null) {
                options["format"] = "dd.mm.yyyy";
            }
            options["language"] = "ru";
            $element.datepicker(options);
            $element.on("changeDate clearDate", function (event) {
                var value = valueAccessor();
                if (knockout_1.isObservable(value)) {
                    value((event.date) ? sd_1.sd.date(event.date).toISOString() : null);
                }
                else {
                    sd_1.sd.error("datePicker должен быть Observable");
                }
            });
        },
        update: function (element, valueAccessor) {
            var date = knockout_1.utils.unwrapObservable(valueAccessor());
            $(element).datepicker("update", date ? new Date(date) : null);
        }
    };
});
