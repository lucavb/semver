"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initConventionalCommitReadableStream = void 0;
const conventionalChangelog = require("conventional-changelog");
function initConventionalCommitReadableStream(config, newVersion) {
    const context = { version: newVersion };
    return conventionalChangelog({
        preset: config.preset,
        tagPrefix: config.tagPrefix,
    }, context, { merges: null, path: config.projectRoot });
}
exports.initConventionalCommitReadableStream = initConventionalCommitReadableStream;
//# sourceMappingURL=init-conventional-commit-readable-stream.js.map