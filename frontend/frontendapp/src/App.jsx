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
import { UpdateUser } from "./pages/UpdateUser.jsx";
import { Feedback } from "./pages/Feedback.jsx";
import { FeedbacksDashboard } from "./pages/FeedbacksDashboard.jsx";
import { Analysis } from "./pages/Analysis.jsx";
import { ForgotPassword } from "./pages/ForgotPassword.jsx";
import { ResetPassword } from "./pages/ResetPassword.jsx";
import { FriendsDashboard } from "./pages/FriendsDashboard.jsx";
import { AddFriend } from "./pages/AddFriend.jsx";
import { ViewFriends } from "./pages/ViewFriends.jsx";
import { IncomingRequests } from "./pages/IncomingRequests.jsx";
import { OutgoingRequests } from "./pages/OutgoingRequests.jsx";
import { BlockedUsers } from "./pages/BlockedUsers.jsx";
import { ProjectDashboard } from "./pages/ProjectDashboard.jsx";
import { ViewProjects } from "./pages/ViewProjects.jsx";
import { AddProject } from "./pages/AddProject.jsx";
import { ViewProject } from "./pages/ViewProject.jsx";
import { MemberPage } from "./pages/MemberPage.jsx";
import { Notifications } from "./pages/Notifications.jsx";
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
    </>
  );
}

export default App;
