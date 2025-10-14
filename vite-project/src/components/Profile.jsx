import { motion } from "framer-motion";
import { useState } from "react";

function Profile() {
  const [userInfo, setUserInfo] = useState({
    fullName: localStorage.getItem("fullName") || "",
    email: localStorage.getItem("email") || "",
    telephone: localStorage.getItem("telephone") || "",
    address: localStorage.getItem("address") || "",
    bloodGroup: localStorage.getItem("bloodGroup") || "",
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    // Update localStorage and potentially backend
    Object.keys(userInfo).forEach((key) => {
      localStorage.setItem(key, userInfo[key]);
    });
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <nav className="bg-orange-500 shadow-md fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <img
                src="/images/logo.jpg"
                alt="LifeStream Logo"
                className="h-8 w-8 mr-2"
              />
              <a href="/" className="text-2xl font-bold text-white">
                LifeStream
              </a>
            </div>
            <div className="flex space-x-4">
              <a
                href="/donor-dashboard"
                className="text-white hover:text-orange-200"
              >
                Dashboard
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16">
        <motion.section
          className="text-center py-16 bg-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Your Profile
            </h1>
            <p className="text-xl text-gray-600">
              Manage your personal information and donation preferences.
            </p>
          </div>
        </motion.section>

        <section className="max-w-2xl mx-auto px-4 py-16">
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userInfo.fullName}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, fullName: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={userInfo.email}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, email: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={userInfo.telephone}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, telephone: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={userInfo.address}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, address: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group
                </label>
                <select
                  value={userInfo.bloodGroup}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, bloodGroup: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <motion.button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Update Profile
              </motion.button>
            </form>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
