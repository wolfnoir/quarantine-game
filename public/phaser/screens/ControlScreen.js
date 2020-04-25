//Displays the controls for the game. Pressing the "back" button will bring you back to the main menu/title screen.

class ControlScreen extends Phaser.Scene {

	constructor() {
		super("controlScreen");
	}

	preload() {
		this.load.image('background', 'assets/virus-bg.png');
		this.load.image('controlsTitle', 'assets/controls-title.png');
	}

	create() {
		this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background');
		this.background.setOrigin(0, 0).setAlpha(0.8);
		this.add.image(this.game.config.width/2, 50, 'controlsTitle').setScale(0.8);

		//back button
		var backButton = new RectangleButton(this, 70, 550, 100, 50, 0xFFFFFF, 1, 'BACK');
		backButton.on('pointerdown', () => this.scene.start('titleScreen'));
	}

}