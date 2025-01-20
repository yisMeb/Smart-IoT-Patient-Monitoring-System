import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./pages/public/signup";
import Login from "./pages/public/login";
import NoPage from "./components/public/nopage";
import { UserRoleProvider } from "./context/UserRoleContext";
import VerifyEmail from "./pages/public/VerifyEmail";
import ProviderDashboard from "./pages/protected/ProviderDashboard";
import ManagePatient from "./pages/protected/ManagePatient";
import ManageDevices from "./pages/protected/ManageDevices";
import ProtectedRoute from "./context/ProtectedRoute";
import ManageProfessionals from "./pages/protected/ManageProfessionals";
import Profile from "./pages/protected/Profile";

function App() {
  return (
    <UserRoleProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="*" element={<NoPage />} />

          {/* Protected routes */}
          <Route
            path="/institutes/h-provider"
            element={
              <ProtectedRoute requiredRole="institution">
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/institutes/h-provider/professionals"
            element={
              <ProtectedRoute requiredRole="institution">
                <ManageProfessionals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/institutes/h-provider/patient"
            element={
              <ProtectedRoute requiredRole="institution">
                <ManagePatient/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/institutes/h-provider/devices"
            element={
              <ProtectedRoute requiredRole="institution">
                <ManageDevices/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/institutes/h-provider/profile"
            element={
              <ProtectedRoute requiredRole="institution">
                <Profile/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </UserRoleProvider>
  );
}

export default App;
