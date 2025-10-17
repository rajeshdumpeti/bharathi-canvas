import React from "react";
import { Card, TextField, IconButton, Empty } from "components/ui/index";
import { updateAt, removeAt } from "utils/immutables";

interface Props {
  form: any;
  patch?: (p: any) => void;
  readonly?: boolean;
}

export const SetupEnvironments: React.FC<Props> = ({
  form,
  patch,
  readonly,
}) => {
  const environments = form.environments || [];

  if (readonly) {
    return (
      <Card className="lg:col-span-2" title="Environments">
        {environments.length ? (
          <div className="grid md:grid-cols-3 gap-4">
            {environments.map((env: any, i: number) => (
              <div
                key={i}
                className="rounded border p-3 text-sm bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="font-semibold mb-1 text-gray-800">
                  {env.name || `Environment ${i + 1}`}
                </div>
                <div className="text-gray-500">App:</div>
                <div className="break-all text-blue-700">
                  {linkOrDash(env.appUrl)}
                </div>
                <div className="text-gray-500 mt-1">API:</div>
                <div className="break-all text-blue-700">
                  {linkOrDash(env.apiUrl)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty text="No environments configured yet." />
        )}
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2" title="Environments">
      <div className="grid md:grid-cols-3 gap-4">
        {environments.map((env: any, i: number) => (
          <div
            key={i}
            className="rounded border p-3 space-y-2 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between">
              <TextField
                label="Environment Name"
                value={env.name}
                onChange={(v) =>
                  patch?.({
                    environments: updateAt(environments, i, { name: v }),
                  })
                }
                placeholder={`Env ${i + 1}`}
              />
              <IconButton
                variant="ghost"
                size="sm"
                onClick={() =>
                  patch?.({ environments: removeAt(environments, i) })
                }
              >
                Remove
              </IconButton>
            </div>

            <TextField
              label="App URL"
              value={env.appUrl}
              onChange={(v) =>
                patch?.({
                  environments: updateAt(environments, i, { appUrl: v }),
                })
              }
              placeholder="https://app.example.com"
            />

            <TextField
              label="API URL"
              value={env.apiUrl}
              onChange={(v) =>
                patch?.({
                  environments: updateAt(environments, i, { apiUrl: v }),
                })
              }
              placeholder="https://api.example.com"
            />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <IconButton
          variant="neutral"
          onClick={() =>
            patch?.({
              environments: [
                ...environments,
                { name: "", appUrl: "", apiUrl: "" },
              ],
            })
          }
        >
          Add environment
        </IconButton>
      </div>
    </Card>
  );
};

// Helper for safe link rendering
function linkOrDash(href?: string) {
  if (!href) return "—";
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-blue-600 hover:underline"
    >
      {href}
    </a>
  );
}
