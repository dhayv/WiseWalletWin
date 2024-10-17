import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import meditatedata from '../assets/meditating.json';
import '../styles/Hompage.css';

const Homepage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-menu">
          <div className="buttons">
            <button className="button is-primary" onClick={handleSignUp}>
              <strong>Sign Up</strong>
            </button>
            <button className="button is-light" onClick={handleLogin}>
              Log In
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <h1>Get Started Today</h1>
        <Player
          autoplay
          loop
          src={meditatedata}
          className="lottie-player"
          aria-label="Meditating animation"
        />
        <h2>
          Predict your expenses, budget smarter, and eliminate financial stress.
        </h2>
        <p>
          With a glance, know exactly what’s coming so you can plan smarter,
          spend smarter, and stay on track.
        </p>
      </main>
    </div>
  );
};

export default Homepage;
