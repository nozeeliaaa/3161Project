import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import TopNavbar from "../components/navigation/TopNavbar";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink-50">
      <div className="fixed inset-y-0 left-0 z-20 hidden lg:block">
        <Sidebar />
      </div>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:pl-72">
        <TopNavbar onMenu={() => setMobileOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
