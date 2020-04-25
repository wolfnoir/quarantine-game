//Will tell the player the backstory for the game and include our names

class HelpScreen extends Phaser.Scene {

	constructor() {
		super("helpScreen");
	}

	preload() {
		this.load.image('background', 'assets/virus-bg.png');
		this.load.image('helpTitle', 'assets/help-title.png');
	}

	create() {
		this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background');
		this.background.setOrigin(0, 0).setAlpha(0.8);
		this.add.image(this.game.config.width/2, 50, 'helpTitle').setScale(0.8);

		//back button
		var backButton = new RectangleButton(this, 70, 550, 100, 50, 0xFFFFFF, 1, 'BACK');
		backButton.on('pointerdown', () => this.scene.start('titleScreen'));
	}

}