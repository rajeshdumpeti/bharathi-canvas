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
    <div className="bg-gray-50 flex flex-col items-center justify-center">
      <div className="flex flex-1 flex-col p-4 text-center">
        <h1 className="text-5xl font-bold text-gray-700 mb-4">
          Welcome to Bharathi&apos;s Canvas
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          {/* Personal Board */}
          <div className="p-8 bg-white rounded-xl shadow-xl transform hover:scale-[1.01] transition-transform duration-300">
            <h2 className="text-2xl font-semibold mb-2">Your Personal Board</h2>
            <p className="text-sm text-gray-500 mb-6">
              Create a Project Board for your personal use.
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
          <div className="p-8 bg-white rounded-xl shadow-xl transform hover:scale-[1.01] transition-transform duration-300">
            <h2 className="text-2xl font-semibold mb-2">
              Your Personal Documents
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Upload, organize and preview PDFs, DOCX, and TXT files.
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
          <div className="p-8 bg-white rounded-xl shadow-xl transform hover:scale-[1.01] transition-transform duration-300">
            <h2 className="text-2xl font-semibold mb-2">
              Release Notes Builder
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Turn your Done tasks into clean, categorized release notes.
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
          <div className="p-8 bg-white rounded-xl shadow-xl transform hover:scale-[1.01] transition-transform duration-300">
            <h2 className="text-2xl font-semibold mb-2">Project Hub</h2>
            <p className="text-sm text-gray-500 mb-6">
              Specs, architecture, APIs, links &amp; more—organized per project.
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
