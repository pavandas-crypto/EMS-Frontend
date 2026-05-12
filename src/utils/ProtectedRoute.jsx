import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function ProtectedAdminRoute({ children }) {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const userRole = localStorage.getItem("userRole");

    // Allow access if:
    // 1. User is authenticated AND
    // 2. User is either admin OR admin accessing verifier pages is allowed
    if (token && user && (userRole === "admin" || userRole === "verifier")) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, []);

  if (isValid === null) return <div>Loading...</div>;
  if (!isValid) return <Navigate to="/" replace />;

  return children;
}

export function ProtectedVerifierRoute({ children }) {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const userRole = localStorage.getItem("userRole");

    // Verifier pages are available to both verifiers and admins
    if (token && user && (userRole === "verifier" || userRole === "admin")) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, []);

  if (isValid === null) return <div>Loading...</div>;
  if (!isValid) return <Navigate to="/" replace />;

  return children;
}

export function ProtectedAdminOnlyRoute({ children }) {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const userRole = localStorage.getItem("userRole");

    // Only admin can access admin pages
    if (token && user && userRole === "admin") {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, []);

  if (isValid === null) return <div>Loading...</div>;
  if (!isValid) return <Navigate to="/" replace />;

  return children;
}
