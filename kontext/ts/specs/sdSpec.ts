import {Deferreds, enumsToStrings, getProperty, sd, tryGetProperty, Uri} from "kontext/sd/sd";
import {expectArrayEqual, expectArraySize, runSpec} from "kontext/sd/spec";
import {Map} from "kontext/sd/types";
import {observable} from "knockout";
describe("sd", () => {
	interface Attr {
		attr: number
	}
	let testObj = {
		str: "привет", int: 1, bool: true, nul: null, arr: [1, 2], obj: {
			attrStr: "просто строка",
			attrStrBracket: "hello (world)",
			"Физкультура (шахматы)": "есть",
			attrFunc: () => "world",
			attrFuncObj: (): Attr => {
				return {attr: 1}
			}
		}, funcSimple: () => {
			return "ok";
		}, funcNull: () => {
			return null;
		}, funcPar: (par: any): string => {
			if (par === undefined) {
				throw new Error("отсутствует параметр в функции funcPar");
			}
			return "hello " + par
		}
	};
	describe(".getProperty", () => {
		it("should get simple attributes", () => {
			expect(getProperty(testObj, "nul")).toBeNull();
			expect(getProperty(testObj, "str")).toEqual(testObj.str);
			expect(getProperty(testObj, "int")).toEqual(testObj.int);
			expect(getProperty(testObj, "bool")).toBeTruthy();
			expect(Array.isArray(getProperty(testObj, "arr"))).toBeTruthy();
			expect(getProperty(testObj, "arr")).toContain(testObj.arr[1]);
			expect(typeof getProperty(testObj, "obj")).toEqual("object");
		});
		it("should get function attributes", () => {
			expect(getProperty(testObj, "funcSimple()")).toEqual(testObj.funcSimple());
			expect(typeof getProperty(testObj, "funcPar")).toEqual("function");
			expect(getProperty(testObj, "funcPar"))
					.toThrowError("отсутствует параметр в функции funcPar");
			try {
				getProperty(testObj, "funcPar()")
			} catch (error) {
				expect(error.message).toEqual("отсутствует параметр в функции funcPar");
			}
			let funcPar = getProperty<(par: any) => string>(testObj, "funcPar");
			expect(funcPar("World")).toEqual("hello World");
			expect(funcPar).toThrowError("отсутствует параметр в функции funcPar");
		});
		it("should get compound attributes", () => {
			expect(getProperty(testObj, "obj.attrStr")).toEqual(testObj.obj.attrStr);
			expect(getProperty(testObj, "obj.attrStrBracket")).toEqual(testObj.obj.attrStrBracket);
		});
		it("should get compound difficult attributes with bracket", () => {
			let attrName = "Физкультура (шахматы)";
			expect((<any>testObj).obj[attrName]).toBeDefined();
			expect((<any>testObj).obj[attrName]).toEqual("есть");
			expect(getProperty(testObj.obj, attrName)).toEqual("есть");
		});
		it("should get compound function attributes", () => {
			expect(typeof getProperty(testObj, "obj.attrFunc")).toEqual("function");
			expect(getProperty(testObj, "obj.attrFunc")).toEqual(testObj.obj.attrFunc);
			expect(getProperty(testObj, "obj.attrFunc()")).toEqual(testObj.obj.attrFunc());
			expect(getProperty(testObj, "obj.attrFuncObj().attr"))
					.toEqual(testObj.obj.attrFuncObj().attr);
		});
		it("should get ifNull", () => {
			expect(getProperty(testObj, "str1", "isnull")).toEqual("isnull");
			expect(getProperty(testObj, "nul", "isnull")).toEqual("isnull");
			expect(getProperty(testObj, "funcNull()", "isnull")).toEqual("isnull");
		});
		it("should throw Exception", () => {
			try {
				getProperty(undefined, "str");
			} catch (error) {
				expect(error.message).toEqual("Ошибка в sd.getProperty(): objectVar не определен");
			}
			try {
				getProperty(null, "str");
			} catch (error) {
				expect(error.message).toEqual("Ошибка в sd.getProperty(): objectVar не определен");
			}
			try {
				getProperty(testObj, "str()");
			} catch (error) {
				expect(error.message)
						.toEqual(
								"Ошибка в sd.getProperty(): str в выражении str() не является функцией: по факту string");
			}
		});
		it("should propertyString not actual", () => {
			expect(getProperty(testObj, "")).toEqual(testObj);
			expect(getProperty(testObj, "str1")).toBeUndefined();
			expect(getProperty(testObj, "()")).toBeUndefined();
		});
	});
	describe(".getTryProperty", () => {
		it("should get without exception", () => {
			expect(tryGetProperty(testObj, "nul")).toBeNull();
			expect(tryGetProperty(testObj, "str")).toEqual(testObj.str);
			expect(tryGetProperty(testObj, "funcSimple()")).toEqual(testObj.funcSimple());
		});
		it("should get with exception", () => {
			expect(tryGetProperty(undefined, "str")).toBeUndefined();
			expect(tryGetProperty(null, "str")).toBeUndefined();
			expect(tryGetProperty(testObj, "str()")).toBeUndefined();
			expect(tryGetProperty(testObj, "funcPar()")).toBeUndefined();
		});
		it("should get with exceptionHandler", () => {
			let i = 0;
			let exceptionHandler = (error: any) => {
				expect(error).toBeDefined();
				i++;
			};
			expect(tryGetProperty(undefined, "str", exceptionHandler)).toBeUndefined();
			expect(i).toEqual(1);
			expect(tryGetProperty(testObj, "str()", exceptionHandler)).toBeUndefined();
			expect(i).toEqual(2);
			expect(tryGetProperty(null, "str", () => {
				return "str2"
			}))
					.toEqual("str2");
			expect(tryGetProperty(testObj, "funcPar()", (error: any) => {
				return error.message;
			}))
					.toEqual("отсутствует параметр в функции funcPar");
		});
		it("should get with ifNull & exceptionHandler", () => {
			let result = tryGetProperty(testObj, "str1", "isnull");
			expect(result).toEqual("isnull");
			result = tryGetProperty(undefined, "str", "isnull");
			expect(result).toEqual("isnull");
			let i = 0;
			result = tryGetProperty(undefined, "str", "ifnull", (error: any) => {
				expect(error).toBeDefined();
				i++;
			});
			expect(result).toBeUndefined();
			expect(i).toEqual(1);
			result = tryGetProperty(undefined, "str", "ifnull", (error: any, ifNull: any) => {
				return ifNull;
			});
			expect(result).toEqual("ifnull");
		});
	});
	describe(".Uri", () => {
		it("should constructor", () => {
			expect(sd.uri("rest")).toEqual("/rest");
			expect(sd.uri(observable("rest"), {par: 1})).toEqual("/rest?par=1");
			expect(sd.uri("rest", {par: 1})).toEqual("/rest?par=1");
			try {
				new Uri("");
				expect(false).toBeTruthy();
			} catch (error) {
				expect(error.message).toEqual("Ошибка при инициализации Uri: uri не определен");
			}
		});
		it("should add path", () => {
			let url = new Uri("rest", {par: 1});
			expect("" + url.withPath("search/findByName")).toEqual("/rest/search/findByName?par=1");
			try {
				url.withPath("");
			} catch (error) {
				expect(error.message).toEqual("Ошибка в Uri.withPath(): pathAdd не определен");
			}
		});
		it("should set parameter(s)", () => {
			let url = new Uri("rest");
			url = url.withParameter("par", "1");
			expect("" + url).toEqual("/rest?par=1");
			expect("" + url.withParameter("par", "dev укблрм"))
					.toEqual("/rest?par=dev%20%D1%83%D0%BA%D0%B1%D0%BB%D1%80%D0%BC");
			expect("" + url.withParameters({par: ""})).toEqual("/rest");
			try {
				let uri = new Uri("rest");
				uri = uri.withParameter("", 1);
				expect(uri).toBeTruthy();
			} catch (error) {
				expect(error.message)
						.toEqual("Ошибка в Uri.setParameter(): parameter не определен");
			}
		});
		it("should fragment", () => {
			let url = new Uri(observable("rest/"), {par: 1});
			expect(url.toFragment("привет")).toEqual("/rest?par=1#привет");
			try {
				let url = new Uri("rest");
				url.toFragment("");
				expect(false).toBeTruthy();
			} catch (error) {
				expect(error.message).toEqual("Ошибка в Uri.toFragment(): fragment не определен");
			}
		});
		it("should full init", () => {
			let url = new Uri("rest", {par: 1, searchText: "привет мир", empty: ""});
			url = url.withParameter("size", 100);
			url = url.withParameters({par: 2, page: 1});
			url = url.withPath("search/findByName");
			expect(url.toFragment("привет"))
					.toEqual(
							"/rest/search/findByName?par=2&searchText=%D0%BF%D1%80%D0%B8%D0%B2%D0%B5%D1%82%20%D0%BC%D0%B8%D1%80&size=100&page=1#привет");
		});
		it("should clone uri", () => {
			let url = new Uri("rest", {par: 1, searchText: "hello", empty: ""});
			let urlClone = sd.uri(url, {size: 100});
			expect(urlClone + "").toEqual("/rest?par=1&searchText=hello&size=100");
			expect(url + "").toEqual("/rest?par=1&searchText=hello");
			urlClone = url.withPath("search/findByName") + "";
			url = url.withParameters({par: 2, page: 1});
			expect(urlClone).toEqual("/rest/search/findByName?par=1&searchText=hello");
			expect(url + "").toEqual("/rest?par=2&searchText=hello&page=1");
		});
		it("should as value object", () => {
			let url = new Uri("rest", {par: 1, searchText: "hello", empty: ""});
			let url2 = url.withParameters({size: 100});
			expect(url2 + "").toEqual("/rest?par=1&searchText=hello&size=100");
			expect(url + "").toEqual("/rest?par=1&searchText=hello");
			let url3 = url2.withPath("search/findByName");
			url = url.withParameters({par: 2, page: 1});
			expect(url3 + "").toEqual("/rest/search/findByName?par=1&searchText=hello&size=100");
			expect(url2 + "").toEqual("/rest?par=1&searchText=hello&size=100");
			expect(url + "").toEqual("/rest?par=2&searchText=hello&page=1");
		});
		it("should constructor & addPath by array", () => {
			let url = new Uri(["rest", "data"]);
			expect(url.toString()).toEqual("/rest/data");
			url = url.withPath(["codificators", 1]);
			expect(url.toString()).toEqual("/rest/data/codificators/1");
		});
		it("should constructor & addPath by string with solid", () => {
			let url = new Uri("/rest/data/");
			expect(url.toString()).toEqual("/rest/data");
			url = url.withPath(["codificators/second/", 1]);
			expect(url.toString()).toEqual("/rest/data/codificators/second/1");
		});
	});
	describe(".Deferreds", () => {
		it("should kr.pupils sorted by klasses", (done) => {
			let kr = {
				klassUchPrograms: [{id: 686, klass: {sname: "5А"}}, {id: 704, klass: {sname: "5Б"}}]
			};
			let deferreds = new Deferreds();
			let pupilKups: Map<any[]> = {};
			for (let klassUchProgram of kr.klassUchPrograms) {
				deferreds.add();
				((klassUchProgram: any) => {
					sd.get("/rest/klassuchprograms/" + klassUchProgram.id + "/pupils",
							(pupilsLoaded: any[]) => {
								pupilKups[klassUchProgram.id + ""] = pupilsLoaded;
								deferreds.resolve();
							});
				})(klassUchProgram);
			}
			deferreds.done(() => {
				expect(pupilKups["686"].length).toEqual(23);
				expect(pupilKups["704"].length).toEqual(26);
				done();
			});
			expect(deferreds.size()).toEqual(2);
		});
	});
	describe("tools", () => {
		it("should enumsToStrings is working", () => {
			enum EnumTest {
				e1, e2, e3
			}
			let enums: string[] = enumsToStrings(EnumTest);
			expectArraySize(enums, 3);
			expectArrayEqual(enums, ["e1", "e2", "e3"]);
		});
	});
});
runSpec();
