"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = writeChangelog;
const tslib_1 = require("tslib");
const chalk = require("chalk");
const createPreset = require("conventional-changelog-conventionalcommits");
const fs_1 = require("fs");
const conventional_commit_1 = require("./conventional-commit");
const START_OF_LAST_RELEASE_PATTERN = /(^#+ \[?[0-9]+\.[0-9]+\.[0-9]+|<a name=)/m;
/* istanbul ignore next */
function writeChangelog(config, newVersion) {
    return buildConventionalChangelog(config, newVersion)
        .then((newContent) => {
        if (config.dryRun) {
            return console.info(`\n---\n${chalk.gray(newContent.trim())}\n---\n`);
        }
        try {
            (0, fs_1.accessSync)(config.changelogPath, fs_1.constants.F_OK);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
/* istanbul ignore next */
function buildExistingContent(config) {
    const existingContent = (0, fs_1.readFileSync)(config.changelogPath, 'utf-8');
    const existingContentStart = existingContent.search(START_OF_LAST_RELEASE_PATTERN);
    // find the position of the last release and remove header:
    if (existingContentStart !== -1) {
        return existingContent.substring(existingContentStart);
    }
    return existingContent;
}
/* istanbul ignore next */
function buildConventionalChangelog(config, newVersion) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let preset;
        if (typeof config.preset === 'object') {
            if (config.preset.name) {
                // Use the name property to load a different preset
                preset = config.preset.name;
            }
            else {
                // Fallback to creating a preset from the object
                preset = yield createPreset(config.preset);
            }
        }
        else {
            // Use the preset directly if it's not an object
            preset = config.preset;
        }
        return new Promise((resolve, reject) => {
            let changelog = '';
            const changelogStream = (0, conventional_commit_1.createConventionalCommitStream)(Object.assign(Object.assign({}, config), { preset }), newVersion);
            changelogStream.on('error', function (err) {
                reject(err);
            });
            changelogStream.on('data', function (buffer) {
                changelog += buffer.toString();
            });
            changelogStream.on('end', function () {
                resolve(changelog);
            });
        });
    });
}
//# sourceMappingURL=write-changelog.js.map