// src/app/shell/AppShell.tsx
import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import CommandPalette from "../../components/ui/CommandPalette";
import { useSearch } from "../../lib/search/SearchProvider";
import { useAuth } from "../../lib/auth/AuthProvider";

const NAV_LINKS = [
  { to: "/", label: "Dashboard" },
  { to: "/board", label: "Board" },
  { to: "/documents", label: "Documents" },
  { to: "/release-notes", label: "Release Notes" },
  { to: "/project-hub", label: "Project Hub" },
];

const KEYS = {
  BOARD: {
    PROJECTS: "projects",
    TASKS: "tasks",
    SELECTED: "selectedProjectId",
  },
  DOCS: { ITEMS: "docs:items", SELECTED: "docs:selectedId" },
  HUB: {
    PROJECTS: "hub:projects",
    SELECTED: "hub:selectedProjectId",
    ACTIVE: "hub:activeSection",
  },
} as const;

const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const loc = useLocation();
  const { user, signOut } = useAuth();
  const { registerSource, open } = useSearch();

  const onLanding = loc.pathname === "/";
  const showNav = !!user && !onLanding;

  const wantsSidebar =
    loc.pathname.startsWith("/board") ||
    loc.pathname.startsWith("/documents") ||
    loc.pathname.startsWith("/release-notes") ||
    loc.pathname.startsWith("/project-hub");

  // Register search sources (unchanged logic, typed usage)
  useEffect(() => {
    const unBoard = registerSource(
      "board",
      "Board",
      (q: string, { safeGet }: any) => {
        const ql = (q || "").toLowerCase();

        const projectsRaw = safeGet(KEYS.BOARD.PROJECTS, []);
        const projects = Array.isArray(projectsRaw)
          ? projectsRaw
          : Array.isArray(projectsRaw?.projects)
            ? projectsRaw.projects
            : [];

        const tasksRaw = safeGet(KEYS.BOARD.TASKS, []);
        const tasks = Array.isArray(tasksRaw)
          ? tasksRaw
          : Array.isArray(tasksRaw?.tasks)
            ? tasksRaw.tasks
            : [];

        const projItems = projects
          .filter((p: any) => {
            const name = (p?.name ?? "").toString();
            return !ql || name.toLowerCase().includes(ql);
          })
          .slice(0, 10)
          .map((p: any) => ({
            id: `board:project:${p.id}`,
            title: (p?.name ?? "Untitled").toString(),
            subtitle: "Project",
            action: () => {
              if (p?.id) localStorage.setItem(KEYS.BOARD.SELECTED, p.id);
              navigate("/board");
            },
          }));

        const taskItems = tasks
          .filter((t: any) => {
            if (!ql) return false;
            const hay =
              `${t?.title ?? ""} ${t?.description ?? ""}`.toLowerCase();
            return hay.includes(ql);
          })
          .slice(0, 15)
          .map((t: any) => ({
            id: `board:task:${t.id}`,
            title: (t?.title ?? "Untitled").toString(),
            subtitle: "Task",
            action: () => navigate("/board"),
          }));

        return [...projItems, ...taskItems];
      }
    );

    const unDocs = registerSource(
      "docs",
      "Documents",
      (q: string, { safeGet }: any) => {
        const ql = (q || "").toLowerCase();
        const docsRaw = safeGet(KEYS.DOCS.ITEMS, []);
        const docs = Array.isArray(docsRaw)
          ? docsRaw
          : Array.isArray(docsRaw?.items)
            ? docsRaw.items
            : [];

        return docs
          .filter((d: any) => !ql || (d?.name ?? "").toLowerCase().includes(ql))
          .slice(0, 20)
          .map((d: any) => ({
            id: `docs:file:${d.id || d.name}`,
            title: d?.name ?? "Untitled",
            subtitle: (d?.type ?? "Document").toString().toUpperCase(),
            action: () => {
              if (d?.id) localStorage.setItem(KEYS.DOCS.SELECTED, d.id);
              navigate("/documents");
            },
          }));
      }
    );

    const unHub = registerSource(
      "hub",
      "Project Hub",
      (q: string, { safeGet }: any) => {
        const ql = (q || "").toLowerCase();
        const hubRaw = safeGet(KEYS.HUB.PROJECTS, []);
        const hubProjects = Array.isArray(hubRaw)
          ? hubRaw
          : Array.isArray(hubRaw?.projects)
            ? hubRaw.projects
            : [];

        const projectItems = hubProjects
          .filter((p: any) => !ql || (p?.name ?? "").toLowerCase().includes(ql))
          .slice(0, 10)
          .map((p: any) => ({
            id: `hub:project:${p.id}`,
            title: p?.name ?? "Untitled",
            subtitle: "Hub Project",
            action: () => {
              if (p?.id) localStorage.setItem(KEYS.HUB.SELECTED, p.id);
              navigate("/project-hub");
            },
          }));

        const sectionItems: any[] = [];
        if (ql) {
          hubProjects.forEach((p: any) => {
            const sections = Object.keys(p?.sections || {});
            sections.forEach((k) => {
              const data = JSON.stringify(p.sections[k] || {}).toLowerCase();
              if (data.includes(ql)) {
                sectionItems.push({
                  id: `hub:section:${p.id}:${k}`,
                  title: `${p?.name ?? "Project"} — ${k}`,
                  subtitle: "Hub Section",
                  action: () => {
                    if (p?.id) localStorage.setItem(KEYS.HUB.SELECTED, p.id);
                    localStorage.setItem(KEYS.HUB.ACTIVE, k);
                    navigate("/project-hub");
                  },
                });
              }
            });
          });
        }

        return [...projectItems, ...sectionItems].slice(0, 20);
      }
    );

    return () => {
      unBoard();
      unDocs();
      unHub();
    };
  }, [navigate, registerSource]);

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      <div className="w-full">
        <Header
          showHamburger={wantsSidebar}
          onToggleSidebar={() =>
            window.dispatchEvent(new CustomEvent("app:toggleSidebar"))
          }
          showTitle
          navLinks={showNav ? NAV_LINKS : []}
          user={user}
          onSignOut={signOut}
          onOpenSearch={open}
        />
      </div>

      <main className="flex-1 min-h-0 overflow-auto">
        <Outlet />
      </main>
      <Footer />
      <CommandPalette />
    </div>
  );
};

export default AppShell;
