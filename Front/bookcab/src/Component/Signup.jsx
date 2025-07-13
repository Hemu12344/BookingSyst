import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
const Signup = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    isAccept: true
  });
  const [isExist, setExist] = useState(false);
  const [message, setMessage] = useState("");
 const sendData = async () => {
  try {
    const res = await axios.post('/api/signup', form);
    setMessage(res.data.message);
    setExist(false); // If signup is successful, user is new
  } catch (err) {
    if (err.response && err.response.data) {
      setMessage(err.response.data.message);
      setExist(err.response.data.isExist || false); // <-- Set isExist from error
    } else {
      setMessage("Something went wrong");
      setExist(false);
    }
  }
};



  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // console.log(form.password.length);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setForm({ password: "" });
    setForm({ name: "", email: "", password: "", role: "", isAccept: false })
    await sendData()
  };
  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        setMessage("");
      },5000);

      return () => clearTimeout(timeout);
    }
  }, [message]);
  console.log(isExist);
  
  useEffect(()=>{isExist?navigate('/login'):navigate('/signup')},[isExist])
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1>{
          message ? message : ""
        }</h1>
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
          <option value="" disabled defaultChecked>Select your role</option>
          <option value="Employee">Company / Employee</option>
          <option value="Vendor">Vendor</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {'Register'}
        </button>

        <p className="mt-3 text-sm text-center">
          Already have an account? <a href="/login" className="text-blue-600 underline">Login</a>
        </p>
        <div className='flex text-center gap-2 mt-3'>
          <input
            type="checkbox"
            name="isAccept"
            checked={form.isAccept}
            onChange={(e) =>
              setForm({ ...form, isAccept: e.target.checked })
            }
            required
          />
          <label htmlFor="isAccept">I Accept all policy</label>
        </div>
      </form>
    </div>
  );
};

export default Signup;
