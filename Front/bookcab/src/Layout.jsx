import { createContext, useContext, useState } from 'react';
import axios from 'axios';
const AuthContext = createContext();
import { useNavigate } from 'react-router';
import { FaBars, FaTimes, FaTaxi } from 'react-icons/fa';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoad] = useState(false);
  const token = localStorage.getItem('token');
  const login = (userData) => setUser(userData);
  const logout = () => localStorage.clear('token');
  const BACKEND = import.meta.env.VITE_BACKEND_URL || "/api";

  const sendData = async (data) => {
    setLoad(true)
    try {
      const res = await axios.post(`${BACKEND}/api/login`, data);
      if (res.data.token == undefined) return setMessage(res.data.message);
      else if (res.data.token != undefined) return localStorage.setItem('token', res.data.token), setMessage(res.data.message);
    } catch (err) {
      setLoad(false)
      localStorage.clear('token')
      setMessage(err.response.data.message)

    } finally {
      setLoad(false); // Always stop loading (success or error)
    }
  }

  // Booking here

  const sendBook = (async (data) => {
    setLoad(true);
    try {
      const res = await axios.post(`${BACKEND}/api/bookNow`, data);
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response.data.message)
    } finally {
      setLoad(false);
    }
  })


  const sendDriverData=async (data)=>{
    setLoad(true);

    try {
      const res = await axios.post(`${BACKEND}/api/driverRegister`,data,{
         headers: {
        Authorization:token,
      },
      });
      setMessage(res.data.message)
    } catch (error) {
      setMessage(err.response?.data?.message || 'Register Failed');
    }finally{
      setLoad(false);
    }
  }

  const driverDetail=async(token)=>{
    try {
      const res = await axios(`${BACKEND}/api/driverDetail`,{
        headers:{
          Authorization:token
        }
      })
      setUser(res.data.user);
    } catch (error) {
      setMessage(error)
    }
  }
  // const logout = () => {
  //   localStorage.removeItem('token');
  //   setUser(null);
  //   setMessage('Logged out');
  // };
  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, sendData, message, token, setMessage, sendBook, loading,sendDriverData ,driverDetail}}>
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
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    if(token){
      logout();
      navigate('/login')
    }else{
      navigate('/login');
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 font-sans">
      <nav className="bg-white/90 backdrop-blur-md shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        {/* Logo */}
        <div className="flex items-center gap-2 text-blue-600 font-extrabold text-2xl tracking-wide">
          <FaTaxi className="text-yellow-500 text-3xl" />
          <span>CabPortal</span>
        </div>

        {/* Hamburger Icon (Mobile) */}
        <div className="md:hidden text-2xl text-blue-600 cursor-pointer" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
          {token ? (
            <>
              <Link to="/" className="hover:text-blue-600 transition">Home</Link>
              <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
              {user?.role==="User"?<Link
                  to="/book"
                  onClick={toggleMenu}
                  className="py-2 px-2 hover:bg-blue-50 rounded transition"
                >
                Book Cab
                </Link>:<></>}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded shadow transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="hover:text-blue-600 transition">Signup</Link>
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col bg-white/90 backdrop-blur-sm shadow-md px-6 py-4 text-gray-800 font-medium divide-y divide-gray-200 rounded-b-xl">
          {token ? (
            <>
              <Link
                to="/"
                onClick={toggleMenu}
                className="py-2 px-2 hover:bg-blue-50 rounded transition"
              >
                🏠 Home
              </Link>
              <Link
                to="/dashboard"
                onClick={toggleMenu}
                className="py-2 px-2 hover:bg-blue-50 rounded transition"
              >
                📊 Dashboard
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={toggleMenu}
                  className="py-2 px-2 hover:bg-blue-50 rounded transition"
                >
                  🛠️ Admin
                </Link>
              )}
              {user?.role === 'Driver' && (
                <Link
                  to="/vendor"
                  onClick={toggleMenu}
                  className="py-2 px-2 hover:bg-blue-50 rounded transition"
                >
                  🚚 Vendor
                </Link>
              )}
              {user?.role === 'User' && (
                <Link
                  to="/book"
                  onClick={toggleMenu}
                  className="py-2 px-2 hover:bg-blue-50 rounded transition"
                >
                  📅 Book Cab
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 mt-3 rounded transition"
              >
                🔓 Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                onClick={toggleMenu}
                className="py-2 px-2 hover:bg-blue-50 rounded transition"
              >
                📝 Signup
              </Link>
              <Link
                to="/login"
                onClick={toggleMenu}
                className="py-2 px-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition mt-2 text-center"
              >
                🔑 Login
              </Link>
            </>
          )}
        </div>
      )}


      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;