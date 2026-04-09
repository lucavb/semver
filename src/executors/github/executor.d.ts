import type { GithubExecutorSchema } from './schema';
export default function runExecutor({ tag, files, notes, notesFile, target, draft, title, prerelease, discussionCategory, repo, generateNotes, notesStartTag, }: GithubExecutorSchema): Promise<{
    success: boolean;
} | {
    success: boolean;
}>;
