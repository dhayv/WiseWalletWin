import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import meditatedata from "../assets/meditating.json"

const Homepage = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    };

    const handleSignUp = () => {
        navigate("/signup");
    };

    return (
        <div>
            {/* Simplified Navigation Bar */}
            <nav className="navbar" role="navigation" aria-label="main navigation">

                <div id="navbarBasicExample" className="navbar-menu">
                    
                    <div className="navbar-end" style={{marginRight: 250}}>
                        <div className="navbar-item">
                            <div className="buttons">
                            <p>Get Started Today</p>
                                <a className="button is-primary" onClick={handleSignUp}>
                                    <strong>Sign Up</strong>
                                </a>
                                <a className="button is-light" onClick={handleLogin}>
                                    Log In
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            
            {/*style={{ display: 'grid', gridTemplateRows: '1fr 100vh 1fr' }} */}
            <div style={{display: 'grid', gridTemplateAreas: '1fr 1fr 100vh',textAlign: 'center',justifyContent: 'center'}} >
              <p>
                Predict your expenses, budget smarter, and eliminate financial stress.
                </p>
                
                {/* <Player
                    autoplay
                    loop
                    src={meditatedata}
                    style={{ height: '500px', width: '500px' }}
                >
                    <Controls visible={false} buttons={['play', 'repeat', 'frame', 'debug']} />
                </Player> */}
                <p>
              With a glance, know exactly what’s coming so you can plan smarter, spend smarter, and stay on track.
              </p>
              
        
            </div>
        </div>
    );
};

export default Homepage;
