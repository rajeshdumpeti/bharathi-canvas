import React from "react";
import {
  SectionHeader,
  Card,
  Button,
  IconButton,
  Alert,
  TextField,
  SelectField,
} from "components/ui/index";
import { FiPlus, FiTrash2 } from "react-icons/fi";

interface LinksEditViewProps {
  form: any;
  patch: (p: any) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  alert?: { type: "success" | "error"; msg: string } | null;
  onCloseAlert?: () => void;
  title?: string;
  description?: string;
}

export const LinksEditView: React.FC<LinksEditViewProps> = ({
  form,
  patch,
  onSave,
  onCancel,
  saving,
  alert,
  onCloseAlert,
  title = "Edit Project Links",
  description = "Add or modify links for repositories, documentation, dashboards, and cloud resources.",
}) => {
  const handleAdd = (key: string, emptyItem: any) => {
    patch({ [key]: [...(form[key] || []), emptyItem] });
  };

  const handleRemove = (key: string, idx: number) => {
    const updated = (form[key] || []).filter((_: any, i: number) => i !== idx);
    patch({ [key]: updated });
  };

  const handleChange = (
    key: string,
    idx: number,
    field: string,
    value: any
  ) => {
    const updated = [...(form[key] || [])];
    updated[idx] = { ...updated[idx], [field]: value };
    patch({ [key]: updated });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className="space-y-6 animate-fadeIn"
    >
      {/* Header */}
      <SectionHeader
        title={title}
        subtitle={description}
        actionLabel="Cancel"
        onActionClick={onCancel}
      />

      {alert && (
        <Alert
          type={alert.type}
          message={alert.msg}
          onClose={onCloseAlert}
          className="animate-slideUp"
        />
      )}

      {/* 🧩 Repositories */}
      <Card title="Repositories">
        {(form.repositories || []).map((repo: any, i: number) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4 border-b pb-3"
          >
            <TextField
              label="Name"
              value={repo.name || ""}
              onChange={(v) => handleChange("repositories", i, "name", v)}
            />
            <TextField
              label="URL"
              value={repo.url || ""}
              onChange={(v) => handleChange("repositories", i, "url", v)}
            />
            <TextField
              label="Branch Strategy"
              value={repo.branchStrategy || ""}
              onChange={(v) =>
                handleChange("repositories", i, "branchStrategy", v)
              }
            />
            <TextField
              label="Owner"
              value={repo.owner || ""}
              onChange={(v) => handleChange("repositories", i, "owner", v)}
            />
            <SelectField
              label="Environment"
              value={repo.environment || ""}
              onChange={(e) =>
                handleChange("repositories", i, "environment", repo)
              }
              options={[
                { label: "Development", value: "Dev" },
                { label: "Staging", value: "Staging" },
                { label: "Production", value: "Prod" },
              ]}
            />
            <div className="flex items-end">
              <IconButton
                variant="ghost"
                onClick={() => handleRemove("repositories", i)}
              >
                <FiTrash2 size={16} />
              </IconButton>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            handleAdd("repositories", {
              name: "",
              url: "",
              branchStrategy: "",
              owner: "",
              environment: "",
            })
          }
        >
          <FiPlus size={16} className="mr-1" /> Add Repository
        </Button>
      </Card>

      {/* 📚 Documentation */}
      <Card title="Documentation">
        {(form.documentation || []).map((doc: any, i: number) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4 border-b pb-3"
          >
            <TextField
              label="Type"
              value={doc.type || ""}
              onChange={(v) => handleChange("documentation", i, "type", v)}
            />
            <TextField
              label="URL"
              value={doc.url || ""}
              onChange={(v) => handleChange("documentation", i, "url", v)}
            />
            <TextField
              label="Owner"
              value={doc.owner || ""}
              onChange={(v) => handleChange("documentation", i, "owner", v)}
            />
            <TextField
              label="Description"
              value={doc.description || ""}
              onChange={(v) =>
                handleChange("documentation", i, "description", v)
              }
            />
            <div className="flex items-end">
              <IconButton
                variant="ghost"
                onClick={() => handleRemove("documentation", i)}
              >
                <FiTrash2 size={16} />
              </IconButton>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            handleAdd("documentation", {
              type: "",
              url: "",
              owner: "",
              description: "",
            })
          }
        >
          <FiPlus size={16} className="mr-1" /> Add Document
        </Button>
      </Card>

      {/* 📊 Dashboards */}
      <Card title="Dashboards & Monitoring">
        {(form.dashboards || []).map((d: any, i: number) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4 border-b pb-3"
          >
            <TextField
              label="Tool"
              value={d.tool || ""}
              onChange={(v) => handleChange("dashboards", i, "tool", v)}
            />
            <TextField
              label="URL"
              value={d.url || ""}
              onChange={(v) => handleChange("dashboards", i, "url", v)}
            />
            <TextField
              label="Description"
              value={d.description || ""}
              onChange={(v) => handleChange("dashboards", i, "description", v)}
            />
            <SelectField
              label="Environment"
              value={d.environment || ""}
              onChange={(e) =>
                handleChange("dashboards", i, "environment", d.environment)
              }
              options={[
                { label: "Development", value: "Dev" },
                { label: "Staging", value: "Staging" },
                { label: "Production", value: "Prod" },
              ]}
            />
            <div className="flex items-end">
              <IconButton
                variant="ghost"
                onClick={() => handleRemove("dashboards", i)}
              >
                <FiTrash2 size={16} />
              </IconButton>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            handleAdd("dashboards", {
              tool: "",
              url: "",
              description: "",
              environment: "",
            })
          }
        >
          <FiPlus size={16} className="mr-1" /> Add Dashboard
        </Button>
      </Card>

      {/* ☁️ Cloud & Infrastructure */}
      <Card title="Cloud & Infrastructure">
        {(form.cloud || []).map((c: any, i: number) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4 border-b pb-3"
          >
            <TextField
              label="Provider"
              value={c.provider || ""}
              onChange={(v) => handleChange("cloud", i, "provider", v)}
            />
            <TextField
              label="Resource"
              value={c.resource || ""}
              onChange={(v) => handleChange("cloud", i, "resource", v)}
            />
            <TextField
              label="Access Type"
              value={c.accessType || ""}
              onChange={(v) => handleChange("cloud", i, "accessType", v)}
            />
            <SelectField
              label="Environment"
              value={c.environment || ""}
              onChange={(e) => handleChange("cloud", i, "environment", c)}
              options={[
                { label: "Development", value: "Dev" },
                { label: "Staging", value: "Staging" },
                { label: "Production", value: "Prod" },
              ]}
            />
            <div className="flex items-end">
              <IconButton
                variant="ghost"
                onClick={() => handleRemove("cloud", i)}
              >
                <FiTrash2 size={16} />
              </IconButton>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            handleAdd("cloud", {
              provider: "",
              resource: "",
              accessType: "",
              environment: "",
              url: "",
            })
          }
        >
          <FiPlus size={16} className="mr-1" /> Add Cloud Resource
        </Button>
      </Card>

      {/* 💡 Knowledge Base */}
      <Card title="Knowledge Base">
        {(form.knowledgeBase || []).map((k: any, i: number) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4 border-b pb-3"
          >
            <TextField
              label="Resource"
              value={k.resource || ""}
              onChange={(v) => handleChange("knowledgeBase", i, "resource", v)}
            />
            <TextField
              label="URL"
              value={k.url || ""}
              onChange={(v) => handleChange("knowledgeBase", i, "url", v)}
            />
            <TextField
              label="Owner"
              value={k.owner || ""}
              onChange={(v) => handleChange("knowledgeBase", i, "owner", v)}
            />
            <TextField
              label="Description"
              value={k.description || ""}
              onChange={(v) =>
                handleChange("knowledgeBase", i, "description", v)
              }
            />
            <div className="flex items-end">
              <IconButton
                variant="ghost"
                onClick={() => handleRemove("knowledgeBase", i)}
              >
                <FiTrash2 size={16} />
              </IconButton>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            handleAdd("knowledgeBase", {
              resource: "",
              url: "",
              owner: "",
              description: "",
            })
          }
        >
          <FiPlus size={16} className="mr-1" /> Add Knowledge Resource
        </Button>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};
