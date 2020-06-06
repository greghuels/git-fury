"use strict";
exports.__esModule = true;
var child_process_1 = require("child_process");
function getCurrentBranch() {
    try {
        var curBranch = child_process_1.execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
        return curBranch === 'HEAD' ? '' : curBranch.trim();
    }
    catch (e) {
        return '';
    }
}
exports["default"] = getCurrentBranch;
//# sourceMappingURL=getCurrentBranch.js.map