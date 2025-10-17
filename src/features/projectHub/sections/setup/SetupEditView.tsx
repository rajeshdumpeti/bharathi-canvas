import React from "react";
import { Button, Spinner, SectionHeader, Alert } from "components/ui/index";
import { SetupBasicsForm } from "./SetupBasicsForm";
import { SetupTechStack } from "./SetupTechStack";
import { SetupEnvironments } from "./SetupEnvironments";
import { SetupEnvVars } from "./SetupEnvVars";
import { SetupContacts } from "./SetupContacts";

interface SetupEditViewProps {
  form: any;
  patch: (p: any) => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
  saving: boolean;
  alert?: { type: "success" | "error"; msg: string } | null;
  onCloseAlert?: () => void;
}

export const SetupEditView: React.FC<SetupEditViewProps> = ({
  form,
  patch,
  onSave,
  onCancel,
  saving,
  alert,
  onCloseAlert,
}) => {
  return (
    <form
      className="space-y-6 animate-fadeIn"
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      <SectionHeader
        title="Edit Setup"
        subtitle="Modify your setup details below."
        actionLabel="Cancel"
        onActionClick={onCancel}
      />

      {alert && (
        <Alert
          type={alert.type}
          message={alert.msg}
          onClose={onCloseAlert}
          //   className="animate-slideUp"
        />
      )}

      <SetupBasicsForm form={form} patch={patch} />
      <SetupTechStack form={form} patch={patch} />
      <SetupEnvironments form={form} patch={patch} />
      <SetupEnvVars form={form} patch={patch} />
      <SetupContacts form={form} patch={patch} />

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          variant="primary"
          disabled={saving}
          className="flex items-center gap-2"
        >
          {saving && <Spinner size="sm" color="white" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};
