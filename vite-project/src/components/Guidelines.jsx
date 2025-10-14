import { motion } from "framer-motion";
import { useState } from "react";

function Guidelines() {
  const [activeCard, setActiveCard] = useState("blood");

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
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 font-sans">
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
                className="text-white border-b-2 border-white"
              >
                Guidelines
              </a>
              <a
                href="/why-donate"
                className="text-white hover:text-orange-200"
              >
                Why Donate
              </a>
              <a href="/contact" className="text-white hover:text-orange-200">
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

      {/* Hero Section */}
      <motion.section
        className="pt-32 pb-20 bg-gradient-to-r from-red-600 to-orange-600 text-white"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6"
            variants={itemVariants}
          >
            Donation Guidelines
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Your journey to saving lives starts with understanding the process.
            Learn everything you need to know before making this life-changing
            decision.
          </motion.p>
          <motion.div variants={itemVariants}>
            <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What You Should Know Before Donating
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your safety and the safety of recipients are our top priorities.
            Follow these guidelines to ensure a safe and successful donation
            experience.
          </p>
        </motion.div>

        {/* Interactive Card Navigation */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {["blood", "organ", "general"].map((card) => (
            <motion.button
              key={card}
              onClick={() => setActiveCard(card)}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                activeCard === card
                  ? "bg-red-600 text-white shadow-2xl"
                  : "bg-white text-gray-700 shadow-lg hover:bg-gray-50"
              }`}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {card === "blood" && "Blood Donation"}
              {card === "organ" && "Organ Donation"}
              {card === "general" && "General Guidelines"}
            </motion.button>
          ))}
        </motion.div>

        {/* Cards Container */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {/* Blood Donation Card */}
          <motion.div
            className={`bg-white rounded-2xl shadow-2xl overflow-hidden border-2 transition-all duration-500 ${
              activeCard === "blood"
                ? "border-red-500 scale-105"
                : "border-gray-200"
            }`}
            variants={cardVariants}
          >
            <div className="h-48 bg-gradient-to-r from-red-500 to-pink-500 relative overflow-hidden">
              <img
                src="/images/download.jpeg"
                alt="Blood Donation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-red-600 bg-opacity-70 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white text-center">
                  Blood Donation
                </h3>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-600 text-2xl">💉</span>
                </div>
                <h4 className="text-2xl font-bold text-gray-900">
                  Blood Donation Requirements
                </h4>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Know Your Blood Group:</strong> Essential for
                    matching with recipients
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Age Requirement:</strong> 18-65 years old
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Weight:</strong> Minimum 50 kg (110 lbs)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Hemoglobin Level:</strong> At least 12.5 g/dL for
                    women, 13.0 g/dL for men
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Health Screening:</strong> Free health check-up
                    before donation
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Frequency:</strong> Every 56 days (8 weeks) for
                    whole blood donation
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Medical History:</strong> Disclosure of recent
                    illnesses, medications, and travel
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Organ Donation Card */}
          <motion.div
            className={`bg-white rounded-2xl shadow-2xl overflow-hidden border-2 transition-all duration-500 ${
              activeCard === "organ"
                ? "border-green-500 scale-105"
                : "border-gray-200"
            }`}
            variants={cardVariants}
          >
            <div className="h-48 bg-gradient-to-r from-green-500 to-teal-500 relative overflow-hidden">
              <img
                src="/images/drips.jpeg"
                alt="Organ Donation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-green-600 bg-opacity-70 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white text-center">
                  Organ Donation
                </h3>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 text-2xl">❤️</span>
                </div>
                <h4 className="text-2xl font-bold text-gray-900">
                  Organ Donation Process
                </h4>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Letter of Consent:</strong> Legal document
                    expressing your donation wishes
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Mental Health Assessment:</strong> Comprehensive
                    psychological evaluation
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Medical Compatibility:</strong> Extensive testing
                    for organ compatibility
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Family Consultation:</strong> Discussion with
                    immediate family members
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Legal Documentation:</strong> Proper registration
                    with national organ registry
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Medical History Review:</strong> Complete health
                    records assessment
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Ethical Committee Approval:</strong> Review by
                    medical ethics board
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* General Guidelines Card */}
          <motion.div
            className={`bg-white rounded-2xl shadow-2xl overflow-hidden border-2 transition-all duration-500 ${
              activeCard === "general"
                ? "border-blue-500 scale-105"
                : "border-gray-200"
            }`}
            variants={cardVariants}
          >
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 relative overflow-hidden">
              <img
                src="/images/surgery.jpg"
                alt="General Guidelines"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-blue-600 bg-opacity-70 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white text-center">
                  General Guidelines
                </h3>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 text-2xl">📋</span>
                </div>
                <h4 className="text-2xl font-bold text-gray-900">
                  Essential Information
                </h4>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Healthy Lifestyle:</strong> Maintain good health and
                    proper nutrition
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Hydration:</strong> Drink plenty of water before and
                    after donation
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Rest:</strong> Ensure adequate sleep before donation
                    day
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Medication Disclosure:</strong> Inform about all
                    current medications
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Travel History:</strong> Report recent international
                    travel
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Infectious Diseases:</strong> Screen for potential
                    infectious conditions
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">✓</span>
                  <span className="text-gray-700">
                    <strong>Follow-up Care:</strong> Post-donation monitoring
                    and care instructions
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Inspirational Donor Stories Section */}
        <motion.section
          className="bg-white rounded-2xl shadow-2xl p-12 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Stories That Inspire
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the heroes who have made a difference through their selfless
              donations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Mbambu Sarah",
                donation: "Blood Donor",
                image: "/images/girl.jpeg",
                story:
                  "Saved 3 lives through regular blood donations over 5 years",
              },
              {
                name: "Micheal Opio",
                donation: "Organ Donor",
                image: "/images/reviews1.jpeg",
                story: "Gave the gift of sight through cornea donation",
              },
              {
                name: "Thembo Emmanuel",
                donation: "Blood & Organ",
                image: "/images/reviews2.jpeg",
                story: "Registered for both blood and organ donation programs",
              },
            ].map((donor, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={donor.image}
                    alt={donor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {donor.name}
                </h4>
                <p className="text-red-600 font-semibold mb-3">
                  {donor.donation}
                </p>
                <p className="text-gray-600 text-sm">{donor.story}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Call to Action Section */}
        <motion.section
          className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl shadow-2xl p-12 text-center text-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <h2 className="text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of life-savers who have taken the first step toward
            changing lives through donation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/signup"
              className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition duration-300 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Register as Donor
            </motion.a>
            <motion.a
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-red-600 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Our Team
            </motion.a>
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
            Committed to saving lives through safe and ethical donation
            practices.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Guidelines;
