//Displays win conditions, and allows the player to restart the game or return to the main menu.

class VictoryScreen extends Phaser.Scene {

	constructor() {
		super('victoryScreen');
	}

	preload() {
		this.load.image('victoryText', 'assets/victory-title.png');
		this.load.image('victoryImage', 'assets/sunrise-image.png');
		this.load.audio('victory', 'assets/music/hollow_victory.wav');
	}

	create() {
		this.cameras.main.setBackgroundColor('#ADD8E6');
        this.add.image(this.game.config.width/2, 50, 'victoryText').setScale(0.8);

		this.game.music.setMute(true);

        var victorymusic = this.sound.add('victory');
        victorymusic.setLoop(false);
        victorymusic.setVolume(0.5);
        victorymusic.play();

        // TODO: add image and message
        this.add.image(this.game.config.width/2, this.game.config.height/2, 'victoryImage').setScale(0.5);

		var restartButton = new RectangleButton(this, this.game.config.width/2 - 125, this.game.config.height - 50, 150, 50, 0xFFFFFF, 1, 'RESTART');
		restartButton.on('pointerdown', () => this.restartButtonClicked(victorymusic));

		var quitButton = new RectangleButton(this, this.game.config.width/2 + 125, this.game.config.height - 50, 150, 50, 0xFFFFFF, 1, 'QUIT');
		quitButton.on('pointerdown', () => this.quitButtonClicked(victorymusic));
	}

	restartButtonClicked(music){
		music.stop();
		let sfx = this.sound.add('chimeSFX').setVolume(0.3);
		sfx.play();
		this.game.resetData();
		this.resumeMusic();
		this.scene.start("gameScreen");
	}

	quitButtonClicked(music){
		music.stop();
		let sfx = this.sound.add('chimeSFX').setVolume(0.3);
		sfx.play();
		this.resumeMusic();
		this.scene.start("titleScreen");
	}

	//Resumes music if not already muted
	resumeMusic(){
		this.game.music.setMute(this.game.mute);
	}
}