import { motion } from "framer-motion";

function WhyDonate() {
  const benefits = [
    {
      title: "Save Lives",
      description:
        "Your donation can save up to 3 lives. Blood and organ donations are critical for emergency surgeries, cancer treatments, and transplant procedures.",
      icon: "❤️",
    },
    {
      title: "Health Benefits",
      description:
        "Regular blood donation helps reduce iron levels, lowering the risk of heart disease. It also provides a free health screening each time you donate.",
      icon: "💪",
    },
    {
      title: "Community Impact",
      description:
        "Join a community of heroes who make a tangible difference in people's lives. Your contribution strengthens our healthcare system.",
      icon: "👥",
    },
    {
      title: "Emotional Reward",
      description:
        "Experience the profound satisfaction of knowing you've directly helped save someone's life and given hope to families in need.",
      icon: "✨",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50">
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
            <div className="flex space-x-4">
              <a
                href="/donor-dashboard"
                className="text-white hover:text-orange-200"
              >
                Dashboard
              </a>
              <a
                href="/guidelines"
                className="text-white hover:text-orange-200"
              >
                Guidelines
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <motion.section
          className="text-center py-16 bg-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Why Donate?
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover the profound impact your donation can make and the
              benefits you'll receive in return.
            </p>
          </div>
        </motion.section>

        {/* Benefits Grid */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Statistics Section */}
        <section className="bg-red-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-12">
              The Impact of Your Donation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { number: "Every 2", text: "Seconds someone needs blood" },
                { number: "1 Donation", text: "Can save up to 3 lives" },
                {
                  number: "100,000+",
                  text: "People waiting for organ transplants",
                },
                {
                  number: "4.5M",
                  text: "Lives saved each year through donations",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="text-3xl font-bold mb-2">{stat.number}</div>
                  <div className="text-lg">{stat.text}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default WhyDonate;
