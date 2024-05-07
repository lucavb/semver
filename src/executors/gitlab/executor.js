"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const devkit_1 = require("@nx/devkit");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const exec_1 = require("../common/exec");
function runExecutor(_a) {
    return tslib_1.__awaiter(this, arguments, void 0, function* ({ tag, ref, assets, description, milestones, name, releasedAt, }) {
        const createRelease$ = (0, exec_1.exec)('release-cli', [
            'create',
            ...['--tag-name', tag],
            ...(name ? ['--name', name] : []),
            ...(description ? ['--description', description] : []),
            ...(milestones
                ? milestones.map((milestone) => ['--milestone', milestone]).flat()
                : []),
            ...(releasedAt ? ['--released-at', releasedAt] : []),
            ...(ref ? ['--ref', ref] : []),
            ...(assets
                ? assets
                    .map((asset) => [
                    '--assets-link',
                    `{"name": "${asset.name}", "url": "${asset.url}"}`,
                ])
                    .flat()
                : []),
        ]).pipe((0, operators_1.mapTo)({ success: true }), (0, operators_1.catchError)((response) => {
            devkit_1.logger.error(response);
            return (0, rxjs_1.of)({ success: false });
        }));
        return (0, rxjs_1.lastValueFrom)(createRelease$);
    });
}
exports.default = runExecutor;
//# sourceMappingURL=executor.js.map