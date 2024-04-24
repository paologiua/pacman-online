import Phaser from "phaser";
import { GameScene } from "./scenes/game.scene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 432,
  height: 368,
  parent: "game-container",
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
  },
  scene: GameScene,
};

const StartGame = (): Phaser.Game => {
  return new Phaser.Game(config);
};

export default StartGame;
