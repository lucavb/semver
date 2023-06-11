import { type ExecutorContext } from '@nx/devkit';
import type { VersionBuilderSchema } from './schema';
export default function version(options: VersionBuilderSchema, context: ExecutorContext): Promise<{
    success: boolean;
}>;
