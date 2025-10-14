import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import Landing from "./components/Landing.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import DonorDashboard from "./components/DonorDashboard.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Guidelines from "./components/Guidelines.jsx";
import WhyDonate from "./components/WhyDonate.jsx";
import HealthEducation from "./components/HealthEducation.jsx";
import HIVTest from "./components/HIVTest.jsx";
import ReferFriend from "./components/ReferFriend.jsx";
import Profile from "./components/Profile.jsx";
import Contact from "./components/Contact.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/guidelines" element={<Guidelines />} />
          <Route path="/why-donate" element={<WhyDonate />} />
          <Route path="/education" element={<HealthEducation />} />
          <Route path="/hiv-test" element={<HIVTest />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected Donor Routes */}
          <Route
            path="/donor-dashboard"
            element={
              <ProtectedRoute allowedRole="donor">
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/refer"
            element={
              <ProtectedRoute allowedRole="donor">
                <ReferFriend />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRole="donor">
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
