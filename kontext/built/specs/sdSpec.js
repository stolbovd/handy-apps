define(["require", "exports", "kontext/sd/sd", "kontext/sd/spec", "knockout"], function (require, exports, sd_1, spec_1, knockout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe("sd", function () {
        var testObj = {
            str: "привет", int: 1, bool: true, nul: null, arr: [1, 2],
            obj: {
                attrStr: "просто строка",
                attrStrBracket: "hello (world)",
                "Физкультура (шахматы)": "есть",
                attrFunc: function () { return "world"; },
                attrFuncObj: function () {
                    return { attr: 1 };
                }
            }, funcSimple: function () {
                return "ok";
            }, funcNull: function () {
                return null;
            }, funcPar: function (par) {
                if (par === undefined) {
                    throw new Error("отсутствует параметр в функции funcPar");
                }
                return "hello " + par;
            }
        };
        describe(".getProperty", function () {
            it("should get simple attributes", function () {
                expect(sd_1.getProperty(testObj, "nul")).toBeNull();
                expect(sd_1.getProperty(testObj, "str")).toEqual(testObj.str);
                expect(sd_1.getProperty(testObj, "int")).toEqual(testObj.int);
                expect(sd_1.getProperty(testObj, "bool")).toBeTruthy();
                expect(Array.isArray(sd_1.getProperty(testObj, "arr"))).toBeTruthy();
                expect(sd_1.getProperty(testObj, "arr")).toContain(testObj.arr[1]);
                expect(typeof sd_1.getProperty(testObj, "obj")).toEqual("object");
            });
            it("should get function attributes", function () {
                expect(sd_1.getProperty(testObj, "funcSimple()")).toEqual(testObj.funcSimple());
                expect(typeof sd_1.getProperty(testObj, "funcPar")).toEqual("function");
                expect(sd_1.getProperty(testObj, "funcPar"))
                    .toThrowError("отсутствует параметр в функции funcPar");
                try {
                    sd_1.getProperty(testObj, "funcPar()");
                }
                catch (error) {
                    expect(error.message).toEqual("отсутствует параметр в функции funcPar");
                }
                var funcPar = sd_1.getProperty(testObj, "funcPar");
                expect(funcPar("World")).toEqual("hello World");
                expect(funcPar).toThrowError("отсутствует параметр в функции funcPar");
            });
            it("should get compound attributes", function () {
                expect(sd_1.getProperty(testObj, "obj.attrStr")).toEqual(testObj.obj.attrStr);
                expect(sd_1.getProperty(testObj, "obj.attrStrBracket")).toEqual(testObj.obj.attrStrBracket);
            });
            it("should get compound difficult attributes with bracket", function () {
                var attrName = "Физкультура (шахматы)";
                expect(testObj.obj[attrName]).toBeDefined();
                expect(testObj.obj[attrName]).toEqual("есть");
                expect(sd_1.getProperty(testObj.obj, attrName)).toEqual("есть");
            });
            it("should get compound function attributes", function () {
                expect(typeof sd_1.getProperty(testObj, "obj.attrFunc")).toEqual("function");
                expect(sd_1.getProperty(testObj, "obj.attrFunc")).toEqual(testObj.obj.attrFunc);
                expect(sd_1.getProperty(testObj, "obj.attrFunc()")).toEqual(testObj.obj.attrFunc());
                expect(sd_1.getProperty(testObj, "obj.attrFuncObj().attr"))
                    .toEqual(testObj.obj.attrFuncObj().attr);
            });
            it("should get ifNull", function () {
                expect(sd_1.getProperty(testObj, "str1", "isnull")).toEqual("isnull");
                expect(sd_1.getProperty(testObj, "nul", "isnull")).toEqual("isnull");
                expect(sd_1.getProperty(testObj, "funcNull()", "isnull")).toEqual("isnull");
            });
            it("should throw Exception", function () {
                try {
                    sd_1.getProperty(undefined, "str");
                }
                catch (error) {
                    expect(error.message).toEqual("Ошибка в sd.getProperty(): objectVar не определен");
                }
                try {
                    sd_1.getProperty(null, "str");
                }
                catch (error) {
                    expect(error.message).toEqual("Ошибка в sd.getProperty(): objectVar не определен");
                }
                try {
                    sd_1.getProperty(testObj, "str()");
                }
                catch (error) {
                    expect(error.message)
                        .toEqual("Ошибка в sd.getProperty(): str в выражении str() не является функцией: по факту string");
                }
            });
            it("should propertyString not actual", function () {
                expect(sd_1.getProperty(testObj, "")).toEqual(testObj);
                expect(sd_1.getProperty(testObj, "str1")).toBeUndefined();
                expect(sd_1.getProperty(testObj, "()")).toBeUndefined();
            });
        });
        describe(".getTryProperty", function () {
            it("should get without exception", function () {
                expect(sd_1.tryGetProperty(testObj, "nul")).toBeNull();
                expect(sd_1.tryGetProperty(testObj, "str")).toEqual(testObj.str);
                expect(sd_1.tryGetProperty(testObj, "funcSimple()")).toEqual(testObj.funcSimple());
            });
            it("should get with exception", function () {
                expect(sd_1.tryGetProperty(undefined, "str")).toBeUndefined();
                expect(sd_1.tryGetProperty(null, "str")).toBeUndefined();
                expect(sd_1.tryGetProperty(testObj, "str()")).toBeUndefined();
                expect(sd_1.tryGetProperty(testObj, "funcPar()")).toBeUndefined();
            });
            it("should get with exceptionHandler", function () {
                var i = 0;
                var exceptionHandler = function (error) {
                    expect(error).toBeDefined();
                    i++;
                };
                expect(sd_1.tryGetProperty(undefined, "str", exceptionHandler)).toBeUndefined();
                expect(i).toEqual(1);
                expect(sd_1.tryGetProperty(testObj, "str()", exceptionHandler)).toBeUndefined();
                expect(i).toEqual(2);
                expect(sd_1.tryGetProperty(null, "str", function () {
                    return "str2";
                }))
                    .toEqual("str2");
                expect(sd_1.tryGetProperty(testObj, "funcPar()", function (error) {
                    return error.message;
                }))
                    .toEqual("отсутствует параметр в функции funcPar");
            });
            it("should get with ifNull & exceptionHandler", function () {
                var result = sd_1.tryGetProperty(testObj, "str1", "isnull");
                expect(result).toEqual("isnull");
                result = sd_1.tryGetProperty(undefined, "str", "isnull");
                expect(result).toEqual("isnull");
                var i = 0;
                result = sd_1.tryGetProperty(undefined, "str", "ifnull", function (error) {
                    expect(error).toBeDefined();
                    i++;
                });
                expect(result).toBeUndefined();
                expect(i).toEqual(1);
                result = sd_1.tryGetProperty(undefined, "str", "ifnull", function (error, ifNull) {
                    return ifNull;
                });
                expect(result).toEqual("ifnull");
            });
        });
        describe(".Uri", function () {
            it("should constructor", function () {
                expect(sd_1.sd.uri("rest")).toEqual("/rest");
                expect(sd_1.sd.uri(knockout_1.observable("rest"), { par: 1 })).toEqual("/rest?par=1");
                expect(sd_1.sd.uri("rest", { par: 1 })).toEqual("/rest?par=1");
                try {
                    new sd_1.Uri("");
                    expect(false).toBeTruthy();
                }
                catch (error) {
                    expect(error.message).toEqual("Ошибка при инициализации Uri: uri не определен");
                }
            });
            it("should add path", function () {
                var url = new sd_1.Uri("rest", { par: 1 });
                expect("" + url.withPath("search/findByName")).toEqual("/rest/search/findByName?par=1");
                try {
                    url.withPath("");
                }
                catch (error) {
                    expect(error.message).toEqual("Ошибка в Uri.withPath(): pathAdd не определен");
                }
            });
            it("should set parameter(s)", function () {
                var url = new sd_1.Uri("rest");
                url = url.withParameter("par", "1");
                expect("" + url).toEqual("/rest?par=1");
                expect("" + url.withParameter("par", "dev укблрм"))
                    .toEqual("/rest?par=dev%20%D1%83%D0%BA%D0%B1%D0%BB%D1%80%D0%BC");
                expect("" + url.withParameters({ par: "" })).toEqual("/rest");
                try {
                    var uri = new sd_1.Uri("rest");
                    uri = uri.withParameter("", 1);
                    expect(uri).toBeTruthy();
                }
                catch (error) {
                    expect(error.message)
                        .toEqual("Ошибка в Uri.setParameter(): parameter не определен");
                }
            });
            it("should fragment", function () {
                var url = new sd_1.Uri(knockout_1.observable("rest/"), { par: 1 });
                expect(url.toFragment("привет")).toEqual("/rest?par=1#привет");
                try {
                    var url_1 = new sd_1.Uri("rest");
                    url_1.toFragment("");
                    expect(false).toBeTruthy();
                }
                catch (error) {
                    expect(error.message).toEqual("Ошибка в Uri.toFragment(): fragment не определен");
                }
            });
            it("should full init", function () {
                var url = new sd_1.Uri("rest", { par: 1, searchText: "привет мир", empty: "" });
                url = url.withParameter("size", 100);
                url = url.withParameters({ par: 2, page: 1 });
                url = url.withPath("search/findByName");
                expect(url.toFragment("привет"))
                    .toEqual("/rest/search/findByName?par=2&searchText=%D0%BF%D1%80%D0%B8%D0%B2%D0%B5%D1%82%20%D0%BC%D0%B8%D1%80&size=100&page=1#привет");
            });
            it("should clone uri", function () {
                var url = new sd_1.Uri("rest", { par: 1, searchText: "hello", empty: "" });
                var urlClone = sd_1.sd.uri(url, { size: 100 });
                expect(urlClone + "").toEqual("/rest?par=1&searchText=hello&size=100");
                expect(url + "").toEqual("/rest?par=1&searchText=hello");
                urlClone = url.withPath("search/findByName") + "";
                url = url.withParameters({ par: 2, page: 1 });
                expect(urlClone).toEqual("/rest/search/findByName?par=1&searchText=hello");
                expect(url + "").toEqual("/rest?par=2&searchText=hello&page=1");
            });
            it("should as value object", function () {
                var url = new sd_1.Uri("rest", { par: 1, searchText: "hello", empty: "" });
                var url2 = url.withParameters({ size: 100 });
                expect(url2 + "").toEqual("/rest?par=1&searchText=hello&size=100");
                expect(url + "").toEqual("/rest?par=1&searchText=hello");
                var url3 = url2.withPath("search/findByName");
                url = url.withParameters({ par: 2, page: 1 });
                expect(url3 + "").toEqual("/rest/search/findByName?par=1&searchText=hello&size=100");
                expect(url2 + "").toEqual("/rest?par=1&searchText=hello&size=100");
                expect(url + "").toEqual("/rest?par=2&searchText=hello&page=1");
            });
            it("should constructor & addPath by array", function () {
                var url = new sd_1.Uri(["rest", "data"]);
                expect(url.toString()).toEqual("/rest/data");
                url = url.withPath(["codificators", 1]);
                expect(url.toString()).toEqual("/rest/data/codificators/1");
            });
            it("should constructor & addPath by string with solid", function () {
                var url = new sd_1.Uri("/rest/data/");
                expect(url.toString()).toEqual("/rest/data");
                url = url.withPath(["codificators/second/", 1]);
                expect(url.toString()).toEqual("/rest/data/codificators/second/1");
            });
        });
        describe(".Deferreds", function () {
            it("should kr.pupils sorted by klasses", function (done) {
                var kr = {
                    klassUchPrograms: [{ id: 686, klass: { sname: "5А" } }, { id: 704, klass: { sname: "5Б" } }]
                };
                var deferreds = new sd_1.Deferreds();
                var pupilKups = {};
                for (var _i = 0, _a = kr.klassUchPrograms; _i < _a.length; _i++) {
                    var klassUchProgram = _a[_i];
                    deferreds.add();
                    (function (klassUchProgram) {
                        sd_1.sd.get("/rest/klassuchprograms/" + klassUchProgram.id + "/pupils", function (pupilsLoaded) {
                            pupilKups[klassUchProgram.id + ""] = pupilsLoaded;
                            deferreds.resolve();
                        });
                    })(klassUchProgram);
                }
                deferreds.done(function () {
                    expect(pupilKups["686"].length).toEqual(23);
                    expect(pupilKups["704"].length).toEqual(26);
                    done();
                });
                expect(deferreds.size()).toEqual(2);
            });
        });
        describe("tools", function () {
            it("should enumsToStrings is working", function () {
                var EnumTest;
                (function (EnumTest) {
                    EnumTest[EnumTest["e1"] = 0] = "e1";
                    EnumTest[EnumTest["e2"] = 1] = "e2";
                    EnumTest[EnumTest["e3"] = 2] = "e3";
                })(EnumTest || (EnumTest = {}));
                var enums = sd_1.enumsToStrings(EnumTest);
                spec_1.expectArraySize(enums, 3);
                spec_1.expectArrayEqual(enums, ["e1", "e2", "e3"]);
            });
        });
    });
    spec_1.runSpec();
});
