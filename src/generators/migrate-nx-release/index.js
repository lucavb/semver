"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const devkit_1 = require("@nx/devkit");
const changelog_1 = require("../../executors/version/utils/changelog");
/* eslint-disable @typescript-eslint/no-non-null-assertion */
function migrate(tree, options) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const projects = Array.from((0, devkit_1.getProjects)(tree));
        const syncModeDetected = projects.some(([, projectConfig]) => {
            return getSemverOptions(projectConfig).syncVersions === true;
        });
        if (syncModeDetected) {
            devkit_1.logger.info('Sync mode detected, skipping migration. Please migrate your workspace manually.');
            return;
        }
        const semverProjects = projects.filter(([, projectConfig]) => findVersionTarget(projectConfig) !== undefined);
        if (semverProjects.length === 0) {
            devkit_1.logger.info('No config detected, skipping migration.');
            return;
        }
        const multipleSemverConfigsDetected = semverProjects
            .map(([, projectConfig]) => findVersionTarget(projectConfig))
            .every(([, { options }], _, [[, { options: baseOptions }]]) => JSON.stringify(options) === JSON.stringify(baseOptions)) === false;
        if (multipleSemverConfigsDetected) {
            devkit_1.logger.info('Multiple semver configs detected, the migration can eventually break your workspace. Please verify the changes.');
        }
        configureNxRelease(tree, semverProjects);
        semverProjects.forEach(([projectName, projectConfig]) => {
            removeSemverTargets(tree, projectName, projectConfig);
            removeSemverChangelogHeader(tree, projectConfig);
        });
        (0, devkit_1.updateJson)(tree, 'nx.json', (nxJson) => {
            var _a;
            Object.entries((_a = nxJson === null || nxJson === void 0 ? void 0 : nxJson.targetDefaults) !== null && _a !== void 0 ? _a : {}).forEach(([targetKey, target]) => {
                if (targetKey === 'version' ||
                    targetKey.includes('semver') ||
                    targetKey.includes('ngx-deploy-npm') ||
                    /npm publish/.test(JSON.stringify(target))) {
                    delete nxJson.targetDefaults[targetKey];
                }
            });
            return nxJson;
        });
        (0, devkit_1.updateJson)(tree, 'package.json', (packageJson) => {
            ['@jscutlery/semver', 'ngx-deploy-npm'].forEach((dep) => {
                var _a, _b;
                (_a = packageJson === null || packageJson === void 0 ? void 0 : packageJson.dependencies) === null || _a === void 0 ? true : delete _a[dep];
                (_b = packageJson === null || packageJson === void 0 ? void 0 : packageJson.devDependencies) === null || _b === void 0 ? true : delete _b[dep];
            });
            return packageJson;
        });
        if (tree.exists('.github') ||
            tree.exists('.gitlab-ci.yml') ||
            tree.exists('.circleci') ||
            tree.exists('.travis.yml')) {
            devkit_1.logger.info('CI setup detected, please update your CI configuration to use Nx Release.');
        }
        if (!options.skipFormat) {
            yield (0, devkit_1.formatFiles)(tree);
        }
        return () => {
            !options.skipInstall && (0, devkit_1.installPackagesTask)(tree);
        };
    });
}
exports.default = migrate;
function removeSemverTargets(tree, projectName, projectConfig) {
    var _a, _b;
    devkit_1.logger.info(`[${projectName}] config detected, removing it.`);
    const [versionTarget, targetConfig] = findVersionTarget(projectConfig);
    const postTargets = ((_b = (_a = targetConfig.options) === null || _a === void 0 ? void 0 : _a.postTargets) !== null && _b !== void 0 ? _b : []).filter((target) => {
        var _a, _b;
        // Note: we are not using parseTargetString here as we need to pass the project graph, let's keep it simple.
        const targetName = target.includes(':') ? target.split(':')[1] : target;
        const executor = (_a = projectConfig.targets) === null || _a === void 0 ? void 0 : _a[targetName].executor;
        return ((executor === null || executor === void 0 ? void 0 : executor.includes('semver')) ||
            (executor === null || executor === void 0 ? void 0 : executor.includes('ngx-deploy-npm')) ||
            // Drop targets defined with both format:
            // { command: "npm publish" }
            // { executor: "nx:run-commands", options: { commands: "npm publish" } }
            /npm publish/.test(JSON.stringify((_b = projectConfig.targets) === null || _b === void 0 ? void 0 : _b[targetName])) ||
            false);
    });
    if (postTargets.length > 0) {
        devkit_1.logger.info(`[${projectName}] Post-targets detected, removing: "${postTargets.join('", "')}".`);
    }
    [versionTarget, ...postTargets].forEach((target) => {
        delete projectConfig.targets[target];
    });
    (0, devkit_1.updateProjectConfiguration)(tree, projectName, projectConfig);
}
function configureNxRelease(tree, semverProjects) {
    var _a, _b, _c, _d;
    const nxJson = (0, devkit_1.readNxJson)(tree);
    if (nxJson == null) {
        devkit_1.logger.info('No nx.json detected, skipping Nx Release configuration.');
        return;
    }
    devkit_1.logger.info('Configuring Nx Release.');
    // We assume that all projects have the same configuration, so we only take the first one.
    const [, semverConfig] = semverProjects[0];
    const options = getSemverOptions(semverConfig);
    const tagPrefix = (_a = options.tagPrefix) !== null && _a !== void 0 ? _a : '{projectName}-';
    const skipProjectChangelog = (_b = options.skipProjectChangelog) !== null && _b !== void 0 ? _b : false;
    const githubRelease = Object.values(semverConfig.targets).some(({ executor }) => { var _a; return (_a = executor === null || executor === void 0 ? void 0 : executor.includes('semver:github')) !== null && _a !== void 0 ? _a : false; });
    (_c = nxJson.release) !== null && _c !== void 0 ? _c : (nxJson.release = {
        releaseTagPattern: `${tagPrefix}{version}`,
        projects: semverProjects.map(([projectName]) => projectName),
        projectsRelationship: 'independent',
        version: {
            conventionalCommits: true,
        },
        git: Object.assign({ commit: (_d = !options.skipCommit) !== null && _d !== void 0 ? _d : true }, (tree.exists('.husky') ? { commitArgs: '--no-verify' } : {})),
        changelog: {
            automaticFromRef: true,
            projectChangelogs: Object.assign({ createRelease: githubRelease ? 'github' : false }, (skipProjectChangelog ? { file: false } : {})),
        },
    });
    (0, devkit_1.writeJson)(tree, 'nx.json', nxJson);
}
function findVersionTarget(projectConfig) {
    var _a;
    return Object.entries((_a = projectConfig.targets) !== null && _a !== void 0 ? _a : {}).find(([, { executor }]) => { var _a; return (_a = executor === null || executor === void 0 ? void 0 : executor.includes('semver:version')) !== null && _a !== void 0 ? _a : false; });
}
function getSemverOptions(projectConfig) {
    var _a, _b;
    return (_b = (_a = findVersionTarget(projectConfig)) === null || _a === void 0 ? void 0 : _a[1].options) !== null && _b !== void 0 ? _b : {};
}
function removeSemverChangelogHeader(tree, projectConfig) {
    var _a;
    const changelog = projectConfig.root + '/CHANGELOG.md';
    if (tree.exists(changelog)) {
        const content = tree.read(changelog).toString('utf-8');
        tree.write(changelog, content.replace((_a = getSemverOptions(projectConfig).changelogHeader) !== null && _a !== void 0 ? _a : changelog_1.defaultHeader, ''));
    }
}
//# sourceMappingURL=index.js.map