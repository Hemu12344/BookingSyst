import React, { useState } from 'react';
import { useAuth, } from '../Layout';
import { useNavigate } from 'react-router';
import { use } from 'react';

const BookCab = () => {
  const { user, sendBook, message, setMessage,loading } = useAuth();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [carType, setCarType] = useState('Sedan');
  const [pick, setPick] = useState('');
  const [drop, setDrop] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate()
  const data = {
    token,
    date,
    time,
    carType,
    pick: {
      address: pick,
      lat: 28.6139,
      lng: 77.2090,
    },
    drop: {
      address: drop,
      lat: 28.5355,
      lng: 77.3910,
    },
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    await sendBook(data);
    // navigate('/dashboard')
    setDate('');
    setDrop('');
    setCarType('Sedan');
    setPick('');
    setTime('');
  };

  // Clear message after 2s
  setTimeout(() => {
    setMessage('');
  }, 2000);

  return (
    <form
      onSubmit={handleBooking}
      className="max-w-xl mx-auto mt-10 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-200 transition duration-300"
    >
      <h1 className="text-center mb-4 text-sm text-green-600 font-semibold animate-pulse">{message}</h1>
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center border-b pb-2">🚖 Book Your Ride</h2>

      {/* Pickup */}
      <div className="mb-4">
        <label htmlFor="PickUp" className="block text-gray-600 font-medium mb-1">
          Pickup Location
        </label>
        <input
          type="text"
          name="PickUp"
          value={pick}
          onChange={(e) => setPick(e.target.value)}
          required
          placeholder="Enter pickup address"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      {/* Drop */}
      <div className="mb-4">
        <label htmlFor="Drop" className="block text-gray-600 font-medium mb-1">
          Drop Location
        </label>
        <input
          type="text"
          name="Drop"
          value={drop}
          onChange={(e) => setDrop(e.target.value)}
          required
          placeholder="Enter drop address"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      {/* Date */}
      <div className="mb-4">
        <label className="block text-gray-600 font-medium mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      {/* Time */}
      <div className="mb-4">
        <label className="block text-gray-600 font-medium mb-1">Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      {/* Car Type */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-1">Car Type</label>
        <select
          value={carType}
          onChange={(e) => setCarType(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="Sedan">🚘 Sedan</option>
          <option value="Hatchback">🚗 Hatchback</option>
          <option value="SUV">🚙 SUV</option>
          <option value="Luxury">✨ Luxury</option>
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200"
      >
        {loading?"Booking.......":"Confirm Booking"}
      </button>
    </form>
  );
};

export default BookCab;
