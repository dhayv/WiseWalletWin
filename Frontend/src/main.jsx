import * as React from 'react';
import {createRoot } from 'react-dom/client';
import App from './App.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Header from './component/Header.jsx';
import Footer from './component/Footer.jsx';
import ErrorMessage from './component/ErrorMessage.jsx';
import Login from './component/Login';
import SignUp from './component/SignUp';
import Income from './component/Income';
import Remaining from './component/Remaining';
import NextCheck from './component/NextCheck';
import Expenses from './component/Expenses';


export const Layout = () => {
  return (
    <div id="page-content">
      <Header/>
      <Outlet/>
      <Footer/>
    </div>
  )
}
const router = createBrowserRouter([
  {
    errorElement:<ErrorMessage/>,
    element: <Layout/> ,
    children: [
      {
        path: '/',
        element: <App/>,
      },
      {
        path: '/login',
        element: <Login/>,
      },
      {
        path: '/signup',
        element: <SignUp/>,
      },
      {
        path: '/income',
        element: <Income/>,
      },
      {
        path: '/expense',
        element: <Expenses/>,
      },
      {
        path: '/remaining',
        element: <Remaining/>,
      },
      {
          path: '/next-check',
          element: <NextCheck/>,
      }
    ]
  }
])


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>,
)
