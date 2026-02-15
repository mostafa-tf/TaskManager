import "./App.css";
import WelcomePage from "./pages/WelcomePage.jsx";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./pages/DashboardLayout.jsx";
import { UnDoneTasks } from "./pages/UnDoneTasks.jsx";
import { DoneTasks } from "./pages/DoneTasks.jsx";
import { AllTasks } from "./pages/AllTasks.jsx";
import { AddTasks } from "./pages/AddTasks.jsx";
import { Profile } from "./pages/Profile.jsx";
import { EditTask } from "./pages/EditTask.jsx";
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AllTasks />} />
          <Route path="donetasks" element={<DoneTasks />} />
          <Route path="undonetasks" element={<UnDoneTasks />} />
          <Route path="addtask" element={<AddTasks />} />
          <Route path="profile" element={<Profile />} />
          <Route path="edittask" element={<EditTask />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
