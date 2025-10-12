import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();
  const { setToken, setRole } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setSelectedRole] = useState("donor");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/signup", {
        email,
        password,
        role,
      });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        setToken(res.data.token);
        setRole(res.data.role);
        navigate(
          res.data.role === "admin" ? "/admin-dashboard" : "/donor-dashboard"
        );
      }
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow">
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="block w-full mb-2 p-2 border"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="block w-full mb-2 p-2 border"
          required
        />
        <select
          value={role}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="block w-full mb-2 p-2 border"
        >
          <option value="donor">Donor</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-green-500 text-white px-4 py-2">
          Signup
        </button>
        <p className="mt-2">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

export default Signup;
