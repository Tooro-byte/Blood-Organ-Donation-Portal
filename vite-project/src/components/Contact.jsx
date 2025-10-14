import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/contact",
        formData
      );
      console.log("Response:", response.data);
      setFormStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(
        "Form submission error:",
        err.response?.data || err.message
      );
      setFormStatus("error");
    } finally {
      setIsSubmitting(false);
    }

    setTimeout(() => setFormStatus(null), 5000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  const cardVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

  const formVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
      {/* Navigation Bar */}
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
            <div className="hidden md:flex space-x-8">
              <a href="/" className="text-white hover:text-orange-200">
                Home
              </a>
              <a
                href="/guidelines"
                className="text-white hover:text-orange-200"
              >
                Guidelines
              </a>
              <a
                href="/why-donate"
                className="text-white hover:text-orange-200"
              >
                Why Donate
              </a>
              <a href="/contact" className="text-white border-b-2 border-white">
                Contact
              </a>
            </div>
            <div className="flex space-x-4">
              <a
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Login
              </a>
              <a
                href="/signup"
                className="border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-orange-500 transition duration-200"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <motion.section
          className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-6"
              variants={itemVariants}
            >
              Contact Us
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              We're here to help you. Get in touch with our friendly customer
              care team for any questions about donation.
            </motion.p>
            <motion.div variants={itemVariants}>
              <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          className="py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Customer Care Image & Info */}
              <motion.div className="space-y-8" variants={cardVariants}>
                {/* Customer Care Image */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <div className="h-80 bg-gradient-to-br from-blue-100 to-purple-100 relative">
                    <img
                      src="/images/customer.webp"
                      alt="Friendly Customer Care Representative"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold">Our Care Team</h3>
                      <p className="text-blue-100">
                        Always here to support you
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-blue-600 text-xl">📞</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Phone</h4>
                        <p className="text-gray-600">24/7 Support</p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-blue-600">
                      +1 (555) 123-4567
                    </p>
                  </motion.div>

                  <motion.div
                    className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-green-600 text-xl">✉️</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Email</h4>
                        <p className="text-gray-600">Quick Response</p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-green-600">
                      support@lifestream.org
                    </p>
                  </motion.div>
                </div>

                {/* Additional Info */}
                <motion.div
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 rounded-2xl shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl font-bold mb-4">Emergency Support</h3>
                  <p className="mb-4">
                    For urgent donation-related matters or medical emergencies,
                    our team is available 24/7 to provide immediate assistance.
                  </p>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🚨</span>
                    <span className="font-semibold">
                      Emergency Hotline: +1 (555) 911-HELP
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Side - Contact Form */}
              <motion.div
                className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12"
                variants={formVariants}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Send us a Message
                </h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form below and we'll get back to you within 24
                  hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="blood-donation">
                        Blood Donation Inquiry
                      </option>
                      <option value="organ-donation">
                        Organ Donation Information
                      </option>
                      <option value="technical-support">
                        Technical Support
                      </option>
                      <option value="general-question">General Question</option>
                      <option value="emergency">Emergency Assistance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="Tell us how we can help you..."
                      required
                    ></textarea>
                  </div>

                  {/* Form Status Messages */}
                  {formStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700"
                    >
                      ✅ Thank you! Your message has been sent successfully.
                      We'll get back to you soon.
                    </motion.div>
                  )}

                  {formStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
                    >
                      ❌ Sorry, there was an error sending your message. Please
                      try again or contact us directly.
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending Message...
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Additional Contact Information */}
        <motion.section
          className="py-16 bg-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Other Ways to Reach Us
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We're available through multiple channels to ensure you get the
                help you need.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🏢",
                  title: "Visit Our Office",
                  description:
                    "LifeStream Headquarters, 123 Health Plaza, Suite 400, Cityville, State 10001",
                  details: "Mon-Fri: 9:00 AM - 6:00 PM EST",
                },
                {
                  icon: "💬",
                  title: "Live Chat",
                  description:
                    "Get instant help through our live chat service during business hours",
                  details: "Available Mon-Fri: 8:00 AM - 8:00 PM EST",
                },
                {
                  icon: "📱",
                  title: "Mobile App",
                  description:
                    "Download our mobile app for quick access to support and donation tracking",
                  details: "Available on iOS and Android",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition duration-300"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <p className="text-sm text-blue-600 font-semibold">
                    {item.details}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">
            © 2025 LifeStream Donation Portal. All rights reserved.
          </p>
          <p className="text-gray-400 mt-2">
            Your trusted partner in saving lives through donation.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Contact;
