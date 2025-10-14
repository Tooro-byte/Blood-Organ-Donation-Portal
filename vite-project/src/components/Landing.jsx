import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

function Landing() {
  // State for carousel in Hero section
  const images = [
    "/images/blood.jpg",
    "/images/surgery.jpg",
    "/images/hospital.jpg",
    "/images/doctor.jpg",
    "/images/drips.jpeg",
    "/images/donor-2.jpg",
  ];
  const [currentImage, setCurrentImage] = useState(0);

  // State for contact form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState(null);

  // Auto-rotate carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Handle contact form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting form data:", formData);
      const response = await axios.post(
        "http://localhost:3000/api/contact",
        formData
      );
      console.log("Response:", response.data);
      setFormStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(
        "Form submission error:",
        err.response?.data || err.message
      );
      setFormStatus("error");
    }
    setTimeout(() => setFormStatus(null), 3000); // Clear status after 3 seconds
  };

  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  // Animation variants for buttons
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation Bar */}
      <nav className="bg-teal-500 shadow-md fixed top-0 left-0 w-full z-50 rounded-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <img
                src="/images/logo.jpg"
                alt="LifeStream Logo"
                className="h-10 w-10 mr-2 rounded-lg"
              />
              <a href="/" className="text-2xl font-bold text-white">
                LifeStream
              </a>
            </div>
            <div className="hidden md:flex space-x-8">
              <a
                href="#how-it-works"
                className="text-white hover:text-orange-200"
              >
                How It Works
              </a>
              <a
                href="#why-donate"
                className="text-white hover:text-orange-200"
              >
                Why Donate
              </a>
              <a href="#contact" className="text-white hover:text-orange-200">
                Contact
              </a>
            </div>
            <div className="flex space-x-4">
              <motion.a
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                variants={buttonVariants}
                whileHover="hover"
              >
                Login
              </motion.a>
              <motion.a
                href="/signup"
                className="border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-orange-500"
                variants={buttonVariants}
                whileHover="hover"
              >
                Sign Up
              </motion.a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Carousel */}
      <motion.section
        className="pt-24 pb-16 bg-gradient-to-r from-blue-100 to-red-100 flex items-center justify-center min-h-screen"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Give the Gift of Life. Register with LifeStream Today.
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Join a secure, centralized portal to track your intent to donate
              blood or organs and save lives.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <motion.a
                href="/signup"
                className="bg-red-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-red-700"
                variants={buttonVariants}
                whileHover="hover"
              >
                Sign Up Now
              </motion.a>
              <motion.a
                href="#why-donate"
                className="border border-red-600 text-red-600 px-6 py-3 rounded-md text-lg hover:bg-red-600 hover:text-white"
                variants={buttonVariants}
                whileHover="hover"
              >
                Learn More
              </motion.a>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 relative h-64 md:h-96">
            {images.map((src, index) => (
              <motion.img
                key={index}
                src={src}
                alt={`Donation image ${index + 1}`}
                className={`absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg`}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentImage ? 1 : 0 }}
                transition={{ duration: 1 }}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Why Donate Section */}
      <motion.section
        id="why-donate"
        className="py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Donate?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-red-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Constant Need</h3>
              <p className="text-gray-600">
                Blood donations are needed every 2 seconds to save lives in
                emergencies.
              </p>
            </div>
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-red-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Transplants Cure</h3>
              <p className="text-gray-600">
                Organ donations provide life-changing transplants for those in
                need.
              </p>
            </div>
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-red-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v2h5m-2-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold mb-2">
                Save Multiple Lives
              </h3>
              <p className="text-gray-600">
                One donation can save up to three lives through blood or organ
                contributions.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        id="how-it-works"
        className="py-16 bg-gray-100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            How LifeStream Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-blue-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3M5 10h14"
                />
              </svg>
              <h3 className="text-xl font-semibold mb-2">1. Register</h3>
              <p className="text-gray-600">
                Sign up as a donor or admin to join LifeStream.
              </p>
            </div>
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-blue-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="text-xl font-semibold mb-2">2. Submit Request</h3>
              <p className="text-gray-600">
                Choose to donate blood or an organ and submit your request.
              </p>
            </div>
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-blue-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold mb-2">3. Track Status</h3>
              <p className="text-gray-600">
                Admins review your request, and you can track its status.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Security & Privacy Section */}
      <motion.section
        id="security"
        className="py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Security & Privacy
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
            Your data is safe with LifeStream. Our portal uses MySQL with
            Sequelize for secure data handling, ensuring your personal and
            health information is protected with industry-standard encryption
            and authentication.
          </p>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section
        className="py-16 bg-gradient-to-r from-blue-100 to-red-100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Make a Difference with LifeStream?
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Join thousands of donors saving lives today.
          </p>
          <div className="flex justify-center space-x-4">
            <motion.a
              href="/signup"
              className="bg-red-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-red-700"
              variants={buttonVariants}
              whileHover="hover"
            >
              Sign Up Now
            </motion.a>
            <motion.a
              href="/login"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md text-lg hover:bg-blue-600 hover:text-white"
              variants={buttonVariants}
              whileHover="hover"
            >
              Login
            </motion.a>
          </div>
        </div>
      </motion.section>

      {/* Footer with Contact Form and Navigation Links */}
      <footer id="contact" className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-400"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <motion.button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  variants={buttonVariants}
                  whileHover="hover"
                >
                  Submit
                </motion.button>
                {formStatus === "success" && (
                  <p className="text-green-400">Message sent successfully!</p>
                )}
                {formStatus === "error" && (
                  <p className="text-red-400">
                    Failed to send message. Try again.
                  </p>
                )}
              </form>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Address</h3>
              <p className="text-gray-300">LifeStream HQ</p>
              <p className="text-gray-300">123 Health Plaza, Suite 400</p>
              <p className="text-gray-300">Cityville, State 10001</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Operating Hours</h3>
              <p className="text-gray-300">Monday - Friday</p>
              <p className="text-gray-300">9:00 AM - 5:00 PM (EST)</p>
              <h3 className="text-lg font-semibold mt-4 mb-2">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="h-6 w-6 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="h-6 w-6 text-pink-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.332.014 7.052.072 3.668.227 1.981 1.97 1.826 5.354.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.215 3.383 1.958 5.07 5.342 5.226 1.28.058 1.689.072 4.948.072s3.668-.014 4.948-.072c3.384-.156 5.127-1.843 5.282-5.226.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.156-3.384-1.898-5.127-5.282-5.282C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-300 hover:text-blue-400"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#why-donate"
                    className="text-gray-300 hover:text-blue-400"
                  >
                    Why Donate
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-gray-300 hover:text-blue-400"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <p className="text-center mt-8 text-gray-300">
            © 2025 LifeStream. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
