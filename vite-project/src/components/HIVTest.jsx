import { motion } from "framer-motion";

function HIVTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
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
              HIV Testing Information
            </h1>
            <p className="text-xl text-gray-600">
              Confidential testing and counseling services for your peace of
              mind.
            </p>
          </div>
        </motion.section>

        <section className="max-w-4xl mx-auto px-4 py-16">
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-6">🔬</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Coming Soon
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              We're working on integrating HIV testing services with our partner
              healthcare providers. This feature will allow you to schedule
              confidential testing and receive your results securely.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-yellow-800">
                <strong>Note:</strong> Regular health screening including HIV
                testing is part of our standard donation process to ensure the
                safety of both donors and recipients.
              </p>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

export default HIVTest;
