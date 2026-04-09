"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDependencyRoots = getDependencyRoots;
exports.getProjectDependencies = getProjectDependencies;
exports.getDependencyRootsFromProjectNames = getDependencyRootsFromProjectNames;
exports.getProjectVersionBuilderSchema = getProjectVersionBuilderSchema;
exports.getProjectVersionBuilderSchemaFromContext = getProjectVersionBuilderSchemaFromContext;
const tslib_1 = require("tslib");
/* istanbul ignore next */
function getDependencyRoots(_a) {
    return tslib_1.__awaiter(this, arguments, void 0, function* ({ trackDeps, releaseAs, projectName, context, trackDepsWithReleaseAs, }) {
        if (trackDeps && (trackDepsWithReleaseAs || !releaseAs)) {
            // Include any depended-upon libraries in determining the version bump.
            return getDependencyRootsFromProjectNames(yield getProjectDependencies(projectName), context.projectsConfigurations);
        }
        return [];
    });
}
/* istanbul ignore next */
function getProjectDependencies(projectName) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { createProjectGraphAsync } = yield Promise.resolve().then(() => require('@nx/devkit'));
        const dependencyGraph = yield createProjectGraphAsync();
        return getProjectsFromDependencies(dependencyGraph.dependencies[projectName]);
    });
}
/* istanbul ignore next */
function getProjectsFromDependencies(dependencies) {
    return dependencies
        .filter((d) => !d.target.startsWith('npm:'))
        .map((d) => d.target);
}
function getDependencyRootsFromProjectNames(projectNames, projectsConfigurations) {
    if (projectsConfigurations == null) {
        return [];
    }
    return projectNames.flatMap((name) => {
        const project = projectsConfigurations.projects[name];
        if (project == null) {
            return [];
        }
        return {
            name,
            path: project.root,
            options: getProjectVersionBuilderSchema(project),
        };
    });
}
function getProjectVersionBuilderSchema(project) {
    var _a;
    const versionTarget = Object.values((_a = project.targets) !== null && _a !== void 0 ? _a : {}).find((target) => target.executor === '@jscutlery/semver:version');
    if (!versionTarget) {
        return;
    }
    return versionTarget.options || undefined;
}
function getProjectVersionBuilderSchemaFromContext(projectName, context) {
    var _a;
    const project = (_a = context.projectsConfigurations) === null || _a === void 0 ? void 0 : _a.projects[projectName];
    if (project == null) {
        return;
    }
    return getProjectVersionBuilderSchema(project);
}
//# sourceMappingURL=get-project-dependencies.js.map