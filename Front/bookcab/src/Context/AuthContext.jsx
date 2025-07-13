import { createContext, useContext, useState } from 'react';
import axios from 'axios'; // ✅ Needed here too

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  const token=localStorage.getItem('token')
  // ✅ Fixed: directly receive `data` object, not `{ data }`
  const sendData = async (data) => {
    try {
      const res = await axios.post('/api/login', data);
      console.log("✅ Backend response:", res.data);
      // You can auto-login the user here:
      // login({ email: data.email, role: data.role });
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, sendData, }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
