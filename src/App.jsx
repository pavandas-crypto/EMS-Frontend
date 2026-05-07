import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./component/login.jsx";
import LandingPage from "./component/eventpage/landingpage.jsx";
import EventLandingPage from "./component/eventpage/EventLandingPage.jsx";
import RegisterForm from "./component/eventpage/registerform.jsx";
import VerifierApp from "./component/verifier/VerifierApp.jsx";
import AdminLayout from "./component/Admin/AdminLayout.jsx";
import AdminDashboard from "./component/Admin/AdminDashboard.jsx";
import EventCreate from "./component/Admin/EventCreate.jsx";
import EventEdit from "./component/Admin/EventEdit.jsx";
import EventManage from "./component/Admin/EventMag.jsx";
import EventForm from "./component/Admin/EventForm.jsx";
import Registrations from "./component/Admin/Registrations.jsx";
import GenerateTickets from "./component/Admin/GenerateTickets.jsx";
import Verifiers from "./component/Admin/Verifiers.jsx";
import Report from "./component/Admin/Report.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/event/:eventId" element={<EventLandingPage />} />
        <Route path="/event/:eventId/register" element={<RegisterForm />} />
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
