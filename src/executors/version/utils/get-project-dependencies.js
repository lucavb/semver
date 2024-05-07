"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectDependencies = exports.getDependencyRoots = void 0;
const tslib_1 = require("tslib");
/* istanbul ignore next */
function getDependencyRoots(_a) {
    return tslib_1.__awaiter(this, arguments, void 0, function* ({ trackDeps, projectName, context, }) {
        if (trackDeps) {
            // Include any depended-upon libraries in determining the version bump.
            return (yield getProjectDependencies(projectName)).map((name) => ({
                name,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                path: context.projectsConfigurations.projects[name].root,
            }));
        }
        return [];
    });
}
exports.getDependencyRoots = getDependencyRoots;
/* istanbul ignore next */
function getProjectDependencies(projectName) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { createProjectGraphAsync } = yield Promise.resolve().then(() => require('@nx/devkit'));
        const dependencyGraph = yield createProjectGraphAsync();
        return getProjectsFromDependencies(dependencyGraph.dependencies[projectName]);
    });
}
exports.getProjectDependencies = getProjectDependencies;
/* istanbul ignore next */
function getProjectsFromDependencies(dependencies) {
    return dependencies
        .filter((d) => !d.target.startsWith('npm:'))
        .map((d) => d.target);
}
//# sourceMappingURL=get-project-dependencies.js.map