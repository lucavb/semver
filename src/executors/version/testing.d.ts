import { ExecutorContext, TargetConfiguration } from '@nx/devkit';
export interface TestingWorkspace {
    exec(command: string): void;
    runNx(command: string): void;
    generateLib(name: string, options?: string): void;
    installSemver(project: string, preset?: string): void;
    tearDown(): Promise<void>;
    root: string;
}
export declare function setupTestingWorkspace(): TestingWorkspace;
export declare function createFakeContext({ cwd, project, projectRoot, workspaceRoot, targets, additionalProjects, }: {
    cwd?: string;
    project: string;
    projectRoot: string;
    workspaceRoot: string;
    targets?: Record<string, TargetConfiguration>;
    additionalProjects?: {
        project: string;
        projectRoot: string;
        targets?: Record<string, TargetConfiguration>;
    }[];
}): ExecutorContext;
