import React from 'react'
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Player, Controls } from '@lottiefiles/react-lottie-player'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import animationdata from '../assets/Animation-1727562973216.json'



const Homepage = () => {
    const [isActive, setIsActive] = useState(false)
  // style={{display:'grid', gridTemplateColumns: '1fr 100vh 1fr'}}

    const handleLogin = () => {
        <Navigate to='/login' replace/>
    }

    const toggleDropdown = () => {
        setIsActive(!isActive)

  }
  return (
    <div style={{display:'grid', gridTemplateColumns: '1fr 100vh 1fr'}}>
      <nav className='navbar' role='navigation' aria-label='main navigation'>
        <div className='container'>


          <div>

            <div className='navbar-end'>
              <div className='navbar-item'>
                <div className='buttons'>
                  <button className='button is-dark' onClick={handleLogin}>
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>


        <div style={{display:'grid', gridTemplateColumns: '1fr 100vh 1fr'}}>
        <DotLottieReact
        animationdata={animationdata}

        loop
        autoplay
      />

      <Player
        autoplay
        loop
        src='https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json'
        style={{ height: '300px', width: '300px' }}
      >
        <Controls visible={false} buttons={['play', 'repeat', 'frame', 'debug']} />

      </Player>
      <Player
        autoplay
        loop
        src='https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json'
        style={{ height: '300px', width: '300px' }}
      >
        <Controls visible={false} buttons={['play', 'repeat', 'frame', 'debug']} />
      </Player>
        </div>


      
    </div>
  )
}

export default Homepage
