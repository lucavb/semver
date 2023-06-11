"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const fs_1 = require("fs");
const init_conventional_commit_readable_stream_1 = require("./init-conventional-commit-readable-stream");
const START_OF_LAST_RELEASE_PATTERN = /(^#+ \[?[0-9]+\.[0-9]+\.[0-9]+|<a name=)/m;
function writeChangelog(config, newVersion) {
    return buildConventionalChangelog(config, newVersion)
        .then((newContent) => {
        if (config.dryRun) {
            return console.info(`\n---\n${chalk.gray(newContent.trim())}\n---\n`);
        }
        try {
            (0, fs_1.accessSync)(config.changelogPath, fs_1.constants.F_OK);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                (0, fs_1.writeFileSync)(config.changelogPath, '\n', 'utf8');
            }
        }
        return (0, fs_1.writeFileSync)(config.changelogPath, config.changelogHeader +
            '\n' +
            (newContent + buildExistingContent(config)).replace(/\n+$/, '\n'), 'utf8');
    })
        .catch((err) => {
        console.warn('changelog creation failed', err);
        return err;
    });
}
exports.default = writeChangelog;
function buildExistingContent(config) {
    const existingContent = (0, fs_1.readFileSync)(config.changelogPath, 'utf-8');
    const existingContentStart = existingContent.search(START_OF_LAST_RELEASE_PATTERN);
    // find the position of the last release and remove header:
    if (existingContentStart !== -1) {
        return existingContent.substring(existingContentStart);
    }
    return existingContent;
}
function buildConventionalChangelog(config, newVersion) {
    return new Promise((resolve, reject) => {
        let changelog = '';
        const changelogStream = (0, init_conventional_commit_readable_stream_1.initConventionalCommitReadableStream)(config, newVersion);
        changelogStream.on('error', function (err) {
            reject(err);
        });
        changelogStream.on('data', function (buffer) {
            changelog += buffer.toString();
        });
        changelogStream.on('end', function () {
            resolve(changelog);
        });
        return;
    });
}
//# sourceMappingURL=write-changelog.js.map