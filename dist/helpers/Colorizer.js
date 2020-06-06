"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var DEFAULT = '\x1b[0m';
var FADED = '\x1b[2m';
var GREEN = '\x1b[32m';
var YELLOW = '\x1b[33m';
var Colorizer = (function () {
    function Colorizer() {
        this.colors = '';
        this.textArray = [];
    }
    Colorizer.prototype.colorize = function (c, text) {
        this.colors += c + "%s";
        this.textArray.push(text);
    };
    Colorizer.prototype.normal = function (text) {
        this.colorize(DEFAULT, text);
    };
    Colorizer.prototype.fadedNormal = function (text) {
        this.colorize("" + DEFAULT + FADED, text);
    };
    Colorizer.prototype.green = function (text) {
        this.colorize(GREEN, text);
    };
    Colorizer.prototype.yellow = function (text) {
        this.colorize(YELLOW, text);
    };
    Colorizer.prototype.log = function () {
        this.colors += DEFAULT;
        var args = __spreadArrays([
            this.colors
        ], this.textArray);
        console.log.apply(console, args);
    };
    return Colorizer;
}());
exports["default"] = Colorizer;
//# sourceMappingURL=Colorizer.js.map