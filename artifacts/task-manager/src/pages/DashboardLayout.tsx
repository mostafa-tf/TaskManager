import { useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardAside from "../components/DashboardAside";
import { DashboardFooter } from "../components/DashboardFooter";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-grid">
      <div className="[grid-area:nav]">
        <DashboardNavbar onMenuClick={() => setSidebarOpen((o) => !o)} />
      </div>

      <div className="hidden lg:flex flex-col [grid-area:aside] bg-[#080b1a] border-r border-indigo-500/[0.12] min-h-0">
        <DashboardAside />
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[240px] bg-[#080b1a] border-r border-indigo-500/[0.18] flex flex-col shadow-[4px_0_30px_rgba(0,0,0,0.5)]">
            <DashboardAside onNavClick={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <main className="[grid-area:main] p-5 sm:p-[30px] min-w-0 bg-[#06070f]">
        <Outlet />
      </main>

      <div className="[grid-area:footer]">
        <DashboardFooter />
      </div>
    </div>
  );
};

export default DashboardLayout;
