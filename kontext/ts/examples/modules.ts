import {enumToString, tryGetProperty} from "kontext/sd/sd";

console.log(enumToString("Как_дела"));

let a = {b: "Hi"};
console.log("sd say: " + tryGetProperty(a, "b"));
