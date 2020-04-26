//Will tell the player the backstory for the game and include our names

class HelpScreen extends Phaser.Scene {

	constructor() {
		super("helpScreen");
	}

	preload() {
		//this.load.image('background', 'assets/virus-bg.png');
		this.load.image('helpTitle', 'assets/help-title.png');
		this.load.image('cityPicture', 'assets/city.png');
	}

	create() {
		this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background');
		this.background.setOrigin(0, 0).setAlpha(0.8);
		this.add.image(this.game.config.width/2, 50, 'helpTitle').setScale(0.8);

		//add textbox
		var textBox = this.add.rectangle(100, 300, 450, 400, 0x000000, 0.8);
		//add text
		var text = this.add.text(20,115,
			"Your city is the epicenter\nof a new disease,\n" +
			"and more people seem to\nbe catching it every\n" +
			"day. The government is\nin panic, and you have\n" +
			"recently been hired as\nthe leader of the\n" +
			"Pandemic Response Team\nof your fair city. It is\n" +
			"your responsibility to\nquell the disease, make\n" +
			"sure the population's\nmorale stays up, and work\n" +
			"towards researching a cure.\nCan you eradicate\n" +
			"the disease in time before\nthe whole city gets\n" +
			"infected?\n\n\n" +
			"Developed by Jeong Uk Lee,\nJimmy Xie, and Everett Yang",
			{fontFamily: '"Courier New"', fontSize: '18px', fontWeight: 900});

		this.add.image(this.game.config.width - 240, 300, 'cityPicture').setScale(0.45);;

		//back button
		var backButton = new RectangleButton(this, 70, 550, 100, 50, 0xFFFFFF, 1, 'BACK');
		backButton.on('pointerdown', () => this.scene.start('titleScreen'));
	}

}