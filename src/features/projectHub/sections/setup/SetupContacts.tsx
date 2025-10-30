import React from "react";
import { Card, TextField, IconButton, Empty } from "components/ui/index";
import { updateAt, removeAt } from "utils/immutables";

interface Props {
  form: any;
  patch?: (p: any) => void;
  readonly?: boolean;
}

export const SetupContacts: React.FC<Props> = ({ form, patch, readonly }) => {
  if (readonly) {
    return (
      <Card title="Contacts">
        {form.contacts?.length ? (
          <ul className="text-sm space-y-2">
            {form.contacts.map((c: any, i: number) => (
              <li key={i}>
                <span className="font-medium">{c.role || "Contact"}</span>{" "}
                {c.name ? `— ${c.name}` : ""}{" "}
                {c.email && (
                  <a
                    className="text-blue-600 hover:underline"
                    href={`mailto:${c.email}`}
                  >
                    {c.email}
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <Empty text="No contacts added." />
        )}
      </Card>
    );
  }

  return (
    <Card title="Contacts">
      <div className="space-y-3">
        {form.contacts.map((c: any, i: number) => (
          <div key={i} className="grid md:grid-cols-3 gap-3 items-start">
            <TextField
              label="Role"
              value={c.role}
              onChange={(v) =>
                patch?.({ contacts: updateAt(form.contacts, i, { role: v }) })
              }
            />
            <TextField
              label="Name"
              value={c.name}
              onChange={(v) =>
                patch?.({ contacts: updateAt(form.contacts, i, { name: v }) })
              }
            />
            <div className="flex gap-2">
              <TextField
                label="Email"
                value={c.email}
                onChange={(v) =>
                  patch?.({
                    contacts: updateAt(form.contacts, i, { email: v }),
                  })
                }
                className="flex-1"
              />
              <IconButton
                variant="ghost"
                onClick={() =>
                  patch?.({ contacts: removeAt(form.contacts, i) })
                }
              >
                Remove
              </IconButton>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3">
        <IconButton
          variant="neutral"
          onClick={() =>
            patch?.({
              contacts: [...form.contacts, { role: "", name: "", email: "" }],
            })
          }
        >
          Add contact
        </IconButton>
      </div>
    </Card>
  );
};
