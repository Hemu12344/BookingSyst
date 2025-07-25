import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaCarSide, FaTimesCircle, FaIdCard, FaPhone, FaCheckCircle, FaUser, FaCar, FaLocationArrow } from 'react-icons/fa';

const Dashboard = () => {
  const { user, setUser, setMessage,driver, setDriver } = useAuth();
  const token = localStorage.getItem('token');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND = import.meta.env.VITE_BACKEND_URL;
  const [driverDetail,setdriverDetail]=useState();
  console.log(driverDetail);

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
        setdriverDetail([res.data.driverDetail])
      } catch (error) {
        console.error('Booking fetch error:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    const driverDetail = async () => {
      try {
        const res = await axios(`${BACKEND}/api/driverDetail`, {
          headers: {
            Authorization: token
          }
        })
        setDriver(res.data.user);
      } catch (error) {
        setMessage(error)
      }
    }
    getUser();
    getBookings();
    driverDetail();
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
      const res = await axios.delete(`${BACKEND}/api/DeleteBooking/${id}`, {
        headers: { Authorization: token },
      });
      alert(res.data.message);
      setBookings(prev => prev.filter(b => b._id !== id))
    } catch (error) {
      alert(error)
    }
  }
  if (user?.role === "Driver") {
    return (
      <motion.div
        className="bg-gradient-to-r from-indigo-100 via-white to-purple-100 rounded-2xl p-8 shadow-xl text-center mb-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-center mb-4">
          <motion.div
            className="text-indigo-600 bg-white rounded-full p-4 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          >
            <FaCarSide size={40} />
          </motion.div>
        </div>

        <motion.h2
          className="text-4xl font-extrabold text-indigo-700"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Driver Dashboard
        </motion.h2>

        <p className="mt-3 text-lg text-gray-700">
          Welcome back, <span className="font-semibold text-indigo-900">{driver?.name || "None"}</span> 👋
        </p>

        {/* Driver Info Card */}
        <motion.div
          className="mt-8 bg-white rounded-xl p-6 shadow-lg text-left max-w-md mx-auto border border-indigo-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center gap-2">
            <FaIdCard /> Driver Information
          </h3>

          <div className="space-y-2 text-gray-700">
            <p><FaUser className="inline text-indigo-500 mr-2" /><strong>Name:</strong> {driver?.name || "None"}</p>
            <p><FaPhone className="inline text-indigo-500 mr-2" /> <strong>Phone:</strong> {driver?.phone || "N/A"}</p>
            <p><FaLocationArrow className="inline text-indigo-500 mr-2" /> <strong>Working Location:</strong> {driver?.location || "N/A"}</p>
            <p><FaIdCard className="inline text-indigo-500 mr-2" /> <strong>License Number:</strong> {driver?.licenseNumber || "N/A"}</p>
            <p><FaCarSide className="inline text-indigo-500 mr-2" /> <strong>Vehicle No:</strong> {driver?.vehicleNumber || "N/A"}</p>
            <p><FaCar className="inline text-indigo-500 mr-2" /><strong>Vehicle Type:</strong> {driver?.vehicleType || "N/A"}</p>
            {/* <p><FaMapMarkerAlt className="inline text-indigo-500 mr-2" /> <strong>Location:</strong> {driver?.lat}, {driver?.lng}</p> */}
            <p><FaCheckCircle className="inline text-green-600 mr-2" /> <strong>Status:</strong> {driver?.isAvailable}</p>
          </div>
        </motion.div>
      </motion.div>
    );
  }
  if (user?.role === "User") {
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
                    <p className='text-sm text-gray-700 pb-2 pl-2'>Booking Id : {booking?._id}</p>
                    <div className="flex justify-between">
                      <p className='p-2 rounded-full font-medium bg-indigo-100 text-indigo-700' >{booking?.cabType} Ride</p>
                      {booking?.status === 'booked'?"":<p className='p-2 rounded-full font-medium bg-red-300 text-red-700 cursor-pointer' onClick={(() => { handleRemoveBooking(booking?._id) })}>{"Remove"}</p>}
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
                        <span className="font-medium">Time:</span> {booking?.time.substr(14)}
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
                    {booking?.tracking?.length > 0 && (
                      <div className="mt-5 border-t pt-4">
                        <p className="text-sm font-semibold text-indigo-600 mb-2">Track Driver:</p>
                        <div className="grid gap-3">
                          {driverDetail.map((driver, i) => (
                            <div
                              key={i}
                              className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 shadow-sm"
                            >
                              <p className="text-gray-800 font-medium">
                                🚘 Name: <span className="font-normal">{driver?.name || "N/A"}</span>
                              </p>
                              <p className="text-gray-600">
                                📞 Phone: <span className="font-medium">{driver?.phone || "N/A"}</span>
                              </p>
                              <p className="text-gray-600">
                                🧭 Location: <span className="font-medium">{driver?.location || "N/A"}</span>
                              </p>
                              <p className="text-gray-600">
                                🚗 Vehicle No: <span className="font-medium">{driver?.vehicleNumber || "N/A"}</span>
                              </p>
                              <p className="text-gray-600">
                                🔒 License: <span className="font-medium">{driver?.licenseNumber || "N/A"}</span>
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  }
};

export default Dashboard;