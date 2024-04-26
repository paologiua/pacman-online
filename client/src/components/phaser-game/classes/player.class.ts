export class Player extends Phaser.Physics.Arcade.Sprite {
  direction?: "up" | "down" | "left" | "right";
  lastPosition: { x?: number; y?: number } = {};
  body!: Phaser.Physics.Arcade.Body;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number | undefined
  ) {
    super(scene, x, y, texture, frame);

    scene.physics.world.enable(this);
    scene.add.existing(this);
  }

  update(): void {
		// let unitX = Math.round((this.x - 8) / 16) * 16 + 8;
		// let unitY = Math.round((this.y - 8) / 16) * 16 + 8;

		// if (this.lastPosition.x !== undefined) {
		// 	if ((this.lastPosition.x < unitX && unitX < this.x) || (this.lastPosition.x > unitX && unitX > this.x)) {
		// 		this.x = unitX;
		// 	} 
		// }
		// if (this.lastPosition.y !== undefined) {
		// 	if ((this.lastPosition.y < unitY && unitY < this.y) || (this.lastPosition.y > unitY && unitY > this.y)) {
		// 		this.y = unitY;
		// 	}
		// }

    if (this.body.velocity.equals(new Phaser.Math.Vector2(0, 0))) {
      this.anims.pause();
    }

    if (this.direction === "left") {
      this.setVelocityX(-160);
    } else if (this.direction === "right") {
      this.setVelocityX(160);
    } else if (this.direction === "up") {
      this.setVelocityY(-160);
    } else if (this.direction === "down") {
      this.setVelocityY(160);
    }

    if (this.lastPosition.x !== undefined && ~~this.x < this.lastPosition.x) {
      this.anims.play("left", true);
    } else if (
      this.lastPosition.x !== undefined &&
      ~~this.x > this.lastPosition.x
    ) {
      this.anims.play("right", true);
    } else if (
      this.lastPosition.y !== undefined &&
      ~~this.y < this.lastPosition.y
    ) {
      this.anims.play("up", true);
    } else if (
      this.lastPosition.y !== undefined &&
      ~~this.y > this.lastPosition.y
    ) {
      this.anims.play("down", true);
    }

    this.lastPosition = { x: ~~this.x, y: ~~this.y };
  }
}
