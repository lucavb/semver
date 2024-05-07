"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConventionalCommitStream = void 0;
const conventionalChangelog = require("conventional-changelog");
/* istanbul ignore next */
function createConventionalCommitStream(config, newVersion) {
    return conventionalChangelog(Object.assign(Object.assign(Object.assign({}, (typeof config.preset === 'string' ? { preset: config.preset } : {})), (typeof config.preset === 'object' ? { config: config.preset } : {})), { tagPrefix: config.tagPrefix, pkg: {
            path: config.projectRoot,
        } }), { version: newVersion }, 
    /// @ts-expect-error - Partially typed API
    { path: config.projectRoot });
}
exports.createConventionalCommitStream = createConventionalCommitStream;
//# sourceMappingURL=conventional-commit.js.map