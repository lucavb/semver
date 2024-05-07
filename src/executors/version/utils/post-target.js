"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._checkTargetExist = exports._getTargetOptions = exports.runPostTargets = void 0;
const tslib_1 = require("tslib");
const devkit_1 = require("@nx/devkit");
const rxjs_1 = require("rxjs");
const logger_1 = require("./logger");
const template_string_1 = require("./template-string");
function runPostTargets({ postTargets, templateStringContext, context, projectName, }) {
    return (0, rxjs_1.concat)(...postTargets.map((postTargetSchema) => (0, rxjs_1.defer)(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        // TODO: deprecate specifying the project name in the post target schema.
        const target = postTargetSchema.includes(':')
            ? (0, devkit_1.parseTargetString)(postTargetSchema)
            : (0, devkit_1.parseTargetString)(postTargetSchema, context);
        _checkTargetExist(target, context);
        const targetOptions = _getTargetOptions({
            options: (0, devkit_1.readTargetOptions)(target, context),
            context: templateStringContext,
        });
        try {
            for (var _d = true, _e = tslib_1.__asyncValues(yield (0, devkit_1.runExecutor)(target, targetOptions, context)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const { success } = _c;
                if (!success) {
                    throw new Error(`Something went wrong with post-target "${target.project}:${target.target}".`);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
    })).pipe((0, logger_1.logStep)({
        step: 'post_target_success',
        message: `Ran post-target "${postTargetSchema}".`,
        projectName,
    }), (0, rxjs_1.catchError)((error) => {
        if ((error === null || error === void 0 ? void 0 : error.name) === 'SchemaError') {
            return (0, rxjs_1.throwError)(() => new Error(error.message));
        }
        return (0, rxjs_1.throwError)(() => error);
    }))));
}
exports.runPostTargets = runPostTargets;
/* istanbul ignore next */
function _getTargetOptions({ options = {}, context, }) {
    return Object.entries(options).reduce((optionsAccumulator, [option, value]) => {
        const resolvedValue = Array.isArray(value)
            ? value.map((_element) => typeof _element !== 'object'
                ? (0, template_string_1.coerce)((0, template_string_1.createTemplateString)(_element.toString(), context))
                : _getTargetOptions({ options: _element, context }))
            : typeof value === 'object'
                ? _getTargetOptions({
                    options: value,
                    context,
                })
                : (0, template_string_1.coerce)((0, template_string_1.createTemplateString)(value.toString(), context));
        return Object.assign(Object.assign({}, optionsAccumulator), { [option]: resolvedValue });
    }, {});
}
exports._getTargetOptions = _getTargetOptions;
/* istanbul ignore next */
function _checkTargetExist(target, context) {
    var _a, _b, _c, _d, _e;
    const project = (_b = (_a = context.projectsConfigurations) === null || _a === void 0 ? void 0 : _a.projects) === null || _b === void 0 ? void 0 : _b[target.project];
    if (project === undefined) {
        throw new Error(`The target project "${target.project}" does not exist in your workspace. Available projects: ${Object.keys((_d = (_c = context.projectsConfigurations) === null || _c === void 0 ? void 0 : _c.projects) !== null && _d !== void 0 ? _d : []).map((project) => `"${project}"`)}.`);
    }
    const projectTarget = (_e = project.targets) === null || _e === void 0 ? void 0 : _e[target.target];
    if (projectTarget === undefined) {
        throw new Error(`The target name "${target.target}" does not exist. Available targets for "${target.project}": ${Object.keys(project.targets || {}).map((target) => `"${target}"`)}.`);
    }
}
exports._checkTargetExist = _checkTargetExist;
//# sourceMappingURL=post-target.js.map