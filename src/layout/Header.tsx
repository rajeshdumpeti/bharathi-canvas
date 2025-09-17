// src/layout/Header.tsx
import React, { useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoMonogram from "../components/ui/LogoMonogram";
import LogoWordmark from "../components/ui/LogoWordmark";
import type { HeaderProps } from "../types/header";
import { useOutsideClose } from "../hooks/useOutsideClose";
import { getInitials } from "../utils/getInitials";

const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  showHamburger = false,
  showTitle = true,

  navLinks = [],
  user = null,
  onSignOut,
  onOpenSearch,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  useOutsideClose(panelRef, () => setMobileOpen(false));
  const navigate = useNavigate(); // Get the navigate function
  const initials = getInitials(user?.name || user?.email || "U");

  const handleSignOut = useCallback(() => {
    setMobileOpen(false);
    onSignOut();
    navigate("/signin");
  }, [setMobileOpen, onSignOut, navigate]);

  return (
    <header className="text-white flex items-center justify-between shadow-xl border-b border-gray-800 bg-gray-900">
      {/* Left: hamburger (for feature sidebars) + brand */}
      <div className="flex items-center gap-3">
        {showHamburger && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle sidebar"
            type="button"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}
        {showTitle && (
          <Link to="/" className="flex items-center gap-3">
            <LogoMonogram className="h-8 w-8 text-white" />
            <LogoWordmark />
          </Link>
        )}
      </div>

      {/* Right: desktop nav + actions */}
      <div className="hidden md:flex items-center gap-3">
        {user &&
          navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-1.5 rounded-md text-sm text-white/90 hover:text-white hover:bg-white/10"
            >
              {l.label}
            </Link>
          ))}
        {/* 
        {onOpenSearch && user && (
          <button
            onClick={onOpenSearch}
            className="px-3 py-1.5 rounded-md text-sm text-white/90 hover:text-white hover:bg-white/10"
            title="Search (⌘K)"
            type="button"
          >
            Search
          </button>
        )} */}

        {user ? (
          <div className="flex items-center gap-2">
            {/* <div
              title={user.email}
              className="h-8 w-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm font-semibold"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {initials}
            </div> */}
            {onSignOut && (
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-md text-sm bg-white/10 hover:bg-white/20 text-white"
                type="button"
              >
                Sign out
              </button>
            )}
          </div>
        ) : (
          <Link
            to="/signin"
            onClick={() => setMobileOpen(false)}
            className="px-3 py-1.5 rounded-md text-sm bg-white/10 hover:bg-white/20 text-white"
          >
            Sign in
          </Link>
        )}
      </div>

      {/* Right: mobile buttons */}
      <div className="md:hidden flex items-center gap-2">
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-lg hover:bg-white/10"
            aria-label="Open search"
            type="button"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </button>
        )}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="p-2 rounded-lg hover:bg-white/10"
          aria-label="Open menu"
          type="button"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" />
          <div
            ref={panelRef}
            className="absolute top-0 right-0 w-72 h-full bg-gray-900 border-l border-gray-800 p-4 space-y-2"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm font-semibold">
                  {initials}
                </div>
                <div className="text-white/80 text-sm truncate max-w-[9rem]">
                  {user ? user.name || user.email : "Guest"}
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded hover:bg-white/10"
                aria-label="Close"
                type="button"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {user ? (
              <>
                {navLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-left px-3 py-2 rounded text-white/90 hover:bg-white/10"
                  >
                    {l.label}
                  </Link>
                ))}
                {onSignOut && (
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-white"
                    type="button"
                  >
                    Sign Out
                  </button>
                )}
              </>
            ) : (
              <Link
                to="/signin"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-left px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
