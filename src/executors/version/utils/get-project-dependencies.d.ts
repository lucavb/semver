import type { ExecutorContext } from '@nx/devkit';
import type { VersionBuilderSchema } from '../schema';
export interface DependencyRoot {
    name: string;
    path: string;
}
export declare function getDependencyRoots({ trackDeps, projectName, context, }: Required<Pick<VersionBuilderSchema, 'trackDeps'>> & Pick<VersionBuilderSchema, 'releaseAs'> & {
    projectName: string;
    context: ExecutorContext;
}): Promise<DependencyRoot[]>;
export declare function getProjectDependencies(projectName: string): Promise<string[]>;
