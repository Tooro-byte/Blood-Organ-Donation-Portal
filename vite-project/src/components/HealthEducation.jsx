import { motion } from "framer-motion";

function HealthEducation() {
  const topics = [
    {
      title: "Blood Donation Process",
      content:
        "Learn about the complete process from registration to post-donation care.",
    },
    {
      title: "Organ Donation Facts",
      content:
        "Understand the different types of organ donations and their requirements.",
    },
    {
      title: "Health Requirements",
      content:
        "Know the health criteria and preparations needed before donation.",
    },
    {
      title: "Post-Donation Care",
      content: "Essential care instructions and recovery tips after donation.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
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
              Health Education
            </h1>
            <p className="text-xl text-gray-600">
              Comprehensive resources to help you make informed decisions about
              donation.
            </p>
          </div>
        </motion.section>

        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {topics.map((topic, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {topic.title}
                </h3>
                <p className="text-gray-600">{topic.content}</p>
                <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition duration-200">
                  Learn More
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default HealthEducation;
