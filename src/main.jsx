import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import CarPartsStore from "./App";
import Dashboard from "./Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";

function Root() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  if (hash === "#admin") {
    return <Dashboard onBack={() => { window.location.hash = ""; }} />;
  }
  if (hash === "#admin2") {
    return <AdminDashboard onBack={() => { window.location.hash = ""; }} />;
  }
  return <CarPartsStore />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/blog"       element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*"           element={<Root />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
