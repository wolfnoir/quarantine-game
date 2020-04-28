//This screen has players choosing the difficulty of the game they wish to play,
//with a brief description talking about each difficulty. After selecting a difficulty,
//the game will bring them to the 'select map' screen.

class DifficultyScreen extends Phaser.Scene {

	constructor() {
		super("difficultyScreen");
	}

	preload() {
		//this.load.image('background', 'assets/virus-bg.png');
		this.load.image('newGameTitle', 'assets/new-game-title.png');
	}

	create() {
		this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background');
		this.background.setOrigin(0, 0).setAlpha(0.8);
		this.add.image(this.game.config.width/2, 50, 'newGameTitle').setScale(0.8);

		var textBox =
			this.add.rectangle(this.game.config.width/2, this.game.config.height/2 + 25, 750, 400, 0x000000, 0.8).setOrigin(0.5, 0.5);

		//difficulty buttons and text
		var easyButton = new RectangleButton(this, 150, 175, 200, 50, 0xFFFFFF, 1, 'EASY');
		easyButton.on('pointerdown', () => this.easyMode());

		var easyText = this.add.text(this.game.config.width/2 + 100, easyButton.y,
			"The pandemic takes slightly more time to spread,\n"+
			"and outbreaks are less likely to occur.",
			{fontFamily: '"Courier New"', fontSize: '16px', fontWeight: 900})
			.setOrigin(0.5);
		
		var mediumButton = new RectangleButton(this, 150, 275, 200, 50, 0xFFFFFF, 1, 'MEDIUM');
		mediumButton.on('pointerdown', () => this.mediumMode());

		var mediumText = this.add.text(this.game.config.width/2 + 100, mediumButton.y,
			"Suggested difficulty setting. The pandemic has\n"+
			"a normal infection rate. Random events happen\n"+
			"at a frequent rate.",
			{fontFamily: '"Courier New"', fontSize: '16px', fontWeight: 900})
			.setOrigin(0.5);

		var hardButton = new RectangleButton(this, 150, 375, 200, 50, 0xFFFFFF, 1, 'HARD');
		hardButton.on('pointerdown', () => this.hardMode());

		var hardButton = this.add.text(this.game.config.width/2 + 100, hardButton.y,
			"The virus rips through the population without\n"+
			"mercy. Morale is more difficult to keep up,\n"+
			"and the cure is significantly harder to research.",
			{fontFamily: '"Courier New"', fontSize: '16px', fontWeight: 900})
			.setOrigin(0.5);

		var customButton = new RectangleButton(this, 150, 475, 200, 50, 0x696969, 1, 'CUSTOM');
		var customText = this.add.text(this.game.config.width/2 + 100, customButton.y,
			"Create a pandemic scenario of your very own\n"+
			"with the custom editor! This option is currently\n"+
			"locked.",
			{fontFamily: '"Courier New"', fontSize: '16px', fontWeight: 900})
			.setOrigin(0.5);

	}

	easyMode(){
		//put easy mode variables here
		this.game.gameData.infectivity = 0.03;
		this.game.gameData.severity = 0.01;
		this.game.gameData.lethality = 0;
		this.game.gameData.cureProgressPerDay = 0.04;

		let sfx = this.sound.add('chimeSFX').setVolume(0.3);
		sfx.play();
		this.scene.start("levelScreen");
	}

	mediumMode(){
		//put medium mode variables here
		this.game.gameData.infectivity = 0.14;
		this.game.gameData.severity = 0.2;
		this.game.gameData.lethality = 0.15;
		this.game.gameData.cureProgressPerDay = 0.03;

		let sfx = this.sound.add('chimeSFX').setVolume(0.3);
		sfx.play();
		this.scene.start("levelScreen");
	}

	hardMode(){
		//put hard mode variables here
		this.game.gameData.infectivity = 0.25;
		this.game.gameData.severity = 0.3;
		this.game.gameData.lethality = 0.40;
		this.game.gameData.cureProgressPerDay = 0.02;

		let sfx = this.sound.add('chimeSFX').setVolume(0.3);
		sfx.play();
		this.scene.start("levelScreen");
	}
}