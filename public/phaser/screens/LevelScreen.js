//Will include pictures of the levels we have built for the game.
//Clicking on any of them will select the map for the player and then bring them to the 'name your disease' page.

class LevelScreen extends Phaser.Scene {

	constructor() {
		super("levelScreen");
	}

	preload() {
		//this.load.image('background', 'assets/virus-bg.png');
		this.load.image('mapSelectTitle', 'assets/map-select-title.png');
	}

	create() {
		this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background');
		this.background.setOrigin(0, 0).setAlpha(0.8);
		this.add.image(this.game.config.width/2, 50, 'mapSelectTitle').setScale(0.8);
	}

}