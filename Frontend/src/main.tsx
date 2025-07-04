import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.jsx'
import { UserProvider } from './context/UserContext.jsx'
import './input.css'

import Header from './component/Header'
import Footer from './component/Footer.jsx'
import Homepage from './component/HomePage.jsx'
import ErrorMessage from './component/ErrorMessage.jsx'
import Login from './component/Login.jsx'
import SignUp from './component/SignUp.jsx'
import ProtectedRoute from './component/ProtectedRoute.jsx'
import Income from './component/Income.jsx'
import Expense from './component/Expenses.jsx'
import Remaining from './component/Remaining.jsx'
import NextCheck from './component/NextCheck.jsx'


if (import.meta.env.PROD) {
  console.log = function () {}
}

export const Layout = () => (
  <div id='page-content'>
    <ProtectedRoute>
      <Header title={'string'} />
    </ProtectedRoute>
    <Outlet />
    <ProtectedRoute>
      <Footer />
    </ProtectedRoute>
  </div>
)

const router = createBrowserRouter([
  {
    errorElement: <ErrorMessage />,
    path: '/',
    element: (
      <UserProvider>
        <Layout />
      </UserProvider>
    ),
    children: [
      {
        path: '/',
        element: <Homepage />

      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/signup',
        element: <SignUp />
      },
      {
        path: '/app',
        element: (
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        )
      },
      {
        path: '/income',
        element: (
          <ProtectedRoute>
            <Income />
          </ProtectedRoute>
        )
      },
      {
        path: '/expense',
        element: (
          <ProtectedRoute>
            <Expense />
          </ProtectedRoute>
        )
      },
      {
        path: '/remaining',
        element: (
          <ProtectedRoute>
            <Remaining />
          </ProtectedRoute>
        )
      },
      {
        path: '/next-check',
        element: (
          <ProtectedRoute>
            <NextCheck />
          </ProtectedRoute>
        )
      }

    ]
  }
])

const root = document.getElementById('root')
if (!root) {throw new Error("Root is missing")};

createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
