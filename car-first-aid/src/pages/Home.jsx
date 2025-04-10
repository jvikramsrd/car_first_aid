import React from "react";
import { Link } from "react-router-dom";
import { FaCarCrash, FaTools, FaMapMarkerAlt, FaShieldAlt, FaHeadset } from "react-icons/fa";

const Home = () => {
  const features = [
    {
      icon: <FaCarCrash className="text-4xl text-blue-600 mb-3" />,
      title: "Instant Diagnosis",
      description: "Our AI-powered system quickly identifies common car problems with 95% accuracy."
    },
    {
      icon: <FaTools className="text-4xl text-blue-600 mb-3" />,
      title: "Trusted Mechanics",
      description: "Verified professionals with ratings and reviews to ensure quality service."
    },
    {
      icon: <FaMapMarkerAlt className="text-4xl text-blue-600 mb-3" />,
      title: "Local Services",
      description: "Find the nearest available mechanics and towing services."
    },
    {
      icon: <FaShieldAlt className="text-4xl text-blue-600 mb-3" />,
      title: "Transparent Pricing",
      description: "Get upfront estimates with no hidden fees."
    },
    {
      icon: <FaHeadset className="text-4xl text-blue-600 mb-3" />,
      title: "24/7 Support",
      description: "Our team is always available to assist you."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Car Trouble? We've Got You Covered</h1>
              <p className="text-xl mb-8">
                From diagnosis to repair, CarFirstAid provides complete solutions to get you back on the road safely.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/diagnose" 
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-center transition duration-300"
                >
                  Diagnose Now
                </Link>
                <Link 
                  to="/mechanics" 
                  className="bg-white hover:bg-gray-100 text-blue-800 font-bold py-3 px-6 rounded-lg text-center transition duration-300"
                >
                  Find Mechanics
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/123.webp" 
                alt="Car assistance" 
                className="rounded-lg shadow-2xl w-full max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How CarFirstAid Helps You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <div className="text-center">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
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
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <p className="italic mb-4">"{testimonial.quote}"</p>
                <p className="font-semibold text-blue-600">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-blue-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Solve Your Car Problems?</h2>
          <Link 
            to="/diagnose" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
