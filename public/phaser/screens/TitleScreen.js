//AKA the main menu.
//Will include three options: start game, controls, and help. Clicking on any of them will take you to the respective screen.

class TitleScreen extends Phaser.Scene {

	constructor() {
		super("titleScreen");
	}

	preload() {
		this.load.image('background', 'assets/virus-bg.png');
		this.load.image('titleText', 'assets/quarantine-title-text.png');
	}

	create() {
		this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background');
		this.background.setOrigin(0, 0).setAlpha(0.8);
		this.add.image(this.game.config.width/2, 50, 'titleText').setScale(0.8);

		//add the buttons to the title screen
		//add functionality to the buttons
	}

}