"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectRoots = exports.getProject = void 0;
const path_1 = require("path");
/* istanbul ignore next */
function getProject(context) {
    var _a;
    const project = (_a = context.projectsConfigurations) === null || _a === void 0 ? void 0 : _a.projects[context.projectName];
    if (!project) {
        throw new Error(`Project root not found for ${context.projectName}`);
    }
    return project;
}
exports.getProject = getProject;
/* istanbul ignore next */
function getProjectRoots(workspaceRoot, workspace) {
    var _a;
    const projects = Object.values((_a = workspace === null || workspace === void 0 ? void 0 : workspace.projects) !== null && _a !== void 0 ? _a : {});
    if (projects.length === 0) {
        throw new Error('No projects found in workspace');
    }
    return projects.map((project) => typeof project === 'string'
        ? (0, path_1.resolve)(workspaceRoot, project)
        : (0, path_1.resolve)(workspaceRoot, project.root));
}
exports.getProjectRoots = getProjectRoots;
//# sourceMappingURL=workspace.js.map