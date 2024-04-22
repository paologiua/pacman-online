import React, { useRef } from 'react';
import './game.page.scss';
import { PhaserGame } from '../../components/phaser-game/phaser-game.component';

function GamePage() {
  return (
    <div className='GamePage'>
      <PhaserGame ref={useRef()} />
    </div>
  );
};

export default GamePage;
