import React from "react";
import { Routes, Route } from "react-router-dom";
import GalleryView from "features/innovationLab/GalleryView";
import DetailView from "features/innovationLab/DetailView";

export default function IdeasApp() {
  return (
    <Routes>
      <Route index element={<GalleryView />} />
      <Route path=":id" element={<DetailView />} />
    </Routes>
  );
}
