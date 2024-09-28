import React from "react";
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const Homepage = ( ) => {



    return(
        <div style={{display:'grid', gridTemplateColumns: '1fr 100vh 1fr'}}>


            <DotLottieReact
            src="https://lottie.host/30f02a3e-c040-4950-857c-f21b164f99da/FiWF5X53KT.json"
            loop
            autoplay
            />

            <Player
            autoplay
            loop
            src="https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json"
            style={{ height: '300px', width: '300px' }}
            >
            <Controls visible={false} buttons={['play', 'repeat', 'frame', 'debug']} />

            </Player>
            <Player
            autoplay
            loop
            src="https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json"
            style={{ height: '300px', width: '300px' }}
            >
            <Controls visible={false} buttons={['play', 'repeat', 'frame', 'debug']} />
            </Player>
        </div>
    )
}

export default Homepage