import React from "react";
import { SectionHeader, Alert } from "components/ui/index";
import { SetupBasicsForm } from "./SetupBasicsForm";
import { SetupTechStack } from "./SetupTechStack";
import { SetupEnvironments } from "./SetupEnvironments";
import { SetupEnvVars } from "./SetupEnvVars";
import { SetupContacts } from "./SetupContacts";

interface SetupReadViewProps {
  form: any;
  onEdit: () => void;
  alert?: { type: "success" | "error"; msg: string } | null;
  onCloseAlert?: () => void;
}

export const SetupReadView: React.FC<SetupReadViewProps> = ({
  form,
  onEdit,
  alert,
  onCloseAlert,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <SectionHeader
        title="Project Setup"
        subtitle="Manage repository, environment, and tooling details."
        actionLabel="Edit"
        onActionClick={onEdit}
      />

      {alert && (
        <Alert
          type={alert.type}
          message={alert.msg}
          onClose={onCloseAlert}
          //   className="animate-slideUp"
        />
      )}

      <SetupBasicsForm form={form} readonly />
      <SetupTechStack form={form} readonly />
      <SetupEnvironments form={form} readonly />
      <SetupEnvVars form={form} readonly />
      <SetupContacts form={form} readonly />
    </div>
  );
};
