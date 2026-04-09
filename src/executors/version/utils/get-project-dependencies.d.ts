import type { ExecutorContext, ProjectConfiguration, ProjectsConfigurations } from '@nx/devkit';
import type { VersionBuilderSchema } from '../schema';
export interface DependencyRoot {
    name: string;
    path: string;
    options?: VersionBuilderSchema;
}
export declare function getDependencyRoots({ trackDeps, releaseAs, projectName, context, trackDepsWithReleaseAs, }: Required<Pick<VersionBuilderSchema, 'trackDeps'>> & Pick<VersionBuilderSchema, 'releaseAs' | 'trackDepsWithReleaseAs'> & {
    projectName: string;
    context: ExecutorContext;
}): Promise<DependencyRoot[]>;
export declare function getProjectDependencies(projectName: string): Promise<string[]>;
export declare function getDependencyRootsFromProjectNames(projectNames: string[], projectsConfigurations: ProjectsConfigurations | undefined): DependencyRoot[];
export declare function getProjectVersionBuilderSchema(project: ProjectConfiguration): VersionBuilderSchema | undefined;
export declare function getProjectVersionBuilderSchemaFromContext(projectName: string, context: ExecutorContext): VersionBuilderSchema | undefined;
