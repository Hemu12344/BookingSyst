import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Layout';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const token = localStorage.getItem('token');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${BACKEND}/checkUser`, {
          headers: { Authorization: token },
        });
        setUser(res.data.user);
      } catch (error) {
        console.error('Error fetching user:', error.response?.data || error.message);
      }
    };

    const getBookings = async () => {
      try {
        const res = await axios.get(`${BACKEND}/myBookings`, {
          headers: { Authorization: token },
        });
        setBookings([res.data.booking]); // wrap it in an array

      } catch (error) {
        console.error('Error fetching bookings:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    getUser();
    getBookings();
  }, [token]);
  // Cancle Booking;

 const handleCancelBooking = async (id) => {
  try {
    const res = await axios.put(`${BACKEND}/cancleBooking/${id}`);
    console.log(res.data);
    setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
  } catch (error) {
    console.log("Cancel Error:", error);
  }
};

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-indigo-700">{user?.role} Dashboard</h2>
        <p className="text-gray-600 mt-2">Welcome back, <span className="font-medium text-gray-800">{user?.email}</span> 👋</p>
      </div>

      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Your Bookings</h3>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {bookings.length === 0 ? (
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
                  className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-xl transition-transform transform hover:scale-[1.02]"
                >
                  <h4 className="text-xl font-semibold text-indigo-600 mb-2">{booking?.cabType} Ride</h4>
                  <p><span className="font-medium text-gray-700">Pickup:</span> {booking?.pickupLocation?.address}</p>
                  <p><span className="font-medium text-gray-700">Drop:</span> {booking?.dropLocation?.address}</p>
                  <p><span className="font-medium text-gray-700">Date:</span> {new Date(booking?.date).toLocaleDateString()}</p>
                  <p><span className="font-medium text-gray-700">Time:</span> {booking?.time}</p>
                  <div className='flex justify-between mt-5'>
                    <p>
                      <span className="font-medium text-gray-900">Status:</span>{" "}
                      <span className={`font-semibold ${booking?.status === 'booked' ? 'text-green-600' : 'text-red-600'}`}>
                        {booking?.status}
                      </span>
                    </p>
                    {
                      booking?.status==="cancelled"?<p className='text-sm text-gray-400'>Cancle on {booking.cancle.substr(0,10)}</p>:<h1 className='p-1 w-25 text-center cursor-pointer bg-red-500 text-white hover:shadow-xl rounded-full border'  onClick={()=>handleCancelBooking(booking._id)}>Cancle</h1>
                    }
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Booked on {new Date(booking?.createdAt).toLocaleString()}
                  </p>
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
