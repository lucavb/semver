import * as semver from 'semver';
import type { Observable } from 'rxjs';
export declare function getLastVersion({ tagPrefix, releaseType, preid, }: {
    tagPrefix: string;
    releaseType?: semver.ReleaseType;
    preid?: string;
}): Observable<string>;
