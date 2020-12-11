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
define(["require", "exports", "kontext/sd/appmodel", "kontext/sd/types", "kontext/sd/sd", "knockout"], function (require, exports, appmodel_1, types_1, sd_1, knockout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EntityControlListEditRest = exports.EntityControlListEdit = exports.EntityControlEdit = exports.EntityControlGet = exports.EntityControlList = exports.EntityEditRest = exports.EntityListEdit = exports.EntityEdit = exports.EntityGet = exports.EntityList = exports.EntityControl = exports.EntitySubscribed = void 0;
    var EntitySubscribed = /** @class */ (function () {
        function EntitySubscribed() {
        }
        return EntitySubscribed;
    }());
    exports.EntitySubscribed = EntitySubscribed;
    //PART main EntityControl data class
    var EntityControl = /** @class */ (function () {
        function EntityControl(entity) {
            var _this = this;
            this.entys = { id: knockout_1.observable(null) };
            this.id = knockout_1.pureComputed(function () { return _this.entys.id(); });
            this.fill(entity);
        }
        EntityControl.prototype.attributes = function () {
            return this.option("attributes");
        };
        EntityControl.prototype.fill = function (entity) {
            entity = this.beforeFill(entity);
            if (entity)
                this.entity = entity;
            appmodel_1.fillApp(this.attributes(), entity, this.entys);
            if (entity)
                this.postFill(entity);
        };
        EntityControl.prototype.restore = function () {
            return appmodel_1.restoreObject(this.attributes(), this.entys);
        };
        EntityControl.prototype.restoreChanges = function () {
            this.fill(this.entity);
        };
        EntityControl.prototype.beforeFill = function (entity) {
            return entity;
        };
        EntityControl.prototype.postFill = function (entity) {
        };
        EntityControl.prototype.option = function (name, ifNull) {
            return sd_1.getProperty(this.options, name, ifNull);
        };
        EntityControl.prototype.isAttribute = function (name) {
            return sd_1.isProperty(this.entys, name);
        };
        EntityControl.prototype.attribute = function (name) {
            return sd_1.getProperty(this.entys, name);
        };
        EntityControl.prototype.getAttributeValue = function (name) {
            return sd_1.getProperty(this.entys, name + "()");
        };
        EntityControl.prototype.oldAttribute = function (name) {
            return sd_1.getProperty(this.entity, name);
        };
        return EntityControl;
    }());
    exports.EntityControl = EntityControl;
    //PART EntityControl Decorators
    var EntityControlDecorator = /** @class */ (function () {
        function EntityControlDecorator(control) {
            this.control = control;
        }
        return EntityControlDecorator;
    }());
    //ToDo добавить шаблон TListControl extends ListEntityControl<TEntity, TControl> и унаследовать от него list
    var EntityList = /** @class */ (function (_super) {
        __extends(EntityList, _super);
        function EntityList() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EntityList.prototype.remove = function () {
            if (this.list) {
                this.beforeRemove();
                this.list.remove(this.control);
            }
        };
        EntityList.prototype.beforeRemove = function () {
        };
        EntityList.prototype.swalRemove = function () {
            appmodel_1.sdSwal("удалить", this.control.option("name"), this.remove);
        };
        return EntityList;
    }(EntityControlDecorator));
    exports.EntityList = EntityList;
    var EntityGet = /** @class */ (function (_super) {
        __extends(EntityGet, _super);
        function EntityGet() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EntityGet.prototype.appRest = function () {
            return appmodel_1.RESTData;
        };
        EntityGet.prototype.uri = function () {
            var projection = this.control.option("projection");
            return new sd_1.Uri([this.appRest(), this.control.option("urlEntity")], (projection) ? {
                projection: projection
            } : undefined);
        };
        EntityGet.prototype.getUrlOne = function (id) {
            return this.uri()
                .withPath((id === undefined ? this.control.id() : id) + "");
        };
        EntityGet.prototype.getUrlGet = function (urlData) {
            switch (typeof urlData) {
                case "string":
                    return urlData;
                case "number":
                    return this.getUrlOne(urlData);
                case "undefined":
                    return this.getUrlOne(entityId);
                default:
                    sd_1.sd.info("Обратитесь к разработчику", "Непредусмотренный формат данных для URL: " + urlData);
                    return "";
            }
        };
        EntityGet.prototype.restGet = function (urlData, postFill) {
            var _this = this;
            return sd_1.sd.get(this.getUrlGet(urlData), function (entity) {
                _this.control.fill(entity);
                if (postFill)
                    postFill(entity);
            });
        };
        return EntityGet;
    }(EntityControlDecorator));
    exports.EntityGet = EntityGet;
    var EntityEdit = /** @class */ (function (_super) {
        __extends(EntityEdit, _super);
        function EntityEdit(control) {
            var _this = _super.call(this, control) || this;
            _this.isEdit = knockout_1.observable(false);
            _this.changes = knockout_1.observable({});
            _this.saveText = knockout_1.pureComputed(function () { return _this.control.id() ?
                "сохранить" :
                "создать"; });
            _this.isNew = knockout_1.pureComputed(function () { return sd_1.isEmpty(_this.control.id()); });
            _this.isChanged = knockout_1.pureComputed(function () {
                var isChanged = false;
                for (var _i = 0, _a = _this.control.attributes(); _i < _a.length; _i++) {
                    var attribute = _a[_i];
                    if (_this.changes()[attribute]) {
                        isChanged = true;
                    }
                }
                app.onbeforeunload(isChanged);
                return isChanged;
            }).extend({ notify: "always" });
            _this.isEditable = knockout_1.pureComputed(function () { return !_this.isEdit() && !_this.isNew(); });
            _this.isDeletable = knockout_1.pureComputed(function () { return !_this.isNew(); });
            _this.isSaveable = knockout_1.pureComputed(function () { return _this.isChanged() &&
                _this.isValidity(); });
            _this.formId = knockout_1.pureComputed(function () { return _this.control.option("formId"); });
            _this.fillChange();
            return _this;
        }
        EntityEdit.prototype.isValidity = function () {
            var formId = this.formId();
            if (!sd_1.isEmpty(formId)) {
                var form = document.getElementById(formId);
                if (!form) {
                    throw new Error("\u0424\u043E\u0440\u043C\u0430 " + formId + " \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435. \u041E\u0431\u0440\u0430\u0442\u0438\u0442\u0435\u0441\u044C \u043A \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A\u0443");
                }
                return form.checkValidity();
            }
            return true;
        };
        EntityEdit.prototype.fillChange = function () {
            var _this = this;
            var changes = this.changes();
            var _loop_1 = function (attributeName) {
                var attribute = this_1.control.attribute(attributeName);
                attribute.subscribe(function (newValue) {
                    var changes = _this.changes();
                    var oldValue = sd_1.getProperty(_this.control, "entity." + attributeName, null);
                    var isChange = false;
                    if (oldValue != null && typeof oldValue === "object") {
                        if (newValue ==
                            null ||
                            (Array.isArray(oldValue) && oldValue.length !== newValue.length)) {
                            isChange = true;
                        }
                        else {
                            for (var i in oldValue)
                                if (oldValue[i] != newValue[i]) {
                                    isChange = true;
                                    break;
                                }
                        }
                    }
                    else {
                        isChange = (oldValue != newValue);
                    }
                    changes[attributeName] = isChange;
                    _this.changes(changes);
                }, attribute, "change");
                changes[attributeName] = false;
            };
            var this_1 = this;
            for (var _i = 0, _a = this.control.attributes(); _i < _a.length; _i++) {
                var attributeName = _a[_i];
                _loop_1(attributeName);
            }
            this.changes(changes);
        };
        EntityEdit.prototype.clearChanges = function () {
            var changes = this.changes();
            for (var attribute in changes)
                changes[attribute] = false;
            this.changes(changes);
        };
        EntityEdit.prototype.restore = function () {
            return this.control.restore();
        };
        EntityEdit.prototype.edit = function () {
            this.isEdit(true);
        };
        EntityEdit.prototype.restoreIdAndFill = function (entity) {
            var newId = entity.id;
            if (!newId) {
                if (sd_1.isProperty(entity, "_links.self.href")) {
                    var self_1 = sd_1.getProperty(entity, "_links.self.href");
                    newId = parseInt(self_1.substr(self_1.lastIndexOf("/") + 1, self_1.length - self_1.lastIndexOf("/")));
                }
                else
                    sd_1.sd.error("ID сохраненной сущности не опознано (" + newId + ")", "обратитесь разработчику", { timeOut: 1000 });
                entity = this.control.restore();
                entity.id = newId;
            }
            this.control.fill(entity);
            return entity;
        };
        EntityEdit.prototype.save = function () {
            var _this = this;
            if (!this.isValidity()) {
                throw new Error("перед Сохранением проверьте значения помеченные красным!");
            }
            var entity = this.restore();
            var name = sd_1.capitalizeFirstLetter(this.control.option("name"));
            if (this.isNew()) {
                if (this.control.beforePost)
                    this.control.beforePost(entity);
                this.doPost(entity, function (entity) {
                    entity = _this.restoreIdAndFill(entity);
                    var onHidden;
                    if (_this.control.postCreate ? _this.control.postCreate(entity) : true) {
                        onHidden = function () {
                            app.onbeforeunload(false);
                            location.href = sd_1.sd.uri([_this.control.option("urlEntity"),
                                types_1.idToString(entity.id)]);
                        };
                    }
                    sd_1.sd.success(name + " успешно создан(а,о)", "", {
                        onHidden: onHidden, timeOut: 1000
                    });
                });
            }
            else {
                this.doPut(entity, function (entity) {
                    entity = _this.restoreIdAndFill(entity);
                    _this.clearChanges();
                    if (_this.control.postPut)
                        _this.control.postPut(entity);
                    sd_1.sd.success(name + " успешно сохранен(а,о)", "", { timeOut: 1500 });
                });
            }
            this.isEdit(false);
        };
        EntityEdit.prototype.cancel = function () {
            if (!this.isNew())
                this.control.restoreChanges();
            this.isEdit(false);
            if (this.control.postCancel)
                this.control.postCancel();
        };
        EntityEdit.prototype.deleteEntity = function (isNotAsk) {
            var _this = this;
            var doDelete = function () {
                _this.doDelete(function () {
                    var onHidden;
                    if (_this.control.postDelete ? _this.control.postDelete() : true) {
                        onHidden = function () {
                            app.onbeforeunload(false);
                            location.href = sd_1.sd.uri(_this.control.option("urlEntity"));
                        };
                    }
                    sd_1.sd.warning(sd_1.capitalizeFirstLetter(_this.control.option("name")) + " \u0443\u0434\u0430\u043B\u0435\u043D(\u0430,\u043E)", "", { onHidden: onHidden, timeOut: 1000 });
                });
            };
            if (isNotAsk === true) {
                doDelete();
            }
            else {
                appmodel_1.sdSwal("удалить", this.control.option("genitive"), doDelete);
            }
        };
        EntityEdit.prototype.doPost = function (entity, callBack) {
            callBack(entity);
        };
        EntityEdit.prototype.doPut = function (entity, callBack) {
            callBack(entity);
        };
        EntityEdit.prototype.doDelete = function (callBack) {
            callBack();
        };
        return EntityEdit;
    }(EntityControlDecorator));
    exports.EntityEdit = EntityEdit;
    var EntityListEdit = /** @class */ (function (_super) {
        __extends(EntityListEdit, _super);
        function EntityListEdit() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EntityListEdit.prototype.postCreate = function (entity) {
            if (this.list && this.list.listEdit.creatingEntity() === this.control) {
                this.list.listEdit.creatingEntity(null);
            }
            return false;
        };
        EntityListEdit.prototype.postDelete = function () {
            if (this.list) {
                this.list.remove(this.control);
            }
            return false;
        };
        EntityListEdit.prototype.postCancel = function () {
            if (this.list != null && this.control.controlEdit.isNew()) {
                this.list.remove(this.control);
                this.list
                    .listEdit
                    .creatingEntity(null);
            }
        };
        return EntityListEdit;
    }(EntityList));
    exports.EntityListEdit = EntityListEdit;
    var EntityEditRest = /** @class */ (function (_super) {
        __extends(EntityEditRest, _super);
        function EntityEditRest() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EntityEditRest.prototype.linksForeach = function (linksOption, linkHandler) {
            var links = this.control.option(linksOption);
            if (links) {
                for (var attribute in links)
                    if (links.hasOwnProperty(attribute)) {
                        linkHandler(attribute, links[attribute]);
                    }
                    else {
                        throw new Error("\u0432 this.options." + linksOption + " \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0430\u0442\u0440\u0438\u0431\u0443\u0442 " + attribute);
                    }
            }
        };
        EntityEditRest.prototype.restore = function () {
            var _this = this;
            var entity = _super.prototype.restore.call(this);
            this.linksForeach("links", function (attribute, link) {
                var action;
                if (_this.isNew() || _this.control.oldAttribute(attribute) == null) {
                    action = (entity[attribute] == null) ? "delete" : "link";
                }
                else {
                    if (entity[attribute] != null) {
                        action = (_this.control.oldAttribute(attribute).id === entity[attribute].id) ?
                            "delete" :
                            "link";
                    }
                }
                if (action === "delete") {
                    delete entity[attribute];
                }
                else {
                    if (action === "link") {
                        sd_1.setProperty(entity, attribute, sd_1.sd.uri([link.indexOf("/") > -1 ? "" : appmodel_1.RESTData,
                            link,
                            entity[attribute].id]));
                    }
                }
            });
            this.linksForeach("agregationLinks", function (attribute) { return delete entity[attribute]; });
            return entity;
        };
        EntityEditRest.prototype.restoreJSON = function () {
            return JSON.stringify(this.restore());
        };
        EntityEditRest.prototype.getUrlPut = function (id) {
            return this.control.controlGet.getUrlOne(id).withParameters({ projection: "" });
        };
        EntityEditRest.prototype.getUrlPost = function () {
            return this.control.controlGet.uri().withParameters({ projection: "" });
        };
        EntityEditRest.prototype.getUrlDetete = function () {
            return this.control.controlGet.getUrlOne().withParameters({ projection: "" });
        };
        EntityEditRest.prototype.doPost = function (entity, callBack) {
            sd_1.sd.post(this.getUrlPost(), JSON.stringify(entity), callBack);
        };
        EntityEditRest.prototype.doPut = function (entity, callBack) {
            var _this = this;
            var changedLinks = [];
            this.linksForeach("links", function (attribute, link) {
                if (_this.changes()[attribute])
                    changedLinks.push(attribute);
            });
            if (changedLinks.length === 0) {
                sd_1.sd.put(this.getUrlPut(), JSON.stringify(entity), callBack);
            }
            else {
                var entityResult_1 = {};
                sd_1.sd.put(this.getUrlPut(), JSON.stringify(entity), function (result) {
                    entityResult_1 = result;
                    var uri = _this
                        .control.controlGet
                        .getUrlOne()
                        .withParameters({ projection: "" });
                    function putLink(self) {
                        var link = changedLinks.pop();
                        if (link)
                            sd_1.sd.request("put", "" + uri.withPath(link), {
                                data: entity[link], type: "text/uri-list",
                                onload: function () {
                                    //@ts-ignore
                                    sd_1.setProperty(entityResult_1, link, self.control.getAttributeValue(link));
                                    putLink(self);
                                }, onerror: function () {
                                    //@ts-ignore
                                    sd_1.sd.error("Ссылка не сохранена " + uri.withPath(link), "Обратитесь к разработчику", { timeOut: 2000 });
                                    putLink(self);
                                }
                            });
                        else
                            callBack(entityResult_1);
                    }
                    putLink(_this);
                });
            }
        };
        EntityEditRest.prototype.doDelete = function (callBack) {
            sd_1.sd.deleteXHR(this.getUrlDetete(), callBack);
        };
        EntityEditRest.prototype.saveAgregation = function (agregation) {
            var _this = this;
            var name = this.control.option("name");
            if (this.isNew()) {
                throw new Error("Сначала сохраните агрегат " + name);
            }
            if (this.control.attributes().indexOf(agregation) === -1) {
                throw new Error(agregation + " отсутствует в списке атрибутов агрегата " + name);
            }
            if (!this.control.isAttribute(agregation)) {
                throw new Error(agregation + " отсутствует в агрегате " + name);
            }
            var agregationLink = this.control.option("agregationLinks." + agregation, "");
            if (sd_1.isEmpty(agregationLink)) {
                throw new Error("ссылка на коллекцию " +
                    agregation +
                    " отсутствует в agregationLinks агрегата " +
                    name);
            }
            var list = this.control.getAttributeValue(agregation);
            var uriList = "";
            var uri = new sd_1.Uri([this.control.controlGet.appRest(), agregationLink]);
            if (!sd_1.isArrayEmpty(list)) {
                for (var i in list)
                    uriList += (i === "0" ? "" : "\n") +
                        uri.withPath(sd_1.getProperty(list[i], "id"));
            }
            uri = this
                .control.controlGet
                .getUrlOne()
                .withPath(agregation)
                .withParameters({ projection: "" });
            sd_1.sd.request("put", "" + uri, {
                data: uriList, type: "text/uri-list",
                onload: function (request) {
                    _this.postSaveAgregation(request);
                    sd_1.sd.success("Коллекция " + name + "." + agregation + " успешно сохранен(а,о)", "", { timeOut: 2000 });
                },
                onerror: sd_1.sd.fail
            });
        };
        EntityEditRest.prototype.postSaveAgregation = function (request) {
        };
        return EntityEditRest;
    }(EntityEdit));
    exports.EntityEditRest = EntityEditRest;
    //PART EntityControl isReady LEGO classes
    var EntityControlList = /** @class */ (function (_super) {
        __extends(EntityControlList, _super);
        function EntityControlList() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.controlList = new EntityList(_this);
            return _this;
        }
        return EntityControlList;
    }(EntityControl));
    exports.EntityControlList = EntityControlList;
    var EntityControlGet = /** @class */ (function (_super) {
        __extends(EntityControlGet, _super);
        function EntityControlGet() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.controlGet = new EntityGet(_this);
            return _this;
        }
        return EntityControlGet;
    }(EntityControl));
    exports.EntityControlGet = EntityControlGet;
    var EntityControlEdit = /** @class */ (function (_super) {
        __extends(EntityControlEdit, _super);
        function EntityControlEdit() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.controlGet = new EntityGet(_this);
            _this.controlEdit = new EntityEditRest(_this);
            return _this;
        }
        return EntityControlEdit;
    }(EntityControl));
    exports.EntityControlEdit = EntityControlEdit;
    var EntityControlListEdit = /** @class */ (function (_super) {
        __extends(EntityControlListEdit, _super);
        function EntityControlListEdit() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.controlEdit = new EntityEdit(_this);
            _this.controlList = new EntityListEdit(_this);
            return _this;
        }
        EntityControlListEdit.prototype.postCreate = function (entity) {
            return this.controlList.postCreate(entity);
        };
        EntityControlListEdit.prototype.postDelete = function () {
            return this.controlList.postDelete();
        };
        EntityControlListEdit.prototype.postCancel = function () {
            this.controlList.postCancel();
        };
        return EntityControlListEdit;
    }(EntityControlGet));
    exports.EntityControlListEdit = EntityControlListEdit;
    var EntityControlListEditRest = /** @class */ (function (_super) {
        __extends(EntityControlListEditRest, _super);
        function EntityControlListEditRest() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.controlGet = new EntityGet(_this);
            _this.controlEdit = new EntityEditRest(_this);
            return _this;
        }
        return EntityControlListEditRest;
    }(EntityControlListEdit));
    exports.EntityControlListEditRest = EntityControlListEditRest;
});
