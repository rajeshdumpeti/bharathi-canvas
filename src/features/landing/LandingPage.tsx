import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "lib/auth/AuthProvider";
import {
  Squares2X2Icon, // Board
  DocumentTextIcon, // Documents
  SparklesIcon, // Release Notes
  CubeTransparentIcon, // Project Hub
  LightBulbIcon, // Ideas
} from "@heroicons/react/24/outline";

type Props = {
  /** Optional legacy callbacks (e.g. your LandingWithNav wrapper). */
  onStart?: () => void; // -> Board
  onStartDocs?: () => void; // -> Documents
  onOpenReleaseNotes?: () => void; // -> Release Notes
  onOpenProjectHub?: () => void; // -> Project Hub
  onOpenIdeas?: () => void;
};

const LandingPage: React.FC<Props> = ({
  onStart,
  onStartDocs,
  onOpenReleaseNotes,
  onOpenProjectHub,
  onOpenIdeas,
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
            A local-first workspace to plan tasks, keep documents, generate
            release notes, and document architecture & new product ideas — all
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
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              Innovation Lab
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 max-w-6xl mx-auto w-full">
          {/* Personal Board */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow transition-shadow">
            <h2 className="text-xl font-semibold mb-1">Your Personal Board</h2>
            <p className="text-sm text-gray-600 mb-6">
              Plan user stories, track status across columns, and keep progress
              visible per project.
            </p>
            <button
              type="button"
              onClick={() => openOrSignIn("/board", onStart)}
              className="w-full rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 text-sm"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <Squares2X2Icon className="h-5 w-5" />
                Get Started
              </span>
            </button>
          </div>
          {/* Personal Documents */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow transition-shadow">
            <h2 className="text-xl font-semibold mb-1">
              Your Personal Documents
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload and preview PDFs, DOCX, and TXT. Everything is indexed per
              project for quick reference.
            </p>
            <button
              type="button"
              onClick={() => openOrSignIn("/documents", onStartDocs)}
              className="w-full rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 text-sm"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <DocumentTextIcon className="h-5 w-5" />
                Open Documents
              </span>
            </button>
          </div>
          {/* Release Notes */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow transition-shadow">
            <h2 className="text-xl font-semibold mb-1">
              Release Notes Builder
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Auto-group completed stories (Features, Fixes, Improvements) and
              export clean Markdown.
            </p>
            <button
              type="button"
              onClick={() => openOrSignIn("/release-notes", onOpenReleaseNotes)}
              className="w-full rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 text-sm"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <SparklesIcon className="h-5 w-5" />
                Open Release Notes
              </span>
            </button>
          </div>
          {/* Project Hub */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow transition-shadow">
            <h2 className="text-xl font-semibold mb-1">Project Hub</h2>
            <p className="text-sm text-gray-600 mb-6">
              Capture setup, architecture, APIs, decisions, and links in one
              place alongside your board.
            </p>
            <button
              type="button"
              onClick={() => openOrSignIn("/project-hub", onOpenProjectHub)}
              className="w-full rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 text-sm"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <CubeTransparentIcon className="h-5 w-5" />
                Open Project Hub
              </span>
            </button>
          </div>
          {/* Ideas Lab */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow transition-shadow">
            <h2 className="text-xl font-semibold mb-1">Innovation Lab</h2>
            <p className="text-sm text-gray-600 mb-6">
              Capture raw sparks, tag them, and evolve each idea into a
              ready-to-ship spec.
            </p>
            <button
              type="button"
              onClick={() => openOrSignIn("/ideas", onOpenIdeas)}
              className="w-full rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 text-sm"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <LightBulbIcon className="h-5 w-5" />
                Open Innovation Lab
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
