"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = version;
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const changelog_1 = require("./utils/changelog");
const commit_1 = require("./utils/commit");
const get_project_dependencies_1 = require("./utils/get-project-dependencies");
const git_1 = require("./utils/git");
const logger_1 = require("./utils/logger");
const post_target_1 = require("./utils/post-target");
const tag_1 = require("./utils/tag");
const try_bump_1 = require("./utils/try-bump");
const workspace_1 = require("./utils/workspace");
const version_1 = require("./version");
function version(options, context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { push, enforceAtomicPush, remote, dryRun, trackDeps, baseBranch, noVerify, syncVersions, skipRootChangelog, skipProjectChangelog, releaseAs, preid, changelogHeader, trackDepsWithReleaseAs, versionTagPrefix, postTargets, commitMessageFormat, preset, allowEmptyRelease, skipCommitTypes, skipCommit, skipStage, commitParserOptions, } = _normalizeOptions(options);
        const workspaceRoot = context.root;
        const projectName = context.projectName;
        let dependencyRoots = [];
        try {
            dependencyRoots = yield (0, get_project_dependencies_1.getDependencyRoots)({
                context,
                projectName,
                releaseAs,
                trackDeps,
                trackDepsWithReleaseAs,
            });
        }
        catch (e) {
            (0, logger_1._logStep)({
                step: 'failure',
                level: 'error',
                message: `Failed to determine dependencies.
      Please report an issue: https://github.com/jscutlery/semver/issues/new.`,
                projectName,
            });
            return { success: false };
        }
        const tagPrefix = (0, tag_1.formatTagPrefix)({
            versionTagPrefix,
            projectName,
            syncVersions,
        });
        const projectRoot = (0, workspace_1.getProject)(context).root;
        const newVersion$ = (0, try_bump_1.tryBump)({
            commitParserOptions,
            preset,
            projectRoot,
            dependencyRoots,
            tagPrefix,
            versionTagPrefix,
            releaseType: releaseAs,
            preid,
            syncVersions,
            allowEmptyRelease,
            skipCommitTypes,
            projectName,
            workspace: context.projectsConfigurations,
        });
        const runSemver$ = newVersion$.pipe((0, operators_1.switchMap)((newVersion) => {
            if (newVersion == null) {
                (0, logger_1._logStep)({
                    step: 'nothing_changed',
                    level: 'info',
                    message: 'Nothing changed since last release.',
                    projectName,
                });
                return (0, rxjs_1.of)({ success: true });
            }
            (0, logger_1._logStep)({
                step: 'calculate_version_success',
                message: `Calculated new version "${newVersion.version}".`,
                projectName,
            });
            const { version, dependencyUpdates } = newVersion;
            const tag = (0, tag_1.formatTag)({ tagPrefix, version });
            const commitMessage = (0, commit_1.formatCommitMessage)({
                projectName,
                commitMessageFormat,
                version,
            });
            const options = {
                newVersion: version,
                tag,
                dryRun,
                trackDeps,
                noVerify,
                preset,
                tagPrefix,
                changelogHeader,
                workspaceRoot,
                projectName,
                skipProjectChangelog,
                commitMessage,
                dependencyUpdates,
                skipCommit,
                skipStage,
                commitParserOptions,
                workspace: context.projectsConfigurations,
            };
            const version$ = (0, rxjs_1.defer)(() => syncVersions
                ? (0, version_1.versionWorkspace)(Object.assign(Object.assign({}, options), { projectRoot,
                    skipRootChangelog }))
                : (0, version_1.versionProject)(Object.assign(Object.assign({}, options), { projectRoot })));
            const push$ = (0, rxjs_1.defer)(() => (0, git_1.tryPush)({
                tag,
                branch: baseBranch,
                noVerify,
                enforceAtomicPush,
                remote,
                projectName,
            }));
            const _runPostTargets = ({ notes }) => (0, rxjs_1.defer)(() => (0, post_target_1.runPostTargets)({
                context,
                projectName,
                postTargets,
                templateStringContext: {
                    dryRun,
                    notes,
                    version,
                    projectName,
                    tag,
                    previousTag: (0, tag_1.formatTag)({
                        tagPrefix,
                        version: newVersion.previousVersion,
                    }),
                },
            }));
            const changelogPath = (0, changelog_1.getChangelogPath)(syncVersions ? workspaceRoot : projectRoot);
            return version$.pipe((0, changelog_1.calculateChangelogChanges)({
                changelogHeader,
                changelogPath,
            }), (0, operators_1.concatMap)((notes) => (0, rxjs_1.concat)(...(push && dryRun === false ? [push$] : []), ...(dryRun === false ? [_runPostTargets({ notes })] : []))), (0, operators_1.reduce)((result) => result, { success: true }));
        }));
        return (0, rxjs_1.lastValueFrom)(runSemver$.pipe((0, operators_1.catchError)((error) => {
            (0, logger_1._logStep)({
                step: 'failure',
                level: 'error',
                message: _toErrorMessage(error),
                projectName,
            });
            return (0, rxjs_1.of)({ success: false });
        })));
    });
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _toErrorMessage(error) {
    var _a, _b;
    return (_b = (_a = error.stack) !== null && _a !== void 0 ? _a : error.message) !== null && _b !== void 0 ? _b : error.toString();
}
function _normalizeOptions(options) {
    var _a;
    return Object.assign(Object.assign({}, options), { push: options.push, enforceAtomicPush: options.enforceAtomicPush, remote: options.remote, dryRun: options.dryRun, trackDeps: options.trackDeps, baseBranch: options.baseBranch, noVerify: options.noVerify, syncVersions: options.syncVersions, skipRootChangelog: options.skipRootChangelog, skipProjectChangelog: options.skipProjectChangelog, allowEmptyRelease: options.allowEmptyRelease, skipCommitTypes: options.skipCommitTypes, releaseAs: options.releaseAs, changelogHeader: (_a = options.changelogHeader) !== null && _a !== void 0 ? _a : changelog_1.defaultHeader, versionTagPrefix: options.tagPrefix, commitMessageFormat: options.commitMessageFormat, commitParserOptions: options.commitParserOptions, skipCommit: options.skipCommit, skipStage: options.skipStage, trackDepsWithReleaseAs: !!options.trackDepsWithReleaseAs, preset: (options.preset === 'conventional'
            ? 'conventionalcommits'
            : options.preset || 'conventionalcommits') });
}
//# sourceMappingURL=index.js.map