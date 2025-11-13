import React, { useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiDownload, FiFileText, FiFile } from "react-icons/fi";

type StatusId = "to_do" | "in_progress" | "validation" | "done";

type Task = {
  id: string;
  project?: string;
  storyId?: string;
  title?: string;
  status?: StatusId | string;
  assignee?: string;
  priority?: "High" | "Medium" | "Low" | string;
  createdAt?: string; // ISO
  completedAt?: string; // ISO
};

type Project = {
  id: string;
  name: string;
  columns?: { id: string; title: string }[];
};

type Props = {
  project: Project | null;
  items: Task[];
};

const STATUS_LABELS: Record<string, string> = {
  to_do: "To Do",
  in_progress: "In Progress",
  validation: "Validation",
  done: "Done",
};

function fmtDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return "—";
  }
}

function csvEscape(val: unknown): string {
  const s = (val ?? "").toString();
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCSVRows(items: Task[]) {
  const headers = [
    "Story ID",
    "Title",
    "Status",
    "Assignee",
    "Priority",
    "Created At",
    "Completed At",
  ];
  const rows = items.map((t) => [
    t.storyId || "",
    t.title || "",
    STATUS_LABELS[t.status ?? ""] || t.status || "",
    t.assignee || "",
    t.priority || "",
    fmtDate(t.createdAt),
    fmtDate(t.completedAt),
  ]);
  return { headers, rows };
}

function downloadCSV(filename: string, items: Task[]) {
  const { headers, rows } = toCSVRows(items);
  const lines = [
    headers.map(csvEscape).join(","),
    ...rows.map((r) => r.map(csvEscape).join(",")),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadPDF(filename: string, projectName: string, items: Task[]) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;

  const title = projectName
    ? `User Stories — Project ${projectName}`
    : "User Stories";
  const asOf = `As of ${new Date().toLocaleString()}`;

  doc.setFontSize(14);
  doc.text(title, margin, 40);
  doc.setFontSize(10);
  doc.text(asOf, margin, 58);

  const columns = [
    { header: "Story ID", dataKey: "storyId" },
    { header: "Title", dataKey: "title" },
    { header: "Status", dataKey: "statusLabel" },
    { header: "Assignee", dataKey: "assignee" },
    { header: "Priority", dataKey: "priority" },
    { header: "Created", dataKey: "createdAt" },
    { header: "Completed", dataKey: "completedAt" },
  ] as const;

  const rows = items.map((t) => ({
    storyId: t.storyId || "",
    title: t.title || "",
    statusLabel: STATUS_LABELS[t.status ?? ""] || t.status || "",
    assignee: t.assignee || "",
    priority: t.priority || "",
    createdAt: fmtDate(t.createdAt),
    completedAt: fmtDate(t.completedAt),
  }));

  autoTable(doc, {
    startY: 70,
    head: [columns.map((c) => c.header)],
    body: rows.map((r) => columns.map((c) => (r as any)[c.dataKey])),
    styles: { fontSize: 9, cellPadding: 6, overflow: "linebreak" },
    headStyles: { fillColor: [33, 33, 33] },
    margin: { left: margin, right: margin },
  });

  doc.save(filename);
}

const ExportStoriesBar: React.FC<Props> = ({ project, items }) => {
  const projectName = project?.name || "All Projects";

  const stamped = useMemo(() => {
    const stamp = new Date().toISOString().slice(0, 10);
    const slug = projectName.toLowerCase().replace(/[^\w]+/g, "-");
    return {
      csv: `${slug}-${stamp}-stories.csv`,
      pdf: `${slug}-${stamp}-stories.pdf`,
    };
  }, [projectName]);

  const handleExportCSV = () => {
    if (items.length === 0) {
      alert("No stories to export. Please adjust your filters.");
      return;
    }
    downloadCSV(stamped.csv, items);
  };

  const handleExportPDF = () => {
    if (items.length === 0) {
      alert("No stories to export. Please adjust your filters.");
      return;
    }
    downloadPDF(stamped.pdf, projectName, items);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleExportCSV}
        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        title={`Export ${items.length} stories to CSV`}
        disabled={items.length === 0}
      >
        <FiDownload className="h-4 w-4" />
        Export CSV
      </button>

      <button
        onClick={handleExportPDF}
        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        title={`Export ${items.length} stories to PDF`}
        disabled={items.length === 0}
      >
        <FiFileText className="h-4 w-4" />
        Export PDF
      </button>
    </div>
  );
};

export default ExportStoriesBar;
