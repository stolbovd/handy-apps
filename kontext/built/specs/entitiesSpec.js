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
define(["require", "exports", "kontext/sd/spec", "kontext/sd/entities", "kontext/sd/entitylists"], function (require, exports, spec_1, entities_1, entitylists_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    new spec_1.AppModelSpec();
    describe("entities", function () {
        it("should AppModel initialised", app.spec.init);
        var Aggregate = /** @class */ (function (_super) {
            __extends(Aggregate, _super);
            function Aggregate() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Aggregate.prototype.options = function () {
                return {
                    attributes: ["id", "name", "type", "link", "leafs", "birds"],
                    links: { link: "links" },
                    agregationLinks: { birds: "birds", leafs: "leafs" },
                    name: "агрегат",
                    genitive: "агрегата",
                    urlEntity: "agregates",
                    projection: "full"
                };
            };
            return Aggregate;
        }(entities_1.EntityControlGet));
        var AggregateEdit = /** @class */ (function (_super) {
            __extends(AggregateEdit, _super);
            function AggregateEdit() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.controlGet = new entities_1.EntityGet(_this);
                _this.controlEdit = new entities_1.EntityEditRest(_this);
                return _this;
            }
            AggregateEdit.prototype.postCreate = function (aggregate) {
                return false;
            };
            AggregateEdit.prototype.postPut = function (aggregate) {
            };
            AggregateEdit.prototype.postDelete = function () {
                return false;
            };
            return AggregateEdit;
        }(Aggregate));
        var Leaf = /** @class */ (function (_super) {
            __extends(Leaf, _super);
            function Leaf() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Leaf.prototype.options = function () {
                return {
                    attributes: ["id", "name", "agregate"],
                    links: { agregate: "agregates" },
                    name: "листок",
                    genitive: "листка",
                    urlEntity: "leaves",
                    projection: "simple"
                };
            };
            Leaf.prototype.postCreate = function (leaf) {
                return false;
            };
            Leaf.prototype.postDelete = function () {
                return false;
            };
            return Leaf;
        }(entities_1.EntityControlEdit));
        var Bird = /** @class */ (function (_super) {
            __extends(Bird, _super);
            function Bird() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Bird.prototype.options = function () {
                return {
                    attributes: ["id", "name"],
                    name: "птичка",
                    genitive: "птички",
                    urlEntity: "birds",
                    projection: "simple"
                };
            };
            Bird.prototype.postCreate = function (bird) {
                return false;
            };
            Bird.prototype.postDelete = function () {
                return false;
            };
            return Bird;
        }(entities_1.EntityControlEdit));
        var aggregateEdit;
        var aggregateId;
        var leaf;
        var leafId;
        var bird;
        var birdId;
        var aggregate = new Aggregate();
        describe("EntityGet", function () {
            it("should get entity", function (done) {
                aggregate.postFill = function (agregate) {
                    expect(agregate.name).toEqual("agregate1");
                    done();
                };
                expect(aggregate.getAttributeValue("name")).toBeNull();
                aggregate.controlGet.restGet();
            });
            it("should entity obtained", function (done) {
                expect(aggregate.getAttributeValue("name")).toEqual("agregate1");
                var leafs = aggregate.getAttributeValue("leafs");
                expect(leafs).toBeDefined();
                expect(leafs).not.toBeNull();
                expect(leafs.length).toEqual(3);
                var birds = aggregate.getAttributeValue("birds");
                expect(birds).toBeDefined();
                expect(birds).not.toBeNull();
                expect(birds.length).toEqual(2);
                done();
            });
        });
        describe("EntityEditRest", function () {
            aggregateEdit = new AggregateEdit({
                id: null,
                name: "created",
                type: "enum2",
                link: { id: 2, name: "link2" },
                birds: [],
                leafs: []
            });
            it("should agregate created", function (done) {
                aggregateEdit.entys.type("enum3");
                aggregateEdit.entys.link({ id: 2, name: "link2" });
                aggregateEdit.postCreate = function (aggregate) {
                    aggregateId = aggregate.id;
                    expect(aggregateId).not.toBeNull();
                    expect(aggregate.link).not.toBeNull();
                    if (aggregate.link)
                        expect(aggregate.link.id).toEqual(2);
                    done();
                    return false;
                };
                aggregateEdit.controlEdit.save();
            });
            it("should agregate modified", function (done) {
                expect(aggregateId).toBeGreaterThan(0);
                expect(aggregateEdit.id()).toEqual(aggregateId);
                aggregateEdit.entys.link({ id: 3, name: "link3" });
                aggregateEdit.entys.name("modified");
                aggregateEdit.entys.type("enum1");
                aggregateEdit.postPut = function (agregate) {
                    expect(agregate.id).toEqual(aggregateId);
                    expect(agregate.name).toEqual("modified");
                    expect(agregate.link).not.toBeNull();
                    if (agregate.link) {
                        expect(agregate.link.id).toEqual(3);
                        expect(agregate.link.name).toEqual("link3");
                    }
                    aggregate.postFill = function (agregateGet) {
                        if (agregateGet.name != "modified")
                            expect(aggregateEdit.id()).toEqual(aggregateId);
                        expect(agregateGet.id).toEqual(aggregateId);
                        expect(agregateGet.name).toEqual("modified");
                        expect(agregateGet.type).toEqual("enum1");
                        if (agregateGet.link) {
                            expect(agregateGet.link.id).toEqual(3);
                            expect(agregateGet.link.name).toEqual("link3");
                        }
                        done();
                    };
                    aggregate.controlGet.restGet(aggregateId);
                };
                aggregateEdit.controlEdit.save();
            });
            it("should leaf created", function (done) {
                var leafName = "Созданный в тесте листок агрегата id:" +
                    aggregateEdit.id() +
                    " " +
                    aggregateEdit.entys.name();
                leaf = new Leaf({
                    name: leafName, agregate: { id: aggregateEdit.id() }
                });
                leaf.postCreate = function (leaf) {
                    leafId = leaf.id;
                    expect(leafId).not.toBeNull();
                    expect(leaf.agregate.id).toEqual(aggregateEdit.id());
                    done();
                    return false;
                };
                leaf.controlEdit.save();
            });
            it("should bird created", function (done) {
                bird = new Bird({ name: "птичка created" });
                bird.postCreate = function (bird) {
                    birdId = bird.id;
                    expect(bird.id).not.toBeNull();
                    expect(bird.name).toEqual("птичка created");
                    done();
                    return false;
                };
                bird.controlEdit.save();
            });
            it("should agregation birds added to agregate by saveAgregation", function (done) {
                aggregateEdit.entys.birds([{ id: 1 }, { id: birdId }]);
                aggregateEdit.controlEdit.postSaveAgregation = function (request) {
                    expect(request.status).toBe(204);
                    done();
                };
                aggregateEdit.controlEdit.saveAgregation("birds");
            });
            it("should agregateEdit obtained", function (done) {
                aggregateEdit.postFill = function (agregate) {
                    spec_1.expectArraySize(agregate.leafs, 1);
                    spec_1.expectArraySize(agregate.birds, 2);
                    done();
                };
                aggregateEdit.controlGet.restGet(aggregateId);
            });
            it("should agregation birds do not added to agregate by save", function (done) {
                aggregateEdit.entys.birds().push({ id: 3 });
                aggregateEdit.postFill = function () {
                };
                aggregateEdit.postPut = function (agregate) {
                    expect(agregate.name).toEqual("modified");
                    spec_1.expectArraySize(agregate.leafs, 1);
                    spec_1.expectArraySize(agregate.birds, 3);
                    aggregate.postFill = function (agregate) {
                        expect(aggregateEdit.id()).toEqual(aggregateId);
                        expect(agregate.id).toEqual(aggregateId);
                        expect(agregate.name).toEqual("modified");
                        expect(agregate.type).toEqual("enum1");
                        if (agregate.link) {
                            expect(agregate.link.id).toEqual(3);
                            expect(agregate.link.name).toEqual("link3");
                        }
                        spec_1.expectArraySize(agregate.leafs, 1);
                        spec_1.expectArraySize(agregate.birds, 2);
                        done();
                    };
                    aggregate.controlGet.restGet(aggregateId);
                };
                //FixMe Иногда вылетает Expected 'created' to equal 'modified'
                expect(aggregateEdit.entys.name()).toEqual("modified");
                aggregateEdit.controlEdit.save();
            });
            it("should agregation birds deleted", function (done) {
                aggregateEdit.entys.birds(null);
                aggregateEdit.controlEdit.postSaveAgregation = function (request) {
                    expect(true).toBeTruthy();
                    done();
                };
                aggregateEdit.controlEdit.saveAgregation("birds");
            });
            it("should bird deleted", function (done) {
                bird.postDelete = function () {
                    expect(true).toBeTruthy();
                    done();
                    return false;
                };
                bird.controlEdit.deleteEntity(true);
            });
            it("should leaf deleted", function (done) {
                leaf.postDelete = function () {
                    expect(true).toBeTruthy();
                    done();
                    return false;
                };
                leaf.controlEdit.deleteEntity(true);
            });
            it("should agregate deleted", function (done) {
                aggregateEdit.postDelete = function () {
                    expect(true).toBeTruthy();
                    done();
                    return false;
                };
                aggregateEdit.controlEdit.deleteEntity(true);
            });
        });
        describe("ListEntityGet", function () {
            var AgregateOfList = /** @class */ (function (_super) {
                __extends(AgregateOfList, _super);
                function AgregateOfList() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.controlList = new entities_1.EntityList(_this);
                    return _this;
                }
                return AgregateOfList;
            }(Aggregate));
            var agregates = new entitylists_1.ListControlGet(AgregateOfList);
            it("should get list of entity", function (done) {
                agregates.postFillList = function (entities) {
                    expect(entities).not.toBeNull();
                    expect(Array.isArray(entities)).toBeTruthy();
                    expect(entities.length).toBeGreaterThan(1);
                    done();
                };
                agregates.listGet.restGetList();
            });
        });
        describe("ListEntityGetPage", function () {
            var BirdOfList = /** @class */ (function (_super) {
                __extends(BirdOfList, _super);
                function BirdOfList() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.controlList = new entities_1.EntityList(_this);
                    return _this;
                }
                return BirdOfList;
            }(Bird));
            var BirdsListEntityGetPage = /** @class */ (function (_super) {
                __extends(BirdsListEntityGetPage, _super);
                function BirdsListEntityGetPage() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                BirdsListEntityGetPage.prototype.getSearch = function () {
                    return {
                        find: "findByAgregateId", parameters: { agregateId: 3 }
                    };
                };
                BirdsListEntityGetPage.prototype.getSize = function () {
                    return 5;
                };
                return BirdsListEntityGetPage;
            }(entitylists_1.ListEntityGetPage));
            var Birds = /** @class */ (function (_super) {
                __extends(Birds, _super);
                function Birds() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.listGet = new BirdsListEntityGetPage(_this);
                    return _this;
                }
                return Birds;
            }(entitylists_1.ListEntityControl));
            var birds = new Birds(BirdOfList);
            var expects = function (page, total, isLoaded, isLoadedFull, textLoaded, textLoadNext) {
                var listGet = birds.listGet;
                expect(listGet.page()).toEqual(page);
                expect(listGet.total()).toEqual(total);
                expect(listGet.isLoaded()).toEqual(isLoaded);
                expect(listGet.isLoadedFull()).toEqual(isLoadedFull);
                expect(listGet.textLoaded()).toEqual(textLoaded);
                expect(listGet.textLoadNext()).toEqual(textLoadNext);
            };
            it("should get first page list of entity", function (done) {
                expects(null, null, false, false, "", "первые 5");
                birds.postAddList = function (entities) {
                    expects(0, 12, true, false, "5 из 12", "следующие 5");
                    expect(entities).not.toBeNull();
                    expect(Array.isArray(entities)).toBeTruthy();
                    expect(entities.length).toEqual(5);
                    expect(birds.entities().length).toEqual(5);
                    done();
                };
                birds.listGet.restGetList();
            });
            it("should get second page to list of entity", function (done) {
                birds.postAddList = function () {
                    expects(1, 12, true, false, "10 из 12", "последние 2");
                    expect(birds.entities().length).toEqual(10);
                    done();
                };
                birds.listGet.restGetList();
            });
            it("should get third page to list of entity", function (done) {
                birds.postAddList = function () {
                    expects(2, 12, true, true, "12 из 12", "");
                    expect(birds.entities().length).toEqual(12);
                    done();
                };
                birds.listGet.restGetList();
            });
            it("should get not fourth page to list of entity", function () {
                birds.postAddList = function (entities) {
                    //если список будет получен, то возникнет исключение
                    expect(entities.length).toEqual(0);
                };
                birds.listGet.restGetList();
                expect(birds.entities().length).toEqual(12);
            });
        });
        describe("ListEntityGetEdit", function () {
            var AgregateOfList = /** @class */ (function (_super) {
                __extends(AgregateOfList, _super);
                function AgregateOfList() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.controlList = new entities_1.EntityListEdit(_this);
                    _this.controlGet = new entities_1.EntityGet(_this);
                    _this.controlEdit = new entities_1.EntityEditRest(_this);
                    return _this;
                }
                AgregateOfList.prototype.postCreate = function (agregate) {
                    return this.controlList.postCreate(agregate);
                };
                AgregateOfList.prototype.postCancel = function () {
                    return this.controlList.postCancel();
                };
                AgregateOfList.prototype.postDelete = function () {
                    return this.controlList.postDelete();
                };
                return AgregateOfList;
            }(Aggregate));
            var agregates = new entitylists_1.ListControlGetEdit(AgregateOfList);
            it("should get listGetEdit of entity", function (done) {
                agregates.postFillList = function (entities) {
                    expect(entities).not.toBeNull();
                    expect(Array.isArray(entities)).toBeTruthy();
                    expect(entities.length).toBeGreaterThan(1);
                    done();
                };
                agregates.listGet.restGetList();
            });
            it("should agregate created in listGetEdit", function (done) {
                var agregatesSize = agregates.entities().length;
                agregates.listEdit.create();
                expect(agregates.entities().length).toBe(agregatesSize + 1);
                var creatingEntity = agregates.listEdit.creatingEntity();
                expect(creatingEntity).not.toBeNull();
                expect(creatingEntity).not.toBeUndefined();
                if (creatingEntity) {
                    expect(creatingEntity instanceof AgregateOfList).toBeTruthy();
                    expect(creatingEntity.controlEdit.isNew()).toBeTruthy();
                    expect(agregates.entities()[0] === creatingEntity).toBeTruthy();
                    creatingEntity.entys.name("created in listGetEdit");
                    creatingEntity.postCreate = function (agregate) {
                        var isLeave = creatingEntity.controlList.postCreate(agregate);
                        aggregateId = agregate.id;
                        expect(aggregateId).toBeGreaterThan(0);
                        expect(agregate.name).toBe("created in listGetEdit");
                        done();
                        return isLeave;
                    };
                    creatingEntity.controlEdit.save();
                }
            });
            it("should agregate canceled", function (done) {
                var agregatesSize = agregates.entities().length;
                agregates.listEdit.create();
                var creatingEntity = agregates.listEdit.creatingEntity();
                if (creatingEntity) {
                    expect(creatingEntity.controlEdit.isNew()).toBeTruthy();
                    creatingEntity.entys.name("created for cancel in listGetEdit");
                    expect(agregates.entities().length).toBe(agregatesSize + 1);
                    creatingEntity.controlEdit.cancel();
                    expect(agregates.entities().length).toBe(agregatesSize);
                    expect(agregates.listEdit.creatingEntity()).toBeNull();
                    done();
                }
                else {
                    throw new Error("новый агрегат не создан");
                }
            });
            var agregate;
            it("should created agregate found in listGetEdit", function (done) {
                agregates.postFillList = function (entities) {
                    expect(entities.length).toBeGreaterThan(1);
                    agregate = agregates.entities()
                        .filter(function (value) { return value.id() === aggregateId; })[0];
                    expect(agregate).not.toBeNull();
                    expect(agregate.id()).toBe(aggregateId);
                    done();
                };
                agregates.listGet.restGetList();
            });
            it("should agregate remove from listGetEdit", function (done) {
                var agregatesSize = agregates.entities().length;
                agregate.postDelete = function () {
                    var isLeave = agregate.controlList.postDelete();
                    expect(agregates.entities().length).toBe(agregatesSize - 1);
                    done();
                    return isLeave;
                };
                agregate.controlEdit.deleteEntity(true);
            });
        });
    });
    spec_1.runSpec();
});
