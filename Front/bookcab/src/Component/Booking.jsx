import axios from 'axios';
import React, { useState } from 'react';
import { useEffect,useContext } from 'react';
import { useAuth } from '../Layout';
const BookCab = () => {
  const {user,sendBook,message,setMessage}=useAuth();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [carType, setCarType] = useState('Sedan');
  const[pick,setPick]=useState("")
  const [drop,setDrop]=useState("")
  const token=localStorage.getItem('token');
  const data = {
    token:token,
    date:date,
    time:time,
    carType:carType,
    pick: {
    address: pick,
    lat: 28.6139, 
    lng: 77.2090 
  },
  drop: {
    address: drop,
    lat: 28.5355, 
    lng: 77.3910 
  }
  }
   const handleBooking = async (e) => {
    e.preventDefault();
    await sendBook(data);
    setDate(""),setDrop(""),setCarType(""),setPick(""),setTime("")
  };

  setTimeout(()=>{
    setMessage(" ")
  },2000)
  
  return (
    <form onSubmit={handleBooking} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className='text-center'>{message}</h1>
      <h2 className="text-xl font-semibold mb-4">Book a Cab</h2>
      <label htmlFor="PickUp" className="block mb-2">Pickup</label>
      <input type="text" name='PickUp' value={pick} required onChange={(e)=>setPick(e.target.value)} className="w-full mb-4 p-2 border outline-none"/>
      <label htmlFor="Drop" className="block mb-2">Drop</label>
      <input type="text" name='Drop' value={drop} required onChange={(e)=>setDrop(e.target.value)} className="w-full mb-4 p-2 border outline-none"/>
      <label className="block mb-2">Date</label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full mb-4 p-2 border" required />
      <label className="block mb-2">Time</label>
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full mb-4 p-2 border" required />
      <label className="block mb-2">Car Type</label>
      <select value={carType} onChange={(e) => setCarType(e.target.value)} className="w-full mb-4 p-2 border">
        <option value="Sedan">Sedan</option>
        <option value="Hatchback">Hatchback</option>
        <option value="SUV">SUV</option>
        <option value="Luxury">Luxury</option>
      </select>
      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Book Now</button>
    </form>
  );
};

export default BookCab;