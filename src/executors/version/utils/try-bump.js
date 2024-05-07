"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._isInitialVersion = exports._isNewVersion = exports._getDependencyVersions = exports._manualBump = exports._semverBump = exports.tryBump = exports.getProjectVersion = void 0;
const tslib_1 = require("tslib");
const conventional_commits_parser_1 = require("conventional-commits-parser");
const conventionalRecommendedBump = require("conventional-recommended-bump");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const semver = require("semver");
const get_last_version_1 = require("./get-last-version");
const git_1 = require("./git");
const logger_1 = require("./logger");
const tag_1 = require("./tag");
const initialVersion = '0.0.0';
function getProjectVersion({ tagPrefix, projectRoot, releaseType, since, projectName, preid, }) {
    const lastVersion$ = (0, get_last_version_1.getLastVersion)({
        tagPrefix,
        preid,
        releaseType,
    }).pipe((0, operators_1.catchError)(() => {
        (0, logger_1._logStep)({
            step: 'warning',
            level: 'warn',
            message: `No previous version tag found, fallback to version 0.0.0.
        New version will be calculated based on all changes since first commit.
        If your project is already versioned, please tag the latest release commit with ${tagPrefix}x.y.z and run this command again.`,
            projectName,
        });
        return (0, rxjs_1.of)(initialVersion);
    }), (0, operators_1.shareReplay)({
        refCount: true,
        bufferSize: 1,
    }));
    const lastVersionGitRef$ = lastVersion$.pipe(
    /** If lastVersion equals 0.0.0 it means no tag exist,
     * then get the first commit ref to compute the initial version. */
    (0, operators_1.switchMap)((lastVersion) => (0, rxjs_1.iif)(() => _isInitialVersion({ lastVersion }), (0, git_1.getFirstCommitRef)(), (0, rxjs_1.of)((0, tag_1.formatTag)({ tagPrefix, version: lastVersion })))));
    const commits$ = lastVersionGitRef$.pipe((0, operators_1.switchMap)((lastVersionGitRef) => {
        return (0, git_1.getCommits)({
            projectRoot,
            since: since !== null && since !== void 0 ? since : lastVersionGitRef,
        });
    }));
    return {
        lastVersion$,
        commits$,
        lastVersionGitRef$,
    };
}
exports.getProjectVersion = getProjectVersion;
/**
 * Return new version or null if nothing changed.
 */
