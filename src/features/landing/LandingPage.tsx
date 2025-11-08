import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "lib/auth/AuthProvider";
import {
  QueueListIcon,
  DocumentDuplicateIcon,
  TagIcon,
  RectangleGroupIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";

type Props = {
  /** Optional legacy callbacks (e.g. your LandingWithNav wrapper). */
  onStart?: () => void; // -> Board
  onStartDocs?: () => void; // -> Documents
  onOpenReleaseNotes?: () => void; // -> Release Notes
  onOpenProjectHub?: () => void; // -> Project Hub
  onOpenIdeas?: () => void;
  onOpenFeatures?: () => void; // <-- ARCHITECT NOTE: Added for new "Features Manager" card
};

/**
 * A reusable chip for the header.
 */
const FeatureChip: React.FC<{
  label: string;
  icon?: React.ElementType;
  iconColor?: string;
}> = ({ label, icon: Icon, iconColor }) => (
  <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold bg-white/20 text-white backdrop-blur-sm shadow-md">
    {Icon && <Icon className={`h-6 w-6 ${iconColor ?? ""}`} />}
    {label}
  </span>
);

/**
 * Reusable Card component for the new 3-column grid.
 */
const ModuleCard: React.FC<{
  title: string;
  description: string;
  buttonText: string;
  buttonBgColor: string;
  cardBgClass: string;
  textColorClass: string;
  icon: React.ElementType;
  iconBgClass: string;
  iconColorClass: string;
  onClick: () => void;
  ariaLabel: string;
}> = ({
  title,
  description,
  buttonText,
  buttonBgColor,
  cardBgClass,
  textColorClass,
  icon: Icon,
  iconBgClass,
  iconColorClass,
  onClick,
  ariaLabel,
}) => (
  <div
    className={`p-6 rounded-3xl shadow-xl transition-transform hover:scale-105 flex flex-col ${cardBgClass} ${textColorClass}`}
  >
    <div
      className={`h-12 w-12 rounded-lg flex items-center justify-center ${iconBgClass}`}
    >
      <Icon className={`h-7 w-7 ${iconColorClass}`} />
    </div>
    <h2 className="text-2xl font-bold mt-4">{title}</h2>
    <p className="text-sm mt-2 flex-grow">{description}</p>
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg text-white font-semibold px-4 py-3 text-sm mt-4 transition-transform hover:scale-105"
      style={{ backgroundColor: buttonBgColor }}
      aria-label={ariaLabel}
    >
      {buttonText}
    </button>
  </div>
);

const LandingPage: React.FC<Props> = ({
  onStart,
  onStartDocs,
  onOpenReleaseNotes,
  onOpenProjectHub,
  onOpenIdeas,
  onOpenFeatures, // <-- New prop
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
    <div className="bg-gradient-to-b from-[#3b3b9a] via-[#2a2a6a] to-[#1a1a3a] text-white">
      <div className="min-h-screen flex flex-col items-center p-6 md:p-4  text-center">
        <div className="mb-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            Welcome to Bharathi&apos;s Canvas
          </h1>

          <p className="mt-2 text-gray-300 max-w-3xl mx-auto text-base sm:text-lg">
            A workspace to plan tasks, keep documents, generate release notes,
            and document architecture & new product ideas — all organized by
            project.
          </p>
        </div>

        {/* */}
        <div className="mt-4 mb-8 w-full max-w-6xl flex flex-col items-center justify-center gap-4">
          {/* Top Row */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <FeatureChip label="Backend Integration" />
            <FeatureChip label="Enhanced Project Tools" />
            <FeatureChip label="Seamless Collaboration" />
          </div>
        </div>
        {/* */}

        {/* Cards - New 3-Column Grid --> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
          {/* Personal Board */}
          <ModuleCard
            title="Board"
            description="Plan user stories, track status across columns, and keep progress
              visible per project."
            buttonText="Open Personal Board"
            buttonBgColor="#8B5CF6"
            cardBgClass="bg-white"
            textColorClass="text-gray-900"
            icon={QueueListIcon}
            iconBgClass="bg-indigo-100"
            iconColorClass="text-indigo-600"
            onClick={() => openOrSignIn("/board", onStart)}
            ariaLabel="Open Personal Board"
          />

          {/* Documents */}
          <ModuleCard
            title="Documents"
            description=" Upload and preview PDFs, DOCX, and TXT. Everything is indexed per
              project for quick reference."
            buttonText="Open Personal Documents"
            buttonBgColor="#8B5CF6"
            cardBgClass="bg-white"
            textColorClass="text-gray-900"
            icon={DocumentDuplicateIcon}
            iconBgClass="bg-indigo-100"
            iconColorClass="text-indigo-600"
            onClick={() => openOrSignIn("/documents", onStartDocs)}
            ariaLabel="Open Personal Documents"
          />

          {/* Release Notes */}
          <ModuleCard
            title="Release Notes"
            description="Auto-group completed stories (Features, Fixes, Improvements) and export clean Markdown."
            buttonText="Open Release Notes Builder"
            buttonBgColor="#8B5CF6"
            cardBgClass="bg-white"
            textColorClass="text-gray-900"
            icon={TagIcon}
            iconBgClass="bg-indigo-100"
            iconColorClass="text-indigo-600"
            onClick={() => openOrSignIn("/release-notes", onOpenReleaseNotes)}
            ariaLabel="Open Release Notes Builder"
          />

          {/* Project Hub */}
          <ModuleCard
            title="Project Hub"
            description="Capture setup, architecture, APIs, decisions, and links in one place alongside your board."
            buttonText="Open Project Hub"
            buttonBgColor="#8B5CF6"
            cardBgClass="bg-gray-200" // Grayish background
            textColorClass="text-gray-900"
            icon={RectangleGroupIcon}
            iconBgClass="bg-gray-300"
            iconColorClass="text-gray-700"
            onClick={() => openOrSignIn("/project-hub", onOpenProjectHub)}
            ariaLabel="Open Project Hub"
          />

          {/* Innovation Lab */}
          <ModuleCard
            title="Innovation Lab"
            description="Capture raw sparks, tag them, and evolve each idea into a ready-to-ship spec."
            buttonText="Open Innovation Lab"
            buttonBgColor="#8B5CF6"
            cardBgClass="bg-white"
            textColorClass="text-gray-900"
            icon={LightBulbIcon}
            iconBgClass="bg-purple-100"
            iconColorClass="text-purple-600"
            onClick={() => openOrSignIn("/ideas", onOpenIdeas)}
            ariaLabel="Open Innovation Lab"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
