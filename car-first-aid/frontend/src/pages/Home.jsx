import React from "react";
import { Link } from "react-router-dom";
import { FaCarCrash, FaTools, FaMapMarkerAlt, FaShieldAlt, FaHeadset } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

const Home = () => {
  const { theme } = useTheme();
  
  const features = [
    {
      icon: <FaCarCrash className="text-5xl text-blue-400" />,
      title: "Instant Diagnosis",
      description: "Our AI-powered system quickly identifies common car problems with 95% accuracy."
    },
    {
      icon: <FaTools className="text-5xl text-blue-400" />,
      title: "Trusted Mechanics",
      description: "Verified professionals with ratings and reviews to ensure quality service."
    },
    {
      icon: <FaMapMarkerAlt className="text-5xl text-blue-400" />,
      title: "Local Services",
      description: "Find the nearest available mechanics and towing services."
    },
    {
      icon: <FaShieldAlt className="text-5xl text-blue-400" />,
      title: "Transparent Pricing",
      description: "Get upfront estimates with no hidden fees."
    },
    {
      icon: <FaHeadset className="text-5xl text-blue-400" />,
      title: "24/7 Support",
      description: "Our team is always available to assist you."
    }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#f7f7fa]'}`}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`relative min-h-[80vh] flex items-center ${theme === 'dark' ? '' : 'bg-white rounded-2xl shadow-md border border-[#ececec]'}`}
      >
        <div className={`absolute inset-0 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700'
            : 'bg-none'
        }`}>
          {/* Remove gradients in light mode */}
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h1 className={`text-5xl md:text-7xl font-bold mb-6 leading-tight ${
                theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'
              }`} style={theme !== 'dark' ? {background: 'none', WebkitTextFillColor: 'unset', textShadow: 'none'} : {}}>
                CAR TROUBLE?<br />
                WE'VE GOT YOU COVERED
              </h1>
              <p className={`text-xl mb-8 ${
                theme === 'dark' ? 'text-blue-200' : 'text-[#6b7280]'
              }`}>
                From diagnosis to repair, CarFirstAid provides complete solutions to get you back on the road safely.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/diagnose" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-center transition-all duration-300 text-lg shadow-sm"
                >
                  Diagnose Now
                </Link>
                <Link 
                  to="/mechanics" 
                  className={`font-bold py-4 px-8 rounded-lg text-center transition-all duration-300 text-lg border shadow-sm ${
                    theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700 text-blue-300 border-blue-400/30'
                      : 'bg-white hover:bg-gray-50 text-blue-600 border-[#ececec]'
                  }`}
                >
                  Find Mechanics
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/123.webp" 
                alt="Car assistance" 
                className={`rounded-2xl shadow-2xl w-full max-w-lg mx-auto border ${
                  theme === 'dark' ? 'border-blue-900' : 'border-[#ececec]'
                }`}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 + index * 0.1, ease: 'easeOut' }}
                className={`p-8 rounded-2xl border backdrop-blur-sm transition-all duration-300 group shadow-sm ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700 hover:border-blue-400/30'
                    : 'bg-white border-[#ececec] hover:border-blue-400'
                }`}
              >
                <div className="text-center">
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 ${
                    theme === 'dark' ? 'text-blue-200' : 'text-[#23272f]'
                  }`}>{feature.title}</h3>
                  <p className={
                    theme === 'dark' ? 'text-blue-300' : 'text-[#6b7280]'
                  }>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#f7f7fa]'}`}
      >
        <div className="container mx-auto px-6">
          <h2 className={`text-3xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}>
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Saved me hundreds on unnecessary repairs by accurately diagnosing my issue first.",
                author: "Sarah J."
              },
              {
                quote: "Found a great mechanic nearby who fixed my car the same day. Amazing service!",
                author: "Michael T."
              },
              {
                quote: "The towing service was quick and affordable when I broke down on the highway.",
                author: "Lisa M."
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 + index * 0.1, ease: 'easeOut' }}
                className={`p-6 rounded-xl border transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 hover:border-blue-400/30'
                    : 'bg-white border-gray-200 hover:border-blue-400'
                }`}
              >
                <p className={`italic mb-4 ${
                  theme === 'dark' ? 'text-blue-200' : 'text-[#6b7280]'
                }`}>"{testimonial.quote}"</p>
                <p className="font-semibold text-blue-400">— {testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`py-16 relative overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-blue-100' : 'text-[#23272f]'}`}>
            Ready to Solve Your Car Problems?
          </h2>
          <Link 
            to="/diagnose" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-sm"
          >
            Get Started Now
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
