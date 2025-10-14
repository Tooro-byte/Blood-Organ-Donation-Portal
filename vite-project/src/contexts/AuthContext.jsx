import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from API when token changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/profile",
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );

        const userData = response.data;
        setUser(userData);
        setRole(userData.role);

        // Update localStorage with fresh data
        localStorage.setItem("role", userData.role);
        localStorage.setItem("fullName", userData.fullName || "");
        localStorage.setItem("email", userData.email || "");
        localStorage.setItem("telephone", userData.telephone || "");
        localStorage.setItem("address", userData.address || "");
        localStorage.setItem("bloodGroup", userData.bloodGroup || "");
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // If token is invalid, logout
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  // Sync token with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (userData) => {
    const { token, role, fullName, email, telephone, address, bloodGroup } =
      userData;

    setToken(token);
    setRole(role);
    setUser({
      fullName,
      email,
      telephone,
      address,
      bloodGroup,
      role,
    });

    // Store in localStorage for persistence
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("fullName", fullName || "");
    localStorage.setItem("email", email || "");
    localStorage.setItem("telephone", telephone || "");
    localStorage.setItem("address", address || "");
    localStorage.setItem("bloodGroup", bloodGroup || "");
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);

    // Clear all localStorage items
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("fullName");
    localStorage.removeItem("email");
    localStorage.removeItem("telephone");
    localStorage.removeItem("address");
    localStorage.removeItem("bloodGroup");
  };

  const updateUserProfile = (updatedUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUserData,
    }));

    // Update localStorage as well
    if (updatedUserData.fullName) {
      localStorage.setItem("fullName", updatedUserData.fullName);
    }
    if (updatedUserData.telephone) {
      localStorage.setItem("telephone", updatedUserData.telephone);
    }
    if (updatedUserData.address) {
      localStorage.setItem("address", updatedUserData.address);
    }
    if (updatedUserData.bloodGroup) {
      localStorage.setItem("bloodGroup", updatedUserData.bloodGroup);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        user,
        loading,
        login,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
