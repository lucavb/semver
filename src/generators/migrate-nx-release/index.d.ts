import { type Tree } from '@nx/devkit';
export default function migrate(tree: Tree, options: {
    skipFormat: boolean;
    skipInstall: boolean;
}): Promise<(() => void) | undefined>;
