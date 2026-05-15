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

      <div className="hidden lg:flex flex-col [grid-area:aside] bg-[#0b1210] border-r border-[#1f3d2e] min-h-0">
        <DashboardAside />
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[240px] bg-[#0b1210] border-r border-[#1f3d2e] flex flex-col shadow-2xl">
            <DashboardAside onNavClick={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <main className="[grid-area:main] p-5 sm:p-[30px] min-w-0">
        <Outlet />
      </main>

      <div className="[grid-area:footer]">
        <DashboardFooter />
      </div>
    </div>
  );
};

export default DashboardLayout;
