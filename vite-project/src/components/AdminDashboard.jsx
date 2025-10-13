import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// Backend API URL constant
const API_BASE_URL = "http://localhost:3000/api/donations";
const AUTH_TOKEN = localStorage.getItem("token");

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
  const [donations, setDonations] = useState([]);
  const [activeTab, setActiveTab] = useState("donations");
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  // Get admin name from localStorage
  const adminName = localStorage.getItem("fullName") || "Admin";

  // Fetch all donations
  const fetchDonations = useCallback(async () => {
    if (!AUTH_TOKEN) {
      showFeedback("Authentication failed. Please log in again.", true);
      navigate("/login");
      return;
    }
    try {
      const res = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      });
      setDonations(res.data);
    } catch (err) {
      console.error("Error fetching donations:", err);
      showFeedback("Failed to load donation data.", true);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  // Feedback handler
  const showFeedback = useCallback((msg, error = false) => {
    setIsError(error);
    setMessage(msg);
    setTimeout(() => setMessage(null), 5000);
  }, []);

  // Update donation status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API_BASE_URL}/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
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

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("fullName");
    navigate("/login");
  };

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
              <span className="text-gray-700">Welcome, {adminName}</span>
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
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-500">
              Total Requests
            </h3>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
            <h3 className="text-sm font-medium text-gray-500">Today</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.today}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
            <h3 className="text-sm font-medium text-gray-500">This Week</h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats.thisWeek}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500">This Month</h3>
            <p className="text-3xl font-bold text-green-600">
              {stats.thisMonth}
            </p>
          </div>
        </div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-sm font-medium text-gray-500">Approved</h3>
            <p className="text-2xl font-bold text-green-600">
              {stats.approved}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </div>
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
                  className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-sm"
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
                        Donor Email
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
                        Details
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
                          colSpan="7"
                          className="p-4 text-center text-gray-500"
                        >
                          No {filterStatus !== "all" ? filterStatus : ""}{" "}
                          donations found.
                        </td>
                      </tr>
                    ) : (
                      filteredDonations.map((d) => (
                        <motion.tr
                          key={d.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-gray-50 transition duration-150"
                        >
                          <td className="p-4 border-b border-gray-200">
                            {d.User?.email || d.email || "N/A"}
                          </td>
                          <td className="p-4 border-b border-gray-200">
                            {d.User?.telephone || d.contact || "N/A"}
                          </td>
                          <td className="p-4 border-b border-gray-200">
                            {d.User?.bloodGroup || d.bloodGroup || "N/A"}
                          </td>
                          <td className="p-4 border-b border-gray-200">
                            {d.type}
                          </td>
                          <td className="p-4 border-b border-gray-200">
                            {d.details || "N/A"}
                          </td>
                          <td className="p-4 border-b border-gray-200">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${
                                d.status === "approved"
                                  ? "bg-green-500"
                                  : d.status === "rejected"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                              }`}
                            >
                              {d.status}
                            </span>
                          </td>
                          <td className="p-4 border-b border-gray-200">
                            {d.status === "pending" && (
                              <div className="space-x-2">
                                <button
                                  onClick={() => updateStatus(d.id, "approved")}
                                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition duration-150"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => updateStatus(d.id, "rejected")}
                                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-150"
                                >
                                  Reject
                                </button>
                              </div>
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
            <div className="p-6 text-center text-gray-600">
              <h3 className="text-xl font-semibold">Reports Section</h3>
              <p className="mt-4">
                Coming soon: Detailed donation analytics and reports.
              </p>
            </div>
          )}

          {activeTab === "users" && (
            <div className="p-6 text-center text-gray-600">
              <h3 className="text-xl font-semibold">User Management</h3>
              <p className="mt-4">
                Coming soon: Manage user accounts and roles.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default AdminDashboard;
