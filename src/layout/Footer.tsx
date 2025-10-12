import React from "react";

const Footer: React.FC = () => (
  <footer className="h-10 flex items-center justify-center text-xs text-gray-500 bg-white border-t mt-4">
    © {new Date().getFullYear()} Bharathi’s Canvas
  </footer>
);

export default Footer;
