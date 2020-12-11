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
    exports.ListControlGetEdit = exports.ListControlEdit = exports.ListControlGetScroll = exports.ListControlGetPage = exports.ListControlGet = exports.ListEntityGetScroll = exports.ListEntityGetPage = exports.ListEntityEdit = exports.ListEntityGet = exports.ListEntityControl = void 0;
    //Part ListEntityControl
    var ListEntityControl = /** @class */ (function () {
        function ListEntityControl(entityControl) {
            var _this = this;
            this.entities = knockout_1.observableArray([]);
            this.isEmpty = knockout_1.pureComputed(function () { return sd_1.isArrayEmpty(_this.entities()); });
            this.entityControl = entityControl;
        }
        ListEntityControl.prototype.createControl = function (entity) {
            var entityControl = new this.entityControl(entity);
            entityControl.controlList.list = this;
            return entityControl;
        };
        ListEntityControl.prototype.print = function () {
            console.log(this.constructor);
            for (var _i = 0, _a = this.entities(); _i < _a.length; _i++) {
                var control = _a[_i];
                console.log(control.toString());
            }
        };
        ListEntityControl.prototype.getOption = function (name, ifNull) {
            if (this.entityOptions === undefined) {
                this.entityOptions = this.createControl();
            }
            return this.entityOptions.option(name, ifNull);
        };
        ListEntityControl.prototype.push = function (entity) {
            this.entities.push(this.createControl(entity));
            //		return entityControl;
        };
        ListEntityControl.prototype.last = function () {
            return this.entities()[this.entities().length - 1];
        };
        ListEntityControl.prototype.remove = function (entityControl) {
            this.entities.remove(entityControl);
        };
        ListEntityControl.prototype.addList = function (entities) {
            this.beforeAddList(entities);
            if (!sd_1.isArrayEmpty(entities)) {
                for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
                    var entity = entities_1[_i];
                    this.push(entity);
                }
            }
            this.postAddList(entities);
        };
        ListEntityControl.prototype.fillList = function (entities) {
            this.entities.removeAll();
            this.beforeFillList(entities);
            this.addList(entities);
            this.postFillList(entities);
        };
        ListEntityControl.prototype.restore = function () {
            var entities = this.entities();
            var restoreEntities = [];
            for (var _i = 0, entities_2 = entities; _i < entities_2.length; _i++) {
                var entity = entities_2[_i];
                restoreEntities.push(entity.restore());
            }
            return restoreEntities;
        };
        ListEntityControl.prototype.beforeAddList = function (entities) {
        };
        ListEntityControl.prototype.postAddList = function (entities) {
        };
        ListEntityControl.prototype.beforeFillList = function (entities) {
        };
        ListEntityControl.prototype.postFillList = function (entities) {
        };
        return ListEntityControl;
    }());
    exports.ListEntityControl = ListEntityControl;
    //PART ListEntityControls Decorators
    var ListEntityDecorator = /** @class */ (function () {
        function ListEntityDecorator(listControl) {
            this.listControl = listControl;
        }
        return ListEntityDecorator;
    }());
    var ListEntityGet = /** @class */ (function (_super) {
        __extends(ListEntityGet, _super);
        function ListEntityGet() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.deferredsLadda = new appmodel_1.DefferedsLadda();
            return _this;
        }
        ListEntityGet.prototype.appRest = function () {
            return appmodel_1.RESTData;
        };
        ListEntityGet.prototype.getProjection = function () {
            return this.listControl.getOption("projection", "");
        };
        ListEntityGet.prototype.getSort = function () {
            return this.listControl.getOption("sort", "");
        };
        ListEntityGet.prototype.getUrlEntity = function () {
            return this.listControl.getOption("urlEntity", "");
        };
        ListEntityGet.prototype.getSearch = function () {
            return {
                find: "", path: [], parameters: {}
            };
        };
        ListEntityGet.prototype.getSize = function () {
            return 200;
        };
        ListEntityGet.prototype.getUrl = function () {
            return this.uri();
        };
        ListEntityGet.prototype.restGetList = function () {
            var _this = this;
            this.deferredsLadda.add("restGetList");
            sd_1.sd.get(this.getUrl(), function (entities) {
                if (entities._embedded) {
                    entities = entities._embedded[_this.listControl.getOption("urlEntity", "")];
                }
                _this.fillList(entities);
                _this.deferredsLadda.resolve();
            }).fail(this.deferredsLadda.resolve);
        };
        ListEntityGet.prototype.fillList = function (entities) {
            if (this.localStorage) {
                this.localStorage.onLoad(entities);
            }
            this.listControl.fillList(entities);
        };
        ListEntityGet.prototype.fillOrLoad = function () {
            if (this.localStorage) {
                this.localStorage.fillOrLoad(this.fillList.bind(this), this.restGetList.bind(this));
            }
            else {
                this.restGetList();
            }
        };
        ListEntityGet.prototype.uri = function () {
            var search = this.getSearch();
            var path = [this.appRest(), this.listControl.getOption("urlEntity")]; // urlEntity
            // совпадает с Entity
            if (search.hasOwnProperty("find") && !sd_1.isEmpty(search.find)) {
                path.push("search/" + search.find);
            } // search только для ListEntityGet
            if (search.hasOwnProperty("path")) {
                for (var _i = 0, _a = sd_1.getProperty(search, "path"); _i < _a.length; _i++) {
                    var part = _a[_i];
                    path.push(part);
                }
            }
            var parameters = {};
            var addParameter = function (name, value) {
                if (value != null)
                    parameters[name] = value;
            };
            addParameter("projection", this.getProjection());
            addParameter("sort", this.getSort());
            addParameter("size", this.getSize());
            if (search.hasOwnProperty("parameters")) {
                for (var parameter in search.parameters)
                    if (search.parameters.hasOwnProperty(parameter)) {
                        addParameter(parameter, search.parameters[parameter]);
                    }
            }
            return new sd_1.Uri(path, parameters);
        };
        return ListEntityGet;
    }(ListEntityDecorator));
    exports.ListEntityGet = ListEntityGet;
    var ListEntityEdit = /** @class */ (function (_super) {
        __extends(ListEntityEdit, _super);
        function ListEntityEdit() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.creatingEntity = knockout_1.observable(null);
            _this.isAddable = knockout_1.pureComputed(function () { return _this.isAddableEntity() &&
                _this.creatingEntity() ===
                    null; });
            return _this;
        }
        ListEntityEdit.prototype.isAddableEntity = function () {
            return true;
        };
        ListEntityEdit.prototype.create = function () {
            var entityControl = this.listControl.createControl();
            entityControl.controlEdit.isEdit(true);
            this.listControl.entities.unshift(entityControl);
            this.creatingEntity(entityControl);
        };
        return ListEntityEdit;
    }(ListEntityDecorator));
    exports.ListEntityEdit = ListEntityEdit;
    var ListEntityGetPage = /** @class */ (function (_super) {
        __extends(ListEntityGetPage, _super);
        function ListEntityGetPage() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.total = knockout_1.observable(null);
            //.extend({rateLimit: AppModel.prototype.rateLimit});
            _this.page = knockout_1.observable(null);
            _this.isLoaded = knockout_1.pureComputed(function () { return _this.total() != null; });
            _this.isLoadedFull = knockout_1.pureComputed(function () {
                return _this.isLoaded() &&
                    (_this.total() <= (_this.page() + 1) * _this.getSize());
            });
            _this.textLoaded = knockout_1.pureComputed(function () {
                return _this.isLoaded() ? _this.listControl.entities().length + " из " + _this.total() : "";
            });
            _this.textLoadNext = knockout_1.pureComputed(function () {
                if (_this.isLoadedFull()) {
                    return "";
                }
                if (!_this.isLoaded()) {
                    return "первые " + _this.getSize();
                }
                var remain = _this.total() - (_this.page() + 1) * _this.getSize();
                if (remain <= _this.getSize()) {
                    return "последние " + remain;
                }
                return "следующие " + _this.getSize();
            });
            return _this;
        }
        ListEntityGetPage.prototype.infoNoData = function () {
        };
        ListEntityGetPage.prototype.restGetList = function () {
            var _this = this;
            if (!this.isLoadedFull()) {
                var page = this.page();
                var newPage_1 = page == null ? 0 : (page + 1);
                app.ladda(true);
                sd_1.sd.get(this.getUrl()
                    .withParameter("page", newPage_1), function (entities) {
                    var content, pageable;
                    var isAppRestData = _this.appRest() === appmodel_1.RESTData;
                    if (isAppRestData && entities.hasOwnProperty("_embedded")) {
                        content = entities._embedded[_this.listControl.getOption("urlEntity", "")];
                    }
                    else {
                        if (entities.hasOwnProperty("content")) {
                            content = entities.content;
                        }
                        else {
                            throw new Error("В результате запроса отсутствуют данные");
                        }
                    }
                    if (isAppRestData && entities.hasOwnProperty("page")) {
                        pageable = entities.page;
                    }
                    else {
                        if (entities.hasOwnProperty("totalElements")) {
                            pageable = entities;
                        }
                        else {
                            throw new Error("В результате запроса отсутствует информация о страницах");
                        }
                    }
                    _this.total(pageable.totalElements);
                    if (pageable.totalElements === 0)
                        _this.infoNoData();
                    _this.page(newPage_1);
                    _this.listControl.addList(content);
                    app.ladda(false);
                }).fail(function () { return app.ladda(false); });
            }
        };
        ListEntityGetPage.prototype.resetAndGet = function () {
            this.listControl.entities.removeAll();
            this.total(null);
            this.page(null);
            this.restGetList();
        };
        return ListEntityGetPage;
    }(ListEntityGet));
    exports.ListEntityGetPage = ListEntityGetPage;
    var ListEntityGetScroll = /** @class */ (function (_super) {
        __extends(ListEntityGetScroll, _super);
        function ListEntityGetScroll(listControl) {
            var _this = _super.call(this, listControl) || this;
            _this.scrollActive = true;
            var scroll = function () {
                if (_this.isScrollActive() && !_this.isLoadedFull() &&
                    window.pageYOffset +
                        window.innerHeight >=
                        $(document).height() - 1) {
                    _this.scrollActive = false;
                    window.onscroll = null;
                    _this.restGetList();
                    setTimeout(function () {
                        window.onscroll = scroll;
                        _this.scrollActive = true;
                    }, 3000);
                }
            };
            window.onscroll = scroll;
            return _this;
        }
        ListEntityGetScroll.prototype.isScrollActive = function () {
            return this.scrollActive;
        };
        return ListEntityGetScroll;
    }(ListEntityGetPage));
    exports.ListEntityGetScroll = ListEntityGetScroll;
    //PART ListEntityControl isReady LEGO classes
    var ListControlGet = /** @class */ (function (_super) {
        __extends(ListControlGet, _super);
        function ListControlGet() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.listGet = new ListEntityGet(_this);
            return _this;
        }
        return ListControlGet;
    }(ListEntityControl));
    exports.ListControlGet = ListControlGet;
    var ListControlGetPage = /** @class */ (function (_super) {
        __extends(ListControlGetPage, _super);
        function ListControlGetPage() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.listGet = new ListEntityGetPage(_this);
            return _this;
        }
        return ListControlGetPage;
    }(ListEntityControl));
    exports.ListControlGetPage = ListControlGetPage;
    var ListControlGetScroll = /** @class */ (function (_super) {
        __extends(ListControlGetScroll, _super);
        function ListControlGetScroll() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.listGet = new ListEntityGetScroll(_this);
            return _this;
        }
        return ListControlGetScroll;
    }(ListEntityControl));
    exports.ListControlGetScroll = ListControlGetScroll;
    var ListControlEdit = /** @class */ (function (_super) {
        __extends(ListControlEdit, _super);
        function ListControlEdit() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.listEdit = new ListEntityEdit(_this);
            return _this;
        }
        return ListControlEdit;
    }(ListEntityControl));
    exports.ListControlEdit = ListControlEdit;
    var ListControlGetEdit = /** @class */ (function (_super) {
        __extends(ListControlGetEdit, _super);
        function ListControlGetEdit() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.listEdit = new ListEntityEdit(_this);
            return _this;
        }
        return ListControlGetEdit;
    }(ListControlGet));
    exports.ListControlGetEdit = ListControlGetEdit;
});
