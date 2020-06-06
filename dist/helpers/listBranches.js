"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var getBranchDescription_1 = __importDefault(require("./getBranchDescription"));
var getCharToBranchMap_1 = __importDefault(require("./getCharToBranchMap"));
var getCurrentBranch_1 = __importDefault(require("./getCurrentBranch"));
var Colorizer_1 = __importDefault(require("./Colorizer"));
function listBranches() {
    try {
        var currentBranch_1 = getCurrentBranch_1["default"]();
        var charToBranchMap_1 = getCharToBranchMap_1["default"]();
        Object.keys(charToBranchMap_1).forEach(function (ch) {
            var branch = charToBranchMap_1[ch];
            var desc = getBranchDescription_1["default"](branch);
            if (branch === currentBranch_1) {
                var colorizer = new Colorizer_1["default"]();
                colorizer.normal('* ');
                colorizer.yellow("(" + ch + ")");
                colorizer.green(" " + branch);
                colorizer.fadedNormal(" " + desc);
                colorizer.log();
            }
            else {
                var colorizer = new Colorizer_1["default"]();
                colorizer.yellow("  (" + ch + ")");
                colorizer.normal(" " + branch);
                colorizer.fadedNormal(" " + desc);
                colorizer.log();
            }
        });
    }
    catch (e) {
        if (e && e.status) {
            process.exit(e.status);
        }
        throw e;
    }
}
exports["default"] = listBranches;
//# sourceMappingURL=listBranches.js.map