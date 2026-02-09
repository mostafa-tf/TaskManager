import DashboardNavbar from "../components/DashboardNavbar";
import DashboardAside from "../components/DashboardAside";
import { DashboardFooter } from "../components/DashboardFooter";
import { Outlet } from "react-router-dom";
const DashboardLayout = () => {
  const griddiv = {
    display: "grid",
    gridTemplateColumns: "180px 1fr",
    gridTemplateRows: "90px 1fr 180px",
    gridTemplateAreas: `
    
     "nav nav"
     "aside main"
     "footer footer"
     `,
    minHeight: "100vh",
    width: "100%",
  };
  return (
    <>
      <div style={griddiv}>
        <DashboardNavbar />

        <DashboardAside />
        <main style={{ gridArea: "main" }}>
          <Outlet />
        </main>

        <DashboardFooter style={{ gridArea: "footer" }} />
      </div>
    </>
  );
};
export default DashboardLayout;
