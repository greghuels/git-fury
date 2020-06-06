"use strict";
exports.__esModule = true;
var child_process_1 = require("child_process");
function getBranchDescription(branch) {
    try {
        return child_process_1.execSync("git config branch." + branch + ".description").toString().trim();
    }
    catch (e) {
        return '';
    }
}
exports["default"] = getBranchDescription;
//# sourceMappingURL=getBranchDescription.js.map