// Basic helpers to classify tasks and render Markdown release notes

export function classifyTask(task) {
    const labels = (task.labels || []).map((l) => String(l).toLowerCase());
    const has = (kw) => labels.some((l) => l.includes(kw));

    if (has('feature') || has('enhancement') || task.priority === 'High') return 'Features';
    if (has('bug') || has('fix') || has('hotfix')) return 'Fixes';
    if (has('perf') || has('refactor') || has('ux') || has('docs')) return 'Improvements';
    return 'Chores';
}

export function tasksToMarkdown({ version, date, tasks, groupBy = 'type' }) {
    const groups = {};
    const push = (k, t) => {
        groups[k] = groups[k] || [];
        groups[k].push(t);
    };

    tasks.forEach((t) => {
        const key =
            groupBy === 'label'
                ? (t.labels && t.labels[0]) || 'Other'
                : classifyTask(t);
        push(key, t);
    });

    const header = `## ${version} — ${date}\n`;
    const sections = Object.entries(groups)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([title, items]) => {
            const emoji =
                title === 'Features' ? '✨' :
                    title === 'Fixes' ? '🐛' :
                        title === 'Improvements' ? '⚙️' : '🧹';

            const lines = items
                .sort((a, b) => (a.title || '').localeCompare(b.title || ''))
                .map((t) => {
                    const id = t.id ? ` (${String(t.id).replace(/^task-/, '#')})` : '';
                    return `- ${emoji} ${t.title || '(untitled)'}${id}`;
                })
                .join('\n');

            return `\n### ${title}\n${lines}\n`;
        })
        .join('\n');

    return header + sections + '\n';
}

export function suggestNextVersion(prevVersion, hasFeature) {
    // Semantic-ish bump: if feature present -> minor, else -> patch
    // Supports vX.Y.Z or X.Y.Z. Falls back to 0.1.0
    const clean = (prevVersion || '').replace(/^v/i, '').trim();
    const parts = clean.split('.').map((n) => parseInt(n, 10));
    let [maj, min, pat] = [0, 0, 0];

    if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) {
        [maj, min, pat] = parts;
    }

    if (hasFeature) {
        min += 1;
        pat = 0;
    } else {
        pat += 1;
    }

    return `v${maj}.${min}.${pat}`;
}
