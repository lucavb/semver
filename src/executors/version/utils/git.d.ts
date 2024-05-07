import { Observable } from 'rxjs';
/**
 * Return the list of commit bodies since `since` commit.
 */
export declare function getCommits({ projectRoot, since, }: {
    projectRoot: string;
    since?: string;
}): Observable<string[]>;
/**
 * Return hash of last commit of a project
 */
export declare function getLastCommitHash({ projectRoot, }: {
    projectRoot: string;
}): Observable<string>;
export declare function tryPush({ remote, branch, noVerify, projectName, tag, }: {
    tag: string;
    remote: string;
    branch: string;
    noVerify: boolean;
    projectName: string;
}): Observable<string>;
export declare function addToStage({ paths, dryRun, }: {
    paths: string[];
    dryRun: boolean;
}): Observable<void>;
export declare function getFirstCommitRef(): Observable<string>;
export declare function createTag({ dryRun, tag, commitHash, commitMessage, projectName, }: {
    dryRun: boolean;
    tag: string;
    commitHash: string;
    commitMessage: string;
    projectName: string;
}): Observable<string>;
