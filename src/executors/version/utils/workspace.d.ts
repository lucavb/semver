import type { ExecutorContext, ProjectConfiguration, ProjectsConfigurations } from '@nx/devkit';
export declare function getProject(context: ExecutorContext): ProjectConfiguration;
export declare function getProjectRoots(workspaceRoot: string, workspace: ProjectsConfigurations | undefined): string[];
