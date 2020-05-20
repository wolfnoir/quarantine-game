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

		this.load.json("manhattanjs", "../../maps/manhattan.json");
		this.load.json("londonjs", "../../maps/london.json");
		this.load.json("seouljs", "../../maps/seoul.json");

		this.load.json("tile-presets", "../../maps/tile-presets.json");
		this.load.json("actions", "../../presets/actions.json");
		this.load.json("tileactions", "../../presets/tileactions.json");
	}

	create() {
		this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background');
		this.background.setOrigin(0, 0).setAlpha(0.8);
		this.add.image(this.game.config.width/2, 50, 'mapSelectTitle').setScale(0.5).setOrigin(0.5);

		this.add.rectangle(this.game.config.width/2 + 30, this.game.config.height/2 + 40, 500, 600, 0x000000, 0.8);

		var newYorkImg = this.add.image(150, 170, 'newYork').setOrigin(0.5).setScale(0.5);
		var londonImg = this.add.image(150, this.game.config.height/2+40, 'london').setOrigin(0.5).setScale(0.5);
		var seoulImg = this.add.image(150, this.game.config.height - 100, 'seoul').setOrigin(0.5).setScale(0.5);

		var nyButton = new RectangleButton(this, 400, newYorkImg.y - 50, 200, 50, 0xFFFFFF, 1, 'NEW YORK');
		nyButton.on('pointerdown', () => this.nySelected());

		var nyText = this.add.text(nyButton.x - 100, nyButton.y + 75,
			"Recommended for beginners learning how to play\n"+
			"the game. Standard map, small size. All you have\n" +
			"to do is focus on fighting against the virus\n"+
			"while you research a cure.\n",
			{fontFamily: '"Courier New"', fontSize: '16px', fontWeight: 900})
			.setOrigin(0, 0.5);
		
		var londonButton = new RectangleButton(this, 400, londonImg.y - 50, 200, 50, 0xFFFFFF, 1, 'LONDON');
		londonButton.on('pointerdown', () => this.londonSelected());

		var londonText = this.add.text(londonButton.x - 100, londonButton.y + 75,
			"This is where things start to heat up. The NHS\n"+
			"does its best to serve the people, but can\n" +
			"they handle an outbreak like this?",
			{fontFamily: '"Courier New"', fontSize: '16px', fontWeight: 900})
			.setOrigin(0, 0.5);

		var seoulButton = new RectangleButton(this, 400, seoulImg.y - 50, 200, 50, 0xFFFFFF, 1, 'SEOUL');
		seoulButton.on('pointerdown', () => this.seoulSelected());

		var seoulText = this.add.text(seoulButton.x - 100, seoulButton.y + 75,
			"Searching for a cure isn't the only thing you\n"+
			"have to worry about--if the pandemic reaches\n"+
			"the airport, it's game over!",
			{fontFamily: '"Courier New"', fontSize: '16px', fontWeight: 900})
			.setOrigin(0, 0.5);

		//Set up actions
		var actionjs = this.cache.json.get('actions');
		this.game.actions = [];
		for (let i = 0; i < 10; i++) {
			var obj = new Action(actionjs[i.toString()]);
			this.game.actions.push(obj);
		}
	}

	nySelected(){
		//Set up data structure for city
		var mapjs = this.cache.json.get('manhattanjs');
		var presets = this.cache.json.get('tile-presets');
		var actionjs = this.cache.json.get('tileactions');
		this.game.city = new City(mapjs, presets, actionjs);
		this.game.cityName = "Manhattan";

		let sfx = this.sound.add('chimeSFX').setVolume(0.3);
		sfx.play();
		this.scene.start("gameScreen");
	}

	londonSelected(){
		//Set up data structure for city
		var mapjs = this.cache.json.get('londonjs');
		var presets = this.cache.json.get('tile-presets');
		var actionjs = this.cache.json.get('tileactions');
		this.game.city = new City(mapjs, presets, actionjs);
		this.game.cityName = "London";

		//change variables here
		let sfx = this.sound.add('chimeSFX').setVolume(0.3);
		sfx.play();
		this.scene.start("gameScreen");
	}

	seoulSelected(){
		//Set up data structure for city
		var mapjs = this.cache.json.get('seouljs');
		var presets = this.cache.json.get('tile-presets');
		var actionjs = this.cache.json.get('tileactions');
		this.game.city = new City(mapjs, presets, actionjs);
		this.game.cityName = "Seoul";

		//change variables here
		let sfx = this.sound.add('chimeSFX').setVolume(0.3);
		sfx.play();
		this.scene.start("gameScreen");
	}

}