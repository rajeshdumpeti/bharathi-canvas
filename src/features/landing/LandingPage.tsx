import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "lib/auth/AuthProvider";

type Props = {
  /** Optional legacy callbacks (e.g. your LandingWithNav wrapper). */
  onStart?: () => void; // -> Board
  onStartDocs?: () => void; // -> Documents
  onOpenReleaseNotes?: () => void; // -> Release Notes
  onOpenProjectHub?: () => void; // -> Project Hub
};

const LandingPage: React.FC<Props> = ({
  onStart,
  onStartDocs,
  onOpenReleaseNotes,
  onOpenProjectHub,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  /** Gate every CTA behind sign-in; if a legacy callback exists, call it after auth. */
  const openOrSignIn = (fallbackPath: string, cb?: () => void) => {
    if (!user) {
      navigate("/signin");
    } else if (cb) {
      cb();
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="min-h-[calc(100vh-64px-40px)] flex flex-col items-center p-4 text-center">
        <div className="mb-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
            Welcome to Bharathi&apos;s Canvas
          </h1>
          <p className="mt-2 text-gray-600 max-w-3xl mx-auto text-base sm:text-lg">
            A local-first productivity workspace where you can plan tasks, keep
            documents, generate release notes, and document architecture — all
            organized by project.
          </p>

          {/* badges */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              Local storage — your data stays on this device
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              No backend required
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              Project-centric workflow
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6  max-w-6xl mx-auto w-full">
          {" "}
          {/* Personal Board */}
          <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <h2 className="text-2xl font-semibold mb-2">Your Personal Board</h2>
            <p className="text-sm text-gray-600 mb-6">
              Plan user stories, track status across columns, and keep progress
              visible per project.
            </p>
            <button
              type="button"
              onClick={() => openOrSignIn("/board", onStart)}
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3"
            >
              Get Started
            </button>
          </div>
          {/* Personal Documents */}
          <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <h2 className="text-2xl font-semibold mb-2">
              Your Personal Documents
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Upload and preview PDFs, DOCX, and TXT. Everything is indexed per
              project for quick reference.
            </p>
            <button
              type="button"
              onClick={() => openOrSignIn("/documents", onStartDocs)}
              className="w-full rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3"
            >
              Open Documents
            </button>
          </div>
          {/* Release Notes */}
          <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <h2 className="text-2xl font-semibold mb-2">
              Release Notes Builder
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Auto-group completed stories (Features, Fixes, Improvements) and
              export clean Markdown.
            </p>
            <button
              type="button"
              onClick={() => openOrSignIn("/release-notes", onOpenReleaseNotes)}
              className="w-full rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3"
            >
              Open Release Notes
            </button>
          </div>
          {/* Project Hub */}
          <div className="p-8 bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <h2 className="text-2xl font-semibold mb-2">Project Hub</h2>
            <p className="text-sm text-gray-600 mb-6">
              Capture setup, architecture, APIs, decisions, and links in one
              place alongside your board.
            </p>
            <button
              type="button"
              onClick={() => openOrSignIn("/project-hub", onOpenProjectHub)}
              className="w-full rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3"
            >
              Open Project Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
