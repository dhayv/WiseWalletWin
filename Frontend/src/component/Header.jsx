import React, { useContext, useState } from 'react';
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
        <nav className="navbar is-light has-shadow" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <a
              role="button"
              className={`navbar-burger burger ${isActive ? 'is-active' : ''}`}
              aria-label="menu"
              aria-expanded={isActive ? 'true' : 'false'}
              data-target="navbarMenu"
              onClick={toggleDropdown}
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div id="navbarMenu" className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
            <div className="navbar-start m-5">
              <a className="navbar-item" href="/account-info">
                Account Information
              </a>
              <a className="navbar-item" href="/add-expense">
                Add Expense
              </a>
            </div>

            <div className="navbar-end pr-4">
              <div className="navbar-item">
                <div className="buttons">
                  <button className="button is-light" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}

      <div className="section mb-0">
        <div className="container has-text-centered">
          <h1 className="title">{title}</h1>
        </div>
      </div>
    </>
  );
};

export default Header;
