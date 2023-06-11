"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTag = exports.getFirstCommitRef = exports.addToStage = exports.tryPush = exports.getLastCommitHash = exports.getCommits = void 0;
const gitRawCommits = require("git-raw-commits");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const exec_1 = require("../../common/exec");
const logger_1 = require("./logger");
/**
 * Return the list of commit bodies since `since` commit.
 */
function getCommits({ projectRoot, since, }) {
    return getFormattedCommits({
        since,
        projectRoot,
        ignoreMergeCommits: true,
        format: '%B',
    });
}
exports.getCommits = getCommits;
/**
 * Return hash of last commit of a project
 */
function getLastCommitHash({ projectRoot, }) {
    return getFormattedCommits({
        projectRoot,
        ignoreMergeCommits: false,
        format: '%H',
    }).pipe((0, operators_1.map)(([commit]) => commit.trim()));
}
exports.getLastCommitHash = getLastCommitHash;
function getFormattedCommits({ projectRoot, format, ignoreMergeCommits, since = '', }) {
    return new rxjs_1.Observable((observer) => {
        const params = {
            from: since,
            format,
            path: projectRoot,
            'full-history': true,
        };
        if (ignoreMergeCommits) {
            params['no-merges'] = ignoreMergeCommits;
        }
        gitRawCommits(params)
            .on('data', (data) => observer.next(data))
            .on('error', (error) => observer.error(error))
            .on('close', () => observer.complete())
            .on('finish', () => observer.complete());
    }).pipe((0, operators_1.scan)((commits, commit) => [...commits, commit.toString()], []), (0, operators_1.startWith)([]), (0, operators_1.last)());
}
function tryPush({ remote, branch, noVerify, projectName, tag, }) {
    if (remote == null || branch == null) {
        return (0, rxjs_1.throwError)(() => new Error('Missing option --remote or --branch, see: https://github.com/jscutlery/semver#configure.'));
    }
    const gitPushOptions = [...(noVerify ? ['--no-verify'] : [])];
    return (0, exec_1.exec)('git', [
        'push',
        ...gitPushOptions,
        '--atomic',
        remote,
        branch,
        tag,
    ])
        .pipe((0, operators_1.catchError)((error) => {
        if (/atomic/.test(error)) {
            (0, logger_1._logStep)({
                step: 'warning',
                level: 'warn',
                message: 'Git push --atomic failed, attempting non-atomic push.',
                projectName,
            });
            return (0, exec_1.exec)('git', ['push', ...gitPushOptions, remote, branch, tag]);
        }
        return (0, rxjs_1.throwError)(() => error);
    }))
        .pipe((0, logger_1.logStep)({
        step: 'push_success',
        message: `Pushed to "${remote}" "${branch}".`,
        projectName,
    }));
}
exports.tryPush = tryPush;
function addToStage({ paths, dryRun, }) {
    if (paths.length === 0) {
        return rxjs_1.EMPTY;
    }
    const gitAddOptions = [...(dryRun ? ['--dry-run'] : []), ...paths];
    return (0, exec_1.exec)('git', ['add', ...gitAddOptions]).pipe((0, operators_1.map)(() => undefined));
}
exports.addToStage = addToStage;
function getFirstCommitRef() {
    return (0, exec_1.exec)('git', ['rev-list', '--max-parents=0', 'HEAD']).pipe((0, operators_1.map)((output) => {
        return output
            .split('\n')
            .map((c) => c.trim())
            .filter(Boolean)
            .pop();
    }));
}
exports.getFirstCommitRef = getFirstCommitRef;
function createTag({ dryRun, tag, commitHash, commitMessage, projectName, }) {
    if (dryRun) {
        return rxjs_1.EMPTY;
    }
    return (0, exec_1.exec)('git', ['tag', '-a', tag, commitHash, '-m', commitMessage]).pipe((0, operators_1.catchError)((error) => {
        if (/already exists/.test(error)) {
            return (0, rxjs_1.throwError)(() => new Error(`Failed to tag "${tag}", this tag already exists.
            This error occurs because the same version was previously created but the tag does not point to a commit referenced in your base branch.
            Please delete the tag by running "git tag -d ${tag}", make sure the tag has been removed from the remote repository as well and run this command again.`));
        }
        return (0, rxjs_1.throwError)(() => error);
    }), (0, operators_1.map)(() => tag), (0, logger_1.logStep)({
        step: 'tag_success',
        message: `Tagged "${tag}".`,
        projectName,
    }));
}
exports.createTag = createTag;
//# sourceMappingURL=git.js.map