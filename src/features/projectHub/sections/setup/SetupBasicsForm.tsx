// src/features/projectHub/sections/SetupBasicsForm.tsx
import React from "react";
import { Card, TextField, SelectField, DL } from "components/ui/index";

export function SetupBasicsForm({ form, patch, readonly }: any) {
  if (readonly) {
    return (
      <Card title="Basics">
        <DL
          rows={[
            ["Repository", linkOrDash(form.repoUrl)],
            ["Issue tracker", linkOrDash(form.issueTrackerUrl)],
            ["Design doc", linkOrDash(form.designDocUrl)],
            ["License", form.license || "—"],
            ["Package manager", form.packageManager || "—"],
            ["Node", form.nodeVersion || "—"],
            ["Framework", form.framework || "—"],
            ["Branching", form.branchStrategy || "—"],
          ]}
        />
      </Card>
    );
  }

  return (
    <Card title="Basics">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="Repository URL"
          value={form.repoUrl}
          onChange={(v) => patch({ repoUrl: v })}
          placeholder="https://github.com/you/repo"
        />
        <TextField
          label="Issue Tracker URL"
          value={form.issueTrackerUrl}
          onChange={(v) => patch({ issueTrackerUrl: v })}
          placeholder="https://github.com/you/repo/issues"
        />
        <SelectField
          label="Package Manager"
          value={form.packageManager}
          options={["npm", "yarn", "pnpm"]}
          onChange={(v) => patch({ packageManager: v })}
        />
      </div>
    </Card>
  );
}

function linkOrDash(href: string) {
  if (!href) return "—";
  return (
    <a
      className="text-blue-600 hover:underline break-all"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {href}
    </a>
  );
}
