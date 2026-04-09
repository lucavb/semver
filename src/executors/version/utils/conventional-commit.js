"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConventionalCommitStream = createConventionalCommitStream;
const path = require("node:path");
const conventionalChangelog = require("conventional-changelog");
/* istanbul ignore next */
function createConventionalCommitStream(config, newVersion) {
    return conventionalChangelog(Object.assign(Object.assign(Object.assign({}, (typeof config.preset === 'string' ? { preset: config.preset } : {})), (typeof config.preset === 'object' ? { config: config.preset } : {})), { tagPrefix: config.tagPrefix, pkg: {
            path: path.join(config.projectRoot, 'package.json'),
        } }), { version: newVersion }, 
    /// @ts-expect-error - Partially typed API
    { path: config.projectRoot }, config.commitParserOptions);
}
//# sourceMappingURL=conventional-commit.js.map