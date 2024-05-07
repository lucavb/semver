import { Options as CommitParserOptions } from 'conventional-commits-parser';
import { type Observable } from 'rxjs';
import type { PresetOpt, ReleaseIdentifier } from '../schema';
import { type Version } from '../version';
import { type DependencyRoot } from './get-project-dependencies';
export interface NewVersion {
    version: string;
    previousVersion: string;
    dependencyUpdates: Version[];
}
export declare function getProjectVersion({ tagPrefix, projectRoot, releaseType, since, projectName, preid, }: {
    tagPrefix: string;
    projectRoot: string;
    releaseType?: ReleaseIdentifier;
    since?: string;
    projectName: string;
    preid?: string;
}): {
    lastVersion$: Observable<string>;
    commits$: Observable<string[]>;
    lastVersionGitRef$: Observable<string>;
};
/**
 * Return new version or null if nothing changed.
 */
export declare function tryBump({ commitParserOptions, preset, projectRoot, tagPrefix, dependencyRoots, releaseType, preid, versionTagPrefix, syncVersions, allowEmptyRelease, skipCommitTypes, projectName, }: {
    commitParserOptions?: CommitParserOptions;
    preset: PresetOpt;
    projectRoot: string;
    tagPrefix: string;
    dependencyRoots?: DependencyRoot[];
    releaseType?: ReleaseIdentifier;
    preid?: string;
    versionTagPrefix?: string | null;
    syncVersions: boolean;
    allowEmptyRelease?: boolean;
    skipCommitTypes: string[];
    projectName: string;
}): Observable<NewVersion | null>;
export declare function _semverBump({ since, preset, projectRoot, tagPrefix, releaseType, preid, }: {
    since: string;
    preset: PresetOpt;
    projectRoot: string;
    tagPrefix: string;
    releaseType?: ReleaseIdentifier;
    preid?: string;
}): Observable<string | null>;
export declare function _manualBump({ since, releaseType, preid, }: {
    since: string;
    releaseType: string;
    preid?: string;
}): Observable<string | null>;
export declare function _getDependencyVersions({ commitParserOptions, preset, dependencyRoots, releaseType, versionTagPrefix, syncVersions, lastVersionGitRef, skipCommitTypes, projectName, preid, }: {
    commitParserOptions?: CommitParserOptions;
    preset: PresetOpt;
    lastVersionGitRef: string;
    dependencyRoots: DependencyRoot[];
    releaseType?: ReleaseIdentifier;
    skipCommitTypes: string[];
    versionTagPrefix?: string | null;
    syncVersions: boolean;
    projectName: string;
    preid?: string;
}): Observable<Version[]>;
export declare function _isNewVersion(version: Version): boolean;
export declare function _isInitialVersion({ lastVersion, }: {
    lastVersion: string;
}): boolean;
