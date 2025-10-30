import { Routes, Route } from "react-router-dom";
import DocumentsView from "features/documents/DocumentsView";

export default function DocumentsApp() {
    return (
        <Routes>
            {/* Always render DocumentsView; it now reads ?project= from URL */}
            <Route index element={<DocumentsView />} />
        </Routes>
    );
}
