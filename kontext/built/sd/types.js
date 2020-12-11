define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.idToNumber = exports.idToString = void 0;
    function idToString(id) {
        return id + "";
    }
    exports.idToString = idToString;
    function idToNumber(id) {
        return parseInt(id + "");
    }
    exports.idToNumber = idToNumber;
});
