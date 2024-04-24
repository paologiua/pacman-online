import Phaser from "phaser";
import { FIRST_MAP } from "../maps/first.map";
const imageContext = require.context('../../../images/map/', true);
const images = imageContext.keys().map(image => imageContext(image));

export class GameScene extends Phaser.Scene {
  // constructor() {
  //   super();
  // }

  init(): void {}

  preload(): void {
		images.forEach((image: string, imageId: number) => 
			this.load.image(`map-${imageId}`, image)
		);
  }

  create(): void {
		FIRST_MAP.forEach((row, i) => 
			row.forEach((imageId, j) => 
				imageId !== -1 && this.add.image(j*16 + 8, i*16 + 8, `map-${imageId}`)
			)
		);
  }

  update(): void {}
}
