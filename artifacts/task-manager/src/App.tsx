import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./pages/DashboardLayout";
import { UnDoneTasks } from "./pages/UnDoneTasks";
import { DoneTasks } from "./pages/DoneTasks";
import { AllTasks } from "./pages/AllTasks";
import { AddTasks } from "./pages/AddTasks";
import { Profile } from "./pages/Profile";
import { EditTask } from "./pages/EditTask";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UpdateUser } from "./pages/UpdateUser";
import { Feedback } from "./pages/Feedback";
import { FeedbacksDashboard } from "./pages/FeedbacksDashboard";
import { Analysis } from "./pages/Analysis";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { FriendsDashboard } from "./pages/FriendsDashboard";
import { AddFriend } from "./pages/AddFriend";
import { ViewFriends } from "./pages/ViewFriends";
import { IncomingRequests } from "./pages/IncomingRequests";
import { OutgoingRequests } from "./pages/OutgoingRequests";
import { BlockedUsers } from "./pages/BlockedUsers";
import { ProjectDashboard } from "./pages/ProjectDashboard";
import { ViewProjects } from "./pages/ViewProjects";
import { AddProject } from "./pages/AddProject";
import { ViewProject } from "./pages/ViewProject";
import { MemberPage } from "./pages/MemberPage";
import { Notifications } from "./pages/Notifications";

function App() {
  return (
    <BrowserRouter>
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
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route
          path="/admindashboard/feedbacks"
          element={
            <ProtectedRoute>
              <FeedbacksDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route
          path="/admindashboard/updateuser"
          element={
            <ProtectedRoute>
              <UpdateUser />
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
          <Route path="feedback" element={<Feedback />} />
        </Route>
        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <Analysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friendsdashboard"
          element={
            <ProtectedRoute>
              <FriendsDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<AddFriend />} />
          <Route path="viewfriends" element={<ViewFriends />} />
          <Route path="incomingrequests" element={<IncomingRequests />} />
          <Route path="outgoingrequests" element={<OutgoingRequests />} />
          <Route path="blockedusers" element={<BlockedUsers />} />
        </Route>
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/viewprojects"
          element={
            <ProtectedRoute>
              <ViewProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/addproject"
          element={
            <ProtectedRoute>
              <AddProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/viewprojects/:projectid"
          element={
            <ProtectedRoute>
              <ViewProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/projectmember/:memberid"
          element={
            <ProtectedRoute>
              <MemberPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
