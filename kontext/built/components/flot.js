define(["require", "exports", "kontext/sd/sd", "knockout", "flotPie"], function (require, exports, sd_1, knockout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FlotPie = void 0;
    var FlotPie = /** @class */ (function () {
        function FlotPie(options, gradeData, gradeRange) {
            this.options = options;
            this.gradeData = gradeData;
            this.gradeRange = gradeRange;
        }
        FlotPie.prototype.getDataValueByRange = function (data, range) {
            if (range in this.gradeRange && (data[this.gradeRange[range]] != undefined)) {
                return data[this.gradeRange[range]].data;
            }
            else {
                return 0;
            }
        };
        FlotPie.prototype.setDataValueByRange = function (data, range, value) {
            if (range in this.gradeRange) {
                var index = this.gradeRange[range];
                if (data[index] == undefined)
                    data[index] = $.extend({}, this.gradeData[index]);
                data[index].data = value;
            }
        };
        FlotPie.prototype.incrementDataValueByRange = function (data, range, value) {
            var oldValue = this.getDataValueByRange(data, range);
            if (sd_1.isEmpty(oldValue)) {
                oldValue = 0;
            }
            this.setDataValueByRange(data, range, oldValue + value);
        };
        return FlotPie;
    }());
    exports.FlotPie = FlotPie;
    knockout_1.bindingHandlers.gradePie = {
        init: function (el) {
            $(el).addClass("flot-chart-pie-content");
        }, update: function (el, valueAccessor) {
            var data = knockout_1.utils.unwrapObservable(valueAccessor());
            $(el).prop("disabled", (data.length == 0));
            if (data.length > 0) {
                var plotData_1 = [];
                data.forEach(function (element) {
                    plotData_1.push(element);
                });
                $.plot(el, plotData_1, app.flotPie.options);
            }
        }
    };
});
