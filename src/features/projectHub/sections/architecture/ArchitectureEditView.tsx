import React from "react";
import { Button, SectionHeader, Alert } from "components/ui/index";
import ChipInput from "components/ui/typography/ChipInput";
import { ServicesEditor } from "./editors/ServicesEditor";
import { ApiEditor } from "./editors/ApiEditor";
import { SimpleListEditor } from "./editors/SimpleListEditor";

export const ArchitectureEditView = ({
  form,
  patch,
  onSave,
  onCancel,
  saving,
  alert,
  onCloseAlert,
}) => (
  <form
    className="space-y-6 animate-fadeIn"
    onSubmit={(e) => {
      e.preventDefault();
      onSave();
    }}
  >
    <SectionHeader
      title="Edit Architecture"
      subtitle="Modify service, API, and observability data."
      actionLabel="Cancel"
      onActionClick={onCancel}
    />

    {alert && (
      <Alert
        type={alert.type}
        message={alert.msg}
        onClose={onCloseAlert}
        // className="animate-slideUp"
      />
    )}

    <section className="rounded border bg-white p-4">
      <h4 className="font-semibold mb-3">Overview</h4>
      <textarea
        rows={4}
        className="w-full rounded border px-3 py-2"
        value={form.overview}
        onChange={(e) => patch({ overview: e.target.value })}
      />
    </section>

    <section className="rounded border bg-white p-4">
      <h4 className="font-semibold mb-3">Diagrams</h4>
      <SimpleListEditor
        value={form.diagrams}
        onChange={(v) => patch({ diagrams: v })}
        columns={[
          { key: "label", label: "Label" },
          { key: "url", label: "URL" },
        ]}
      />
    </section>

    <section className="rounded border bg-white p-4">
      <h4 className="font-semibold mb-3">Services</h4>
      <ServicesEditor
        value={form.services}
        onChange={(v) => patch({ services: v })}
      />
    </section>

    <section className="rounded border bg-white p-4">
      <h4 className="font-semibold mb-3">APIs</h4>
      <ApiEditor value={form.apis} onChange={(v) => patch({ apis: v })} />
    </section>

    {/* Add more (DataStores, Security, etc.) following the same pattern */}

    <section className="rounded border bg-white p-4">
      <h4 className="font-semibold mb-3">Tags</h4>
      <ChipInput
        value={form.tags || []}
        onChange={(v) => patch({ tags: v })}
        placeholder="Add a tag and press Enter"
      />
    </section>

    <div className="flex justify-end pt-4">
      <Button
        type="submit"
        variant="primary"
        disabled={saving}
        className="flex items-center gap-2"
      >
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  </form>
);
