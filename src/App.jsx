import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./component/login.jsx";
import AdminLayout from "./component/Admin/AdminLayout.jsx";
import AdminDashboard from "./component/Admin/AdminDashboard.jsx";
import EventCreate from "./component/Admin/EventCreate.jsx";
import EventEdit from "./component/Admin/EventEdit.jsx";
import EventManage from "./component/Admin/EventManage.jsx";
import EventForm from "./component/Admin/EventForm.jsx";
import Registrations from "./component/Admin/Registrations.jsx";
import GenerateTickets from "./component/Admin/GenerateTickets.jsx";
import Verifiers from "./component/Admin/Verifiers.jsx";

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("adminToken") === "admin_logged_in";
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Admin Routes - Protected */}
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
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
