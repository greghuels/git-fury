"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var getCurrentBranch_1 = __importDefault(require("./helpers/getCurrentBranch"));
var child_process_1 = require("child_process");
var listBranches_1 = __importDefault(require("./helpers/listBranches"));
var BranchDescription = (function () {
    function BranchDescription(branch) {
        this.branch = (branch === null || branch === void 0 ? void 0 : branch.trim()) || getCurrentBranch_1["default"]();
        this.configSetting = "branch." + this.branch + ".description";
    }
    BranchDescription.prototype.show = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var child = child_process_1.spawn('git', ['config', _this.configSetting], { stdio: 'inherit' });
            child.on('exit', function (code) {
                resolve(code);
            });
        });
    };
    BranchDescription.prototype.set = function (description) {
        var _this = this;
        return new Promise(function (resolve) {
            var child = child_process_1.spawn('git', ['config', _this.configSetting, description], { stdio: 'inherit' });
            child.on('exit', function (code) {
                if (code) {
                    resolve();
                }
                else {
                    listBranches_1["default"]();
                    resolve(code);
                }
            });
        });
    };
    BranchDescription.prototype.remove = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var child = child_process_1.spawn('git', ['config', '--unset', _this.configSetting], { stdio: 'inherit' });
            child.on('exit', function (code) {
                if (code) {
                    resolve();
                }
                else {
                    listBranches_1["default"]();
                    resolve(code);
                }
            });
        });
    };
    return BranchDescription;
}());
exports["default"] = BranchDescription;
//# sourceMappingURL=BranchDescription.js.map