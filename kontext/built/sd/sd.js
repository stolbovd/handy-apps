define(["require", "exports", "toastr", "kontext/sd/types", "knockout"], function (require, exports, toastr, types_1, knockout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.clickElement = exports.watch = exports.Deferreds = exports.Deffered = exports.Uri = exports.dateRuLL = exports.SDate = exports.sd = exports.setProperty = exports.getPropertyValue = exports.tryGetProperty = exports.getProperty = exports.isProperty = exports.nvl = exports.isEmpty = exports.htmlToDivJQ = exports.wrapTag = exports.simplifyStringRussian = exports.simplifyString = exports.getRegExp = exports.enumsToStrings = exports.enumToString = exports.famNameSec = exports.personFIO = exports.parseIntElseZero = exports.capitalizeFirstLetter = exports.MapEntity = exports.arrayObjectsSort = exports.sort = exports.isArrayEmpty = exports.arrayRemove = exports.getArrayElementById = exports.getArrayElementByAttr = exports.round = exports.momentFormat = void 0;
    exports.momentFormat = "YYYY-MM-DDTHH:mm:ss";
    //PART numbers
    function round(value, precision) {
        return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
    }
    exports.round = round;
    //PART Arrays
    function getArrayElementByAttr(array, value, property) {
        for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
            var element = array_1[_i];
            if (getProperty(element, property) == value)
                return element;
        }
        return undefined;
    }
    exports.getArrayElementByAttr = getArrayElementByAttr;
    function getArrayElementById(array, id) {
        return getArrayElementByAttr(array, id, "id");
    }
    exports.getArrayElementById = getArrayElementById;
    function arrayRemove(array, predicat) {
        if (Array.isArray(array) && typeof predicat === "function") {
            for (var i = 0; i < array.length; i++)
                if (predicat(array[i])) {
                    array.splice(i, 1);
                    i--;
                }
        }
        else {
            console.log("array не является массивом в arrayRemove");
        }
    }
    exports.arrayRemove = arrayRemove;
    function isArrayEmpty(array) {
        return !Array.isArray(array) || array.length === 0;
    }
    exports.isArrayEmpty = isArrayEmpty;
    function sort(left, right, desc) {
        return left === right ? 0 : desc ? (left > right ? -1 : 1) : (left < right ? -1 : 1);
    }
    exports.sort = sort;
    function arrayObjectsSort(array, attributes) {
        return array.sort(function (left, right) {
            for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
                var attribute = attributes_1[_i];
                var desc = false;
                if (attribute.substr(0, 1) == "!") {
                    attribute = attribute.substr(1, attribute.length - 1);
                    desc = true;
                }
                var compare = sort(getProperty(left, attribute, null), getProperty(right, attribute, null), desc);
                if (compare != 0) {
                    return compare;
                }
            }
            return 0;
        });
    }
    exports.arrayObjectsSort = arrayObjectsSort;
    var MapEntity = /** @class */ (function () {
        function MapEntity() {
            this.entities = {};
        }
        MapEntity.prototype.push = function (entity) {
            var id = types_1.idToString(entity.id);
            if (!this.entities.hasOwnProperty(id))
                this.entities[id] = entity;
        };
        MapEntity.prototype.keys = function () {
            return Object.keys(this.entities);
        };
        MapEntity.prototype.values = function () {
            var values = [];
            for (var _i = 0, _a = this.keys(); _i < _a.length; _i++) {
                var key = _a[_i];
                values.push(this.entities[key]);
            }
            return values;
        };
        MapEntity.prototype.fill = function (data) {
            this.entities = {};
            if (!isArrayEmpty(data)) {
                for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                    var entity = data_1[_i];
                    this.push(entity);
                }
            }
        };
        MapEntity.prototype.sortedValues = function (attributes) {
            return arrayObjectsSort(this.values(), attributes);
        };
        return MapEntity;
    }());
    exports.MapEntity = MapEntity;
    //PART обработка строк
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    exports.capitalizeFirstLetter = capitalizeFirstLetter;
    function parseIntElseZero(parsedValue) {
        var intValue = parseInt(parsedValue);
        if (isNaN(intValue))
            intValue = 0;
        return intValue;
    }
    exports.parseIntElseZero = parseIntElseZero;
    function personFIO(person) {
        return person == null ? "" : famNameSec(person.family, person.name, person.secName);
    }
    exports.personFIO = personFIO;
    function famNameSec(family, name, secName) {
        return family +
            (isEmpty(name) ?
                "" :
                (" " + name + ((secName == null || secName === "") ? "" : " " + secName)));
    }
    exports.famNameSec = famNameSec;
    function enumToString(enumValue) {
        return enumValue.replace("_", " ");
    }
    exports.enumToString = enumToString;
    function enumsToStrings(enums) {
        return Object.keys(enums)
            .map(function (key) { return enums[key]; })
            .filter(function (key) { return typeof key === "string"; });
    }
    exports.enumsToStrings = enumsToStrings;
    function getRegExp(str, regExp, argument) {
        if (str == null) {
            return null;
        }
        var resultArray = str.match(regExp);
        return (resultArray == null || resultArray.length < argument) ?
            null :
            resultArray[argument - 1];
    }
    exports.getRegExp = getRegExp;
    function simplifyString(str) {
        var simplifyString = str + "";
        return simplifyString.replace(" ", "").toLowerCase();
    }
    exports.simplifyString = simplifyString;
    function simplifyStringRussian(str) {
        var russianString = simplifyString(str);
        var replaces = {
            "ё": "е",
            "e": "е",
            "o": "о",
            "p": "р",
            "a": "а",
            "h": "н",
            "t": "т",
            "k": "к",
            "x": "х",
            "b": "в",
            "m": "м"
        };
        for (var symbol in replaces)
            russianString = russianString.replace(symbol, replaces[symbol]);
        return russianString;
    }
    exports.simplifyStringRussian = simplifyStringRussian;
    function wrapTag(html, tag) {
        return "<" + tag + ">" + html + ("</" + tag + ">");
    }
    exports.wrapTag = wrapTag;
    function htmlToDivJQ(html) {
        return $.fn.append.apply($("<div>"), $(html));
    }
    exports.htmlToDivJQ = htmlToDivJQ;
    //PART обработка пустых значений
    function isEmpty(value) {
        return (!value);
    }
    exports.isEmpty = isEmpty;
    function nvl(value, ifnull, callback) {
        if (value == null) {
            return ifnull;
        }
        else {
            if (callback) {
                return callback(value);
            }
            else {
                return value;
            }
        }
    }
    exports.nvl = nvl;
    //PART обработка свойств объекта
    function isProperty(objectVar, propertyString) {
        return getProperty(objectVar, propertyString, "#Netданных") !== "#Netданных";
    }
    exports.isProperty = isProperty;
    function getProperty(objectVar, propertyString, ifNull) {
        if (typeof objectVar === "function")
            objectVar = objectVar();
        if (ifNull === undefined && objectVar == null) {
            throw new Error("Ошибка в sd.getProperty(): objectVar не определен");
        }
        else {
            if (propertyString != null && objectVar != null && typeof objectVar === "object") {
                if (typeof propertyString !== "string") {
                    throw new Error("Ошибка в sd.getProperty(): propertyString не является строкой: " +
                        typeof propertyString);
                }
                else {
                    if (propertyString !== "") {
                        var propertyList = propertyString.split(".");
                        for (var _i = 0, propertyList_1 = propertyList; _i < propertyList_1.length; _i++) {
                            var prop = propertyList_1[_i];
                            var property = prop.trim();
                            var isFunction = (property.substr(property.length - 2, 2) === "()");
                            if (isFunction)
                                property = property.substr(0, property.length - 2);
                            if (property in objectVar) {
                                if (isFunction) {
                                    if (typeof objectVar[property] === "function") {
                                        objectVar = objectVar[property]();
                                    }
                                    else {
                                        throw new Error("Ошибка в sd.getProperty(): " +
                                            property +
                                            " в выражении " +
                                            propertyString +
                                            " не является функцией: по факту " +
                                            typeof objectVar[property]);
                                    }
                                }
                                else {
                                    objectVar = objectVar[property];
                                }
                            }
                            else {
                                objectVar = undefined;
                            }
                            if (objectVar == null) {
                                break;
                            }
                        }
                    }
                }
            }
        }
        return (ifNull === undefined) ? objectVar : (objectVar == null) ? ifNull : objectVar;
    }
    exports.getProperty = getProperty;
    function tryGetProperty(objectVar, propertyString, ifError, fail) {
        if (typeof ifError === "function" && fail === undefined) {
            fail = ifError;
            ifError = undefined;
        }
        try {
            return getProperty(objectVar, propertyString, (fail === undefined) ? ifError : undefined);
        }
        catch (error) {
            if (typeof fail === "function") {
                return fail(error, ifError);
            }
            else {
                return ifError;
            }
        }
    }
    exports.tryGetProperty = tryGetProperty;
    function getPropertyValue(objectVar, propertyString, ifNull) {
        var value = getProperty(objectVar, propertyString, ifNull);
        return (typeof value === "function") ? value() : value;
    }
    exports.getPropertyValue = getPropertyValue;
    function setProperty(owner, association, value) {
        var property = getProperty(owner, association);
        if (typeof property === "function") {
            property(value);
        }
        else {
            if (typeof owner === "function")
                owner = owner();
            owner[association] = value;
        }
    }
    exports.setProperty = setProperty;
    var sd;
    (function (sd) {
        function fail(error) {
            var response = (isProperty(error, "responseJSON")) ? (Array.isArray(error.responseJSON) ? {
                path: "Сообщение от сервера:",
                status: error.status,
                error: error.statusText,
                message: error.responseJSON.toString()
            } : error.responseJSON) : {
                path: "Неизвестная ошибка:",
                status: error.status,
                error: error.statusText,
                message: error.responseText
            };
            console.log(response.path +
                " " +
                response.status +
                " " +
                response.error +
                " " +
                response.message);
            if (typeof app == "object")
                app.ladda(false);
            var message = isEmpty(response.message) ?
                (response.status + " запрос не выполнен") :
                response.message;
            if (response.status < 400) {
                sd.warning(message);
            }
            else {
                sd.error(message);
            }
        }
        sd.fail = fail;
        function get(uri, callback, type) {
            if (uri instanceof Uri)
                uri = "" + uri;
            //@ts-ignore
            return $.get(uri, callback, type)
                .fail(fail);
        }
        sd.get = get;
        function post(url, data, callback, type) {
            if (url instanceof Uri)
                url = "" + url;
            if (type == null)
                type = "json";
            return $.post(url, data, callback, type)
                .fail(fail);
        }
        sd.post = post;
        //ToDo переименовать sd.delete в sd.deleteXHR, т.к. delete зарегистрированное слово
        function deleteXHR(uri, callback) {
            if (uri instanceof Uri)
                uri = "" + uri;
            return $.ajax({
                url: uri, type: "DELETE", success: callback
            }).fail(fail);
        }
        sd.deleteXHR = deleteXHR;
        // return jqXHR
        function putXHR(uri, data, callback, type) {
            if (uri instanceof Uri)
                uri = "" + uri;
            if (type == null)
                type = "json";
            return $.ajax({
                url: uri, method: "PUT", dataType: type, data: data, success: callback
            });
        }
        sd.putXHR = putXHR;
        // with standard .fail
        function put(uri, data, callback, type) {
            return putXHR(uri, data, callback, type)
                .fail(fail);
        }
        sd.put = put;
        /*
         sd.request("get", "/rest/data/persons", {
         function  onload (value) {uchGod = JSON.parse(value)},
         function  onprogress (e) {console.log(Match.round(100 * e.loaded / e.total) + "% загружено")}});
         sd.request("put", "/rest/data/klasses/50/klRuk", {
         data: "/rest/data/teachers/9",
         type: "text/uri-list",
         function  onerror (err) {console.log("Ошибка: " + err.message)}});
         
         ManyToMany REST PUT
         sd.request("put", "/rest/data/agregates/141/birds",
         {data:"/rest/data/birds/1\n/rest/data/birds/2",
         type:"text/uri-list",
         onload:function(data) {
         console.log(data)
         }});
         */
        function request(method, uri, opt) {
            if (uri instanceof Uri)
                uri = "" + uri;
            var request = new XMLHttpRequest();
            var async = opt.hasOwnProperty("async") ? opt.async : true;
            request.open(method, uri, async);
            request.setRequestHeader("Content-Type", (opt.type) ? opt.type : "application/json");
            if (typeof app === "object") {
                request.setRequestHeader(app.header, app.token);
            }
            if (opt.onload) {
                request.onload = function () {
                    if (request.status >= 200 && request.status < 400)
                        opt.onload(request);
                };
            }
            if (opt.onprogress) {
                request.onprogress = function (e) {
                    if (e.lengthComputable)
                        opt.onprogress(e);
                };
                request.onloadend = function (e) {
                    opt.onprogress(e);
                };
            }
            if (opt.onerror) {
                request.onerror = opt.onerror;
                request.onreadystatechange = function () {
                    if (request.readyState === 4 && (request.status < 200 || request.status >= 400)) {
                        opt.onerror(JSON.parse(request.response));
                    }
                };
            }
            request.send((opt.data) ? opt.data : undefined);
            return request;
        }
        sd.request = request;
        function response(method, uri, data, contentType, onLoad) {
            if (typeof data === "object")
                data = JSON.stringify(data);
            return request(method, uri, {
                data: data,
                type: (contentType) ? contentType : "application/json",
                onload: (onLoad) ? onLoad : function (request) {
                    console.log(JSON.parse(request.response));
                }
            });
        }
        sd.response = response;
        function uri(uri, parameters) {
            return "" + new Uri(uri, parameters);
        }
        sd.uri = uri;
        function frontendLog(type, message, title) {
            sd.request("POST", "/log/frontend", {
                data: JSON.stringify({
                    type: type,
                    uri: location.pathname +
                        (location.href.indexOf("?") > -1 ?
                            location.href.substr(location.href.indexOf("?")) :
                            ""),
                    message: message,
                    title: title
                })
            });
        }
        sd.frontendLog = frontendLog;
        function getReport(uri, sendObjects, description) {
            app.ladda(true);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", uri, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader(app.header, app.token);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        var type = xhr.getResponseHeader("Content-Type");
                        var blob = new Blob([xhr.response], { type: type });
                        var downloadUrl_1 = URL.createObjectURL(blob);
                        var filename = "";
                        var disposition = xhr.getResponseHeader("Content-Disposition");
                        if (disposition && disposition.indexOf("attachment") !== -1) {
                            var filenameRegex = /filename[^;=\n]*=UTF-8''((['"]).*?\2|[^;\n]*)/;
                            var matches = filenameRegex.exec(disposition);
                            if (matches != null && matches[1]) {
                                filename = matches[1].replace(/['"]/g, "");
                            }
                        }
                        if (filename) {
                            var a = document.createElement("a");
                            a.href = downloadUrl_1;
                            a.download = decodeURI(filename);
                            document.body.appendChild(a);
                            clickElement(a);
                        }
                        else {
                            location.href = downloadUrl_1;
                        }
                        setTimeout(function () {
                            URL.revokeObjectURL(downloadUrl_1);
                        }, 100);
                    }
                    else if (xhr.status < 200 || xhr.status >= 400) {
                        sd.error("\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442 \"" + description + "\" \u043D\u0435 \u0441\u0444\u043E\u0440\u043C\u0438\u0440\u043E\u0432\u0430\u043D. \u041E\u0431\u0440\u0430\u0442\u0438\u0442\u0435\u0441\u044C \u043A \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A\u0443. " + xhr.responseURL);
                    }
                }
                app.ladda(false);
            };
            xhr.onerror = sd.fail.bind(sd.fail);
            xhr.responseType = "arraybuffer";
            xhr.send(JSON.stringify(sendObjects));
        }
        sd.getReport = getReport;
        function doToastr(method, message, title, overrides) {
            //		if (method != "success") frontendLog(method, message, title);
            //TODO заменить на Bootstrap4.toast
            //@ts-ignore
            var methodCall = toastr[method];
            if (title != undefined) {
                if (overrides) {
                    return methodCall(message, title, overrides);
                }
                else {
                    return methodCall(message, title);
                }
            }
            else {
                return methodCall(message);
            }
        }
        function success(message, title, overrides) {
            return doToastr("success", message, title, overrides);
        }
        sd.success = success;
        function info(message, title, overrides) {
            return doToastr("info", message, title, overrides);
        }
        sd.info = info;
        function warning(message, title, overrides) {
            return doToastr("warning", message, title, overrides);
        }
        sd.warning = warning;
        function error(message, title, overrides) {
            return doToastr("error", message, title, overrides);
        }
        sd.error = error;
        function date(date) {
            return new SDate(date);
        }
        sd.date = date;
    })(sd = exports.sd || (exports.sd = {}));
    var SDate = /** @class */ (function () {
        function SDate(date) {
            if (date === null) {
                this.date = null;
                return;
            }
            if (date === undefined)
                date = new Date();
            if (date instanceof Date) {
                this.date = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            }
            else if (typeof date === "string") {
                this.date = new Date(date);
            }
            else {
                sd.error("\u0414\u0430\u0442\u0430 \u0432 \u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E\u043C \u0444\u043E\u0440\u043C\u0430\u0442\u0435: " + date + " " + typeof date);
                return;
            }
        }
        SDate.prototype.get = function () {
            return this.date;
        };
        SDate.prototype.toISOString = function () {
            return this.date instanceof Date ? this.date.toISOString() : "";
        };
        SDate.prototype.toLocaleDateString = function () {
            return this.date instanceof Date ? this.date.toLocaleDateString() : "";
        };
        SDate.prototype.toRuLL = function () {
            return dateRuLL(this.date);
        };
        return SDate;
    }());
    exports.SDate = SDate;
    var monthsRu = ["января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря"];
    function dateRuLL(date) {
        return (date) ? date.getDate() + " " + monthsRu[date.getMonth()] + " " + date.getFullYear() : "";
    }
    exports.dateRuLL = dateRuLL;
    var Uri = /** @class */ (function () {
        function Uri(paths, parameters) {
            // attributes
            this.path = "";
            this.parameters = {};
            if (isEmpty(paths)) {
                throw new Error("Ошибка при инициализации Uri: uri не определен");
            }
            // constructor
            if (knockout_1.isObservable(paths)) {
                this.path += this.addPath(paths());
            }
            else {
                if (paths instanceof Uri) {
                    this.path += this.addPath(paths.getPath());
                    this.setParameters(paths.getParameters());
                }
                else {
                    this.path += this.addPath(paths);
                }
            }
            if (parameters)
                this.setParameters(parameters);
        }
        // operations
        Uri.prototype.setParameters = function (parameters) {
            for (var parameter in parameters)
                if (parameters.hasOwnProperty(parameter)) {
                    this.setParameter(parameter, parameters[parameter] + "");
                }
        };
        Uri.prototype.setParameter = function (parameter, parameterValue) {
            if (isEmpty(parameter)) {
                throw new Error("Ошибка в Uri.setParameter(): parameter не определен");
            }
            if (isEmpty(parameterValue)) {
                delete this.parameters[parameter];
            }
            else {
                this.parameters[parameter] = parameterValue;
            }
        };
        Uri.prototype.addOnePath = function (pathOne) {
            pathOne = pathOne + "";
            if (!isEmpty(pathOne)) {
                if (pathOne.substr(0, 1) === "/")
                    pathOne = pathOne.substr(1, pathOne.length - 1);
                if (pathOne.substr(pathOne.length - 1, 1) === "/") {
                    pathOne = pathOne.substr(0, pathOne.length - 1);
                }
                // path += (isEmpty(path) ? "" : "/") + path;
                pathOne = "/" + pathOne;
            }
            return pathOne;
        };
        Uri.prototype.addPath = function (pathAdding) {
            var path = "";
            if (!isEmpty(pathAdding)) {
                if (Array.isArray(pathAdding)) {
                    for (var _i = 0, pathAdding_1 = pathAdding; _i < pathAdding_1.length; _i++) {
                        var part = pathAdding_1[_i];
                        path += this.addOnePath(part);
                    }
                }
                else {
                    path += this.addOnePath(pathAdding);
                }
            }
            return path;
        };
        Uri.prototype.toString = function () {
            var uri = this.path;
            for (var parameter in this.parameters)
                if (this.parameters.hasOwnProperty(parameter)) {
                    uri += (uri.indexOf("?") === -1) ? "?" : "&";
                    uri += parameter + "=" + encodeURI(this.parameters[parameter] + "");
                }
            return uri;
        };
        Uri.prototype.getPath = function () {
            return this.path;
        };
        Uri.prototype.getParameters = function () {
            return this.parameters;
        };
        Uri.prototype.toFragment = function (fragment) {
            if (isEmpty(fragment)) {
                throw new Error("Ошибка в Uri.toFragment(): fragment не определен");
            }
            return this.toString() + "#" + fragment;
        };
        Uri.prototype.withPath = function (pathAdd) {
            if (isEmpty(pathAdd)) {
                throw new Error("Ошибка в Uri.withPath(): pathAdd не определен");
            }
            return new Uri(this.path + this.addPath(pathAdd), this.parameters);
        };
        Uri.prototype.withParameter = function (parameter, parameterValue) {
            var parameters = {};
            parameters[parameter] = parameterValue;
            return this.withParameters(parameters);
        };
        Uri.prototype.withParameters = function (parameters) {
            if (parameters == null) {
                throw new Error("Ошибка в Uri.withParameters(): parameters не определены");
            }
            return new Uri(this, parameters);
        };
        return Uri;
    }());
    exports.Uri = Uri;
    var Deffered = /** @class */ (function () {
        function Deffered(name, deffered) {
            this.name = name;
            this.deffered = deffered;
        }
        return Deffered;
    }());
    exports.Deffered = Deffered;
    var Deferreds = /** @class */ (function () {
        function Deferreds(name, isLog) {
            this.deferreds = [];
            this.isDone = true;
            this.isLog = false;
            this.name = name ? name : "noname";
            this.isLog = isLog === undefined ? false : isLog;
        }
        Deferreds.prototype.size = function () {
            return this.deferreds.length;
        };
        Deferreds.prototype.add = function (name) {
            var _this = this;
            this.onAdd();
            var deferred = new Deffered(name !== null && name !== void 0 ? name : this.deferreds.length + "", $.Deferred());
            $.when(deferred.deffered).done(function () { return _this.onDone(deferred.name); });
            this.deferreds.push(deferred);
            this.isDone = false;
            if (this.isLog)
                console.log(this.name + "." + deferred.name + " added (length = " + this.deferreds.length + ")");
        };
        Deferreds.prototype.onAdd = function () {
        };
        Deferreds.prototype.resolve = function () {
            var deferred = this.deferreds.pop();
            if (deferred) {
                if (this.isLog)
                    console.log(this.name + "." + deferred.name + " resolved (length = " + this.deferreds.length + ")");
                deferred.deffered.resolve();
            }
            else {
                if (this.isLog)
                    console.log(this.name + " resolved but array is empty");
            }
        };
        Deferreds.prototype.functionDone = function () {
        };
        Deferreds.prototype.onDone = function (name) {
            if (this.deferreds.length === 0 && !this.isDone) {
                this.isDone = true;
                this.functionDone();
                if (this.isLog)
                    console.log(this.name + " done (last deferred was " + name + ")");
            }
        };
        Deferreds.prototype.done = function (functionDone) {
            var _this = this;
            if (functionDone !== undefined)
                this.functionDone = functionDone;
            this.add("byDone");
            var _loop_1 = function (deferred) {
                $.when(deferred.deffered)
                    .done(function () { return _this.onDone(deferred.name); });
            };
            for (var _i = 0, _a = this.deferreds; _i < _a.length; _i++) {
                var deferred = _a[_i];
                _loop_1(deferred);
            }
            this.resolve();
        };
        return Deferreds;
    }());
    exports.Deferreds = Deferreds;
    //http://stackoverflow.com/questions/11618278/how-to-break-on-property-change-in-chrome
    function watch(oObj, sProp) {
        var sPrivateProp = "$_" + sProp + "_$"; // to minimize the name clash risk
        oObj[sPrivateProp] = oObj[sProp];
        // overwrite with accessor
        Object.defineProperty(oObj, sProp, {
            get: function () {
                return oObj[sPrivateProp];
            }, set: function (value) {
                //console.log("setting " + sProp + " to " + value);
                debugger; // sets breakpoint
                oObj[sPrivateProp] = value;
            }
        });
    }
    exports.watch = watch;
    function clickElement(element) {
        var evt = window.document.createEvent("MouseEvent");
        evt.initEvent("click", true, true);
        element.dispatchEvent(evt);
        return element;
    }
    exports.clickElement = clickElement;
});
