"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var commander_1 = require("commander");
var getExpandedArgs_1 = __importDefault(require("./helpers/getExpandedArgs"));
var listBranches_1 = __importDefault(require("./helpers/listBranches"));
var child_process_1 = require("child_process");
var BranchDescription_1 = __importDefault(require("./BranchDescription"));
var getCurrentBranch_1 = __importDefault(require("./helpers/getCurrentBranch"));
function execHelp() {
    console.log('Usage: git fury [options]');
    console.log('');
    console.log('Options:');
    console.log('  -h, --help  display help for command');
    console.log('  desc [branch] <description>, Set a branch description');
    console.log('  desc -D [branch], Delete a branch description');
    console.log('');
    console.log('Examples:');
    console.log('');
    console.log('- Set a branch description');
    console.log('  $ git fury desc https://github.com/greghuels/git-fury/pull/12345');
    console.log('  $ git fury desc a "Some description for branch a"');
    console.log('');
    console.log('- Delete a branch description');
    console.log('  $ git fury desc -D');
    console.log('');
    console.log('- Use git shorthand (set config aliases like `git config --global alias.co "fury checkout"` for enhanced productivity)');
    console.log('  $ git fury diff 2 1  ### --> git diff HEAD~2 HEAD~1');
    console.log('  $ git fury checkout a  ### --> git checkout <branch-name-for-a>');
    console.log('  $ git fury rebase -i 2  ### --> git rebase -i HEAD~2');
}
function getBranchName(descArgs) {
    var _a;
    var filteredArgs = descArgs.filter(function (arg) { return arg !== '-D' && arg !== '-S'; });
    var isDeleteOrShow = filteredArgs.length !== descArgs.length;
    if (isDeleteOrShow) {
        return (_a = filteredArgs[0]) !== null && _a !== void 0 ? _a : getCurrentBranch_1["default"]();
    }
    else {
        return filteredArgs.length < 2 ? getCurrentBranch_1["default"]() : filteredArgs[0];
    }
}
function execBranchDescription() {
    return __awaiter(this, void 0, void 0, function () {
        var descArgs, branchName, branchDescription, code, descriptionString;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    descArgs = getExpandedArgs_1["default"]().slice(1);
                    commander_1.program
                        .usage('desc [branch] <description|options>')
                        .option('-D', 'Delete description for the current branch or optionally specified branch / shorthand branch')
                        .option('-S', 'Show description for the current branch or optionally specified branch / shorthand branch')
                        .description('Set, show or delete a branch description for the current branch or optionally specified branch / shorthand branch');
                    if (!(descArgs.length === 0 || descArgs.length > 2)) return [3, 1];
                    commander_1.program.outputHelp();
                    process.exit(1);
                    return [3, 8];
                case 1:
                    branchName = getBranchName(descArgs);
                    branchDescription = new BranchDescription_1["default"](branchName);
                    code = void 0;
                    if (!descArgs.includes('-D')) return [3, 3];
                    return [4, branchDescription.remove()];
                case 2:
                    code = _a.sent();
                    return [3, 7];
                case 3:
                    if (!descArgs.includes('-S')) return [3, 5];
                    return [4, branchDescription.show()];
                case 4:
                    code = _a.sent();
                    return [3, 7];
                case 5:
                    descriptionString = descArgs.length === 2 ? descArgs[1] : descArgs[0];
                    return [4, branchDescription.set(descriptionString)];
                case 6:
                    code = _a.sent();
                    _a.label = 7;
                case 7:
                    process.exit(code);
                    _a.label = 8;
                case 8: return [2];
            }
        });
    });
}
var args = process.argv.slice(2);
if (args.includes('-h') || args.includes('--help')) {
    execHelp();
}
else if (args[0] === 'desc') {
    execBranchDescription();
}
else if (args.length === 1 && args[0] === 'br' || args[0] === 'branch') {
    listBranches_1["default"]();
}
else {
    var expandedArgs = getExpandedArgs_1["default"](args);
    var child = child_process_1.spawn('git', __spreadArrays(expandedArgs), { stdio: 'inherit' });
    child.on('exit', function (code) {
        listBranches_1["default"]();
        process.exit(code);
    });
}
//# sourceMappingURL=index.js.map