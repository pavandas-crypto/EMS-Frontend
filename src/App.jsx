import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./component/login.jsx";
import LandingPage from "./component/eventpage/landingpage.jsx";
import RegisterForm from "./component/eventpage/registerform.jsx";
import VerifierApp from "./component/verifier/VerifierApp.jsx";
import AdminLayout from "./component/admin/AdminLayout.jsx";
import AdminDashboard from "./component/admin/AdminDashboard.jsx";
import EventCreate from "./component/admin/EventCreate.jsx";
import EventEdit from "./component/admin/EventEdit.jsx";
import EventManage from "./component/Admin/EventMag.jsx";
import EventForm from "./component/admin/EventForm.jsx";
import Registrations from "./component/admin/Registrations.jsx";
import GenerateTickets from "./component/admin/GenerateTickets.jsx";
import Verifiers from "./component/admin/Verifiers.jsx";
import Report from "./component/admin/Report.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/verifier" element={<VerifierApp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="events/create" element={<EventCreate />} />
          <Route path="events/manage" element={<EventManage />} />
          <Route path="events/edit/:eventId" element={<EventEdit />} />
          <Route path="events/:eventId/form" element={<EventForm />} />
          <Route path="registrations" element={<Registrations />} />
          <Route path="tickets" element={<GenerateTickets />} />
          <Route path="verifiers" element={<Verifiers />} />
          <Route path="reports" element={<Report />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
