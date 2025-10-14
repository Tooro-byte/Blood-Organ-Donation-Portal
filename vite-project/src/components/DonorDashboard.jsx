import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// Backend API URL constants
const API_BASE_URL = "http://localhost:3000/api/donations";
const API_USER_DONATIONS_URL = "http://localhost:3000/api/user/donations";

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
    <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-4 rounded-xl shadow-lg">
      <div className="text-center">
        <div className="text-2xl font-mono font-bold mb-1">
          {formatTime(currentTime)}
        </div>
        <div className="text-sm opacity-90">{formatDate(currentTime)}</div>
      </div>
    </div>
  );
};

// --- Custom Feedback Message Component ---
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

function DonorDashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useContext(AuthContext);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Donation form states
  const [donationType, setDonationType] = useState("blood");
  const [details, setDetails] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [hospital, setHospital] = useState("");
  const [time, setTime] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // State for custom feedback message
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  // Function to display custom feedback message
  const showFeedback = useCallback((msg, error = false) => {
    setIsError(error);
    setMessage(msg);
    setTimeout(() => setMessage(null), 5000);
  }, []);

  // Fetch all donations for the authenticated user
  const fetchDonations = useCallback(async () => {
    if (!token) {
      showFeedback("Authentication failed. Please log in again.", true);
      navigate("/login");
      return;
    }
    try {
      const res = await axios.get(API_USER_DONATIONS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonations(res.data);
    } catch (err) {
      console.error("Error fetching donations:", err);
      showFeedback("Failed to load donation history.", true);
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

  // Memoized filter logic
  const filteredDonations = useMemo(() => {
    return donations.filter(
      (d) => filterStatus === "all" || d.status === filterStatus
    );
  }, [donations, filterStatus]);

  // Handler for submitting a new donation request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      showFeedback("Please log in to submit a donation.", true);
      return;
    }

    if (!user) {
      showFeedback(
        "User information not loaded. Please refresh the page.",
        true
      );
      return;
    }

    try {
      await axios.post(
        API_BASE_URL,
        {
          type: donationType,
          details,
          preferredDate,
          hospital,
          time,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchDonations(); // Refresh donations after submission
      setDetails("");
      setPreferredDate("");
      setHospital("");
      setTime("");
      showFeedback("Donation request submitted successfully!");
    } catch (err) {
      console.error("Submission error:", err);
      showFeedback("Failed to submit donation. Please try again.", true);
    }
  };

  // Handler for cancelling a PENDING donation request
  const handleCancelDonation = async (donationId) => {
    if (
      !window.confirm("Are you sure you want to cancel this donation request?")
    ) {
      return;
    }
    try {
      await axios.delete(`${API_BASE_URL}/${donationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchDonations(); // Refresh donations after cancellation
      showFeedback("Donation request successfully cancelled.");
    } catch (err) {
      console.error("Cancellation error:", err);
      showFeedback(
        "Failed to cancel donation. It might already be processed.",
        true
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-500 hover:bg-green-600";
      case "rejected":
        return "bg-red-500 hover:bg-red-600";
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-gray-500";
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-inter">
      <FeedbackMessage
        message={message}
        isError={isError}
        onClose={() => setMessage(null)}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 text-xl font-bold text-orange-600">
              LifeStream Portal
            </div>
            <ul className="flex space-x-6 items-center">
              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("donation-form-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-gray-700 hover:text-orange-600 font-medium transition duration-150"
                >
                  Make Donation
                </button>
              </li>
              <li>
                <a
                  href="/guidelines"
                  className="text-gray-700 hover:text-orange-600 font-medium transition duration-150"
                >
                  Donation Guidelines
                </a>
              </li>
              <li>
                <a
                  href="/why-donate"
                  className="text-gray-700 hover:text-orange-600 font-medium transition duration-150"
                >
                  Why Donate
                </a>
              </li>
              <li>
                <a
                  href="/refer"
                  className="text-gray-700 hover:text-orange-600 font-medium transition duration-150"
                >
                  Refer a Friend
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-gray-700 hover:text-orange-600 font-medium transition duration-150"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/education"
                  className="text-gray-700 hover:text-orange-600 font-medium transition duration-150"
                >
                  Health Education
                </a>
              </li>
              <li>
                <a
                  href="/hiv-test"
                  className="text-gray-700 hover:text-orange-600 font-medium transition duration-150"
                >
                  Test for HIV
                </a>
              </li>
              <li>
                <a
                  href="/profile"
                  className="text-gray-700 hover:text-orange-600 font-medium transition duration-150"
                >
                  Profile
                </a>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition duration-150 shadow-md"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Header and Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-white shadow-xl rounded-xl border border-orange-100"
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Welcome Section */}
            <div className="lg:col-span-3">
              <h1 className="text-3xl font-extrabold text-gray-800">
                Welcome back,{" "}
                <span className="text-orange-600">
                  {user?.fullName || "Valued Donor"}
                </span>
                !
              </h1>
              <p className="text-gray-500 mt-1">
                Thank you for being a LifeStream donor. Your willingness saves
                lives.
              </p>

              <div className="flex space-x-4 mt-6">
                <div className="flex-1 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Total Submissions
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {donations.length}
                  </p>
                </div>
                <div className="flex-1 p-4 bg-green-50 rounded-lg border-l-4 border-green-500 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Approved Donations
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {donations.filter((d) => d.status === "approved").length}
                  </p>
                </div>
                <div className="flex-1 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Pending Requests
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {donations.filter((d) => d.status === "pending").length}
                  </p>
                </div>
              </div>

              <a
                href="/profile"
                className="mt-4 inline-block text-orange-600 px-4 py-1 rounded-full text-sm font-semibold hover:bg-orange-100 transition duration-150"
              >
                View & Update Profile
              </a>
            </div>

            {/* Digital Clock */}
            <div className="lg:col-span-1">
              <DigitalClock />
            </div>
          </div>
        </motion.div>

        {/* Donation Form Section */}
        <motion.div
          id="donation-form-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-8 bg-white shadow-xl rounded-xl mx-auto mt-8 border border-green-100"
        >
          <h2 className="text-2xl font-bold text-green-600 mb-6 border-b pb-2">
            Submit New Donation Request
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Your details below are pre-filled from your profile. Please confirm
            your donation preferences.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Displaying Profile Data (Read-only for context) */}
            {user && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border">
                <div className="p-2 border-r">
                  <p className="text-xs text-gray-500">Email:</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div className="p-2 border-r">
                  <p className="text-xs text-gray-500">Blood Group:</p>
                  <p className="font-medium">
                    {user.bloodGroup || "Not specified"}
                  </p>
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-500">Contact:</p>
                  <p className="font-medium">
                    {user.telephone || "Not specified"}
                  </p>
                </div>
              </div>
            )}

            {/* Donation Specific Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Donation Type
                </label>
                <select
                  value={donationType}
                  onChange={(e) => setDonationType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150"
                  required
                >
                  <option value="blood">Blood</option>
                  <option value="organ">Organ</option>
                  <option value="other">Others</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150"
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hospital/Location
                </label>
                <input
                  type="text"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  placeholder="e.g., City General Hospital"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150"
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Details (Optional)
                </label>
                <input
                  type="text"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g., Specific organ, allergies, etc."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full md:w-auto bg-orange-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-orange-700 transition duration-150 shadow-lg"
            >
              Submit Donation Request
            </motion.button>
          </form>
        </motion.div>

        {/* Donation History Table/Cards */}
        <div className="p-8 bg-white shadow-xl rounded-xl mx-auto mt-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
            Your Donation History
          </h2>

          <div className="flex justify-end mb-4">
            <label className="text-sm font-medium text-gray-700 mr-2">
              Filter by Status:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150 text-sm"
            >
              <option value="all">All Submissions</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonations.length === 0 ? (
              <p className="col-span-3 text-center text-gray-500 p-8">
                No {filterStatus !== "all" ? filterStatus : ""} donations found.
              </p>
            ) : (
              filteredDonations.map((d) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`inline-block px-3 py-1 text-white text-xs font-bold uppercase rounded-full mb-3 shadow-sm ${getStatusColor(
                        d.status
                      )}`}
                    >
                      {d.status}
                    </div>
                    <p className="text-sm text-gray-500 mb-1">
                      <span className="font-semibold">Type:</span> {d.type}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      <span className="font-semibold">Date:</span>{" "}
                      {new Date(d.preferredDate).toLocaleDateString()} at{" "}
                      {d.time}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      <span className="font-semibold">Location:</span>{" "}
                      {d.hospital}
                    </p>
                    {d.details && (
                      <p className="text-sm text-gray-500 mb-3">
                        <span className="font-semibold">Details:</span>{" "}
                        {d.details}
                      </p>
                    )}
                  </div>

                  {d.status === "pending" && (
                    <button
                      onClick={() => handleCancelDonation(d.id)}
                      className="mt-3 text-red-500 text-sm font-medium hover:text-red-700 transition duration-150 self-start"
                    >
                      Cancel Request
                    </button>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonorDashboard;
