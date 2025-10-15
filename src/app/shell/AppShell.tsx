// src/app/shell/AppShell.tsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import CommandPalette from "../../components/ui/CommandPalette";
import { useSearch } from "../../lib/search/SearchProvider";
import { useAuth } from "../../lib/auth/AuthProvider";
import { useProjectStore } from "stores/projectStore";

const AppShell: React.FC = () => {
  const loc = useLocation();
  const { user, signOut } = useAuth();
  const { open } = useSearch();
  const { selectedProjectId } = useProjectStore(); // ✅ current project

  const onLanding = loc.pathname === "/";
  const showNav = !!user && !onLanding;

  const navLinks = showNav
    ? [
        { to: "/", label: "Dashboard" },
        { to: "/board", label: "Board" },
        {
          to: selectedProjectId
            ? `/documents?project=${selectedProjectId}`
            : "/documents",
          label: "Documents",
        },
        { to: "/release-notes", label: "Release Notes" },
        { to: "/project-hub", label: "Project Hub" },
        { to: "/ideas", label: "Innovation Lab" },
      ]
    : [];

  const wantsSidebar =
    loc.pathname.startsWith("/board") ||
    loc.pathname.startsWith("/documents") ||
    loc.pathname.startsWith("/release-notes") ||
    loc.pathname.startsWith("/project-hub");

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      <div className="w-full">
        <Header
          showHamburger={wantsSidebar}
          onToggleSidebar={() =>
            window.dispatchEvent(new CustomEvent("app:toggleSidebar"))
          }
          showTitle
          navLinks={showNav ? navLinks : []}
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
