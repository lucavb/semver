"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDependencies = void 0;
const devkit_1 = require("@nx/devkit");
const fs_1 = require("fs");
const PACKAGE_JSON = 'package.json';
const COMMITLINT_VERSION = '^18.0.0';
const HUSKY_VERSION = '^9.0.0';
function addDependencies(tree, options) {
    if (options.enforceConventionalCommits) {
        const preset = _getCommitlintConfig(options);
        if (preset === null) {
            devkit_1.logger.warn(`No commitlint config found for ${options.preset} preset, --enforceConventionalCommits option ignored.`);
            return tree;
        }
        _addCommitlintConfig(tree, options);
        _addHuskyConfig(tree);
        _addHuskyConfigMsg(tree);
        _addDevDependencies(tree, options);
    }
}
exports.addDependencies = addDependencies;
function _addDevDependencies(tree, options) {
    (0, devkit_1.addDependenciesToPackageJson)(tree, {}, {
        '@commitlint/cli': COMMITLINT_VERSION,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        [_getCommitlintConfig(options)]: COMMITLINT_VERSION,
        husky: HUSKY_VERSION,
    });
}
function _addCommitlintConfig(tree, options) {
    const packageJson = (0, devkit_1.readJson)(tree, PACKAGE_JSON);
    const hasConfig = packageJson.commitlint != null ||
        [
            'commitlint.config.js',
            'commitlint',
            '.commitlintrc.js',
            '.commitlintrc.json',
            '.commitlintrc.yml',
        ].some((file) => tree.exists(file));
    if (!hasConfig) {
        tree.write('.commitlintrc.json', JSON.stringify({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            extends: [_getCommitlintConfig(options)],
            rules: {},
        }, null, 2));
    }
    return tree;
}
function _addHuskyConfig(tree) {
    return (0, devkit_1.updateJson)(tree, PACKAGE_JSON, (packageJson) => {
        const hasHusky = tree.exists('.husky/_/husky.sh');
        if (!hasHusky) {
            packageJson.scripts = Object.assign(Object.assign({}, packageJson.scripts), { prepare: 'husky' });
        }
        return packageJson;
    });
}
function _addHuskyConfigMsg(tree) {
    const hasConfigFile = tree.exists('.husky/commit-msg');
    const packageManager = (0, devkit_1.detectPackageManager)(tree.root);
    const command = packageManager === 'npm'
        ? 'npx --no-install'
        : packageManager === 'yarn'
            ? 'yarn run'
            : 'pnpm';
    if (!hasConfigFile) {
        const commitMsg = `#!/bin/sh\n. "$(dirname "$0")/_/husky.sh"\n\n${command} commitlint --edit "$1"\n`;
        tree.write('.husky/commit-msg', commitMsg, {
            /* File mode indicating readable, writable, and executable by owner. */
            mode: fs_1.constants.S_IRWXU,
        });
    }
}
function _getCommitlintConfig(options) {
    switch (options.preset) {
        case 'angular':
            return '@commitlint/config-angular';
        case 'conventionalcommits':
            return '@commitlint/config-conventional';
        default:
            return null;
    }
}
//# sourceMappingURL=dependencies.js.map