"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePackageJson = exports.getPackageJsonPath = exports.readPackageJson = void 0;
const path_1 = require("path");
const rxjs_1 = require("rxjs");
const filesystem_1 = require("./filesystem");
const logger_1 = require("./logger");
const detectIndent = require("detect-indent");
function readPackageJson(projectRoot) {
    return (0, filesystem_1.readJsonFile)(getPackageJsonPath(projectRoot));
}
exports.readPackageJson = readPackageJson;
function getPackageJsonPath(projectRoot) {
    return (0, path_1.resolve)(projectRoot, 'package.json');
}
exports.getPackageJsonPath = getPackageJsonPath;
/* istanbul ignore next */
function updatePackageJson({ newVersion, projectRoot, projectName, dryRun, }) {
    if (dryRun) {
        return (0, rxjs_1.of)(null);
    }
    const path = getPackageJsonPath(projectRoot);
    return (0, filesystem_1.readFileIfExists)(path).pipe((0, rxjs_1.switchMap)((packageJson) => {
        if (!packageJson.length) {
            return (0, rxjs_1.of)(null);
        }
        const newPackageJson = _updatePackageVersion(packageJson, newVersion);
        return (0, filesystem_1.writeFile)(path, newPackageJson).pipe((0, logger_1.logStep)({
            step: 'package_json_success',
            message: `Updated package.json version.`,
            projectName,
        }), (0, rxjs_1.map)(() => path));
    }));
}
exports.updatePackageJson = updatePackageJson;
/* istanbul ignore next */
function _updatePackageVersion(packageJson, version) {
    const data = JSON.parse(packageJson);
    const { indent } = detectIndent(packageJson);
    return _stringifyJson(Object.assign(Object.assign({}, data), { version }), indent);
}
/* istanbul ignore next */
function _stringifyJson(data, indent) {
    // We need to add a newline at the end so that Prettier will not complain about the new file.
    return JSON.stringify(data, null, indent).concat('\n');
}
//# sourceMappingURL=project.js.map