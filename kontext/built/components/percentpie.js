define(["require", "exports", "knockout", "jquery", "peity"], function (require, exports, knockout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    knockout_1.bindingHandlers.percentPie = {
        init: function (el) {
            $(el).addClass("pie").css("display", "none");
        }, update: function (element, valueAccessor) {
            element.textContent = knockout_1.utils.unwrapObservable(valueAccessor());
            //@ts-ignore
            $(element).peity("pie", { fill: ["#1ab394", "#d7d7d7", "#ffffff"] });
        }
    };
});
