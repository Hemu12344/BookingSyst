import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router';
const Signup = () => {
  const navigate = useNavigate();
  const BACKEND = import.meta.env.VITE_BACKEND_URL || '/api';

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    isAccept: true
  });

  const [isExist, setExist] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // 🔧 Start false

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendData = async () => {
    setLoading(true); // ✅ Start loading
    try {
      const res = await axios.post(`${BACKEND}/api/signup`, form);
      setMessage(res.data.message);
      setExist(false);
    } catch (err) {
      if (err.response && err.response.data) {
        setMessage(err.response.data.message);
        setExist(err.response.data.isExist || false);
      } else {
        setMessage("Something went wrong");
        setExist(false);
      }
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendData();
    setForm({
      name: '',
      email: '',
      password: '',
      role: '',
      isAccept: false
    });
  };

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  useEffect(() => {
    if (isExist) {
      navigate('/login');
    }
  }, [isExist]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        {message && <h1 className="mb-2 text-red-600 font-medium">{message}</h1>}
        <h2 className="text-2xl font-semibold mb-4">Signup</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        >
          <option value="" disabled>Select your role</option>
          <option value="User">Customer</option>
          <option value="Driver">Driver</option>
        </select>

        <div className='flex text-center gap-2 mb-4'>
          <input
            type="checkbox"
            name="isAccept"
            checked={form.isAccept}
            onChange={(e) => setForm({ ...form, isAccept: e.target.checked })}
            required
          />
          <label htmlFor="isAccept">I Accept all policy</label>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="mt-3 text-sm text-center">
          Already have an account?  <Link to="/login" className=' p-1  rounded  hover:border text-blue-800 '>Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
