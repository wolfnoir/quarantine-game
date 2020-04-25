//Brief screen that first appears, displaying the logo for the game, that will lead to main menu when the mouse is clicked.
class SplashScreen extends Phaser.Scene {

	constructor() {
		super("splashScreen");
	}

	preload() {
        this.load.image('background', 'assets/background.png');
		this.load.image('titleText', 'assets/quarantine-title-text.png');
	}

	create() {
		this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background');
        this.background.setOrigin(0, 0);
		
		var text = this.add.text(100, 100, 'Welcome To My Game!');
	}

}
