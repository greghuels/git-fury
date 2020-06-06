"use strict";
exports.__esModule = true;
var child_process_1 = require("child_process");
function getCharFromNum(num) {
    var i = num - 1;
    if (num > 26) {
        var moreSignificantDigit = Math.floor(i / 26);
        var remainder = Math.floor(i % 26) + 1;
        return "" + getCharFromNum(moreSignificantDigit) + getCharFromNum(remainder);
    }
    else {
        return String.fromCharCode(97 + i);
    }
}
function getCharToBranchMap() {
    try {
        var num_1 = 1;
        return child_process_1.execSync('git branch --format=\'%(refname:short)\'').toString().split('\n').reduce(function (acc, branch) {
            if (branch) {
                acc[getCharFromNum(num_1)] = branch;
                num_1 += 1;
            }
            return acc;
        }, {});
    }
    catch (e) {
        if (e && e.status) {
            process.exit(e.status);
        }
        throw e;
    }
}
exports["default"] = getCharToBranchMap;
//# sourceMappingURL=getCharToBranchMap.js.map