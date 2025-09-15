import React, { useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const STATUS_LABELS = {
    'to-do': 'To Do',
    'in-progress': 'In Progress',
    'validation': 'Validation',
    'done': 'Done',
};

function fmtDate(iso) {
    if (!iso) return '—';
    try { return new Date(iso).toISOString().slice(0, 10); } catch { return '—'; }
}

function csvEscape(val) {
    const s = (val ?? '').toString();
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
}

function toCSVRows(items) {
    const headers = [
        'Story ID', 'Title', 'Status', 'Assignee', 'Priority',
        'Created At', 'Completed At',
    ];
    const rows = items.map(t => [
        t.storyId || '',
        t.title || '',
        STATUS_LABELS[t.status] || t.status || '',
        t.assignee || '',
        t.priority || '',
        fmtDate(t.createdAt),
        fmtDate(t.completedAt),
    ]);
    return { headers, rows };
}

function downloadCSV(filename, items) {
    const { headers, rows } = toCSVRows(items);
    const lines = [
        headers.map(csvEscape).join(','),
        ...rows.map(r => r.map(csvEscape).join(','))
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function downloadPDF(filename, projectName, items) {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 40;

    const title = projectName ? `User Stories — Project ${projectName}` : 'User Stories';
    const asOf = `As of ${new Date().toLocaleString()}`;

    doc.setFontSize(14);
    doc.text(title, margin, 40);
    doc.setFontSize(10);
    doc.text(asOf, margin, 58);

    const columns = [
        { header: 'Story ID', dataKey: 'storyId' },
        { header: 'Title', dataKey: 'title' },
        { header: 'Status', dataKey: 'statusLabel' },
        { header: 'Assignee', dataKey: 'assignee' },
        { header: 'Priority', dataKey: 'priority' },
        { header: 'Created', dataKey: 'createdAt' },
        { header: 'Completed', dataKey: 'completedAt' },
    ];

    const rows = items.map(t => ({
        storyId: t.storyId || '',
        title: t.title || '',
        statusLabel: STATUS_LABELS[t.status] || t.status || '',
        assignee: t.assignee || '',
        priority: t.priority || '',
        createdAt: fmtDate(t.createdAt),
        completedAt: fmtDate(t.completedAt),
    }));

    autoTable(doc, {
        startY: 70,
        head: [columns.map(c => c.header)],
        body: rows.map(r => columns.map(c => r[c.dataKey])),
        styles: { fontSize: 9, cellPadding: 6, overflow: 'linebreak' },
        headStyles: { fillColor: [33, 33, 33] },
        margin: { left: margin, right: margin },
    });

    doc.save(filename);
}

export default function ExportStoriesBar({ project, items }) {
    const projectName = project?.name || 'All Projects';

    const stamped = useMemo(() => {
        const stamp = new Date().toISOString().slice(0, 10);
        const slug = projectName.toLowerCase().replace(/[^\w]+/g, '-');
        return { csv: `${slug}-${stamp}-stories.csv`, pdf: `${slug}-${stamp}-stories.pdf` };
    }, [projectName]);

    return (
        <div className="flex items-center gap-2 justify-end ">
            <button
                onClick={() => downloadCSV(stamped.csv, items)}
                className="px-2 py-1 rounded border bg-white hover:bg-gray-50 text-gray-700"
                title="Exports the currently filtered list to CSV"
            >
                Export CSV
            </button>
            <button
                onClick={() => downloadPDF(stamped.pdf, projectName, items)}
                className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                title="Exports the currently filtered list to PDF"
            >
                Export PDF
            </button>
        </div>
    );
}
