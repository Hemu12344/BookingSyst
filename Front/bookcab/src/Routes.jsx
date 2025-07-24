import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './Component/Home';
import Login from './Component/Login';
import Dashboard from './Component/DashBoard';
import BookCab from './Component/Booking';
import AdminDashboard from './Component/AdminDashboard';
import VendorDashboard from './Component/VendorDashboadr'
import Signup from './Component/Signup';
import {Protected} from './Component/Protected'
import { Vendor } from './Component/Driver/Vendor';
import DriverRegistration from './Component/Driver/Dregister';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="signup" element={<Signup />} />
      <Route path="login" element={<Login />} />
      <Route element={<Protected />}>
        <Route index element={<Home />} />
        <Route path={`dashboard`} element={<Dashboard />} />
        <Route path="book" element={<BookCab />} />
        <Route path='RegisterDriver' element={<DriverRegistration/>}/>
        <Route path='Vendor' element={<Vendor/>}/>
      </Route>
    </Route>
  ),
  {
    basename: '/'
  }
);

export default router;