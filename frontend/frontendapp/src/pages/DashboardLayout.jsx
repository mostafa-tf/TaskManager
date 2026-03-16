import DashboardNavbar from "../components/DashboardNavbar";
import DashboardAside from "../components/DashboardAside";
import { DashboardFooter } from "../components/DashboardFooter";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const griddiv = {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    gridTemplateRows: "90px 1fr 140px",
    gridTemplateAreas: `
      "nav nav"
      "aside main"
      "footer footer"
    `,
    minHeight: "100vh",
    width: "100%",
    background:
      "linear-gradient(135deg, #07110d 0%, #0b1d15 50%, #08110c 100%)",
  };

  const mainStyle = {
    gridArea: "main",
    padding: "30px",
    background: "transparent",
    minWidth: 0,
  };

  const asideWrapper = {
    gridArea: "aside",
    background: "rgba(0, 0, 0, 0.18)",
    borderRight: "1px solid rgba(0,255,140,0.12)",
    minHeight: "100%",
  };

  const footerWrapper = {
    gridArea: "footer",
  };

  return (
    <div style={griddiv}>
      <DashboardNavbar />

      <div style={asideWrapper}>
        <DashboardAside />
      </div>

      <main style={mainStyle}>
        <Outlet />
      </main>

      <div style={footerWrapper}>
        <DashboardFooter />
      </div>
    </div>
  );
};

export default DashboardLayout;
