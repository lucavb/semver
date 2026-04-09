import { type Tree } from '@nx/devkit';
import type { SchemaOptions } from './schema';
export default function install(tree: Tree, options: SchemaOptions): Promise<() => void>;
