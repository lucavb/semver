import type { Observable } from 'rxjs';
export declare function getLastVersion({ tagPrefix, includePrerelease, preid, }: {
    tagPrefix: string;
    includePrerelease?: boolean;
    preid?: string;
}): Observable<string>;
