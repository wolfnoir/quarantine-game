//Should allow the player to adjust any settings such as sound and music volume as well as allow them to
//quit to the main menu. The menu also allows the player to restart the game with their current settings.


class PauseScreen extends Phaser.Scene {

	constructor() {
		super("pauseScreen");
	}

	preload() {
	}

	create() {
		this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background');
		this.background.setOrigin(0, 0).setAlpha(0.8);

		this.add.image(this.game.config.width/2, 50, 'titleText').setScale(0.8);

		//add the buttons to the title screen
		var resumeButton = new RectangleButton(this, this.game.config.width/2, 200, 300, 50, 0xFFFFFF, 1, 'RESUME');
		resumeButton.on('pointerdown', () => this.resumeButtonClicked());
		
		var muteButton = new RectangleButton(this, this.game.config.width/2, 300, 300, 50, 0xFFFFFF, 1, 'MUTE/UNMUTE');
		muteButton.on('pointerdown', () => this.muteButtonClicked());

		var restartButton = new RectangleButton(this, this.game.config.width/2, 400, 300, 50, 0xFFFFFF, 1, 'RESTART');
		restartButton.on('pointerdown', () => this.restartButtonClicked());

		var quitButton = new RectangleButton(this, this.game.config.width/2, 500, 300, 50, 0xFFFFFF, 1, 'QUIT');
		quitButton.on('pointerdown', () => this.quitButtonClicked());
	}

	resumeButtonClicked(){
		let sfx = this.sound.add('chimeSFX').setVolume(0.3);
		sfx.play();
		this.scene.start("gameScreen");
	}

	muteButtonClicked(){
		let sfx = this.sound.add('chimeSFX').setVolume(0.3);
		sfx.play();

		if(this.game.music.isPlaying)
			this.game.music.stop();

		else
			this.game.music.play();
	}

	restartButtonClicked(){
		let sfx = this.sound.add('chimeSFX').setVolume(0.3);
		sfx.play();
		this.game.resetData();
		this.scene.start("gameScreen");
	}

	quitButtonClicked(){
		let sfx = this.sound.add('chimeSFX').setVolume(0.3);
		sfx.play();
		this.game.resetData();
		this.game.resetAll();
		this.scene.start("titleScreen");
	}
}