//AKA the main menu.
//Will include three options: start game, controls, and help. Clicking on any of them will take you to the respective screen.
class TitleScreen extends Phaser.Scene {

	constructor() {
		super("titleScreen");
	}

	preload() {
		//this.load.image('background', 'assets/virus-bg.png');
		//this.load.image('titleText', 'assets/quarantine-title-text.png');
		this.load.audio('chimeSFX', 'assets/sfx/soft-chime.wav');
	}

	create() {
		this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background');
		this.background.setOrigin(0, 0).setAlpha(0.8);
		this.add.image(this.game.config.width/2, 50, 'titleText').setScale(0.8);

		//add the buttons to the title screen
		var startButton = new RectangleButton(this, this.game.config.width/2, 200, 300, 50, 0xFFFFFF, 1, 'START');
		startButton.on('pointerdown', () => this.startButtonClicked());
		
		var helpButton = new RectangleButton(this, this.game.config.width/2, 300, 300, 50, 0xFFFFFF, 1, 'HELP');
		helpButton.on('pointerdown', () => this.helpButtonClicked());

		var controlsButton = new RectangleButton(this, this.game.config.width/2, 400, 300, 50, 0xFFFFFF, 1, 'CONTROLS');
		controlsButton.on('pointerdown', () => this.controlsButtonClicked());
	}

	startButtonClicked(){
		let sfx = this.sound.add('chimeSFX').setVolume(0.3);
		sfx.play();
		this.scene.start("difficultyScreen");
	}

	helpButtonClicked(){
		let sfx = this.sound.add('chimeSFX').setVolume(0.3);
		sfx.play();
		this.scene.start("helpScreen");
	}

	controlsButtonClicked(){
		let sfx = this.sound.add('chimeSFX').setVolume(0.3);
		sfx.play();
		this.scene.start("controlScreen");
	}
}