function tryBump({ commitParserOptions, preset, projectRoot, tagPrefix, dependencyRoots = [], releaseType, preid, versionTagPrefix, syncVersions, allowEmptyRelease, skipCommitTypes, projectName, }) {
    const { lastVersion$, commits$, lastVersionGitRef$ } = getProjectVersion({
        tagPrefix,
        projectRoot,
        releaseType,
        projectName,
        preid,
    });
    return (0, rxjs_1.forkJoin)([lastVersion$, commits$, lastVersionGitRef$]).pipe((0, operators_1.switchMap)(([lastVersion, commits, lastVersionGitRef]) => {
        if (releaseType && releaseType !== 'prerelease') {
            return _manualBump({
                since: lastVersion,
                releaseType,
                preid,
            }).pipe((0, operators_1.map)((version) => version
                ? ({
                    version,
                    previousVersion: lastVersion,
                    dependencyUpdates: [],
                })
                : null));
        }
        const projectBump$ = _semverBump({
            since: lastVersion,
            preset,
            projectRoot,
            tagPrefix,
            releaseType,
            preid,
        }).pipe((0, operators_1.map)((version) => ({ type: 'project', version })));
        const dependencyVersions$ = _getDependencyVersions({
            commitParserOptions,
            lastVersionGitRef,
            dependencyRoots,
            preset,
            releaseType,
            versionTagPrefix,
            skipCommitTypes,
            syncVersions,
            projectName,
            preid,
        });
        return (0, rxjs_1.forkJoin)([projectBump$, dependencyVersions$]).pipe((0, operators_1.switchMap)(([projectVersion, dependencyVersions]) => {
            const dependencyUpdates = dependencyVersions.filter(_isNewVersion);
            const newVersion = {
                version: projectVersion.version || lastVersion,
                previousVersion: lastVersion,
                dependencyUpdates,
            };
            /* bump patch version if dependency updates are available */
            if (projectVersion.version === null && dependencyUpdates.length) {
                return _manualBump({
                    since: lastVersion,
                    releaseType: 'patch',
                    preid: preid,
                }).pipe((0, operators_1.map)((version) => version
                    ? (Object.assign(Object.assign({}, newVersion), { version: version || lastVersion, previousVersion: lastVersion }))
                    : null));
            }
            const filteredCommits = commits.filter((commit) => shouldCommitBeCalculated({
                commit,
                commitParserOptions,
                skipCommitTypes,
            }));
            /* No commits since last release & no dependency updates so don't bump if the `releastAtLeast` flag is not present. */
            if (!dependencyUpdates.length &&
                !filteredCommits.length &&
                !allowEmptyRelease) {
                return (0, rxjs_1.of)(null);
            }
            return (0, rxjs_1.of)(newVersion);
        }));
    }));
}
exports.tryBump = tryBump;
/* istanbul ignore next */
function _semverBump({ since, preset, projectRoot, tagPrefix, releaseType, preid, }) {
    return (0, rxjs_1.defer)(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const recommended = yield conventionalRecommendedBump(Object.assign(Object.assign({ path: projectRoot, tagPrefix }, (typeof preset === 'string' ? { preset } : {})), (typeof preset === 'object'
            ? { preset: (_a = preset.name) !== null && _a !== void 0 ? _a : 'conventionalcommits', config: preset }
            : {})));
        let recommendedReleaseType = recommended.releaseType;
        if (recommendedReleaseType && releaseType === 'prerelease') {
            recommendedReleaseType =
                ((_b = semver.parse(since)) === null || _b === void 0 ? void 0 : _b.prerelease.length) === 0
                    ? `pre${recommendedReleaseType}`
                    : releaseType;
        }
        return recommendedReleaseType
            ? semver.inc(since, recommendedReleaseType, preid)
            : null;
    }));
}
exports._semverBump = _semverBump;
/* istanbul ignore next */
function _manualBump({ since, releaseType, preid, }) {
    return (0, rxjs_1.defer)(() => {
        const semverArgs = [
            since,
            releaseType,
            ...(preid ? [preid] : []),
        ];
        return (0, rxjs_1.of)(semver.inc(...semverArgs));
    });
}
exports._manualBump = _manualBump;
function shouldCommitBeCalculated({ commit, commitParserOptions, skipCommitTypes, }) {
    const { type } = (0, conventional_commits_parser_1.sync)(commit, commitParserOptions !== null && commitParserOptions !== void 0 ? commitParserOptions : {});
    const shouldSkip = skipCommitTypes.some((typeToSkip) => typeToSkip === type);
    return !shouldSkip;
}
function _getDependencyVersions({ commitParserOptions, preset, dependencyRoots, releaseType, versionTagPrefix, syncVersions, lastVersionGitRef, skipCommitTypes, projectName, preid, }) {
    return (0, rxjs_1.forkJoin)(dependencyRoots.map(({ path: projectRoot, name: dependencyName }) => {
        /* Get dependency version changes since last project version */
        const tagPrefix = (0, tag_1.formatTagPrefix)({
            versionTagPrefix,
            projectName: dependencyName,
            syncVersions,
        });
        const { lastVersion$, commits$ } = getProjectVersion({
            tagPrefix,
            projectRoot,
            releaseType,
            since: lastVersionGitRef,
            projectName,
            preid,
        });
        return (0, rxjs_1.forkJoin)([lastVersion$, commits$]).pipe((0, operators_1.switchMap)(([dependencyLastVersion, commits]) => {
            const filteredCommits = commits.filter((commit) => shouldCommitBeCalculated({
                commit,
                commitParserOptions,
                skipCommitTypes,
            }));
            if (filteredCommits.length === 0) {
                return (0, rxjs_1.of)({
                    type: 'dependency',
                    version: null,
                    dependencyName: dependencyName,
                });
            }
            /* Dependency has changes but has no tagged version */
            if (_isInitialVersion({ lastVersion: dependencyLastVersion })) {
                return _semverBump({
                    since: dependencyLastVersion,
                    preset,
                    projectRoot,
                    tagPrefix,
                }).pipe((0, operators_1.map)((version) => ({
                    type: 'dependency',
                    version,
                    dependencyName: dependencyName,
                })));
            }
            /* Return the changed version of dependency since last commit within project */
            return (0, rxjs_1.of)({
                type: 'dependency',
                version: dependencyLastVersion,
                dependencyName: dependencyName,
            });
        }));
    })).pipe((0, operators_1.defaultIfEmpty)([]));
}
exports._getDependencyVersions = _getDependencyVersions;
function _isNewVersion(version) {
    return version.version !== null && version.version !== initialVersion;
}
exports._isNewVersion = _isNewVersion;
function _isInitialVersion({ lastVersion, }) {
    return lastVersion === initialVersion;
}
exports._isInitialVersion = _isInitialVersion;
//# sourceMappingURL=try-bump.js.map