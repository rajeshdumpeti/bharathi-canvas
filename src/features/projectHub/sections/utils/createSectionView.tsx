import React, { useEffect, useState } from "react";
import { Spinner, EmptyState } from "components/ui/index";
import { useProjectHubContext } from "../../context";

interface SectionOptions {
  sectionType: string;
  title: string;
  description?: string;
  ReadView: React.FC<any>;
  EditView: React.FC<any>;
  defaultValue: any;
}

export function createSectionView({
  sectionType,
  title,
  description,
  ReadView,
  EditView,
  defaultValue,
}: SectionOptions) {
  return function SectionWrapper() {
    const { projectId, getSection, saveSection, isLoading } =
      useProjectHubContext();

    const [form, setForm] = useState(defaultValue);
    const [mode, setMode] = useState<"read" | "edit">("read");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [alert, setAlert] = useState<{
      type: "success" | "error";
      msg: string;
    } | null>(null);

    useEffect(() => {
      if (!projectId) return;
      setLoading(true);
      getSection(sectionType)
        .then((res) => {
          if (!res?.content) setForm(defaultValue);
          else setForm(res.content);
        })
        .catch(async () => {
          // Try to create the section if missing
          await saveSection({
            section_type: sectionType,
            content: defaultValue,
          });
          setForm(defaultValue);
        })
        .finally(() => setLoading(false));
    }, [getSection, projectId]);

    const patch = (p: any) => setForm((f: any) => ({ ...f, ...p }));

    const onSave = async () => {
      setSaving(true);
      try {
        await saveSection({ section_type: sectionType, content: form });
        setAlert({ type: "success", msg: `${title} saved successfully.` });
        setMode("read");
      } catch {
        setAlert({ type: "error", msg: `Failed to save ${title}.` });
      } finally {
        setSaving(false);
        setTimeout(() => setAlert(null), 3000);
      }
    };

    if (!projectId)
      return (
        <EmptyState
          title={`Select a project`}
          description={`Choose a project from sidebar to view ${title}.`}
        />
      );

    if (loading || isLoading)
      return (
        <div className="flex justify-center items-center h-48">
          <Spinner size="lg" color="gray" />
        </div>
      );

    return mode === "read" ? (
      <ReadView
        form={form}
        onEdit={() => setMode("edit")}
        alert={alert}
        onCloseAlert={() => setAlert(null)}
        title={title}
        description={description}
      />
    ) : (
      <EditView
        form={form}
        patch={patch}
        onSave={onSave}
        onCancel={() => setMode("read")}
        saving={saving}
        alert={alert}
        onCloseAlert={() => setAlert(null)}
        title={title}
        description={description}
      />
    );
  };
}
