//Displays the controls for the game. Pressing the "back" button will bring you back to the main menu/title screen.

class ControlScreen extends Phaser.Scene {

	constructor() {
		super("controlScreen");
	}

	preload() {
		//this.load.image('background', 'assets/virus-bg.png');
		this.load.image('controlsTitle', 'assets/controls-title.png');
	}

	create() {
		this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background');
		this.background.setOrigin(0, 0).setAlpha(0.8);
		this.add.image(this.game.config.width/2, 50, 'controlsTitle').setScale(0.8);

		//add control text
		var textBox = this.add.rectangle(this.game.config.width/2, this.game.config.height/2, 400, 350, 0x000000, 0.8).setOrigin(0.5, 0.5);
		var controlText = this.add.text(textBox.x, textBox.y,
			"GENERAL CONTROLS\n\n" +
			"LEFT CLICK - Interact\n" +
			"RIGHT CLICK - Cancel\n" +
			"ESCAPE - Pause (in game)\n" +
			"TAB - Access menu\n\n" +
			"MAP NAVIGATION\n\n" +
			"Up Arrow - Scroll Up\n" +
			"Right Arrow - Scroll Right\n" +
			"Down Arrow - Scroll Down\n" +
			"Left Arrow - Scroll Left",
			{fontFamily: '"Courier New"', fontSize: '24px', fontWeight: 900}
			).setOrigin(0.5);

		//back button
		var backButton = new RectangleButton(this, 70, this.game.config.height-50, 100, 50, 0xFFFFFF, 1, 'BACK');
		backButton.on('pointerdown', () => this.backClicked());
	}

	backClicked(){
		let sfx = this.sound.add('chimeSFX').setVolume(0.3);
		sfx.play();
		this.scene.start('titleScreen');
	}
}