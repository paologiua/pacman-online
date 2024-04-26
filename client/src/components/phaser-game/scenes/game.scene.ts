import Phaser from "phaser";
import { FIRST_MAP } from "../maps/first.map";
import pacman from "../../../images/spritesheets/pacman.png";
import { Player } from "../classes/player.class";
const imageContext = require.context("../../../images/map/", true);
const images = imageContext.keys().map((image) => imageContext(image));

export class GameScene extends Phaser.Scene {
  private _cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private _platforms!: Phaser.Physics.Arcade.StaticGroup;
  private _player!: Player;

  // constructor() {
  //   super();
  // }

  init(): void {
    this._cursors = this.input.keyboard!.createCursorKeys();
  }

  preload(): void {
    this.load.spritesheet("pacman", pacman, {
      frameWidth: 16,
      frameHeight: 16,
    });
    images.forEach((image: string, imageId: number) =>
      this.load.image(`map-${imageId}`, image)
    );
  }

  create(): void {
    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("pacman", { start: 1, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("pacman", { start: 3, end: 4 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("pacman", { start: 5, end: 6 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("pacman", { start: 7, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this._platforms = this.physics.add.staticGroup();

    FIRST_MAP.forEach((row, i) =>
      row.forEach((imageId, j) => {
        if (imageId !== -1) {
          let x: number = j * 16 + 8;
          let y: number = i * 16 + 8;

          if (imageId < 14) {
            this._platforms.create(x, y, `map-${imageId}`);
          } else {
            this.add.image(x, y, `map-${imageId}`);
          }
        }
      })
    );

    this._player = new Player(this, 216, 216, "pacman");
    this._player.setCollideWorldBounds(true);

    this.physics.add.collider(this._player, this._platforms);
  }

  update(): void {
    if (this._cursors.left.isDown) {
			this._player.direction = "left";
    } else if (this._cursors.right.isDown) {
			this._player.direction = "right";
    } else if (this._cursors.up.isDown) {
			this._player.direction = "up";
    } else if (this._cursors.down.isDown) {
			this._player.direction = "down";
    }
		
		this._player.update();
  }
}
