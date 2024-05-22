import React, { useContext, useState} from 'react';
import { UserContext } from '../context/UserContext';
import 'bulma/css/bulma.min.css';

const Header = ({ title }) => {
  const { token, setToken } = useContext(UserContext);
  const [isActive, setIsActive] = useState(false);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };


  const toggleDropdown = () => {
      setIsActive(!isActive);
  };

  return (
    <>
      {token && (
      <nav className="navbar is-transparent" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a
            role="button"
            className={`navbar-burger burger ${isActive ? 'is-active' : ''}`}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarMenu"
            onClick={toggleDropdown}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarMenu" className={`navbar-menu ${isActive ? 'isactive' : ''}`}>
          <div className="navbar-start">
            <a className="navbar-item" href="/account-info">
              Account Information
            </a>
            <a className="navbar-item" href="/add-expense">
              Add Expense
            </a>
          </div>

          <div className="navbar-end">
            {token && (
              <div className="navbar-item">
                <button className="button is-light" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>)}

      <div className="section">
        <div className="container has-text-centered">
          <h1 className="title">{title}</h1>
        </div>
      </div>
  </>
  );
};

export default Header;
