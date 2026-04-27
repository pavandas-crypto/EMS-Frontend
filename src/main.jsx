import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./component/login.jsx";
import RegisterForm from "./component/eventpage/registerform.jsx";
import VerifierApp from "./component/verifier/VerifierApp.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <Login /> */}
    {/* <RegisterForm/> */}
    <VerifierApp/>
  </React.StrictMode>
);
