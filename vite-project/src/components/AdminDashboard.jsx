import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// Backend API URL constants
const API_BASE_URL = "http://localhost:3000/api";
const API_DONATIONS_URL = `${API_BASE_URL}/donations`;
const API_USERS_URL = `${API_BASE_URL}/users`;
const API_CONTACTS_URL = `${API_BASE_URL}/contact`;

// Digital Clock Component
const DigitalClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-4 rounded-xl shadow-lg">
      <div className="text-center">
        <div className="text-2xl font-mono font-bold mb-1">
          {formatTime(currentTime)}
        </div>
        <div className="text-sm opacity-90">{formatDate(currentTime)}</div>
      </div>
    </div>
  );
};

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

// User Details Modal Component
const UserDetailsModal = ({
  user,
  isOpen,
  onClose,
  onRoleChange,
  currentUserId,
}) => {
  if (!isOpen || !user) return null;

  const getRoleBadge = (role) => {
    return role === "admin"
      ? "bg-purple-100 text-purple-800"
      : "bg-blue-100 text-blue-800";
  };

  const canModify = user.id !== currentUserId;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  User Details
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold text-lg">
                      {user.fullName?.charAt(0) || user.email?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {user.fullName || "N/A"}
                    </h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Role:</span>
                    <span
                      className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">
                      Blood Group:
                    </span>
                    <span className="ml-2 text-gray-800">
                      {user.bloodGroup || "Not specified"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-gray-500">Contact:</span>
                    <span className="ml-2 text-gray-800">
                      {user.telephone || "Not specified"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-gray-500">Address:</span>
                    <span className="ml-2 text-gray-800">
                      {user.address || "Not specified"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-gray-500">
                      Registered:
                    </span>
                    <span className="ml-2 text-gray-800">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {canModify && (
                  <div className="pt-4 border-t">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Change Role:
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onRoleChange(user.id, "donor")}
                        disabled={user.role === "donor"}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition duration-150 ${
                          user.role === "donor"
                            ? "bg-blue-600 text-white"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }`}
                      >
                        Donor
                      </button>
                      <button
                        onClick={() => onRoleChange(user.id, "admin")}
                        disabled={user.role === "admin"}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition duration-150 ${
                          user.role === "admin"
                            ? "bg-purple-600 text-white"
                            : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        }`}
                      >
                        Admin
                      </button>
                    </div>
                  </div>
                )}

                {!canModify && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500 text-center">
                      You cannot modify your own role
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Report Card Component
const ReportCard = ({ title, value, change, changeType, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-xl shadow-lg border-l-4 hover:shadow-xl transition duration-300"
    style={{ borderLeftColor: color }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        {change && (
          <p
            className={`text-sm mt-1 ${
              changeType === "positive" ? "text-green-600" : "text-red-600"
            }`}
          >
            {changeType === "positive" ? "↑" : "↓"} {change}
          </p>
        )}
      </div>
      <div className="text-2xl" style={{ color }}>
        {icon}
      </div>
    </div>
  </motion.div>
);

// Simple Bar Chart Component
const SimpleBarChart = ({ data, title, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <span className="text-sm text-gray-600 w-20 truncate">
            {item.label}
          </span>
          <div className="flex-1 mx-2">
            <div
              className="h-6 rounded-full transition-all duration-500"
              style={{
                width: `${item.percentage}%`,
                backgroundColor: color,
              }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-800 w-8 text-right">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

function AdminDashboard() {
  const navigate = useNavigate();
  const { user: currentUser, token, logout } = useContext(AuthContext);
  const [donations, setDonations] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("donations");
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [reportPeriod, setReportPeriod] = useState("month");

  // Feedback handler
  const showFeedback = useCallback((msg, error = false) => {
    setIsError(error);
    setMessage(msg);
    setTimeout(() => setMessage(null), 5000);
  }, []);

  // Fetch all data
  const fetchDonations = useCallback(async () => {
    if (!token) {
      showFeedback("Authentication failed. Please log in again.", true);
      navigate("/login");
      return;
    }
    try {
      const res = await axios.get(API_DONATIONS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonations(res.data);
    } catch (err) {
      console.error("Error fetching donations:", err);
      showFeedback("Failed to load donation data.", true);
    }
  }, [token, navigate, showFeedback]);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(API_USERS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      showFeedback("Failed to load user data.", true);
    }
  }, [token, showFeedback]);

  const fetchContacts = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(API_CONTACTS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(res.data.contacts || []);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  }, [token]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchDonations(), fetchUsers(), fetchContacts()]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchDonations, fetchUsers, fetchContacts]);

  // Update donation status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API_DONATIONS_URL}/${id}`,
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

  // Update user role
  const updateUserRole = async (userId, newRole) => {
    try {
      await axios.put(
        `${API_USERS_URL}/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchUsers();
      showFeedback(`User role updated to ${newRole} successfully.`);
      setIsUserModalOpen(false);
    } catch (err) {
      console.error("Error updating user role:", err);
      showFeedback("Failed to update user role.", true);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`${API_USERS_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchUsers();
      showFeedback("User deleted successfully.");
    } catch (err) {
      console.error("Error deleting user:", err);
      showFeedback("Failed to delete user.", true);
    }
  };

  // Open user details modal
  const openUserDetails = (user) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  // Calculate report data
  const calculateReportData = () => {
    const now = new Date();
    let startDate;

    switch (reportPeriod) {
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    // Filter data for the selected period
    const periodDonations = donations.filter(
      (d) => new Date(d.createdAt) >= startDate
    );
    const periodUsers = users.filter((u) => new Date(u.createdAt) >= startDate);
    const periodContacts = contacts.filter(
      (c) => new Date(c.createdAt) >= startDate
    );

    // Donation statistics
    const donationStats = {
      total: periodDonations.length,
      approved: periodDonations.filter((d) => d.status === "approved").length,
      pending: periodDonations.filter((d) => d.status === "pending").length,
      rejected: periodDonations.filter((d) => d.status === "rejected").length,
      blood: periodDonations.filter((d) => d.type === "blood").length,
      organ: periodDonations.filter((d) => d.type === "organ").length,
    };

    // User statistics
    const userStats = {
      total: periodUsers.length,
      donors: periodUsers.filter((u) => u.role === "donor").length,
      admins: periodUsers.filter((u) => u.role === "admin").length,
    };

    // Contact statistics
    const contactStats = {
      total: periodContacts.length,
    };

    // Blood group distribution
    const bloodGroups = {};
    users.forEach((user) => {
      if (user.bloodGroup) {
        bloodGroups[user.bloodGroup] = (bloodGroups[user.bloodGroup] || 0) + 1;
      }
    });

    const bloodGroupData = Object.entries(bloodGroups)
      .map(([group, count]) => ({
        label: group,
        value: count,
        percentage: (count / users.length) * 100,
      }))
      .sort((a, b) => b.value - a.value);

    // Donation type distribution
    const donationTypeData = [
      {
        label: "Blood",
        value: donationStats.blood,
        percentage: (donationStats.blood / donationStats.total) * 100 || 0,
      },
      {
        label: "Organ",
        value: donationStats.organ,
        percentage: (donationStats.organ / donationStats.total) * 100 || 0,
      },
    ];

    // Status distribution
    const statusData = [
      {
        label: "Approved",
        value: donationStats.approved,
        percentage: (donationStats.approved / donationStats.total) * 100 || 0,
      },
      {
        label: "Pending",
        value: donationStats.pending,
        percentage: (donationStats.pending / donationStats.total) * 100 || 0,
      },
      {
        label: "Rejected",
        value: donationStats.rejected,
        percentage: (donationStats.rejected / donationStats.total) * 100 || 0,
      },
    ];

    return {
      donationStats,
      userStats,
      contactStats,
      bloodGroupData,
      donationTypeData,
      statusData,
      periodDonations,
      periodUsers,
      periodContacts,
    };
  };

  // Export functionality
  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      showFeedback("No data to export.", true);
      return;
    }

    const headers = Object.keys(data[0]).join(",");
    const csvData = data
      .map((row) =>
        Object.values(row)
          .map((value) =>
            typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value
          )
          .join(",")
      )
      .join("\n");

    const csv = `${headers}\n${csvData}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showFeedback(`${filename} exported successfully!`);
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
    totalUsers: users.length,
    adminUsers: users.filter((u) => u.role === "admin").length,
    donorUsers: users.filter((u) => u.role === "donor").length,
  };

  const reportData = calculateReportData();

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

      <UserDetailsModal
        user={selectedUser}
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onRoleChange={updateUserRole}
        currentUserId={currentUser?.id}
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
                  {currentUser?.fullName || "Administrator"}
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
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats.totalUsers}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition duration-300"
          >
            <DigitalClock />
          </motion.div>
        </div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
          >
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <h3 className="text-sm font-medium text-gray-500">Admins</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {stats.adminUsers}
            </p>
            <p className="text-xs text-gray-500 mt-1">Administrator accounts</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
          >
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <h3 className="text-sm font-medium text-gray-500">Donors</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {stats.donorUsers}
            </p>
            <p className="text-xs text-gray-500 mt-1">Donor accounts</p>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          {["donations", "users", "reports"].map((tab) => (
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
              {tab === "users" && `User Management (${users.length})`}
              {tab === "reports" && "Analytics & Reports"}
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

          {activeTab === "users" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-extrabold text-gray-800">
                  User Management
                </h2>
                <div className="text-sm text-gray-500">
                  Total: {users.length} users
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gradient-to-r from-purple-100 to-pink-100 text-gray-700">
                    <tr>
                      <th className="p-4 border-b-2 border-gray-200 font-semibold">
                        User
                      </th>
                      <th className="p-4 border-b-2 border-gray-200 font-semibold">
                        Contact
                      </th>
                      <th className="p-4 border-b-2 border-gray-200 font-semibold">
                        Blood Group
                      </th>
                      <th className="p-4 border-b-2 border-gray-200 font-semibold">
                        Role
                      </th>
                      <th className="p-4 border-b-2 border-gray-200 font-semibold">
                        Registered
                      </th>
                      <th className="p-4 border-b-2 border-gray-200 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="p-8 text-center text-gray-500"
                        >
                          <div className="flex flex-col items-center">
                            <div className="text-4xl mb-2">👥</div>
                            <p className="text-lg font-medium">
                              No users found.
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              User accounts will appear here once registered.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      users.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-gray-50 transition duration-150 border-b border-gray-100"
                        >
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="text-indigo-600 font-semibold text-sm">
                                  {user.fullName?.charAt(0) ||
                                    user.email?.charAt(0) ||
                                    "U"}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {user.fullName || "N/A"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-gray-600">
                              {user.telephone || "Not specified"}
                            </div>
                            <div className="text-xs text-gray-400 max-w-xs truncate">
                              {user.address || "No address"}
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.bloodGroup
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {user.bloodGroup || "Not specified"}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-gray-600">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <motion.button
                                onClick={() => openUserDetails(user)}
                                className="bg-indigo-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-600 transition duration-150"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                View
                              </motion.button>
                              {user.id !== currentUser?.id && (
                                <motion.button
                                  onClick={() => deleteUser(user.id)}
                                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition duration-150"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Delete
                                </motion.button>
                              )}
                            </div>
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
            <div className="space-y-6">
              {/* Report Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-800">
                    Analytics & Reports
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Comprehensive overview of your donation portal performance
                  </p>
                </div>
                <div className="flex space-x-4 mt-4 lg:mt-0">
                  <select
                    value={reportPeriod}
                    onChange={(e) => setReportPeriod(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="year">Last Year</option>
                  </select>
                  <button
                    onClick={() => exportToCSV(donations, "donations_report")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-150"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <ReportCard
                  title="Total Donations"
                  value={reportData.donationStats.total}
                  change="+12%"
                  changeType="positive"
                  icon="📊"
                  color="#3B82F6"
                />
                <ReportCard
                  title="New Users"
                  value={reportData.userStats.total}
                  change="+8%"
                  changeType="positive"
                  icon="👥"
                  color="#8B5CF6"
                />
                <ReportCard
                  title="Approval Rate"
                  value={`${(
                    (reportData.donationStats.approved /
                      reportData.donationStats.total) *
                      100 || 0
                  ).toFixed(1)}%`}
                  change="+5%"
                  changeType="positive"
                  icon="✅"
                  color="#10B981"
                />
                <ReportCard
                  title="Contact Messages"
                  value={reportData.contactStats.total}
                  change="+15%"
                  changeType="positive"
                  icon="📩"
                  color="#F59E0B"
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <SimpleBarChart
                  data={reportData.bloodGroupData}
                  title="Blood Group Distribution"
                  color="#EF4444"
                />
                <SimpleBarChart
                  data={reportData.donationTypeData}
                  title="Donation Types"
                  color="#3B82F6"
                />
                <SimpleBarChart
                  data={reportData.statusData}
                  title="Donation Status"
                  color="#10B981"
                />

                {/* Quick Stats Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Quick Statistics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active Donors</span>
                      <span className="font-semibold">
                        {reportData.userStats.donors}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Administrators</span>
                      <span className="font-semibold">
                        {reportData.userStats.admins}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pending Requests</span>
                      <span className="font-semibold text-yellow-600">
                        {reportData.donationStats.pending}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Rejection Rate</span>
                      <span className="font-semibold text-red-600">
                        {(
                          (reportData.donationStats.rejected /
                            reportData.donationStats.total) *
                            100 || 0
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {reportData.periodDonations.slice(0, 5).map((donation) => (
                    <div
                      key={donation.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            donation.status === "approved"
                              ? "bg-green-500"
                              : donation.status === "pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {donation.User?.fullName || donation.fullName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {donation.type} donation
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-800">
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">
                          {donation.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Section */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Data Export
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => exportToCSV(donations, "donations")}
                    className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition duration-150"
                  >
                    <div className="text-blue-600 text-lg mb-2">📊</div>
                    <p className="font-medium text-blue-800">
                      Export Donations
                    </p>
                    <p className="text-sm text-blue-600">
                      {donations.length} records
                    </p>
                  </button>
                  <button
                    onClick={() => exportToCSV(users, "users")}
                    className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition duration-150"
                  >
                    <div className="text-purple-600 text-lg mb-2">👥</div>
                    <p className="font-medium text-purple-800">Export Users</p>
                    <p className="text-sm text-purple-600">
                      {users.length} records
                    </p>
                  </button>
                  <button
                    onClick={() => exportToCSV(contacts, "contacts")}
                    className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition duration-150"
                  >
                    <div className="text-green-600 text-lg mb-2">📩</div>
                    <p className="font-medium text-green-800">
                      Export Contacts
                    </p>
                    <p className="text-sm text-green-600">
                      {contacts.length} records
                    </p>
                  </button>
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
