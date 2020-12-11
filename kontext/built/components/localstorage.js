define(["require", "exports", "pako", "../sd/sd", "knockout"], function (require, exports, pako, sd_1, knockout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LStorage = void 0;
    var LStorage = /** @class */ (function () {
        function LStorage(key) {
            this.key = key;
            this.isLoaded = knockout_1.observable(false);
            this.setKey(key);
        }
        LStorage.prototype.setKey = function (key) {
            this.key = "sd_" + key;
        };
        LStorage.prototype.addKey = function (addText) {
            this.key += addText;
        };
        LStorage.prototype.onLoad = function (data) {
            var ls = localStorage.getItem(this.key);
            if (!ls) {
                this.update(data);
            }
        };
        LStorage.prototype.fillOrLoad = function (fill, load) {
            var ls = localStorage.getItem(this.key);
            if (ls) {
                fill(JSON.parse(pako.inflate(ls, { to: "string" })));
            }
            else {
                load();
            }
        };
        LStorage.prototype.update = function (data) {
            var pakoData = pako.deflate(JSON.stringify(data), { to: "string" });
            try {
                localStorage.setItem(this.key, pakoData);
                this.isLoaded(true);
            }
            catch (exception) {
                sd_1.sd.frontendLog("LocalStorage", exception.message, "\u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E: " + pakoData.length + " \u0437\u0430\u043D\u044F\u0442\u043E: " + LStorage.occupied());
            }
        };
        LStorage.prototype.remove = function (key) {
            if (!key) {
                key = this.key;
            }
            localStorage.removeItem(key);
        };
        LStorage.occupied = function () {
            var occupied = 0;
            for (var _i = 0, _a = Object.keys(localStorage); _i < _a.length; _i++) {
                var key = _a[_i];
                occupied += localStorage.getItem(key).length;
            }
            return occupied;
        };
        LStorage.clear = function () {
            for (var _i = 0, _a = Object.keys(localStorage); _i < _a.length; _i++) {
                var key = _a[_i];
                if (key.substr(0, 3) == "sd_")
                    localStorage.removeItem(key);
            }
        };
        return LStorage;
    }());
    exports.LStorage = LStorage;
});
