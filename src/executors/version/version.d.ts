import { ProjectsConfigurations } from '@nx/devkit';
import { Observable } from 'rxjs';
import { Preset } from './schema';
export type Version = {
    type: 'project';
    version: string | null;
} | {
    type: 'dependency';
    version: string | null;
    dependencyName: string;
};
export interface CommonVersionOptions {
    tag: string;
    dryRun: boolean;
    trackDeps: boolean;
    newVersion: string;
    noVerify: boolean;
    workspaceRoot: string;
    tagPrefix: string;
    changelogHeader: string;
    skipCommit: boolean;
    commitMessage: string;
    projectName: string;
    skipProjectChangelog: boolean;
    dependencyUpdates: Version[];
    preset: Preset;
    workspace: ProjectsConfigurations | undefined;
}
export declare function versionWorkspace({ skipRootChangelog, commitMessage, newVersion, dryRun, noVerify, projectName, tag, skipCommit, projectRoot, ...options }: {
    skipRootChangelog: boolean;
    projectRoot: string;
} & CommonVersionOptions): Observable<string>;
export declare function versionProject({ workspaceRoot, projectRoot, newVersion, dryRun, commitMessage, noVerify, tagPrefix, projectName, skipCommit, tag, ...options }: {
    projectRoot: string;
} & CommonVersionOptions): Observable<string>;
/**
 * istanbul ignore next
 */
export declare function _generateChangelogs({ projectRoots, workspaceRoot, skipRootChangelog, skipProjectChangelog, projectName, ...options }: CommonVersionOptions & {
    skipRootChangelog: boolean;
    projectRoots: string[];
}): Observable<string[]>;
