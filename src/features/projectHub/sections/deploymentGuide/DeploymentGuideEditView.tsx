import React from "react";
import {
  SectionHeader,
  Card,
  Alert,
  TextField,
  SelectField,
  Button,
} from "components/ui/index";
import { FaPlus, FaTrash } from "react-icons/fa";

export const DeploymentGuideEditView = ({
  form,
  patch,
  onSave,
  onCancel,
  saving,
  alert,
  onCloseAlert,
}) => {
  // ---- Handlers ----
  const handleEnvChange = (index, field, value) => {
    const updated = [...form.environments];
    updated[index][field] = value;
    patch({ environments: updated });
  };

  const handleAddEnv = () => {
    patch({
      environments: [
        ...form.environments,
        {
          name: "",
          url: "",
          infraType: "",
          branch: "",
          notes: "",
        },
      ],
    });
  };

  const handleRemoveEnv = (index) => {
    const updated = form.environments.filter((_, i) => i !== index);
    patch({ environments: updated });
  };

  const handleScriptChange = (index, field, value) => {
    const updated = [...form.scripts];
    updated[index][field] = value;
    patch({ scripts: updated });
  };

  const handleAddScript = () => {
    patch({
      scripts: [...form.scripts, { name: "", command: "" }],
    });
  };

  const handleRemoveScript = (index) => {
    patch({
      scripts: form.scripts.filter((_, i) => i !== index),
    });
  };

  // ---- Render ----
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className="space-y-6 animate-fadeIn"
    >
      <SectionHeader
        title="Deployment Guide"
        subtitle="Update CI/CD configuration, environments, and scripts."
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

      {/* Overview */}
      <Card title="Overview">
        <TextField
          label="Overview"
          value={form.overview}
          onChange={(v) => patch({ overview: v })}
          placeholder="Describe overall deployment strategy and infrastructure..."
        />
      </Card>

      {/* Environments */}
      <Card
        title="Environments"
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddEnv}
          >
            <FaPlus className="mr-2" /> Add Environment
          </Button>
        }
      >
        {form.environments?.length ? (
          <div className="space-y-4">
            {form.environments.map((env, i) => (
              <div
                key={i}
                className="border rounded-lg p-4 bg-gray-50 relative group"
              >
                <button
                  type="button"
                  className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition"
                  onClick={() => handleRemoveEnv(i)}
                >
                  <FaTrash size={14} />
                </button>

                <div className="grid md:grid-cols-2 gap-3">
                  <TextField
                    label="Environment Name"
                    value={env.name}
                    onChange={(v) => handleEnvChange(i, "name", v)}
                  />
                  <SelectField
                    label="Infra Type"
                    value={env.infraType}
                    onChange={(v) => handleEnvChange(i, "infraType", v)}
                    options={[
                      "Docker Compose",
                      "Kubernetes",
                      "ECS",
                      "Terraform",
                      "Other",
                    ]}
                  />
                  <TextField
                    label="URL"
                    value={env.url}
                    onChange={(v) => handleEnvChange(i, "url", v)}
                    placeholder="https://example.com"
                  />
                  <TextField
                    label="Branch"
                    value={env.branch}
                    onChange={(v) => handleEnvChange(i, "branch", v)}
                  />
                  <TextField
                    label="Notes"
                    value={env.notes}
                    onChange={(v) => handleEnvChange(i, "notes", v)}
                    placeholder="Deployment instructions or access notes..."
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">
            No environments yet. Add one above.
          </p>
        )}
      </Card>

      {/* CI/CD Pipeline */}
      <Card title="CI/CD Configuration">
        <div className="grid md:grid-cols-2 gap-3">
          <TextField
            label="Tool"
            value={form.ciCd.tool}
            onChange={(v) => patch({ ciCd: { ...form.ciCd, tool: v } })}
            placeholder="GitHub Actions, Jenkins, etc."
          />
          <TextField
            label="Pipeline URL"
            value={form.ciCd.pipelineUrl}
            onChange={(v) => patch({ ciCd: { ...form.ciCd, pipelineUrl: v } })}
            placeholder="https://ci.example.com/pipeline"
          />
          <TextField
            label="Triggers"
            value={form.ciCd.deployTriggers?.join(", ")}
            onChange={(v) =>
              patch({ ciCd: { ...form.ciCd, deployTriggers: v.split(",") } })
            }
            placeholder="PR merge, manual, schedule"
          />
          <TextField
            label="Rollback Strategy"
            value={form.ciCd.rollbackStrategy}
            onChange={(v) =>
              patch({ ciCd: { ...form.ciCd, rollbackStrategy: v } })
            }
            placeholder="Blue/Green, Canary, Manual"
          />
        </div>
      </Card>

      {/* Scripts */}
      <Card
        title="Deployment Scripts"
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddScript}
          >
            <FaPlus className="mr-2" /> Add Script
          </Button>
        }
      >
        {form.scripts?.length ? (
          <div className="space-y-3">
            {form.scripts.map((script, i) => (
              <div
                key={i}
                className="flex items-center gap-3 border rounded-lg p-3 bg-gray-50 relative group"
              >
                <button
                  type="button"
                  className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition"
                  onClick={() => handleRemoveScript(i)}
                >
                  <FaTrash size={14} />
                </button>
                <TextField
                  label="Name"
                  value={script.name}
                  onChange={(v) => handleScriptChange(i, "name", v)}
                  className="flex-1"
                />
                <TextField
                  label="Command"
                  value={script.command}
                  onChange={(v) => handleScriptChange(i, "command", v)}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">No scripts yet.</p>
        )}
      </Card>

      {/* Monitoring */}
      <Card title="Monitoring & Alerts">
        <TextField
          label="Tools"
          value={form.monitoring.tools?.join(", ")}
          onChange={(v) =>
            patch({
              monitoring: { ...form.monitoring, tools: v.split(",") },
            })
          }
          placeholder="Grafana, Dynatrace, CloudWatch"
        />
        <TextField
          label="Dashboards (comma separated URLs)"
          value={form.monitoring.dashboards?.map((d) => d.url).join(", ")}
          onChange={(v) =>
            patch({
              monitoring: {
                ...form.monitoring,
                dashboards: v
                  .split(",")
                  .map((url) => ({ name: url.trim(), url: url.trim() })),
              },
            })
          }
        />
      </Card>

      {/* Notes */}
      <Card title="Additional Notes">
        <TextField
          label="Notes"
          value={form.notes}
          onChange={(v) => patch({ notes: v })}
          placeholder="Add additional deployment tips or warnings..."
        />
      </Card>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};
