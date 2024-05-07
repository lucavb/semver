"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChangelog = void 0;
const devkit_1 = require("@nx/devkit");
function createChangelog(tree, libraryRoot) {
    if (tree.exists((0, devkit_1.joinPathFragments)(libraryRoot, 'CHANGELOG.md'))) {
        return;
    }
    (0, devkit_1.generateFiles)(tree, (0, devkit_1.joinPathFragments)(__dirname, '../files'), // path to the file templates
    libraryRoot, {});
}
exports.createChangelog = createChangelog;
//# sourceMappingURL=create-changelog.js.map