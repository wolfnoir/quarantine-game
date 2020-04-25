//Brief screen that first appears, displaying the logo for the game, that will lead to main menu when the mouse is clicked.
class SplashScreen extends Phaser.Scene {

	constructor() {
		super({key:'splashScreen'});
	}

	preload() {
		this.load.image('background', './assets/background.png');
	}

	create() {
		var bg = this.add.sprite(0,0,'background');
    	bg.setOrigin(0,0);
	}

}

export default SplashScreen;