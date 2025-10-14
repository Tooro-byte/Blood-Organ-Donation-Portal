import { motion } from "framer-motion";
import { useState } from "react";

function ReferFriend() {
  const [formData, setFormData] = useState({
    friendName: "",
    friendEmail: "",
    friendPhone: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle referral submission
    alert("Referral sent successfully!");
    setFormData({
      friendName: "",
      friendEmail: "",
      friendPhone: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
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
              Refer a Friend
            </h1>
            <p className="text-xl text-gray-600">
              Help us grow our community of life-savers by referring friends and
              family.
            </p>
          </div>
        </motion.section>

        <section className="max-w-2xl mx-auto px-4 py-16">
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Friend's Name
                </label>
                <input
                  type="text"
                  value={formData.friendName}
                  onChange={(e) =>
                    setFormData({ ...formData, friendName: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Friend's Email
                </label>
                <input
                  type="email"
                  value={formData.friendEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, friendEmail: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Friend's Phone
                </label>
                <input
                  type="tel"
                  value={formData.friendPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, friendPhone: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Tell your friend why they should join LifeStream..."
                />
              </div>
              <motion.button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Referral
              </motion.button>
            </form>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

export default ReferFriend;
