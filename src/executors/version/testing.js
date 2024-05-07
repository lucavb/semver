"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFakeContext = exports.setupTestingWorkspace = void 0;
const tslib_1 = require("tslib");
const devkit_1 = require("@nx/devkit");
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = require("path");
const tmp = require("tmp");
const packageManager = 'yarn';
function runNxNewCommand(dir) {
    (0, child_process_1.execSync)(`node ${require.resolve('nx')} new proj --nx-workspace-root=${dir} --no-interactive --skip-install --collection=@nx/workspace --npmScope=proj --preset=apps --e2eTestRunner=none --package-manager=${packageManager}`, {
        cwd: dir,
        stdio: 'ignore',
    });
}
function linkPackage(dir) {
    const json = (0, devkit_1.readJsonFile)((0, path_1.resolve)(dir, 'package.json'));
    json.devDependencies = Object.assign(Object.assign({}, json.devDependencies), { '@jscutlery/semver': `file:${(0, path_1.resolve)(devkit_1.workspaceRoot, 'dist/packages/semver')}` });
    (0, devkit_1.writeJsonFile)((0, path_1.resolve)(dir, 'package.json'), json);
}
function runInstall(dir) {
    (0, child_process_1.execSync)(`${packageManager} config set enableImmutableInstalls false`, {
        cwd: dir,
        stdio: 'inherit',
    });
    (0, child_process_1.execSync)(`${packageManager} install`, {
        cwd: dir,
        stdio: 'inherit',
    });
}
function initGit(dir) {
    (0, child_process_1.execSync)(`
        git init --quiet

        # These are needed by CI.
        git config user.email "bot@jest.io"
        git config user.name "Test Bot"
        git config commit.gpgsign false
`, { cwd: dir, stdio: 'ignore' });
}
function setupTestingWorkspace() {
    /* Create a temporary directory. */
    const tmpDir = tmp.dirSync();
    const originalCwd = process.cwd();
    process.chdir(tmpDir.name);
    const tmpRoot = process.cwd();
    const workspaceRoot = (0, path_1.resolve)(tmpRoot, 'proj');
    // This symlink is workaround for Nx trying to resolve its module locally when generating a new workspace
    (0, fs_1.symlinkSync)((0, path_1.resolve)(originalCwd, 'node_modules'), (0, path_1.resolve)(tmpRoot, 'node_modules'), 'dir');
    runNxNewCommand(tmpRoot);
    initGit(workspaceRoot);
    linkPackage(workspaceRoot);
    runInstall(workspaceRoot);
    return {
        runNx(command) {
            (0, child_process_1.execSync)(`node ${require.resolve('nx')} ${command}`, {
                cwd: workspaceRoot,
                stdio: 'inherit',
            });
        },
        exec(command) {
            (0, child_process_1.execSync)(command, {
                cwd: workspaceRoot,
                stdio: 'inherit',
            });
        },
        generateLib(name, options = '') {
            const commonArgs = `--unitTestRunner=none --linter=none --bundler=none --minimal --skipFormat --projectNameAndRootFormat=as-provided`;
            this.runNx(`g @nx/js:lib ${name} --directory=libs/${name} ${commonArgs} ${options}`);
        },
        installSemver(project, options = '') {
            this.runNx(`g @jscutlery/semver:install --projects=${project} --interactive=false ${options}`);
        },
        tearDown() {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield fs_1.promises.rm(tmpRoot, { recursive: true });
                process.chdir(originalCwd);
            });
        },
        root: workspaceRoot,
    };
}
exports.setupTestingWorkspace = setupTestingWorkspace;
function createFakeContext({ cwd = process.cwd(), project, projectRoot, workspaceRoot, targets = {}, additionalProjects = [], }) {
    return {
        isVerbose: false,
        cwd: cwd,
        root: workspaceRoot,
        projectName: project,
        projectsConfigurations: {
            version: 2,
            projects: Object.assign({ [project]: {
                    root: projectRoot,
                    targets,
                } }, assembleAdditionalProjects(additionalProjects)),
        },
        projectGraph: {
            nodes: {},
            dependencies: {},
        },
    };
}
exports.createFakeContext = createFakeContext;
function assembleAdditionalProjects(additionalProjects) {
    return additionalProjects.reduce((acc, p) => {
        acc[p.project] = {
            root: p.projectRoot,
            targets: p.targets || {},
        };
        return acc;
    }, {});
}
//# sourceMappingURL=testing.js.map