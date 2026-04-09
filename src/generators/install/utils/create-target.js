"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTarget = createTarget;
exports._createOptions = _createOptions;
/* istanbul ignore next */
function createTarget(options) {
    const targetOptions = _createOptions(options);
    return Object.assign({ executor: '@jscutlery/semver:version' }, (Object.keys(targetOptions).length > 0
        ? { options: targetOptions }
        : {}));
}
/* istanbul ignore next */
function _createOptions(options) {
    const targetOptions = [
        'syncVersions',
        'baseBranch',
        'preset',
        'commitMessageFormat',
    ];
    return targetOptions
        .filter((key) => Boolean(options[key]))
        .reduce((targetOptions, key) => (Object.assign(Object.assign({}, targetOptions), { [key]: options[key] })), {});
}
//# sourceMappingURL=create-target.js.map