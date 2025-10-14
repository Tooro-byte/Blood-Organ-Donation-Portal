import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// Backend API URL constants
const API_BASE_URL = "http://localhost:3000/api/donations";

// Custom Feedback Message Component
const FeedbackMessage = ({ message, isError, onClose }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl text-white max-w-sm ${
          isError ? "bg-red-600" : "bg-green-600"
        }`}
      >
        <p className="font-semibold">{isError ? "Error" : "Success"}</p>
        <p>{message}</p>
        <button
          onClick={onClose}
          className="absolute top-1 right-2 text-xl font-bold opacity-75 hover:opacity-100"
        >
          ×
        </button>
      </motion.div>
    )}
  </AnimatePresence>
);

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useContext(AuthContext);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("donations");
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  // Feedback handler
  const showFeedback = useCallback((msg, error = false) => {
    setIsError(error);
    setMessage(msg);
    setTimeout(() => setMessage(null), 5000);
  }, []);

  // Fetch all donations
  const fetchDonations = useCallback(async () => {
    if (!token) {
      showFeedback("Authentication failed. Please log in again.", true);
      navigate("/login");
      return;
    }
    try {
      const res = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonations(res.data);
    } catch (err) {
      console.error("Error fetching donations:", err);
      showFeedback("Failed to load donation data.", true);
    }
  }, [token, navigate, showFeedback]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchDonations();
      setLoading(false);
    };

    loadData();
  }, [fetchDonations]);

  // Update donation status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API_BASE_URL}/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchDonations();
      showFeedback(`Donation ${status} successfully.`);
    } catch (err) {
      console.error("Error updating status:", err);
      showFeedback("Failed to update donation status.", true);
    }
  };

  // Filtered donations based on status
  const filteredDonations = donations.filter(
    (d) => filterStatus === "all" || d.status === filterStatus
  );

  // Calculate statistics
  const stats = {
    total: donations.length,
    pending: donations.filter((d) => d.status === "pending").length,
    approved: donations.filter((d) => d.status === "approved").length,
    rejected: donations.filter((d) => d.status === "rejected").length,
    today: donations.filter((d) => {
      const today = new Date().toDateString();
      const donationDate = new Date(d.createdAt).toDateString();
      return donationDate === today;
    }).length,
    thisWeek: donations.filter((d) => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(d.createdAt) >= oneWeekAgo;
    }).length,
    thisMonth: donations.filter((d) => {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return new Date(d.createdAt) >= oneMonthAgo;
    }).length,
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-inter">
      <FeedbackMessage
        message={message}
        isError={isError}
        onClose={() => setMessage(null)}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 text-xl font-bold text-indigo-700">
              LifeStream Admin Portal
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome,{" "}
                <span className="font-semibold text-indigo-600">
                  {user?.fullName || "Administrator"}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition duration-150 shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition duration-300"
          >
            <h3 className="text-sm font-medium text-gray-500">
              Total Requests
            </h3>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500 hover:shadow-xl transition duration-300"
          >
            <h3 className="text-sm font-medium text-gray-500">Today</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.today}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition duration-300"
          >
            <h3 className="text-sm font-medium text-gray-500">This Week</h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats.thisWeek}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition duration-300"
          >
            <h3 className="text-sm font-medium text-gray-500">This Month</h3>
            <p className="text-3xl font-bold text-green-600">
              {stats.thisMonth}
            </p>
          </motion.div>
        </div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
          >
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
            <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
          >
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <h3 className="text-sm font-medium text-gray-500">Approved</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {stats.approved}
            </p>
            <p className="text-xs text-gray-500 mt-1">Successfully processed</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
          >
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            <p className="text-xs text-gray-500 mt-1">Not eligible</p>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          {["donations", "reports", "users"].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${
                activeTab === tab
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab === "donations" && "Donation Requests"}
              {tab === "reports" && "Reports"}
              {tab === "users" && "User Management"}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-2xl border border-gray-100 p-6"
        >
          {activeTab === "donations" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-extrabold text-gray-800">
                  Donation Requests
                </h2>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gradient-to-r from-indigo-100 to-blue-100 text-gray-700">
                    <tr>
                      <th className="p-4 border-b-2 border-gray-200 font-semibold">
                        Donor Name
                      </th>
                      <th className="p-4 border-b-2 border-gray-200 font-semibold">
                        Email
                      </th>
                      <th className="p-4 border-b-2 border-gray-200 font-semibold">
                        Contact
                      </th>
                      <th className="p-4 border-b-2 border-gray-200 font-semibold">
                        Blood Group
                      </th>
                      <th className="p-4 border-b-2 border-gray-200 font-semibold">
                        Type
                      </th>
                      <th className="p-4 border-b-2 border-gray-200 font-semibold">
                        Hospital
                      </th>
                      <th className="p-4 border-b-2 border-gray-200 font-semibold">
                        Preferred Date
                      </th>
                      <th className="p-4 border-b-2 border-gray-200 font-semibold">
                        Status
                      </th>
                      <th className="p-4 border-b-2 border-gray-200 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDonations.length === 0 ? (
                      <tr>
                        <td
                          colSpan="9"
                          className="p-8 text-center text-gray-500"
                        >
                          <div className="flex flex-col items-center">
                            <div className="text-4xl mb-2">📭</div>
                            <p className="text-lg font-medium">
                              No {filterStatus !== "all" ? filterStatus : ""}{" "}
                              donations found.
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              {filterStatus === "all"
                                ? "No donation requests have been submitted yet."
                                : `No ${filterStatus} donation requests at the moment.`}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredDonations.map((d, index) => (
                        <motion.tr
                          key={d.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-gray-50 transition duration-150 border-b border-gray-100"
                        >
                          <td className="p-4">
                            <div className="font-medium text-gray-900">
                              {d.User?.fullName || d.fullName || "N/A"}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-gray-600">
                              {d.User?.email || d.email || "N/A"}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-gray-600">
                              {d.User?.telephone || d.contact || "N/A"}
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                d.User?.bloodGroup || d.bloodGroup
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {d.User?.bloodGroup ||
                                d.bloodGroup ||
                                "Not specified"}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                d.type === "blood"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {d.type}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-gray-600 max-w-xs truncate">
                              {d.hospital}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-gray-600">
                              {new Date(d.preferredDate).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-400">
                              {d.time}
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                d.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : d.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {d.status.charAt(0).toUpperCase() +
                                d.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-4">
                            {d.status === "pending" && (
                              <div className="flex space-x-2">
                                <motion.button
                                  onClick={() => updateStatus(d.id, "approved")}
                                  className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition duration-150 flex items-center"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <span className="mr-1">✓</span> Approve
                                </motion.button>
                                <motion.button
                                  onClick={() => updateStatus(d.id, "rejected")}
                                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition duration-150 flex items-center"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <span className="mr-1">✕</span> Reject
                                </motion.button>
                              </div>
                            )}
                            {d.status !== "pending" && (
                              <span className="text-xs text-gray-400">
                                Processed
                              </span>
                            )}
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === "reports" && (
            <div className="p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  Reports Section
                </h3>
                <p className="text-gray-600 mb-6">
                  Detailed donation analytics and reports are coming soon. We're
                  working on comprehensive reporting features.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    <strong>Planned Features:</strong> Monthly reports, donor
                    statistics, approval rates, and export functionality.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  User Management
                </h3>
                <p className="text-gray-600 mb-6">
                  User account management features are under development. You'll
                  soon be able to manage donor and admin accounts.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700">
                    <strong>Coming Soon:</strong> User search, account
                    management, role assignments, and activity tracking.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default AdminDashboard;
