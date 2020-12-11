define(["require", "exports", "kontext/sd/sd", "kontext/sd/appmodel", "knockout", "kontext/components/chosen"], function (require, exports, sd_1, appmodel_1, knockout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectEntity = void 0;
    var SelectEntity = /** @class */ (function () {
        function SelectEntity(options) {
            this.entities = knockout_1.observableArray([]);
            this.isEntities = knockout_1.observable(false);
            this.entity = {};
            this.empty = null;
            this.options = (options) ? options : {};
            this.chosen = (this.options.chosen) ? this.options.chosen : {};
            var chosenDefault = { disable_search_threshold: 3, no_results_text: "не найдено" };
            for (var option in chosenDefault)
                if (!this.chosen[option]) {
                    this.chosen[option] = chosenDefault[option];
                }
            if (!this.options.value)
                this.options.value = { owner: this, association: "entity" };
            //ToDo Важно!!! При использовании getList необходимо обернуть <select/> в <!-- ko if:isEntities -->
            if (options.getList)
                this.getList();
            else if (options.entities)
                this.setList(options.entities);
            if (options.onChange)
                this.onChange = options.onChange;
        }
        //необходимо для объектных значений, например 'person.famIO',
        //вызывается с optionsText.bind($data)
        SelectEntity.prototype.optionsText = function (entity) {
            return sd_1.getProperty(entity, this.options.optionsText);
        };
        SelectEntity.prototype.setList = function (entities) {
            this.beforeSetList(entities);
            if (this.options.filter) {
                entities = entities.filter(this.options.filter);
            }
            if (this.options.empty) {
                this.empty = this.options.empty;
                entities.unshift(this.empty);
            }
            this.connect(entities);
            this.postSetList();
        };
        SelectEntity.prototype.beforeSetList = function (entities) {
        };
        SelectEntity.prototype.postSetList = function () {
        };
        SelectEntity.prototype.getList = function () {
            var _this = this;
            var uri = this.uri() + "";
            sd_1.sd.get(uri, function (entities) {
                if (entities._embedded) {
                    var urlEntity = sd_1.getRegExp(uri, appmodel_1.RESTData.split("/").join("\\/") + "\/(.*?)(\/|$)", 2);
                    if (!urlEntity)
                        throw Error("urlEntity не найден в Uri: " + uri);
                    entities = entities._embedded[urlEntity];
                }
                _this.setList(entities);
            });
        };
        SelectEntity.prototype.connect = function (entities) {
            var _this = this;
            if (this.options.value && entities && !sd_1.isArrayEmpty(entities)) {
                if (this.subscription !== undefined)
                    this.subscription.dispose();
                var owner = this.options.value.owner;
                var association = this.options.value.association;
                var connectingValue = sd_1.getProperty(owner, association);
                var value = knockout_1.utils.unwrapObservable(connectingValue);
                if (value != null && entities.indexOf(value) === -1) {
                    var identity = (this.options.value.identity) ? this.options.value.identity : "id";
                    var id = sd_1.tryGetProperty(connectingValue, identity);
                    if (id !== undefined) {
                        for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
                            var entity = entities_1[_i];
                            if (id === entity[identity]) {
                                sd_1.setProperty(owner, association, entity);
                                break;
                            }
                        }
                    }
                }
                this.entities(entities);
                this.isEntities(true);
                if (knockout_1.isObservable(connectingValue)) {
                    this.subscription = connectingValue.subscribe(function (newValue) { return _this.onChange(newValue, _this); });
                }
            }
        };
        SelectEntity.prototype.getBy = function (value, property) {
            var entities = this.entities();
            for (var _i = 0, entities_2 = entities; _i < entities_2.length; _i++) {
                var entity = entities_2[_i];
                if (sd_1.getProperty(entity, property) === value)
                    return entity;
            }
            return null;
        };
        SelectEntity.prototype.filter = function (filter) {
            return (this.entities().length > 0) ? this.entities().filter(filter) : [];
        };
        SelectEntity.prototype.uri = function () {
            return this.options.uri;
        };
        SelectEntity.prototype.onChange = function (newValue, self) {
        };
        SelectEntity.prototype.setEntityById = function (id) {
            var entity = {};
            entity[sd_1.nvl(sd_1.getProperty(this.options, "value.identity"), "id")] = id;
            this.entity = knockout_1.observable(entity);
        };
        return SelectEntity;
    }());
    exports.SelectEntity = SelectEntity;
});
