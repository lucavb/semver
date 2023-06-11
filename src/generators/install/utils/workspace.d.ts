import { type ProjectConfiguration } from '@nx/devkit';
import type { Tree } from '@nx/devkit';
import type { SchemaOptions } from '../schema';
export type ProjectDefinition = ProjectConfiguration & {
    projectName: string;
};
export declare function listProjects(tree: Tree): ProjectDefinition[];
export declare function updateProjects(tree: Tree, options: SchemaOptions, predicate: (projectName: string) => boolean): void;
export declare function updateWorkspaceFromPrompt(tree: Tree, options: SchemaOptions): Promise<void>;
export declare function updateWorkspaceFromSchema(tree: Tree, options: SchemaOptions): void;
