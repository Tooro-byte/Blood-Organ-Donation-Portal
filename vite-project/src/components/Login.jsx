import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      if (res.data.token) {
        login({
          token: res.data.token,
          role: res.data.role,
          fullName: res.data.fullName || "",
          email: res.data.email || email,
          telephone: res.data.telephone || "",
          address: res.data.address || "",
          bloodGroup: res.data.bloodGroup || "",
        });

        // Navigate based on role
        navigate(
          res.data.role === "admin" ? "/admin-dashboard" : "/donor-dashboard"
        );
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        // Server responded with error
        setError(err.response.data.message || "Login failed");
      } else if (err.request) {
        // Request made but no response
        setError(
          "Cannot connect to server. Please check if the server is running on port 3000."
        );
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(/images/blood.jpg)" }}
    >
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500/50 via-red-500/30 to-transparent">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-xl shadow-2xl max-w-md w-full border border-white/20"
        >
          <div className="flex items-center mb-6">
            <img
              src="/images/logo.jpg"
              alt="LifeStream Logo"
              className="h-12 w-12 mr-3"
            />
            <h1 className="text-3xl font-bold text-blue-600">
              LifeStream Login
            </h1>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              variants={buttonVariants}
              whileHover={!isLoading ? "hover" : {}}
              whileTap={!isLoading ? "tap" : {}}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </motion.button>
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="text-orange-500 hover:underline">
                Sign up
              </a>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
