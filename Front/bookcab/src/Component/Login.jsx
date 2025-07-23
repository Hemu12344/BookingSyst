import React, { useEffect, useState } from 'react';
import { useAuth } from '../Layout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('company');

  const { message, sendData, setMessage, loading, setUser } = useAuth();
  const navigate = useNavigate();
  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  const data = { email, password, role };

  const getUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND}/api/checkUser`, {
        headers: { Authorization: token },
      });
      setUser(res.data.user);
      return res.data.user;
    } catch (error) {
      console.error('User fetch error:', error.response?.data || error.message);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendData(data);           // login and store token
    const fetchedUser = await getUser(); // fetch user after login
    if (fetchedUser) {
      if (fetchedUser.role === 'Driver' && fetchedUser.newUser) {
        navigate('/RegisterDriver');
      } else {
        navigate('/dashboard');
      }
    }
    setEmail('');
    setPassword('');
    setRole('company');
  };

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto bg-white p-6 rounded shadow">
      <h1>{message ? message : ''}</h1>
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <input type="email" placeholder="Email" className="w-full mb-3 p-2 border"
        value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" className="w-full mb-3 p-2 border"
        value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded"
        disabled={loading}>{loading ? "Loading..." : "Login"}</button>
      <p className='w-full text-center cursor-pointer bg-green-600 text-white py-2 mt-2 rounded'>
        <Link to="/signup">Sign up</Link>
      </p>
    </form>
  );
};

export default Login;
