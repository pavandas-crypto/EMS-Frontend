import React from "react";
import ReactDOM from "react-dom/client";
<<<<<<< HEAD
<<<<<<< HEAD
import "bootstrap/dist/css/bootstrap.min.css";
import EventMag from "./component/Admin/EventMag.jsx";
import Participant from "./component/Admin/Participant.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <EventMag /> */}
    <Participant />
=======
import Login from "./component/login.jsx";
import RegisterForm from "./component/eventpage/registerform.jsx";
import VerifierApp from "./component/verifier/VerifierApp.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <Login /> */}
    {/* <RegisterForm/> */}
    <VerifierApp/>
>>>>>>> e5c1f813f2a25009ad13a687f0b3c2ecb04d82c9
=======
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
>>>>>>> 801602d618d3d4fb0919c55734e125b770c00e7a
  </React.StrictMode>
);
