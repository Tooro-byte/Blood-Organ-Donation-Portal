import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem("token", token || "");
  }, [token]);

  useEffect(() => {
    localStorage.setItem("role", role || "");
  }, [role]);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user) || "{}");
  }, [user]);

  const login = (userData) => {
    const { token, role, fullName, email, telephone, address, bloodGroup } =
      userData;
    setToken(token);
    setRole(role);
    setUser({ fullName, email, telephone, address, bloodGroup });
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");
    localStorage.removeItem("telephone");
    localStorage.removeItem("address");
    localStorage.removeItem("bloodGroup");
  };

  return (
    <AuthContext.Provider value={{ token, role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
