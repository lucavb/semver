"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logStep = logStep;
exports._logStep = _logStep;
const devkit_1 = require("@nx/devkit");
const chalk = require("chalk");
const rxjs_1 = require("rxjs");
const iconMap = new Map([
    ['failure', '❌'],
    ['warning', '🟠'],
    ['nothing_changed', '🟢'],
    ['calculate_version_success', '🆕'],
    ['changelog_success', '📜'],
    ['commit_success', '📦'],
    ['package_json_success', '📝'],
    ['post_target_success', '🎉'],
    ['tag_success', '🔖'],
    ['push_success', '🚀'],
]);
/* istanbul ignore next */
function logStep({ step, message, projectName, }) {
    return (source) => source.pipe((0, rxjs_1.tap)(() => _logStep({ step, message, projectName })));
}
/* istanbul ignore next */
function _logStep({ step, message, projectName, level = 'log', }) {
    const msg = `${chalk.bold(`[${projectName}]`)} ${iconMap.get(step)} ${message}`;
    devkit_1.logger[level](msg);
}
//# sourceMappingURL=logger.js.map