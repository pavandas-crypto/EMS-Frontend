import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./component/login.jsx";
<<<<<<< HEAD
import AdminLayout from "./component/Admin/AdminLayout.jsx";
import AdminDashboard from "./component/Admin/AdminDashboard.jsx";
import EventCreate from "./component/Admin/EventCreate.jsx";
import EventEdit from "./component/Admin/EventEdit.jsx";
import EventManage from "./component/Admin/EventManage.jsx";
import EventForm from "./component/Admin/EventForm.jsx";
import Registrations from "./component/Admin/Registrations.jsx";
import GenerateTickets from "./component/Admin/GenerateTickets.jsx";
import Verifiers from "./component/Admin/Verifiers.jsx";
=======
import LandingPage from "./component/eventpage/landingpage.jsx";
import RegisterForm from "./component/eventpage/registerform.jsx";
import VerifierApp from "./component/verifier/VerifierApp.jsx";
import AdminLayout from "./component/admin/AdminLayout.jsx";
import AdminDashboard from "./component/admin/AdminDashboard.jsx";
import EventCreate from "./component/admin/EventCreate.jsx";
import EventEdit from "./component/admin/EventEdit.jsx";
import EventManage from "./component/admin/EventManage.jsx";
import EventForm from "./component/admin/EventForm.jsx";
import Registrations from "./component/admin/Registrations.jsx";
import GenerateTickets from "./component/admin/GenerateTickets.jsx";
import Verifiers from "./component/admin/Verifiers.jsx";
>>>>>>> 801f76918e360e13599da7aa11f8a09cfe6a04fd

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("adminToken") === "admin_logged_in";
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/verifier" element={<VerifierApp />} />

        {/* Admin Routes - Protected */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="events/create" element={<EventCreate />} />
          <Route path="events/manage" element={<EventManage />} />
          <Route path="events/edit/:eventId" element={<EventEdit />} />
          <Route path="events/:eventId/form" element={<EventForm />} />
          <Route path="registrations" element={<Registrations />} />
          <Route path="tickets" element={<GenerateTickets />} />
          <Route path="verifiers" element={<Verifiers />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
