import {AppModelSpec, expectArraySize, runSpec} from "kontext/sd/spec";
import {EntityControlEdit, EntityControlGet, EntityEditable, EntityEditRest, EntityGet, EntityList, EntityListable, EntityListEdit} from "kontext/sd/entities";
import {IUriSearch} from "kontext/sd/sd";
import {AggregateId, ID, IEntity} from "kontext/sd/types";
import {ListControlGet, ListControlGetEdit, ListEntityControl, ListEntityControlGetPageable, ListEntityGetPage} from "kontext/sd/entitylists";

declare let app: AppModelSpec;

export interface LinkProjection extends IEntity {
	name: string
}

export interface BirdProjection extends IEntity {
	name: string
}

export interface LeafProjection extends IEntity {
	name: string
	agregate: AggregateId
}

export interface AggregateProjection extends IEntity {
	name: string
	type: string
	link: LinkProjection | null
	leafs: LeafProjection[]
	birds: BirdProjection[]
}

new AppModelSpec();
describe("entities", () => {
	it("should AppModel initialised", app.spec.init);
	
	class Aggregate extends EntityControlGet<AggregateProjection> {
		options () {
			return {
				attributes: ["id", "name", "type", "link", "leafs", "birds"],
				links: {link: "links"},
				agregationLinks: {birds: "birds", leafs: "leafs"},
				name: "агрегат",
				genitive: "агрегата",
				urlEntity: "agregates",
				projection: "full"
			}
		}
	}
	
	class AggregateEdit extends Aggregate implements EntityEditable<AggregateProjection> {
		controlGet: EntityGet<AggregateProjection, AggregateEdit> = new EntityGet<AggregateProjection, AggregateEdit>(
				this);
		controlEdit: EntityEditRest<AggregateProjection, AggregateEdit> = new EntityEditRest<AggregateProjection, AggregateEdit>(
				this);
		
		postCreate (aggregate: AggregateProjection): boolean {
			return false;
		}
		
		postPut (aggregate: AggregateProjection): void {
		}
		
		postDelete (): boolean {
			return false;
		}
	}
	
	class Leaf extends EntityControlEdit<LeafProjection> {
		options () {
			return {
				attributes: ["id", "name", "agregate"],
				links: {agregate: "agregates"},
				name: "листок",
				genitive: "листка",
				urlEntity: "leaves",
				projection: "simple"
			}
		}
		
		postCreate (leaf: LeafProjection): boolean {
			return false;
		}
		
		postDelete (): boolean {
			return false;
		}
	}
	
	class Bird extends EntityControlEdit<BirdProjection> {
		options () {
			return {
				attributes: ["id", "name"],
				name: "птичка",
				genitive: "птички",
				urlEntity: "birds",
				projection: "simple"
			}
		}
		
		postCreate (bird: BirdProjection): boolean {
			return false;
		}
		
		postDelete (): boolean {
			return false;
		}
	}
	
	let aggregateEdit: AggregateEdit;
	let aggregateId: ID;
	let leaf: Leaf;
	let leafId: ID;
	let bird: Bird;
	let birdId: ID;
	let aggregate = new Aggregate();
	describe("EntityGet", () => {
		it("should get entity", (done) => {
			aggregate.postFill = (agregate: AggregateProjection) => {
				expect(agregate.name).toEqual("agregate1");
				done();
			};
			expect(aggregate.getAttributeValue("name")).toBeNull();
			aggregate.controlGet.restGet();
		});
		it("should entity obtained", (done) => {
			expect(aggregate.getAttributeValue("name")).toEqual("agregate1");
			let leafs = aggregate.getAttributeValue("leafs");
			expect(leafs).toBeDefined();
			expect(leafs).not.toBeNull();
			expect(leafs.length).toEqual(3);
			let birds = aggregate.getAttributeValue("birds");
			expect(birds).toBeDefined();
			expect(birds).not.toBeNull();
			expect(birds.length).toEqual(2);
			done();
		});
	});
	describe("EntityEditRest", () => {
		aggregateEdit = new AggregateEdit({
			id: null,
			name: "created",
			type: "enum2",
			link: {id: 2, name: "link2"},
			birds: [],
			leafs: []
		});
		it("should agregate created", (done) => {
			aggregateEdit.entys.type("enum3");
			aggregateEdit.entys.link({id: 2, name: "link2"});
			aggregateEdit.postCreate = (aggregate: AggregateProjection) => {
				aggregateId = <ID>aggregate.id;
				expect(aggregateId).not.toBeNull();
				expect(aggregate.link).not.toBeNull();
				if (aggregate.link) expect(aggregate.link.id).toEqual(2);
				done();
				return false;
			};
			aggregateEdit.controlEdit.save();
		});
		it("should agregate modified", (done) => {
			expect(aggregateId).toBeGreaterThan(0);
			expect(aggregateEdit.id()).toEqual(aggregateId);
			aggregateEdit.entys.link({id: 3, name: "link3"});
			aggregateEdit.entys.name("modified");
			aggregateEdit.entys.type("enum1");
			aggregateEdit.postPut = (agregate) => {
				expect(agregate.id).toEqual(aggregateId);
				expect(agregate.name).toEqual("modified");
				expect(agregate.link).not.toBeNull();
				if (agregate.link) {
					expect(agregate.link.id).toEqual(3);
					expect(agregate.link.name).toEqual("link3");
				}
				aggregate.postFill = (agregateGet) => {
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
		it("should leaf created", (done) => {
			let leafName = "Созданный в тесте листок агрегата id:" +
					aggregateEdit.id() +
					" " +
					aggregateEdit.entys.name();
			leaf = new Leaf({
				name: leafName, agregate: {id: aggregateEdit.id()}
			});
			leaf.postCreate = (leaf) => {
				leafId = <ID> leaf.id;
				expect(leafId).not.toBeNull();
				expect(leaf.agregate.id).toEqual(aggregateEdit.id());
				done();
				return false
			};
			leaf.controlEdit.save();
		});
		it("should bird created", (done) => {
			bird = new Bird({name: "птичка created"});
			bird.postCreate = (bird) => {
				birdId = <ID> bird.id;
				expect(bird.id).not.toBeNull();
				expect(bird.name).toEqual("птичка created");
				done();
				return false
			};
			bird.controlEdit.save();
		});
		it("should agregation birds added to agregate by saveAgregation", (done) => {
			aggregateEdit.entys.birds([{id: 1}, {id: birdId}]);
			aggregateEdit.controlEdit.postSaveAgregation = (request: XMLHttpRequest) => {
				expect(request.status).toBe(204);
				done();
			};
			aggregateEdit.controlEdit.saveAgregation("birds");
		});
		it("should agregateEdit obtained", (done) => {
			aggregateEdit.postFill = (agregate) => {
				expectArraySize(agregate.leafs, 1);
				expectArraySize(agregate.birds, 2);
				done();
			};
			aggregateEdit.controlGet.restGet(aggregateId);
		});
		it("should agregation birds do not added to agregate by save", (done) => {
			aggregateEdit.entys.birds().push({id: 3});
			aggregateEdit.postFill = () => {
			};
			aggregateEdit.postPut = (agregate) => {
				expect(agregate.name).toEqual("modified");
				expectArraySize(agregate.leafs, 1);
				expectArraySize(agregate.birds, 3);
				aggregate.postFill = (agregate) => {
					expect(aggregateEdit.id()).toEqual(aggregateId);
					expect(agregate.id).toEqual(aggregateId);
					expect(agregate.name).toEqual("modified");
					expect(agregate.type).toEqual("enum1");
					if (agregate.link) {
						expect(agregate.link.id).toEqual(3);
						expect(agregate.link.name).toEqual("link3");
					}
					expectArraySize(agregate.leafs, 1);
					expectArraySize(agregate.birds, 2);
					done();
				};
				aggregate.controlGet.restGet(aggregateId);
			};
			//FixMe Иногда вылетает Expected 'created' to equal 'modified'
			expect(aggregateEdit.entys.name()).toEqual("modified");
			aggregateEdit.controlEdit.save();
		});
		it("should agregation birds deleted", (done) => {
			aggregateEdit.entys.birds(null);
			aggregateEdit.controlEdit.postSaveAgregation = (request: XMLHttpRequest) => {
				expect(true).toBeTruthy();
				done();
			};
			aggregateEdit.controlEdit.saveAgregation("birds");
		});
		it("should bird deleted", (done) => {
			bird.postDelete = () => {
				expect(true).toBeTruthy();
				done();
				return false
			};
			bird.controlEdit.deleteEntity(true);
		});
		it("should leaf deleted", (done) => {
			leaf.postDelete = () => {
				expect(true).toBeTruthy();
				done();
				return false
			};
			leaf.controlEdit.deleteEntity(true);
		});
		it("should agregate deleted", (done) => {
			aggregateEdit.postDelete = () => {
				expect(true).toBeTruthy();
				done();
				return false
			};
			aggregateEdit.controlEdit.deleteEntity(true);
		});
	});
	describe("ListEntityGet", () => {
		class AgregateOfList extends Aggregate implements EntityListable<AggregateProjection> {
			controlList: EntityList<AggregateProjection, AgregateOfList> = new EntityList<AggregateProjection, AgregateOfList>(
					this);
		}
		
		let agregates = new ListControlGet<AggregateProjection, AgregateOfList>(AgregateOfList);
		it("should get list of entity", (done) => {
			agregates.postFillList = (entities) => {
				expect(entities).not.toBeNull();
				expect(Array.isArray(entities)).toBeTruthy();
				expect(entities.length).toBeGreaterThan(1);
				done();
			};
			agregates.listGet.restGetList();
		});
	});
	describe("ListEntityGetPage", () => {
		class BirdOfList extends Bird implements EntityListable<BirdProjection> {
			controlList: EntityList<BirdProjection, BirdOfList> = new EntityList<BirdProjection, BirdOfList>(
					this);
		}
		
		class BirdsListEntityGetPage extends ListEntityGetPage<BirdProjection, BirdOfList> {
			getSearch (): IUriSearch {
				return {
					find: "findByAgregateId", parameters: {agregateId: 3}
				}
			}
			
			getSize (): number {
				return 5;
			}
		}
		
		class Birds extends ListEntityControl<BirdProjection, BirdOfList> implements ListEntityControlGetPageable<BirdProjection, BirdOfList> {
			listGet = new BirdsListEntityGetPage(this);
		}
		
		let birds = new Birds(BirdOfList);
		let expects = (page: number | null,
				total: number | null,
				isLoaded: boolean,
				isLoadedFull: boolean,
				textLoaded: string,
				textLoadNext: string) => {
			let listGet = birds.listGet;
			expect(listGet.page()).toEqual(page);
			expect(listGet.total()).toEqual(total);
			expect(listGet.isLoaded()).toEqual(isLoaded);
			expect(listGet.isLoadedFull()).toEqual(isLoadedFull);
			expect(listGet.textLoaded()).toEqual(textLoaded);
			expect(listGet.textLoadNext()).toEqual(textLoadNext);
		};
		it("should get first page list of entity", (done) => {
			expects(null, null, false, false, "", "первые 5");
			birds.postAddList = (entities: BirdProjection[]) => {
				expects(0, 12, true, false, "5 из 12", "следующие 5");
				expect(entities).not.toBeNull();
				expect(Array.isArray(entities)).toBeTruthy();
				expect(entities.length).toEqual(5);
				expect(birds.entities().length).toEqual(5);
				done();
			};
			birds.listGet.restGetList();
		});
		it("should get second page to list of entity", (done) => {
			birds.postAddList = () => {
				expects(1, 12, true, false, "10 из 12", "последние 2");
				expect(birds.entities().length).toEqual(10);
				done();
			};
			birds.listGet.restGetList();
		});
		it("should get third page to list of entity", (done) => {
			birds.postAddList = () => {
				expects(2, 12, true, true, "12 из 12", "");
				expect(birds.entities().length).toEqual(12);
				done();
			};
			birds.listGet.restGetList();
		});
		it("should get not fourth page to list of entity", () => {
			birds.postAddList = (entities: BirdProjection[]) => {
				//если список будет получен, то возникнет исключение
				expect(entities.length).toEqual(0);
			};
			birds.listGet.restGetList();
			expect(birds.entities().length).toEqual(12);
		});
	});
	describe("ListEntityGetEdit", () => {
		class AgregateOfList extends Aggregate {
			controlList: EntityListEdit<AggregateProjection, AgregateOfList> = new EntityListEdit<AggregateProjection, AgregateOfList>(
					this);
			controlGet: EntityGet<AggregateProjection, AgregateOfList> = new EntityGet<AggregateProjection, AgregateOfList>(
					this);
			controlEdit: EntityEditRest<AggregateProjection, AgregateOfList> = new EntityEditRest<AggregateProjection, AgregateOfList>(
					this);
			
			postCreate (agregate: AggregateProjection): boolean {
				return this.controlList.postCreate(agregate);
			}
			
			postCancel (): void {
				return this.controlList.postCancel();
			}
			
			postDelete (): boolean {
				return this.controlList.postDelete();
			}
		}
		
		let agregates = new ListControlGetEdit<AggregateProjection, AgregateOfList>(AgregateOfList);
		it("should get listGetEdit of entity", (done) => {
			agregates.postFillList = (entities: AggregateProjection[]) => {
				expect(entities).not.toBeNull();
				expect(Array.isArray(entities)).toBeTruthy();
				expect(entities.length).toBeGreaterThan(1);
				done();
			};
			agregates.listGet.restGetList();
		});
		it("should agregate created in listGetEdit", (done) => {
			let agregatesSize = agregates.entities().length;
			agregates.listEdit.create();
			expect(agregates.entities().length).toBe(agregatesSize + 1);
			let creatingEntity = agregates.listEdit.creatingEntity();
			expect(creatingEntity).not.toBeNull();
			expect(creatingEntity).not.toBeUndefined();
			if (creatingEntity) {
				expect(creatingEntity instanceof AgregateOfList).toBeTruthy();
				expect(creatingEntity.controlEdit.isNew()).toBeTruthy();
				expect(agregates.entities()[0] === creatingEntity).toBeTruthy();
				creatingEntity.entys.name("created in listGetEdit");
				creatingEntity.postCreate = (agregate: AggregateProjection) => {
					let isLeave = (<AgregateOfList>creatingEntity).controlList.postCreate(agregate);
					aggregateId = <ID>agregate.id;
					expect(aggregateId).toBeGreaterThan(0);
					expect(agregate.name).toBe("created in listGetEdit");
					done();
					return isLeave
				};
				creatingEntity.controlEdit.save();
			}
		});
		it("should agregate canceled", (done) => {
			let agregatesSize = agregates.entities().length;
			agregates.listEdit.create();
			let creatingEntity = agregates.listEdit.creatingEntity();
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
		let agregate: AgregateOfList;
		it("should created agregate found in listGetEdit", (done) => {
			agregates.postFillList = (entities: AggregateProjection[]) => {
				expect(entities.length).toBeGreaterThan(1);
				agregate = agregates.entities()
						.filter((value: AgregateOfList) => value.id() === aggregateId)[0];
				expect(agregate).not.toBeNull();
				expect(agregate.id()).toBe(aggregateId);
				done()
			};
			agregates.listGet.restGetList();
		});
		it("should agregate remove from listGetEdit", (done) => {
			let agregatesSize = agregates.entities().length;
			agregate.postDelete = () => {
				let isLeave = (<AgregateOfList>agregate).controlList.postDelete();
				expect(agregates.entities().length).toBe(agregatesSize - 1);
				done();
				return isLeave
			};
			agregate.controlEdit.deleteEntity(true);
		});
	});
});
runSpec();
