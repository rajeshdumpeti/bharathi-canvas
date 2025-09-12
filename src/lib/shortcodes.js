export function expandShortcodes(md) {
    if (!md) return md;

    // :::decision ... :::
    md = md.replace(/:::\s*decision([\s\S]*?):::/g, (_, body) => {
        const html = body
            .trim()
            .replace(/^Title:\s*(.*)$/im, '<div><strong>Title:</strong> $1</div>')
            .replace(/^Why:\s*(.*)$/im, '<div><strong>Why:</strong> $1</div>')
            .replace(/^Date:\s*(.*)$/im, '<div><strong>Date:</strong> $1</div>');
        return `<div class="bc-block bc-decision">${html}</div>`;
    });

    // :::caution ... :::
    md = md.replace(/:::\s*caution([\s\S]*?):::/g, (_, body) => {
        const text = body.trim();
        return `<div class="bc-block bc-caution">${text}</div>`;
    });

    // Add more: :::risk, :::todo, :::snippet, etc.
    return md;
}
