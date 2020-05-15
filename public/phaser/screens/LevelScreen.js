//Will include pictures of the levels we have built for the game.
//Clicking on any of them will select the map for the player and then bring them to the 'name your disease' page.

class LevelScreen extends Phaser.Scene {

	constructor() {
		super("levelScreen");
	}

	preload() {
		//this.load.image('background', 'assets/virus-bg.png');
		this.load.image('mapSelectTitle', 'assets/map-select-title.png');
		this.load.image('newYork', 'assets/new york.jpg');
		this.load.image('london', 'assets/london.jpg');
		this.load.image('seoul', 'assets/seoul.jpg');
	}

	create() {
		this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background');
		this.background.setOrigin(0, 0).setAlpha(0.8);
		this.add.image(this.game.config.width/2, 50, 'mapSelectTitle').setScale(0.5).setOrigin(0.5);

		var newYorkImg = this.add.image(150, 170, 'newYork').setOrigin(0.5).setScale(0.5);
		var londonImg = this.add.image(150, this.game.config.height/2+40, 'london').setOrigin(0.5).setScale(0.5);
		var seoulImg = this.add.image(150, 510, 'seoul').setOrigin(0.5).setScale(0.5);

		var nyButton = new RectangleButton(this, 400, newYorkImg.y - 50, 200, 50, 0xFFFFFF, 1, 'NEW YORK');
		nyButton.on('pointerdown', () => this.nySelected());

		var nyText = this.add.text(nyButton.x, nyButton.y + 50,
			"Description TBA",
			{fontFamily: '"Courier New"', fontSize: '16px', fontWeight: 900})
			.setOrigin(0.5);
		
		var londonButton = new RectangleButton(this, 400, londonImg.y - 50, 200, 50, 0xFFFFFF, 1, 'LONDON');
		londonButton.on('pointerdown', () => this.londonSelected());

		var londonText = this.add.text(londonButton.x, londonButton.y + 50,
			"Description TBA",
			{fontFamily: '"Courier New"', fontSize: '16px', fontWeight: 900})
			.setOrigin(0.5);

		var seoulButton = new RectangleButton(this, 400, seoulImg.y - 50, 200, 50, 0x696969, 1, 'SEOUL');
		seoulButton.on('pointerdown', () => this.seoulSelected());

		var seoulText = this.add.text(seoulButton.x, seoulButton.y + 50,
			"Description TBA",
			{fontFamily: '"Courier New"', fontSize: '16px', fontWeight: 900})
			.setOrigin(0.5);
	}

	nySelected(){
		//change variables here
		let sfx = this.sound.add('chimeSFX').setVolume(0.3);
		sfx.play();
		this.scene.start("gameScreen");
	}

	londonSelected(){
		//change variables here
		let sfx = this.sound.add('chimeSFX').setVolume(0.3);
		sfx.play();
		this.scene.start("gameScreen");
	}

}