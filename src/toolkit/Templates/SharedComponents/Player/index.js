import React, { useState } from 'react';
import { Wrapper } from './player.styles.js';
import cameraIcon from './../../../../assets/camera.svg';
import player from '../../../toolkit/player';
const Player = () => {
  const [image, setImage] = useState('');

  

  return <div>
    <div className="icon-container">
      <Wrapper id="player-root" />
     </div>
  </div>;
};

export default Player;
