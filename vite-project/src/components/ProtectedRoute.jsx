import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function ProtectedRoute({ children, allowedRole }) {
  const { token, role, user, loading } = useContext(AuthContext);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for auth context to finish loading
    if (!loading) {
      setIsChecking(false);
    }
  }, [loading]);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
