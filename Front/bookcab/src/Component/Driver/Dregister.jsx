import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaPhone, FaIdCard, FaCar, FaMapMarkerAlt, FaTaxi, FaLocationArrow } from 'react-icons/fa';
import { Button } from '../ui/button';
import { useAuth } from '../../Layout';
import { useNavigate } from 'react-router';
const DriverRegistration = () => {
  const {sendDriverData ,message,setMessage, loading, setUser } = useAuth();
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    vehicleNumber: '',
    vehicleType: '',
    isAvailable: 'Available',
    lat: '',
    lng: '',
    token:token
  });

  setTimeout(()=>{
    setMessage(" ")
  },5000)
  const navigate=useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
   const res= await sendDriverData(formData);
   if(res){
    navigate('/dashboard')
   }
    // console.log('Driver registered:', formData);
    setMessage(" ")
    setFormData({ name: '',
    phone: '',
    location:'',
    licenseNumber: '',
    vehicleNumber: '',
    vehicleType: '',
    isAvailable: 'available',
    lat: '',
    lng: ''});
  };
  // console.log(formData);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-300 via-white to-blue-200 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white rounded-3xl p-10 w-full max-w-4xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-purple-300"
      >
        <div className="flex flex-col items-center mb-8">
          <h1 className='text-green-500'>{message ? message : ''}</h1>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="text-purple-700 text-6xl mb-3"
          >
            <FaTaxi />
          </motion.div>
          <h2 className="text-5xl font-extrabold text-purple-800 tracking-tight drop-shadow-lg animate-bounce">
            Join As A Driver
          </h2>
          <p className="text-gray-600 text-center mt-2 text-lg">
            Fill in your details to get started with our platform.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6"
        >
          {[
            { icon: <FaUser />, name: 'name', placeholder: 'Full Name' },
            { icon: <FaPhone />, name: 'phone', placeholder: 'Phone Number', type: 'tel' },
            { icon: <FaLocationArrow />, name: 'location', placeholder: 'Working Location', type: 'loc' },
            { icon: <FaIdCard />, name: 'licenseNumber', placeholder: 'License Number' },
            { icon: <FaCar />, name: 'vehicleNumber', placeholder: 'Vehicle Number' },
            { icon: <FaCar />, name: 'vehicleType', placeholder: 'Vehicle Type (Sedan, SUV, Auto)' },
            { icon: <FaMapMarkerAlt />, name: 'lat', placeholder: 'Current Latitude' },
            { icon: <FaMapMarkerAlt />, name: 'lng', placeholder: 'Current Longitude' }
          ].map(({ icon, name, placeholder, type = 'text' }, idx) => (
            <motion.div
              key={idx}
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 shadow-inner transition-all duration-300 hover:shadow-md focus-within:ring-2 focus-within:ring-purple-500"
            >
              <span className="text-purple-600 text-xl">{icon}</span>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                required
                value={formData[name]}
                onChange={handleChange}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500 text-base"
              />
            </motion.div>
          ))}

          <div className="col-span-1 sm:col-span-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                className="cursor-pointer w-full bg-purple-600 hover:bg-purple-700 text-white text-xl font-semibold py-3 rounded-2xl shadow-lg transition duration-300"
                
              >
                {loading?"Wait 😊👍....":"Register Now"}
              </Button>
            </motion.div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default DriverRegistration