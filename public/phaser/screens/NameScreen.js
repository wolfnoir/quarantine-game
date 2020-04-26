//A simple text box and graphic that prompts the player to name the disease they’re fighting against.
//Mostly used to apply flavor text to the game. After completing the process, the player is finally
//brought to the main map/game screen.

class NameScreen extends Phaser.Scene {

	constructor() {
		super("nameScreen");
	}

	preload() {
		this.load.image('name-title', 'assets/name-title.png');
	}

	create() {
		this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background');
		this.background.setOrigin(0, 0).setAlpha(0.8);

		var text = this.add.text(this.game.config.width/2 - 170, 150, "Please enter the name of your disease:");
		
		// TODO: can't get DOM elements to actually appear
		var nameInput = this.add.dom(this.game.config.width/2 - 170, 200, 'div', 'width: 200; height: 100;', 'Hello World!');
		this.add.image(this.game.config.width/2, 50, 'name-title').setScale(0.8);

		this.add.image(this.game.config.width/2, 50, 'name-title').setScale(0.8);
	}

}