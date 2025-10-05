// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import { ping, apiConfig } from "lib/api";

// export default function HealthBadge() {
//   const { data, status } = useQuery({
//     queryKey: ["healthz"],
//     queryFn: ping,
//     refetchInterval: 5000,
//   });

//   const healthy = status === "success" && data === "ok";

//   return (
//     <div
//       style={{
//         position: "fixed",
//         right: 12,
//         bottom: 12,
//         padding: "6px 10px",
//         borderRadius: 8,
//         fontSize: 12,
//         background: healthy ? "#e6ffed" : "#fff5f5",
//         color: healthy ? "#036B26" : "#8A1C1C",
//         border: `1px solid ${healthy ? "#36c078" : "#e53e3e"}`,
//         zIndex: 1000,
//       }}
//       title={`API: ${apiConfig.API_BASE}`}
//     >
//       API {healthy ? "healthy" : "down"}
//     </div>
//   );
// }
