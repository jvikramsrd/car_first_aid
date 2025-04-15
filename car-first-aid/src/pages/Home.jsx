import React from "react";
import { Link } from "react-router-dom";
import { FaCarCrash, FaTools, FaMapMarkerAlt, FaShieldAlt, FaHeadset } from "react-icons/fa";

const Home = () => {
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
    <div className="min-h-screen bg-[#111827]">
      {/* Hero Section */}
      <div className="relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#374151]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#3b82f6_0%,_transparent_60%)] opacity-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_#60a5fa_0%,_transparent_60%)] opacity-10"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-blue-100 leading-tight">
                CAR TROUBLE?<br />
                WE'VE GOT YOU COVERED
              </h1>
              <p className="text-xl mb-8 text-blue-200">
                From diagnosis to repair, CarFirstAid provides complete solutions to get you back on the road safely.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/diagnose" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-center transition-all duration-300 text-lg"
                >
                  Diagnose Now
                </Link>
                <Link 
                  to="/mechanics" 
                  className="bg-gray-800 hover:bg-gray-700 text-blue-300 font-bold py-4 px-8 rounded-lg text-center transition-all duration-300 text-lg border border-blue-400/30"
                >
                  Find Mechanics
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/123.webp" 
                alt="Car assistance" 
                className="rounded-2xl shadow-2xl w-full max-w-lg mx-auto border border-blue-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-[#1a2332]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-[#1f2937]/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-900 hover:border-blue-400/30 transition-all duration-300 group"
              >
                <div className="text-center">
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-200">{feature.title}</h3>
                  <p className="text-blue-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-[#1f2937]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-100">
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
              <div 
                key={index} 
                className="bg-[#111827] p-6 rounded-xl border border-blue-900 hover:border-blue-400/30 transition-all duration-300"
              >
                <p className="italic mb-4 text-blue-200">"{testimonial.quote}"</p>
                <p className="font-semibold text-blue-400">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-[#1a2332] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3b82f6_0%,_transparent_70%)] opacity-10"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6 text-blue-100">
            Ready to Solve Your Car Problems?
          </h2>
          <Link 
            to="/diagnose" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
