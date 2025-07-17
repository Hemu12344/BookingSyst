import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaCarSide, FaTimesCircle } from 'react-icons/fa';

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const token = localStorage.getItem('token');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${BACKEND}/api/checkUser`, {
          headers: { Authorization: token },
        });
        setUser(res.data.user);
      } catch (error) {
        console.error('User fetch error:', error.response?.data || error.message);
      }
    };

    const getBookings = async () => {
      try {
        const res = await axios.get(`${BACKEND}/api/myBookings`, {
          headers: { Authorization: token },
        });
        setBookings(res.data.booking);
      } catch (error) {
        console.error('Booking fetch error:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    getUser();
    getBookings();
  }, [token]);

  const handleCancelBooking = async (id) => {
    try {
      const res = await axios.put(`${BACKEND}/api/cancelBooking/${id}`);
      setBookings(prev =>
        prev.map(b =>
          b._id === id ? { ...b, status: 'cancelled', cancle: Date.now() } : b
        )
      );
      alert(res.data.message);
    } catch (error) {
      console.log("Cancel error:", error);
      alert("Cancel failed: " + error.response?.data?.message || error.message);
    }
  };

  const handleRemoveBooking = async (id) => {
    try {
      const res=await axios.delete(`${BACKEND}/api/DeleteBooking/${id}`, {
        headers: { Authorization: token },
      });
      alert(res.data.message);
      setBookings(prev=> prev.filter(b=>b._id!==id))
    } catch (error) {
      alert(error)
    }
  }
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.h2
          className="text-3xl font-bold text-indigo-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {user?.role} Dashboard
        </motion.h2>
        <p className="text-gray-600 mt-2">
          Welcome back, <span className="font-medium text-gray-800">{user?.userName}</span> 👋
        </p>
      </div>

      {/* Section Heading */}
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Your Bookings</h3>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {/* No Booking */}
            {bookings?.length === 0 || !bookings[0] ? (
              <motion.div
                className="text-center text-gray-500 col-span-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                No bookings found 🚌
              </motion.div>
            ) : (
              bookings.map((booking, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-xl transition-transform transform hover:scale-[1.02] relative"
                >
                  <div className="flex justify-between">
                    <p className='p-2 rounded-full font-medium bg-indigo-100 text-indigo-700' >{booking?.cabType} Ride</p>
                    <p className='p-2 rounded-full font-medium bg-red-300 text-red-700 cursor-pointer' onClick={(() => { handleRemoveBooking(booking?._id) })}>Remove</p>

                  </div>

                  <div className="space-y-2 mt-2">
                    <p className="flex items-center gap-2 text-gray-700">
                      <FaMapMarkerAlt className="text-indigo-500" />
                      <span className="font-medium">Pickup:</span> {booking?.pickupLocation?.address}
                    </p>
                    <p className="flex items-center gap-2 text-gray-700">
                      <FaMapMarkerAlt className="text-red-400" />
                      <span className="font-medium">Drop:</span> {booking?.dropLocation?.address}
                    </p>
                    <p className="flex items-center gap-2 text-gray-700">
                      <FaClock className="text-yellow-500" />
                      <span className="font-medium">Time:</span> {booking?.time}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(booking?.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-400">
                      Booked on {new Date(booking?.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Booking Status */}
                  <div className="flex justify-between items-center mt-5">
                    <span
                      className={`text-sm px-3 py-1 rounded-full font-semibold ${booking?.status === 'booked'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                        }`}
                    >
                      {booking?.status}
                    </span>

                    {booking?.status === 'cancelled' ? (
                      <p className="text-xs text-gray-500">
                        Cancelled on {new Date(booking?.cancle).toLocaleDateString()}
                      </p>
                    ) : (
                      <button
                        className="flex items-center gap-2 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full transition"
                        onClick={() => handleCancelBooking(booking?._id)}
                      >
                        <FaTimesCircle /> Cancel
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Dashboard;