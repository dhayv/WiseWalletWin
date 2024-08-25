import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import App from './App.jsx';
import { UserProvider } from './context/UserContext.jsx';
import Header from './component/Header.jsx';
import Footer from './component/Footer.jsx';
import ErrorMessage from './component/ErrorMessage.jsx';
import Login from './component/Login';
import SignUp from './component/SignUp';
import ProtectedRoute from './component/ProtectedRoute'; 
import Income from './component/Income.jsx';
import Expense from './component/Expenses.jsx';
import Remaining from './component/Remaining';
import NextCheck from './component/NextCheck';
import './styles/App.css'
import 'bootstrap/dist/css/bootstrap.min.css';


export const Layout = () => (
  <div id="page-content">
    <ProtectedRoute>
        <Header />
    </ProtectedRoute>
    <Outlet />
    <ProtectedRoute>
        <Footer />
    </ProtectedRoute>
  </div>
);

const router = createBrowserRouter([
  {
    errorElement: <ErrorMessage />,
    element: <Layout/>,
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
            <Expense />
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
