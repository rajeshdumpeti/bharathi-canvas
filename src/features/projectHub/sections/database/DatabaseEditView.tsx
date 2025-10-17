import React from "react";
import { Button, Alert, SectionHeader } from "components/ui/index";
import { DatabasePrimaryCard } from "./components/DatabasePrimaryCard";
import { DatabaseAICard } from "./components/DatabaseAICard";
import { DatabaseGovernanceCard } from "./components/DatabaseGovernanceCard";
import { DatabasePerformanceCard } from "./components/DatabasePerformanceCard";
import { DatabaseRecoveryCard } from "./components/DatabaseRecoveryCard";
import { DatabasePipelineCard } from "./components/DatabasePipelineCard";

export const DatabaseEditView = ({
  form,
  patch,
  onSave,
  alert,
  onCloseAlert,
  onCancel,
}: any) => {
  return (
    <form
      className="space-y-6 animate-fadeIn"
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      <SectionHeader
        title="Database Overview"
        subtitle="Explore all primary, secondary, and AI-related data stores in the system."
        actionLabel="Cancel"
        onActionClick={onCancel}
      />
      {alert && (
        <Alert type={alert.type} message={alert.msg} onClose={onCloseAlert} />
      )}

      <DatabasePrimaryCard
        form={form.primaryDB}
        patch={(v: any) => patch({ primaryDB: { ...form.primaryDB, ...v } })}
      />
      <DatabaseAICard aiDatabases={form.aiDatabases} patch={patch} />
      <DatabaseGovernanceCard governance={form.governance} patch={patch} />
      <DatabasePerformanceCard performance={form.performance} patch={patch} />
      <DatabaseRecoveryCard recovery={form.disasterRecovery} patch={patch} />
      <DatabasePipelineCard pipelines={form.dataPipelines} patch={patch} />

      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Save Changes
        </Button>
      </div>
    </form>
  );
};
