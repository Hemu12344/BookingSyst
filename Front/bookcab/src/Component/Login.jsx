import React, { useEffect, useState } from 'react';
import { useAuth } from '../Layout';
import { useNavigate } from 'react-router';
import axios from 'axios'; // ✅ IMPORTANT: Added axios import

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('company');
  const {message,sendData,setMessage} = useAuth();
  const navigate = useNavigate();
  const token=localStorage.getItem('token')
  const data = {
    email,
    password,
    role,
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendData(data);
    setEmail("");
    setPassword("");
    setRole(" ");
  };

  useEffect(()=>{
    if(token){
      navigate('/dashboard')
    }
  },[token])

  setTimeout(() => {
    setMessage("");
    clearTimeout()
  }, 5000);

  return (
    <form onSubmit={handleSubmit} method="post" className="max-w-sm mx-auto bg-white p-6 rounded shadow">
      <h1>{message?message:""}</h1>
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <input type="email" placeholder="Email" className="w-full mb-3 p-2 border" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" className="w-full mb-3 p-2 border" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
    </form>
  );
};

export default Login;
