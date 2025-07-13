import { createContext, useContext, useState } from 'react';
import axios from 'axios';
const AuthContext = createContext();
import { useNavigate } from 'react-router';
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem('token');
  const login = (userData) => setUser(userData);
  const logout = () => localStorage.clear('token');
  const sendData = async (data) => {
    try {
      const res = await axios.post('/api/login', data);
      if(res.data.token==undefined) return setMessage(res.data.message);
      else if(res.data.token!=undefined) return localStorage.setItem('token', res.data.token) ,setMessage(res.data.message);
    } catch (err) {
      localStorage.clear('token')
      setMessage(err.response.data.message)

    }
  }

  // Booking here
  
        const sendBook=(async (data)=>{
          try {
            const res=await axios.post('/api/bookNow',data);
            setMessage(res.data.message);
          } catch (error) {
            setMessage(error.response.data.message)
          }
        })
  return (
    <AuthContext.Provider value={{ user, login, logout,setUser, sendData, message, token, setMessage ,sendBook}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// -------------------------------
// src/components/Layout.jsx
// -------------------------------
import React from 'react';
import { Outlet, Link } from 'react-router';

const Layout = () => {
  const { user, logout } = useAuth();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const handleLogout=()=>{
    logout(),
    navigate('/login')
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between">
        <h1 className="text-xl font-bold">CabPortal</h1>
        <div>
          {token ? (
            <>
              <Link to="/" className="mr-4">Home</Link>
              <Link to="/dashboard" className="mr-4">Dashboard</Link>
              {user?.role === 'admin' && <Link to="/admin" className="mr-4">Admin</Link>}
              {user?.role === 'vendor' && <Link to="/vendor" className="mr-4">Vendor</Link>}
              {user?.role==='vendor'?"":<Link to="/book" className="mr-4">Book</Link>}
              <button onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to='/signup' className='mr-3  p-1  rounded  hover:border '>Signup</Link>
              <Link to="/login" className=' p-1  rounded  hover:border'>Login</Link>
            </>
          )}
        </div>
      </nav>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;