import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router';
import Layout from './Layout';
import Home from './Component/Home';
import Login from './Component/Login';
import Dashboard from './Component/DashBoard';
import BookCab from './Component/Booking';
import AdminDashboard from './Component/AdminDashboard';
import VendorDashboard from './Component/VendorDashboadr';
import Signup from './Component/Signup';
import { Procted } from './Component/Protected';
const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='signup' element={<Signup/>} />
      <Route path='login' element={<Login/>} />
      <Route element={<Procted />}>
        <Route index element={<Home />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='book' element={<BookCab />} />
        <Route path='admin' element={<AdminDashboard />} />
        <Route path='vendor' element={<VendorDashboard />} />
      </Route>
    </Route>
  )
);

export default routes;