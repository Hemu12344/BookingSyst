import React from 'react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-12 px-4 md:px-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-700">Welcome to Corporate Cab Booking</h1>
        <p className="mt-4 text-gray-600 text-lg">
          Book cabs efficiently for your company's travel needs.
        </p>
        <button className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow">
          Book Now
        </button>
      </motion.div>

      {/* Why Choose Us */}
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Why Choose Us</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Instant Booking',
              desc: 'Book rides within seconds with real-time availability.',
            },
            {
              title: 'Verified Drivers',
              desc: 'All drivers undergo strict verification for safety.',
            },
            {
              title: 'Live Tracking',
              desc: 'Track cabs live and receive timely updates.',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold text-indigo-600">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="mt-24">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">How It Works</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            'Signup/Login with your company email',
            'Enter pickup & drop locations with cab type',
            'Track your cab in real-time from dashboard',
            'Manage or cancel bookings as needed',
          ].map((step, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 * index }}
            >
              <div className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white font-bold rounded-full shadow">
                {index + 1}
              </div>
              <p className="text-gray-700">{step}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-24">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Platform Highlights</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Rides', value: '12,354+' },
            { label: 'Active Vendors', value: '89' },
            { label: 'Happy Companies', value: '324+' },
            { label: 'Avg Booking Time', value: '2.5 min' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.2 }}
              className="bg-white text-center p-6 rounded-xl shadow"
            >
              <h3 className="text-3xl font-bold text-indigo-700">{stat.value}</h3>
              <p className="mt-1 text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
