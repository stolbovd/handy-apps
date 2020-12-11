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
define(["require", "exports", "kontext/sd/sd", "knockout", "jquery", "sweetalert"], function (require, exports, sd_1, knockout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.restoreObject = exports.fillApp = exports.sdSwal = exports.hasChanged = exports.ShowAppMode = exports.AppModel = exports.DefferedsLadda = exports.AppDecorator = exports.LOG = exports.REST = exports.RESTData = void 0;
    exports.RESTData = "rest/data";
    exports.REST = "rest";
    exports.LOG = "log";
    var AppDecorator = /** @class */ (function () {
        function AppDecorator(app) {
            this.app = app;
        }
        return AppDecorator;
    }());
    exports.AppDecorator = AppDecorator;
    var LogClickEvent = /** @class */ (function () {
        function LogClickEvent(method, elementText) {
            this.method = method;
            this.elementText = elementText;
            this.method = method;
            this.elementText = elementText;
            this.date = (new Date()).toTimeString().substr(0, 5);
        }
        LogClickEvent.prototype.toString = function () {
            return this.date + ":" + this.method + ":" + this.elementText + " ";
        };
        return LogClickEvent;
    }());
    var LogEvents = /** @class */ (function () {
        function LogEvents(delay, run) {
            this.delay = delay;
            this.eventsLog = [];
            window.addEventListener("beforeunload", function () { return app.logClikEvents.send(true); });
            if (run) {
                this.run();
            }
        }
        LogEvents.prototype.push = function (method, elementText) {
            this.eventsLog.push(new LogClickEvent(method, elementText));
        };
        LogEvents.prototype.send = function (isUnload) {
            var eventsLog = app.logClikEvents.eventsLog;
            if (eventsLog.length > 0) {
                var message = "";
                if (isUnload) {
                    for (var _i = 0, eventsLog_1 = eventsLog; _i < eventsLog_1.length; _i++) {
                        var event_1 = eventsLog_1[_i];
                        message += event_1.toString();
                    }
                }
                else {
                    while (eventsLog.length > 0) {
                        message += eventsLog.shift().toString();
                    }
                }
                sd_1.sd.request("POST", "/log/clicks", { data: message });
            }
        };
        LogEvents.prototype.run = function () {
            setInterval(this.send.bind(this), this.delay);
        };
        return LogEvents;
    }());
    var DefferedsLadda = /** @class */ (function (_super) {
        __extends(DefferedsLadda, _super);
        function DefferedsLadda() {
            return _super.call(this, "ladda") || this;
        }
        DefferedsLadda.prototype.onAdd = function () {
            app.ladda(true);
        };
        DefferedsLadda.prototype.functionDone = function () {
            app.ladda(false);
        };
        return DefferedsLadda;
    }(sd_1.Deferreds));
    exports.DefferedsLadda = DefferedsLadda;
    var AppModel = /** @class */ (function () {
        function AppModel() {
            this.ladda = knockout_1.observable(false);
            this.deferreds = new sd_1.Deferreds("app");
            //	header: string | undefined = $("meta[name='_csrf_header']").attr("content");
            //	token: string | undefined = $("meta[name='_csrf']").attr("content");
            this.logClikEvents = new LogEvents(1000 * 20, true);
            //		$(document).ajaxSend((e: JQuery.TriggeredEvent, xhr: JQuery.jqXHR) => {
            //			xhr.setRequestHeader("Content-type", "application/json");
            //			if (this.header && this.token) xhr.setRequestHeader(this.header, this.token);
            //		});
            this.init();
        }
        AppModel.prototype.onbeforeunload = function (isConfirm) {
            window.onbeforeunload = (isConfirm ? function () { return "Данные не сохранены"; } : null);
        };
        AppModel.prototype.connect = function () {
            this.postConnect();
        };
        AppModel.prototype.postConnect = function (deferreds) {
        };
        AppModel.prototype.init = function () {
            window.app = this;
            this.deferreds.done(function () {
                knockout_1.applyBindings(app);
                app.connect();
            });
        };
        return AppModel;
    }());
    exports.AppModel = AppModel;
    var ShowAppMode = /** @class */ (function () {
        function ShowAppMode(modes) {
            var _this = this;
            this.mode = knockout_1.observable("");
            var _loop_1 = function (mode) {
                this_1["is" + mode] = knockout_1.pureComputed(function () { return _this.mode() === mode; });
                this_1["show" + mode] = function () {
                    _this.last = _this.mode();
                    _this.mode(mode);
                };
            };
            var this_1 = this;
            for (var _i = 0, modes_1 = modes; _i < modes_1.length; _i++) {
                var mode = modes_1[_i];
                _loop_1(mode);
            }
            this.mode(modes[0]);
        }
        ShowAppMode.prototype.switch = function (mode) {
            if (this["is" + mode]())
                this["show" + this.last]();
            else
                this["show" + mode]();
        };
        return ShowAppMode;
    }());
    exports.ShowAppMode = ShowAppMode;
    function hasChanged(observable) {
        if (knockout_1.isObservable(observable)) {
            if (knockout_1.isObservableArray(observable)) {
                var data = observable();
                observable([]);
                observable(data);
            }
            else {
                observable.valueHasMutated();
            }
        }
    }
    exports.hasChanged = hasChanged;
    function sdSwal(action, entity, callback) {
        sweetAlert({
            title: "Подтвердите",
            text: "Вы действительно желаете " + action + " " + entity + "?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Да, " + action + "!",
            cancelButtonText: "Отмена",
            animation: false
        }, callback);
    }
    exports.sdSwal = sdSwal;
    // ToDo реализовать заполнение атрибутов в формате "person.name"
    // ToDo и автоматическое создание функций observable() или observableArray() в зависимости от типа атрибута
    function fillApp(attributes, objFrom, objTo) {
        if (objTo === undefined)
            objTo = window.app;
        if (objFrom === undefined)
            objFrom = {};
        for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
            var attribute = attributes_1[_i];
            if (objFrom[attribute] === undefined)
                objFrom[attribute] = null;
            var from = objFrom[attribute];
            if (Array.isArray(from))
                from = from.slice();
            if (objTo[attribute] === undefined) {
                objTo[attribute] = (Array.isArray(from)) ? knockout_1.observableArray(from) : knockout_1.observable(from);
                objTo[attribute].attributeName = attribute;
            }
            else if (typeof objTo[attribute] === "function") {
                objTo[attribute](from);
            }
            else {
                objTo[attribute] = from;
            }
        }
    }
    exports.fillApp = fillApp;
    function restoreObject(attributes, objFrom) {
        if (objFrom === undefined)
            objFrom = window.app;
        var objTo = {};
        for (var _i = 0, attributes_2 = attributes; _i < attributes_2.length; _i++) {
            var attribute = attributes_2[_i];
            if (objFrom[attribute] === undefined) {
                sd_1.sd.error("В копируемом объекте не найден атрибут " + attribute);
            }
            else {
                objTo[attribute] = (typeof objFrom[attribute] === "function") ?
                    objFrom[attribute]() :
                    objFrom[attribute];
            }
        }
        return objTo;
    }
    exports.restoreObject = restoreObject;
    function makeTemplateValueAccessor(valueAccessor) {
        return function () {
            var values = knockout_1.utils.unwrapObservable(valueAccessor());
            if (values == null) {
                return;
            }
            var array = [];
            var keys = Object.keys(values);
            keys.sort();
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                array.push({ key: key, value: values[key] });
            }
            return array;
        };
    }
    knockout_1.bindingHandlers.keyvalue = {
        init: function (element, valueAccessor) {
            return knockout_1.bindingHandlers["foreach"]["init"](element, makeTemplateValueAccessor(valueAccessor));
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            return knockout_1.bindingHandlers["foreach"]["update"](element, makeTemplateValueAccessor(valueAccessor), allBindings, viewModel, bindingContext);
        }
    };
    knockout_1.virtualElements.allowedBindings.keyvalue = true; //Чтобы работал support virtual elements <!-- ko keyvalue: ...
    knockout_1.bindingHandlers.fileUri = {
        init: function (element) {
            $(element).attr("target", "_blank");
        }, update: function (element, valueAccessor) {
            knockout_1.bindingHandlers["attr"]["update"](element, function () {
                return { href: "/files/" + valueAccessor() };
            });
            knockout_1.bindingHandlers["text"]["update"](element, function () {
                var path = valueAccessor();
                if (typeof path !== "string") {
                    return "";
                }
                var slashPosition = path.lastIndexOf("/");
                return path.substr(slashPosition + 1, path.length - slashPosition);
            });
        }
    };
    //<input type="checkbox" data-bind="iCheck: isIn"/>
    knockout_1.bindingHandlers.ladda = {
        init: function (element, valueAccessor, allBindings, viewModel) {
            if (element.tagName == "SPAN") {
                element.classList.add("spinner-border");
                element.parentElement.classList.add("spinner-ladda");
            }
            else {
                $(element).prepend("<span class=\"spinner-border\"></span> ");
                element.classList.add("spinner-ladda");
            }
            knockout_1.applyBindingsToNode(element, { visible: valueAccessor() }, viewModel);
        }
    };
    // для изменяемого содержания вместо tooltip: {.., title: forecastGradeTooltip}
    // делаем attr: {'data-original-title': forecastGradeTooltip}
    knockout_1.bindingHandlers.tooltip = {
        init: function (element, valueAccessor) {
            var value = __assign({ placement: "left", container: "body" }, valueAccessor());
            var jQElement = $(element);
            for (var attribute in value) {
                if (value.hasOwnProperty(attribute)) {
                    jQElement.attr("data-" + attribute, value[attribute]);
                }
                else {
                    jQElement.attr("data-placement", value);
                }
                jQElement.attr("disabled");
            }
            //@ts-ignore
            jQElement.tooltip();
            //NOTE если tooltip остается после уничтожения element в результате visible: true у
            //  родительских нод, повесить событие на ноду, уничтожающую .tooltip как в примере:
            //  codificator.ts RequirementEdit.constructor
            //	this.isEdit.subscribe((isEdit: boolean) => {
            //		if (!isEdit) $(".tooltip").remove()
            //	});
        }
    };
    /* Toggle visible elements inside <tr>
     <tr data-bind="tdToggle:">
     <td class="td-toggle">
     inside toggled tags
     OR
     <td>
     <tag class="tag-toggle">
     OR
     <td data-bind="tdToggle:>
     <tag class="tag-toggle">
     */
    knockout_1.bindingHandlers.tdToggle = {
        init: function (element) {
            var jqElement = $(element);
            var labelToggle = function () {
                $(".td-toggle", jqElement).children().toggle();
                $(".tag-toggle", jqElement).toggle();
            };
            $(".td-toggle", jqElement).children().hide();
            $(".tag-toggle", jqElement).hide();
            jqElement.on("mouseover", labelToggle);
            jqElement.on("mouseout", labelToggle);
        }
    };
    knockout_1.bindingHandlers.textDate = {
        update: function (el, valueAccessor) {
            el.textContent = sd_1.sd.date(knockout_1.utils.unwrapObservable(valueAccessor())).toLocaleDateString();
        }
    };
    // data-bind="debug: $data"
    knockout_1.bindingHandlers.debug = {
        init: function (element, valueAccessor) {
            console.log("debug.init");
            console.log(knockout_1.unwrap(valueAccessor()));
        }, update: function (element, valueAccessor) {
            console.log("debug.update");
            console.log(knockout_1.unwrap(valueAccessor()));
        }
    };
    knockout_1.bindingHandlers.valueUpdated = {
        preprocess: function (value, name, addBindingCallback) {
            addBindingCallback("value", value);
            addBindingCallback("valueUpdate", "'afterkeydown'");
            return value;
        }
    };
    knockout_1.bindingHandlers.clickl = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var originalFunction = valueAccessor();
            knockout_1.applyBindingsToNode(element, {
                click: function () {
                    var methodName = originalFunction.toString().match("(.*)return (.*) }");
                    app.logClikEvents.push(methodName ? methodName[2] + ":" : "", element.innerText);
                    originalFunction.call(viewModel, bindingContext.$data, element);
                }
            }, viewModel);
        }
    };
});
