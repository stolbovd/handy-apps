define(["require", "exports", "nouislider", "knockout"], function (require, exports, noUiSlider, knockout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //ToDo деделать
    // Пример отсюда https://stackoverflow.com/questions/38523943/knockout-nouislider-custom-binding-fluency
    knockout_1.bindingHandlers.noUiSlider = {
        init: function (element, valueAccessor) {
            var params = valueAccessor();
            var rangeMin = (params.hasOwnProperty("rangeMin")) ? params.rangeMin : 0;
            var rangeMax = (params.hasOwnProperty("rangeMax")) ? params.rangeMax : 0;
            noUiSlider.create(element, {
                start: [1, 10000000], range: {
                    "min": rangeMin, "max": rangeMax
                }, connect: true, step: 1,
            });
            element.noUiSlider.on("slide", function (values, handle) {
                var value = values[handle];
                if (handle) {
                    params.maxValue(value);
                }
                else {
                    params.minValue(value);
                }
            });
        }, update: function (element, valueAccessor) {
            var params = valueAccessor();
            var range = [params.minValue(), params.maxValue()];
            element.noUiSlider.set(range);
        }
    };
});
