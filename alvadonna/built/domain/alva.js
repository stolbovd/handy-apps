var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "kontext/sd/appmodel", "knockout", "kontext/sd/sd"], function (require, exports, appmodel_1, knockout_1, sd_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var emptyPoint = {
        "id": "", "task": "", "code": "", "linkUrl": "", "linkName": "", "images": [], "html": ""
    };
    var Point = /** @class */ (function () {
        function Point(point) {
            var _this = this;
            this.code = knockout_1.observable("");
            this.id = knockout_1.observable("");
            this.images = [];
            this.isCode = knockout_1.observable(true);
            this.isExpanded = knockout_1.observable(false);
            this.isReady = knockout_1.computed(function () { return app.pointIds[_this.id()] <
                app.pointIds[app.lastPointId()] &&
                !_this.isExpanded(); });
            this.point = point;
            this.id(point.id);
            this.isCode(!sd_1.isEmpty(point.code));
            point.images.forEach(function (image) { return _this.images.push("img/" + image); });
        }
        Point.prototype.check = function () {
            if (this.codeSubstr(this.code()) == this.codeSubstr(this.point.code)) {
                sd_1.sd.success("\u0417\u0430\u0434\u0430\u043D\u0438\u0435: " + this.point.task, "\u0423\u0440\u0430! \"" + this.code() + "\" \u044D\u0442\u043E \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u044B\u0439 \u043A\u043E\u0434");
                app.nextPoint(this);
            }
            else {
                sd_1.sd.warning("попробуйте снова", "неправильно");
            }
        };
        Point.prototype.codeSubstr = function (code) {
            return code.trim().substr(0, 5).toLowerCase();
        };
        Point.prototype.active = function () {
            this.isExpanded(true);
            app.current(this);
            app.setLastPoint(this.id());
        };
        Point.prototype.expand = function () {
            this.isExpanded(true);
        };
        Point.prototype.onKeyUp = function (self, event) {
            if (event.code == "Enter")
                self.check();
        };
        return Point;
    }());
    var AlvaApp = /** @class */ (function (_super) {
        __extends(AlvaApp, _super);
        function AlvaApp() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.points = knockout_1.observableArray([]);
            _this.pointIds = {};
            _this.lastPointId = knockout_1.observable(sd_1.nvl(localStorage.getItem("alva-last-point-id"), ""));
            _this.current = knockout_1.observable(new Point(emptyPoint));
            _this.isReady = knockout_1.observable(false);
            _this.readyHtml = "<h1>Поздравлем!!!</h1> <h2>Вы завершили квест</h2> <div class=\"row\">	<img src=\"img/congratulation.jpg\"></div>";
            return _this;
        }
        AlvaApp.prototype.connect = function () {
            var _this = this;
            //		localStorage.setItem("alva-last-point-id", "start");
            var point;
            sd_1.sd.get("points.json", function (data) {
                var points = [];
                for (var index in data) {
                    var pointData = data[index];
                    point = new Point(pointData);
                    _this.pointIds[pointData.id] = parseInt(index);
                    if (sd_1.isEmpty(_this.lastPointId())) {
                        _this.lastPointId(pointData.id);
                        localStorage.setItem("alva-last-point-id", pointData.id);
                    }
                    if (pointData.id == _this.lastPointId()) {
                        point.active();
                    }
                    points.push(point);
                }
                _this.points(points);
            });
        };
        AlvaApp.prototype.nextPoint = function (point) {
            point.isExpanded(false);
            var pointIndex = this.pointIds[point.id()];
            if (pointIndex >= this.points().length - 1) {
                this.lastPointId("");
                this.isReady(true);
            }
            else if (pointIndex >= this.pointIds[this.lastPointId()]) {
                this.points()[pointIndex + 1].active();
            }
        };
        AlvaApp.prototype.setLastPoint = function (pointId) {
            if (sd_1.isEmpty(this.lastPointId()) || this.pointIds[pointId] >= this.pointIds[this.lastPointId()]) {
                localStorage.setItem("alva-last-point-id", pointId);
                this.lastPointId(pointId);
            }
        };
        AlvaApp.prototype.start = function () {
            this.points()[0].active();
            this.isReady(false);
        };
        return AlvaApp;
    }(appmodel_1.AppModel));
    new AlvaApp();
});
