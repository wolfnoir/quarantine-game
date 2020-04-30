//Brief screen that first appears, displaying the logo for the game, that will lead to main menu when the mouse is clicked.
class SplashScreen extends Phaser.Scene {

	constructor() {
		super("splashScreen");
	}

	preload() {
        this.load.image('background', 'assets/virus-bg.png');
		this.load.image('titleText', 'assets/quarantine-title-text.png');
		this.load.audio('titleMusic', 'assets/music/Purple Planet Music - Electro Zombies.mp3');
	}

	create() {
		let titleMusic = this.sound.add('titleMusic');
		titleMusic.setLoop(true);
		titleMusic.setVolume(0.5);
		titleMusic.play();
		this.game.music = titleMusic;

		this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background');
		this.background.setOrigin(0, 0);
		this.add.image(this.game.config.width/2, 50, 'titleText').setScale(0.8);
		var shadow = this.add.text(this.game.config.width/2,552, 'CLICK ANYWHERE TO BEGIN THE INFECTION',
			{fontFamily: '"Georgia"', fontSize: '20px', fontWeight: 900, color: 'black'});
		var text = this.add.text(this.game.config.width/2,550, 'CLICK ANYWHERE TO BEGIN THE INFECTION',
			{fontFamily: '"Georgia"', fontSize: '20px', fontWeight: 900});
		text.setOrigin(0.5); //centers the text
		shadow.setOrigin(0.5); //centers the text

		//enables the user to click on the background. when clicked, change to titleScreen
		this.background.setInteractive({ useHandCursor: true});
		this.background.on('pointerdown', () => this.scene.start('titleScreen'));
	}
}
