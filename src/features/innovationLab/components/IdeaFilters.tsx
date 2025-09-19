// import React from "react";
// import type { IdeaType, IdeaStatus } from "types/innovationLab";

// type Props = {
//   type?: IdeaType | "All";
//   status?: IdeaStatus | "All";
//   tag?: string;
//   sort?: "ICE" | "Newest" | "Title";
//   onChange: (patch: Partial<Props>) => void;
//   tags: string[];
// };

// const IdeaFilters: React.FC<Props> = ({
//   type = "All",
//   status = "All",
//   tag = "",
//   sort = "ICE",
//   onChange,
//   tags,
// }) => {
//   return (
//     <div className="flex flex-wrap items-center gap-2">
//       <select
//         className="rounded border px-2 py-1 text-sm"
//         value={type}
//         onChange={(e) => onChange({ type: e.target.value as any })}
//       >
//         {["All", "Product", "Feature", "Tooling", "Research", "Infra"].map(
//           (o) => (
//             <option key={o}>{o}</option>
//           )
//         )}
//       </select>
//       <select
//         className="rounded border px-2 py-1 text-sm"
//         value={status}
//         onChange={(e) => onChange({ status: e.target.value as any })}
//       >
//         {[
//           "All",
//           "Draft",
//           "Exploring",
//           "Planned",
//           "Building",
//           "Shipped",
//           "Archived",
//         ].map((o) => (
//           <option key={o}>{o}</option>
//         ))}
//       </select>
//       <select
//         className="rounded border px-2 py-1 text-sm"
//         value={tag}
//         onChange={(e) => onChange({ tag: e.target.value })}
//       >
//         <option value="">All tags</option>
//         {tags.map((t) => (
//           <option key={t} value={t}>
//             {t}
//           </option>
//         ))}
//       </select>
//       <select
//         className="rounded border px-2 py-1 text-sm"
//         value={sort}
//         onChange={(e) => onChange({ sort: e.target.value as any })}
//       >
//         {["ICE", "Newest", "Title"].map((o) => (
//           <option key={o}>{o}</option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default IdeaFilters;
