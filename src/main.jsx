import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import EventMag from "./component/Admin/EventMag.jsx";
import Participant from "./component/Admin/Participant.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <EventMag /> */}
    <Participant />
  </React.StrictMode>
);
