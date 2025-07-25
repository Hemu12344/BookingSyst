import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaPhone, FaMapMarkerAlt, FaClock, FaCheck, FaTimes, FaMailBulk } from "react-icons/fa";
import { useAuth } from "../../Layout";
import axios from "axios";

export const Vendor = () => {
    const { driver, setDriver, setMessage } = useAuth();
    const token = localStorage.getItem('token');
    const BACKEND = import.meta.env.VITE_BACKEND_URL;
    const [booker, setBooker] = useState([])
    const [bookings, setBookings] = useState([]);
    useEffect(() => {
        const driverDetail = async () => {
            try {
                const res = await axios(`${BACKEND}/api/driverDetail`, {
                    headers: {
                        Authorization: token
                    }
                })
                setDriver(res.data.user);
                setBookings(res.data.bookingData)
                setBooker(res.data.bookers)
                
            } catch (error) {
                setMessage(error);
            }
        }
        driverDetail();
    }, [token]);
    //   console.log(driver);
    //   console.log(bookings);
    // console.log(booker);


    const handleAccept = (id) => {
        alert(`Accepted ride for Booking ID ${id}`);
    };

    const handleDecline = (id) => {
        setBookings(prev => prev.filter(b => b.id !== id));
        alert(`Declined ride for Booking ID ${id}`);
    };

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
            <motion.h1
                className="text-3xl font-bold text-center text-indigo-800 mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Today's Drives 🚗
            </motion.h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bookings?.length > 0 &&
                    bookings.map((booking, index) => {
                        if (!booking?.pickupLocation?.address) return null;

                        const currentBooker = booker?.find(b => b._id === booking.employeeId);

                        return (
                            <motion.div
                                key={booking._id}
                                className="bg-white rounded-2xl p-5 shadow-xl border border-indigo-200"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                {/* Booker Info */}
                                <div className="text-lg font-semibold text-indigo-700 flex items-center gap-2 mb-2">
                                    <FaUser /> {currentBooker?.name || "None"}
                                </div>
                                <p className="text-sm text-gray-700 mb-1">
                                    <FaMailBulk className="inline mr-2 text-indigo-500" />
                                    {currentBooker?.email || "None"}
                                </p>

                                {/* Booking Info */}
                                <p className="text-sm text-gray-700 mb-1">
                                    <FaMapMarkerAlt className="inline mr-2 text-green-500" />
                                    Pickup: {booking?.pickupLocation?.address}
                                </p>
                                <p className="text-sm text-gray-700 mb-1">
                                    <FaMapMarkerAlt className="inline mr-2 text-red-500" />
                                    Drop: {booking?.dropLocation?.address}
                                </p>
                                <p className="text-sm text-gray-700 mb-3">
                                    <FaClock className="inline mr-2 text-yellow-500" />
                                    Time: {booking.time}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex justify-between">
                                    <button
                                        onClick={() => handleAccept(booking._id)}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full flex items-center gap-1 text-sm"
                                    >
                                        <FaCheck /> Accept
                                    </button>
                                    <button
                                        onClick={() => handleDecline(booking._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full flex items-center gap-1 text-sm"
                                    >
                                        <FaTimes /> Decline
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
            </div>


            {/* Testimonial Section */}
            <div className="mt-16">
                <motion.h2
                    className="text-2xl font-bold text-indigo-700 mb-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    💬 Customer Testimonials
                </motion.h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            name: "Amit Sharma",
                            rating: 5,
                            review: "Very professional driver, safe journey and clean vehicle.",
                        },
                        {
                            name: "Priya Verma",
                            rating: 4,
                            review: "Reached on time, smooth ride. Would book again!",
                        },
                        {
                            name: "Rajesh Kumar",
                            rating: 2.5,
                            review: "Average experience, but driver was polite.",
                        },
                    ].map((t, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-2xl p-5 shadow-lg border border-indigo-200"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <p className="font-semibold text-lg text-indigo-700 mb-1">{t.name}</p>
                            <div className="flex mb-2 text-yellow-500">
                                {Array(5)
                                    .fill(0)
                                    .map((_, i) => (
                                        <span key={i}>{i < t.rating ? "★" : "☆"}</span>
                                    ))}
                            </div>
                            <p className="text-gray-700 italic">"{t.review}"</p>
                        </motion.div>
                    ))}
                </div>
            </div>

        </div>
    );
};
