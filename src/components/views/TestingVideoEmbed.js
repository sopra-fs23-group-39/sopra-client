import {useRef, useState} from 'react';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/TestingVideoEmbed.scss";
import React from 'react';
import YouTube from "react-youtube";


const TestingVideoEmbed = () => {
    const [playerState, setPlayerState] = useState(null);
    const [isMuted, setIsMuted] = useState(true);
    const playerRef = useRef(null);

    const opts = {
        playerVars: {
            autoplay: 1,
            mute: 1,
            showinfo: 0,
            modestbranding: 1,
            loop: 1,
            controls: 0
        }
    }

    const handleStateChange = (event) => {
        console.log('State changed:', event.data);
        setPlayerState(event.data);
    };

    const onReady = (event) => {
        setPlayerState(YouTube.PlayerState.PLAYING);
        const player = playerRef.current.getInternalPlayer();
        setTimeout(() => {
            player.stopVideo();
            setPlayerState(YouTube.PlayerState.ENDED);
        }, 20000); // Stop playback after x seconds
    }

    const handlePlayPauseClick = () => {
        console.log('Play/pause clicked');
        const player = playerRef.current.getInternalPlayer();
        if (playerState === YouTube.PlayerState.PLAYING) {
            player.pauseVideo();
            setPlayerState(YouTube.PlayerState.PAUSED);
        } else {
            player.playVideo();
            setPlayerState(YouTube.PlayerState.PLAYING);
        }
    };

    const handleMuteUnmuteClick = () => {
        console.log('Mute/unmute clicked');
        const player = playerRef.current.getInternalPlayer();
        if (isMuted) {
            player.unMute();
            setIsMuted(false);
        } else {
            player.mute();
            setIsMuted(true);
        }
    }

    console.log('Current player state:', playerState);

    return (
        <BaseContainer>
            <div className="video-container">
                <YouTube videoId="7U7BDn-gU18" opts = {opts} onStateChange={handleStateChange} onReady = {onReady} ref={playerRef} />
            </div>
            <button onClick={handlePlayPauseClick}>{playerState === YouTube.PlayerState.PLAYING ? 'Pause' : 'Play'}</button>
            <button onClick={handleMuteUnmuteClick}>{isMuted ? 'Unmute' : 'Mute'}</button>
        </BaseContainer>
    );
}

export default TestingVideoEmbed;