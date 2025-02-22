import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./pages/public/signup";
import Login from "./pages/public/login";
import NoPage from "./components/public/nopage";
import { UserRoleProvider } from "./context/UserRoleContext";
import VerifyEmail from "./pages/public/VerifyEmail";
import ProviderDashboard from "./pages/protected/ProviderDashboard";
import ManagePatient from "./pages/protected/ManagePatient";
import ManagePatients from "./pages/protected/professionals/ManagePatients";
import ManageDevices from "./pages/protected/ManageDevices";
import ProtectedRoute from "./context/ProtectedRoute";
import ManageProfessionals from "./pages/protected/ManageProfessionals";
import Profile from "./pages/protected/Profile";
import ProfileProfessionals from "./pages/protected/professionals/Profile";
import ProfessionalDashboard from "./pages/protected/professionals/ProfessionalDashboard";
import Alerts from "./pages/protected/professionals/Alerts";
import PatientsDashbaord from "./pages/protected/patients/PatientsDashboard";
import ProfilePatient from "./pages/protected/patients/Profile";
import ForgotPassword from "./pages/public/ForgotPassword";
import EnableMFA from "./pages/public/EnableMFA";
import VerifyMFA from "./pages/public/VerifyMFA";

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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/enable-mfa" element={<EnableMFA />} />
          <Route path="/verify-mfa" element={<VerifyMFA />} />
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
        {/* professionals */}
        <Route
            path="/professionals/dashboard"
            element={
              <ProtectedRoute requiredRole="professional"> 
                <ProfessionalDashboard/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/professionals/patients"
            element={
              <ProtectedRoute requiredRole="professional"> 
                <ManagePatients/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/professionals/alert"
            element={
              <ProtectedRoute requiredRole="professional"> 
                <Alerts/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/professionals/profile"
            element={
              <ProtectedRoute requiredRole="professional"> 
                <ProfileProfessionals/>
              </ProtectedRoute>
            }
          />
          {/* Patients */}
          <Route
            path="/patients/dashboard"
            element={
              <ProtectedRoute requiredRole="patient"> 
                <PatientsDashbaord/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/profile"
            element={
              <ProtectedRoute requiredRole="patient">  
                <ProfilePatient/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </UserRoleProvider>
  );
}

export default App;
