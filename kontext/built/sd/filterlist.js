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
define(["require", "exports", "kontext/sd/appmodel", "kontext/sd/sd", "knockout"], function (require, exports, appmodel_1, sd_1, knockout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FilterList = exports.FilterEntitySelect = exports.FilterEntityRussianString = exports.FilterBoolean = exports.FilterAttribute = exports.FilterEntity = void 0;
    var FilterEntity = /** @class */ (function () {
        function FilterEntity() {
        }
        FilterEntity.prototype.subscribe = function (onFilter) {
            if (this.subscription) {
                this.subscription.dispose();
            }
            if (onFilter) {
                this.subscription = this.selected.subscribe(onFilter);
                this.selected.extend({ rateLimit: 50 });
            }
        };
        FilterEntity.prototype.setSelected = function (selectred) {
            this.selected(selectred);
        };
        FilterEntity.prototype.onSelect = function (newValue) {
            this.filterList.fill();
        };
        return FilterEntity;
    }());
    exports.FilterEntity = FilterEntity;
    var FilterAttribute = /** @class */ (function (_super) {
        __extends(FilterAttribute, _super);
        function FilterAttribute(attribute) {
            var _this = _super.call(this) || this;
            _this.attribute = attribute;
            return _this;
        }
        return FilterAttribute;
    }(FilterEntity));
    exports.FilterAttribute = FilterAttribute;
    var FilterBoolean = /** @class */ (function (_super) {
        __extends(FilterBoolean, _super);
        function FilterBoolean(selected) {
            var _this = _super.call(this) || this;
            _this.selected = knockout_1.observable(selected == null ? false : selected);
            _this.attribute = _this.constructor.name;
            return _this;
        }
        FilterBoolean.prototype.match = function (entity) {
            return this.selected() ? this.predicate(entity) : true;
        };
        return FilterBoolean;
    }(FilterEntity));
    exports.FilterBoolean = FilterBoolean;
    var FilterEntityRussianString = /** @class */ (function (_super) {
        __extends(FilterEntityRussianString, _super);
        function FilterEntityRussianString() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.selected = knockout_1.observable("");
            return _this;
        }
        FilterEntityRussianString.prototype.match = function (entity) {
            var value = sd_1.simplifyStringRussian(this.selected());
            if (sd_1.isEmpty(value))
                return true;
            return sd_1.simplifyStringRussian(sd_1.getProperty(entity, this.attribute, ""))
                .indexOf(value) != -1;
        };
        return FilterEntityRussianString;
    }(FilterAttribute));
    exports.FilterEntityRussianString = FilterEntityRussianString;
    var FilterEntitySelect = /** @class */ (function (_super) {
        __extends(FilterEntitySelect, _super);
        function FilterEntitySelect(attribute, notValue) {
            var _this = _super.call(this, attribute) || this;
            _this.selected = knockout_1.observableArray([]);
            _this.values = knockout_1.observableArray([]);
            _this.isFillLock = false;
            _this.notValue = (notValue == undefined ? "нет" : notValue);
            return _this;
        }
        FilterEntitySelect.prototype.onSelect = function (newValue) {
            if (newValue.length > 0) {
                this.isFillLock = true;
            }
            _super.prototype.onSelect.call(this, newValue);
        };
        FilterEntitySelect.prototype.match = function (entity) {
            if (this.selected().length == 0)
                return true;
            return this.selected.indexOf(sd_1.getProperty(entity, this.attribute, this.notValue)) > -1;
        };
        FilterEntitySelect.prototype.fill = function (entities) {
            var _this = this;
            var values = [];
            for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
                var entity = entities_1[_i];
                var value = sd_1.getProperty(entity, this.attribute, this.notValue);
                if (values.indexOf(value) == -1) {
                    values.push(value);
                }
            }
            values.sort(function (left, right) { return left == _this.notValue ?
                -1 :
                right == _this.notValue ? 1 : left == right ? 0 : (left < right ? -1 : 1); });
            this.values(values);
        };
        return FilterEntitySelect;
    }(FilterAttribute));
    exports.FilterEntitySelect = FilterEntitySelect;
    var FilterList = /** @class */ (function () {
        function FilterList(listContainer, // Control в котором содержится фильтруемый observableArray
        listAttribute, // атрибут с фильтруемым списком в list
        entityAttribute, // атрибут сущности в фильтруемом списке
        attributes) {
            this.listContainer = listContainer;
            this.listAttribute = listAttribute;
            this.entityAttribute = entityAttribute;
            this.attributes = attributes;
            this.select = [];
            this.russianString = [];
            this.other = [];
            this.listContainer = listContainer;
            this.listAttribute = listAttribute;
            var i = 0;
            if (attributes.select) {
                for (var _i = 0, _a = attributes.select; _i < _a.length; _i++) {
                    var select = _a[_i];
                    this.select[i++] = new FilterEntitySelect(select);
                }
            }
            i = 0;
            if (attributes.russianString) {
                for (var _b = 0, _c = attributes.russianString; _b < _c.length; _b++) {
                    var russianString = _c[_b];
                    this.russianString[i++] = new FilterEntityRussianString(russianString);
                }
            }
            if (attributes.other) {
                this.other = attributes.other;
            }
            var _loop_1 = function (filter) {
                filter.filterList = this_1;
                filter.selected.subscribe(function (newValue) {
                    filter.onSelect.bind(filter);
                    app.logClikEvents.push("filter:" + filter.attribute, newValue);
                });
            };
            var this_1 = this;
            for (var _d = 0, _e = this.filters(); _d < _e.length; _d++) {
                var filter = _e[_d];
                _loop_1(filter);
            }
        }
        FilterList.prototype.filters = function () {
            return this.select.concat(this.russianString).concat(this.other);
        };
        //Сущность проверяется на соответствие фильтру
        FilterList.prototype.match = function (entity) {
            for (var _i = 0, _a = this.filters(); _i < _a.length; _i++) {
                var select = _a[_i];
                if (!select.match(entity)) {
                    return false;
                }
            }
            return true;
        };
        FilterList.prototype.fill = function (entities) {
            var _this = this;
            var list;
            if (entities != undefined) {
                list = entities;
            }
            else if (this.entityAttribute) {
                list = this.list()().map(function (element) { return element[_this.entityAttribute]; });
            }
            else {
                list = this.list()();
            }
            list = list.filter(function (entity) { return _this.match(entity); });
            var selects = this.select.concat(this.other
                .filter(function (filter) { return filter instanceof FilterEntitySelect; }));
            for (var _i = 0, selects_1 = selects; _i < selects_1.length; _i++) {
                var select = selects_1[_i];
                if (select.isFillLock) {
                    select.isFillLock = false;
                }
                else {
                    select.fill(list);
                }
            }
        };
        //Обновление фильтруемого списка
        FilterList.prototype.find = function () {
            appmodel_1.hasChanged(this.list());
        };
        FilterList.prototype.list = function () {
            return this.listContainer[this.listAttribute];
        };
        FilterList.prototype.subscribe = function (onFilter) {
            for (var _i = 0, _a = this.filters(); _i < _a.length; _i++) {
                var select = _a[_i];
                select.subscribe(onFilter);
            }
        };
        return FilterList;
    }());
    exports.FilterList = FilterList;
});
