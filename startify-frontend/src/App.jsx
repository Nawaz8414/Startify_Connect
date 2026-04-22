import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import AuthChoice from "./pages/AuthChoice";
import AIAssistant from "./pages/AIAssistant";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import EditProfile from "./pages/EditProfile";



function App() {
  return (
    <Router>
      <Routes>
        {/* 🏠 Landing / First Page */}
        <Route path="/" element={<Landing />} />

        {/* 🔑 Choose Login Type */}
        <Route path="/auth" element={<AuthChoice />} />

        {/* 🌐 Public */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* 🔐 Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
   <Route
  path="/messages"
  element={
    <ProtectedRoute>
      <Messages />
    </ProtectedRoute>
  }
/>

<Route
  path="/messages/:userId"
  element={
    <ProtectedRoute>
      <Messages />
    </ProtectedRoute>
  }
/>
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/edit-profile" element={<EditProfile />} />
        <Route
          path="/post"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
  path="/ai"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <AIAssistant />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>

        {/* ❓ Fallback → Landing */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;
