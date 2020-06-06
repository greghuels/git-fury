"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var getCharToBranchMap_1 = __importDefault(require("./getCharToBranchMap"));
var _charToBranchMap;
var getMemoizedCharToBranchMap = function () {
    if (!_charToBranchMap) {
        _charToBranchMap = getCharToBranchMap_1["default"]();
    }
    return _charToBranchMap;
};
function getExpandedArgs(args, _a) {
    if (args === void 0) { args = process.argv.slice(2); }
    var _b = _a === void 0 ? {} : _a, _c = _b.excludeNumArg, excludeNumArg = _c === void 0 ? false : _c, _d = _b.excludeCharArg, excludeCharArg = _d === void 0 ? false : _d;
    try {
        return args.map(function (arg) {
            var trimmedArg = arg.trim();
            if (!excludeNumArg && /^\d+$/.test(trimmedArg)) {
                var parsedArg = parseInt(trimmedArg, 10);
                if (parsedArg < 1000) {
                    return "HEAD~" + parsedArg;
                }
            }
            if (!excludeCharArg && /^[a-z]{1,2}$/.test(trimmedArg)) {
                var charToBranchMap = getMemoizedCharToBranchMap();
                if (charToBranchMap[trimmedArg]) {
                    return charToBranchMap[trimmedArg];
                }
            }
            return trimmedArg;
        });
    }
    catch (e) {
        if (e && e.status) {
            process.exit(e.status);
        }
        throw e;
    }
}
exports["default"] = getExpandedArgs;
//# sourceMappingURL=getExpandedArgs.js.map