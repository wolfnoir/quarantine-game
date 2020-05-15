//Displays loss conditions, and allows the player to restart the game or return to the main menu.

class DefeatScreen extends Phaser.Scene {

	constructor() {
		super('defeatScreen');
	}

	preload() {
		this.load.image('defeatText', 'assets/defeat-title.png');
		this.load.image('defeatImage', 'assets/defeat-image.png');
		this.load.audio('gameover', 'assets/sfx/eas_gameover.mp3');
	}

	create() {
		this.cameras.main.setBackgroundColor('#8b0000');
		this.add.image(this.game.config.width/2, 50, 'defeatText').setScale(0.8);

		this.game.music.stop();

		let gameover = this.sound.add('gameover');
		gameover.setLoop(false);
		gameover.setVolume(0.5);
		gameover.play();

		// TODO: add message
		this.add.image(this.game.config.width/2, this.game.config.height/2, 'defeatImage').setScale(1);

		var restartButton = new RectangleButton(this, this.game.config.width/2 - 125, this.game.config.height - 50, 150, 50, 0xFFFFFF, 1, 'RESTART');
		restartButton.on('pointerdown', () => this.restartButtonClicked(gameover));

		var quitButton = new RectangleButton(this, this.game.config.width/2 + 125, this.game.config.height - 50, 150, 50, 0xFFFFFF, 1, 'QUIT');
		quitButton.on('pointerdown', () => this.quitButtonClicked(gameover));
	}

	restartButtonClicked(sound){
		sound.stop();
		let sfx = this.sound.add('chimeSFX').setVolume(0.3);
		sfx.play();
		this.game.resetData();
		this.scene.start("gameScreen");
	}

	quitButtonClicked(sound){
		sound.stop();
		let sfx = this.sound.add('chimeSFX').setVolume(0.3);
		sfx.play();
		this.scene.start("titleScreen");
	}
}