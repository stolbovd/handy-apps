define(["require", "exports", "kontext/sd/sd"], function (require, exports, sd_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    console.log(sd_1.enumToString("Как_дела"));
    var a = { b: "Hi" };
    console.log("sd say: " + sd_1.tryGetProperty(a, "b"));
});
