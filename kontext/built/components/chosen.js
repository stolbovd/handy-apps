define(["require", "exports", "knockout", "jquery", "chosen"], function (require, exports, knockout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // https://gist.github.com/tomazy/9800573
    knockout_1.bindingHandlers.chosen = {
        init: function (element, valueAccessor, allBindings) {
            element = $(element);
            element.attr("data-placeholder", "...");
            element.addClass("chosen-select");
            var options = knockout_1.unwrap(valueAccessor());
            if (typeof options !== "object")
                options = {};
            if (!options.hasOwnProperty("disable_search_threshold")) {
                options.disable_search_threshold = 9;
            }
            element.chosen(options);
            var binds = allBindings();
            var list = (binds.options) ? binds.options : binds.foreach;
            if (knockout_1.isObservable(list)) {
                list.subscribe(function () { return element.trigger("chosen:updated"); });
            }
        }
    };
});
//NOTE Важен порядок! chosen должен быть последним 1. options или foreach: values,
// 2. selectedOptions: selected 3. chosen
// Пр.krlist select
