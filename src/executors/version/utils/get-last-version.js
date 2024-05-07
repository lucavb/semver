"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastVersion = void 0;
const gitSemverTags = require("git-semver-tags");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const semver = require("semver");
function getLastVersion({ tagPrefix, releaseType, preid, }) {
    return (0, rxjs_1.from)(gitSemverTags({ tagPrefix })).pipe((0, operators_1.switchMap)((tags) => {
        const versions = tags
            .map((tag) => tag.substring(tagPrefix.length))
            .filter((v) => {
            const prerelease = semver.prerelease(v);
            /* Filter-in everything except prereleases. */
            if (prerelease == null) {
                return true;
            }
            /* Filter-in everything if preid is not set. */
            if (releaseType && preid == null) {
                return true;
            }
            /* Filter-in if preids match. */
            const [versionPreid] = prerelease;
            if (releaseType && versionPreid === preid) {
                return true;
            }
            /* Filter-out everything else.*/
            return false;
        });
        const [version] = versions.sort(semver.rcompare);
        if (version == null) {
            return (0, rxjs_1.throwError)(() => new Error('No semver tag found'));
        }
        return (0, rxjs_1.of)(version);
    }));
}
exports.getLastVersion = getLastVersion;
//# sourceMappingURL=get-last-version.js.map