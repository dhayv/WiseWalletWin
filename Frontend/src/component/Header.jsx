import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import 'bulma/css/bulma.min.css';

const Header = ({ title }) => {
  const { token, setToken } = useContext(UserContext);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <header>
      <nav className="navbar is-light" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            My App
          </a>
          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarMenu"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarMenu" className="navbar-menu">
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
      </nav>

      <div className="section">
        <div className="container has-text-centered">
          <h1 className="title">{title}</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
