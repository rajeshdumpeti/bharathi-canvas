import React from "react";
import { Card, Empty } from "components/ui/index";
import ChipInput from "components/ui/typography/ChipInput";

interface Props {
  form: any;
  patch?: (p: any) => void;
  readonly?: boolean;
}

export const SetupTechStack: React.FC<Props> = ({ form, patch, readonly }) => {
  if (readonly) {
    return (
      <Card title="Tech Stack">
        {form.techStack?.length ? (
          <div className="flex flex-wrap gap-2">
            {form.techStack.map((t: string) => (
              <span
                key={t}
                className="px-2 py-1 rounded bg-gray-100 text-xs font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        ) : (
          <Empty text="No technologies added yet." />
        )}
      </Card>
    );
  }

  return (
    <Card title="Tech Stack">
      <ChipInput
        value={form.techStack}
        onChange={(v) => patch?.({ techStack: v })}
        placeholder="Add a technology and press Enter"
      />
    </Card>
  );
};
