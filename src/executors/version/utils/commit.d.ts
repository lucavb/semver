import { type Observable } from 'rxjs';
export declare function commit({ dryRun, noVerify, skipCommit, commitMessage, projectName, }: {
    dryRun: boolean;
    skipCommit: boolean;
    noVerify: boolean;
    commitMessage: string;
    projectName: string;
}): Observable<void>;
export declare function formatCommitMessage({ commitMessageFormat, version, projectName, }: {
    version: string;
    commitMessageFormat: string;
    projectName: string;
}): string;
