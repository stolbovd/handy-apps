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
define(["require", "exports", "kontext/components/select", "kontext/sd/sd", "kontext/sd/appmodel", "kontext/sd/entitylists", "kontext/sd/entities", "knockout", "kontext/examples/modules"], function (require, exports, select_1, sd_1, appmodel_1, entitylists_1, entities_1, knockout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Game = /** @class */ (function () {
        function Game(stones, count) {
            this.stones = stones;
            this.count = count;
            this.petya = new Player(this, "Петя");
            this.vasya = new Player(this, "Вася");
            if (stones >= 1 && stones <= 25) {
                this.stones = stones;
            }
            else {
                throw new Error("кол-во камней должно быть от 1 до 25");
            }
            do {
                if (this.petya.go())
                    break;
                if (this.vasya.go())
                    break;
            } while (true);
        }
        Game.prototype.multiply = function () {
            this.stones *= this.count;
        };
        Game.prototype.add = function () {
            this.stones += this.count;
        };
        Game.prototype.checkWin = function () {
            return this.stones >= 26;
        };
        Game.prototype.printWinner = function () {
            //ToDo print Winner
        };
        return Game;
    }());
    var Player = /** @class */ (function () {
        function Player(game, name) {
            this.game = game;
            this.name = name;
            this.game = game;
            this.name = name;
        }
        Player.prototype.go = function () {
            if (Math.random() < 0.5) {
                this.game.add();
            }
            else {
                this.game.multiply();
            }
            return this.game.checkWin();
        };
        return Player;
    }());
    var game = new Game(12, 4);
    game.printWinner();
    var Chosen = /** @class */ (function () {
        function Chosen() {
            this.list = [{
                    id: 0, name: "valuevaluevaluevalue1", type: "type1"
                }, {
                    id: 1, name: "valuevaluevaluevalue2", type: "type2"
                }, {
                    id: 2, name: "valuevaluevaluevalue3", type: "type3"
                }, {
                    id: 3, name: "valuevaluevaluevalue4", type: "type1"
                }, {
                    id: 4, name: "valuevaluevaluevalue5", type: "type2"
                }, {
                    id: 5, name: "valuevaluevaluevalue6", type: "type2"
                }];
            this.selected = knockout_1.observableArray([this.list[2]]);
            this.select = new select_1.SelectEntity({});
            this.select.setList(this.list);
        }
        return Chosen;
    }());
    var OptGroup = /** @class */ (function () {
        function OptGroup() {
            this.list = knockout_1.observableArray([{
                    type: "type1", values: knockout_1.observableArray([{
                            id: 0, name: "valuevaluevaluevalue1"
                        }, {
                            id: 3, name: "valuevaluevaluevalue4"
                        }])
                }, {
                    type: "type2", values: knockout_1.observableArray([{
                            id: 1, name: "valuevaluevaluevalue2"
                        }, {
                            id: 4, name: "valuevaluevaluevalue5"
                        }, {
                            id: 5, name: "valuevaluevaluevalue6"
                        }])
                }, {
                    type: "type3", values: knockout_1.observableArray([{ id: 2, name: "valuevaluevaluevalue3" }])
                }]);
            this.selected = knockout_1.observableArray([this.list()[1].values()[2]]);
        }
        return OptGroup;
    }());
    var Select = /** @class */ (function () {
        function Select() {
            var _this = this;
            this.teacher = knockout_1.observable({ id: 10, person: null });
            this.teacherFamIO = knockout_1.pureComputed(function () {
                return sd_1.getProperty(_this.teacher, "person.famIO", "");
            });
            this.teachers = new select_1.SelectEntity({
                uri: new sd_1.Uri([appmodel_1.REST, "teachers/projections/simple"]),
                optionsText: "person.famIO",
                getList: true,
                value: { owner: this, association: "teacher" },
                filter: function (entity) { return sd_1.getProperty(entity, "person.enabled"); }
            });
        }
        return Select;
    }());
    knockout_1.bindingHandlers.inputInt = {
        init: function (element, valueAccessor, allBindings) {
            knockout_1.bindingHandlers.value.init(element, valueAccessor, allBindings);
            $(element).addClass("input-int form-control").attr({ "type": "number", "min": 0 });
            $(element).on("click", function () { return $(element).trigger("select"); });
        }, update: function (element, valueAccessor, allBindings, viewModel) {
            knockout_1.bindingHandlers.value.update(element, valueAccessor);
            var value = knockout_1.utils.unwrapObservable(valueAccessor());
            knockout_1.applyBindingsToNode(element, { style: { "opacity": value == 0 ? 0.4 : 1 } }, viewModel);
        }
    };
    knockout_1.bindingHandlers.hasSelectedFocus = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            knockout_1.bindingHandlers["hasfocus"].init(element, valueAccessor, allBindingsAccessor);
        }, update: function (element, valueAccessor) {
            knockout_1.bindingHandlers["hasfocus"].update(element, valueAccessor);
            var selected = knockout_1.utils.unwrapObservable(valueAccessor());
            if (selected)
                element.select();
        }
    };
    var Person = /** @class */ (function (_super) {
        __extends(Person, _super);
        function Person() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.fio = knockout_1.pureComputed(function () { return sd_1.famNameSec(_this.entys.family(), _this.entys.name(), _this.entys.secName()); });
            return _this;
        }
        Person.prototype.options = function () {
            return {
                attributes: ["id", "family", "name", "secName", "username", "email", "birthday"],
                name: "учащийся",
                genitive: "учащегося",
                urlEntity: "persons",
                projection: "simple"
            };
        };
        return Person;
    }(entities_1.EntityControlList));
    var FileOpen = /** @class */ (function () {
        function FileOpen() {
            if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
                sd_1.sd.warning("Этот броузер не поддерживает открытие файлов!");
            }
            document.getElementById("files").addEventListener("change", this.handleFileSelect, false);
        }
        FileOpen.prototype.handleFileSelect = function (evt) {
            var file = evt.target.files[0];
            var parser = new DOMParser();
            var reader = new FileReader();
            reader.onload = function (evt) {
                var xmlDoc = parser.parseFromString(evt.target.result, "text/xml");
                document.getElementById("xmlContent").innerHTML
                    = "<p style=\"font-family:monospace\">" + evt.target.result + "</p>";
            };
            reader.readAsText(file);
            document.getElementById("list").innerHTML
                = "<strong>" + file.name + "</strong> (" + (file.type || "n/a") + ") - " + file.size + " \u0431\u0430\u0439\u0442";
        };
        return FileOpen;
    }());
    var Examples = /** @class */ (function (_super) {
        __extends(Examples, _super);
        function Examples() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.chosen = new Chosen();
            _this.optgroup = new OptGroup();
            _this.select = new Select();
            _this.persons = new entitylists_1.ListControlGetPage(Person);
            _this.xmlFiles = new FileOpen();
            _this.isChanged = knockout_1.observable(false);
            return _this;
        }
        Examples.prototype.connect = function () {
            this.persons.listGet.getSize = function () { return 20; };
            this.persons.listGet.restGetList();
            window.onbeforeunload = function () { return app.isChanged() ? "Изменено" : undefined; };
        };
        return Examples;
    }(appmodel_1.AppModel));
    console.log("entityId: " + entityId);
    new Examples();
    knockout_1.tasks.schedule(function () { return console.log("task"); });
    var shedule = function (callback, delay) {
        setTimeout(function () {
            callback();
            shedule(callback, delay);
        }, delay);
    };
    //shedule(() => console.log("shedule task"), 1000);
    setInterval(function () { return console.log("interval"); }, 1000 * 60 * 10);
});
//function loop() {
//	tasks.schedule(loop);
//}
//loop();
