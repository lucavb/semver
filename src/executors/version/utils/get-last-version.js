"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastVersion = getLastVersion;
const gitSemverTags = require("git-semver-tags");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const semver = require("semver");
function getLastVersion({ tagPrefix, releaseType, preid, }) {
    return (0, rxjs_1.from)(gitSemverTags({ tagPrefix })).pipe((0, operators_1.switchMap)((tags) => getLastVersionFromTags({ tags, tagPrefix, preid })));
}
function getLastVersionFromTags({ tags, tagPrefix, preid, }) {
    const versions = tags
        .map((tag) => tag.substring(tagPrefix.length))
        .filter((v) => {
        const prerelease = semver.prerelease(v);
        /* Filter-in all versions. */
        if (prerelease == null) {
            return true;
        }
        /* Filter-in all prereleases if no preid is specified. */
        if (preid == null) {
            return true;
        }
        /* Filter-in if preids match. */
        const [versionPreid] = prerelease;
        if (versionPreid === preid) {
            return true;
        }
        /* Filter-out only prereleases with different preids. */
        return false;
    });
    const [version] = versions.sort(semver.rcompare);
    if (version == null) {
        return (0, rxjs_1.throwError)(() => new Error('No semver tag found'));
    }
    return (0, rxjs_1.of)(version);
}
//# sourceMappingURL=get-last-version.js.map