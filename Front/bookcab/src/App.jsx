import React from 'react';
import { RouterProvider } from 'react-router';
import routes from './Routes';
import { AuthProvider } from './Context/AuthContext';
const App = () => (
  <AuthProvider>
    <RouterProvider router={routes} />
  </AuthProvider>
);

export default App;