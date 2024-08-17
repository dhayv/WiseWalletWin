import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import App from './App.jsx';
import { UserProvider } from './context/UserContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ProtectedRoute from './components/ProtectedRoute';  // Import ProtectedRoute

export const Layout = () => (
  <div id="page-content">
    <Header />
    <Outlet />
    <Footer />
  </div>
);

const router = createBrowserRouter([
  {
    errorElement: <ErrorMessage />,
    element: <Layout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <SignUp />,
      },
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        ),
      },
      {
        path: '/income',
        element: (
          <ProtectedRoute>
            <Income />
          </ProtectedRoute>
        ),
      },
      {
        path: '/expense',
        element: (
          <ProtectedRoute>
            <Expenses />
          </ProtectedRoute>
        ),
      },
      {
        path: '/remaining',
        element: (
          <ProtectedRoute>
            <Remaining />
          </ProtectedRoute>
        ),
      },
      {
        path: '/next-check',
        element: (
          <ProtectedRoute>
            <NextCheck />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);
