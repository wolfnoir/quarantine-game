//Will tell the player the backstory for the game and include our names

class HelpScreen extends Phaser.Scene {

	constructor() {
		super("helpScreen");
		this.currentPage = 1;
		this.pageCounter;
		this.textInfo;
	}

	preload() {
		//this.load.image('background', 'assets/virus-bg.png');
		this.load.image('helpTitle', 'assets/help-title.png');
		this.load.image('cityPicture', 'assets/city.png');
	}

	create() {
		this.currentPage = 1;
		this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background');
		this.background.setOrigin(0, 0).setAlpha(0.8);
		this.add.image(this.game.config.width/2, 50, 'helpTitle').setScale(0.8);

		//add textbox
		var textBox = this.add.rectangle(100, this.game.config.height/2, 700, 400, 0x000000, 0.8);
		//add text
		this.textInfo = this.add.text(20,this.game.config.height/2,
			"Your city is the epicenter of a new\ndisease, " +
			"and more people seem to be\ncatching it every" +
			"day. The government\nis in panic, and you have " +
			"recently\nbeen hired as the leader of the " +
			"\nPandemic Response Team of your fair\ncity." +
			"\n\nIt is your responsibility to\n" +
			"quell the disease, make sure the\n" +
			"population's morale stays up, and\n" +
			"towards researching a cure. Can you\n" +
			"eradicate the disease in time before\n" +
			"the whole city gets infected?\n\n\n" +
			"Developed by Jeong Uk Lee,\nJimmy Xie, and Everett Yang",
			{fontFamily: '"Courier New"', fontSize: '18px', fontWeight: 900}).setOrigin(0, 0.5);

		this.add.image(this.game.config.width - 240, this.game.config.height/2, 'cityPicture').setScale(0.45);

		//back button
		var backButton = new RectangleButton(this, 70, this.game.config.height-50, 100, 50, 0xFFFFFF, 1, 'BACK');
		backButton.on('pointerdown', () => this.backClicked());

		//page counter
		this.pageCounter = this.add.text(this.game.config.width/2, this.game.config.height - 50, this.currentPage + "/4",
			{fontWeight: 'bold', fontSize: '24px'});

		//next page button
		var lastPageButton = new RectangleButton(this, this.game.config.width - 150, this.game.config.height-50, 50, 50, 0xFFFFFF, 1, '<');
		lastPageButton.on('pointerdown', () => this.lastPage());

		//next page button
		var nextPageButton = new RectangleButton(this, this.game.config.width - 70, this.game.config.height-50, 50, 50, 0xFFFFFF, 1, '>');
		nextPageButton.on('pointerdown', () => this.nextPage());
	}

	backClicked(){
		let sfx = this.sound.add('chimeSFX').setVolume(0.3);
		sfx.play();
		this.scene.start('titleScreen');
	}

	nextPage(){
		let page = this.currentPage;
		if(page === 4){
			this.currentPage = 1;
		}
		else{
			this.currentPage = this.currentPage + 1;
		}
		
		this.pageCounter.setText(this.currentPage + "/4");
		this.textInfo.setText(this.updateText(this.currentPage));
	}

	lastPage(){
		let page = this.currentPage;
		if(page === 1){
			this.currentPage = 4;
		}
		else{
			this.currentPage = this.currentPage - 1;
		}
		
		this.pageCounter.setText(this.currentPage + "/4");
		this.textInfo.setText(this.updateText(this.currentPage));
	}

	updateText(num){
		console.log("text changing");
		switch(num){
			case 1:
				return "Your city is the epicenter of a new\ndisease, " +
				"and more people seem to be\ncatching it every" +
				"day. The government\nis in panic, and you have " +
				"recently\nbeen hired as the leader of the " +
				"\nPandemic Response Team of your fair\ncity." +
				"\n\nIt is your responsibility to\n" +
				"quell the disease, make sure the\n" +
				"population's morale stays up, and\n" +
				"towards researching a cure. Can you\n" +
				"eradicate the disease in time before\n" +
				"the whole city gets infected?\n\n\n" +
				"Developed by Jeong Uk Lee,\nJimmy Xie, and Everett Yang";
			case 2:
				return "------STARTING OUT------\n\n" +
				"Your main goal is to fight against the\n" +
				"pandemic until a cure can be found.\n" +
				"Each day, you have several actions you\n" +
				"can take to fight back against the\n" +
				"infection. Different actions have\n" +
				"different effects listed in their\n" +
				"descriptions.\n\n" +
				"INFECTIVITY - Affects the rate at\n" +
				"which the disease spreads.\n\n" + 
				"SEVERITY - Controls how badly the virus\n"+
				"seems to be affecting others, thus\n" +
				"affecting morale.\n\n" + 
				"LETHALITY - Affects how quickly the\n" +
				"virus kills those infected.\n\n" +
				"RECOVERY - Affects the rate at which\n" +
				"people recover from the disease.";
			case 3:
				return "------ENERGY------\n\n" +
				"Actions take time and resources, and\n"+
				"thus each action has an associated\n" +
				"energy cost. You are given a limited\n" +
				"amount of energy each turn, so pick\n"+
				"your moves wisely.\n\n" +
				"------ACTIONS------\n\n" +
				"There are two types of actions one\n" +
				"can take each turn--global actions and\n" +
				"tile actions. Global actions affect\n" +
				"all the tiles on the map, but take\n"+
				"more energy. Tile actions are specific\n"+
				"to individual tiles.\n\n" +
				"You may use tile actions by clicking\n" +
				"on a tile and clicking on the actions\n" +
				"that appear.";
			case 4:
				return "------ACHIEVING VICTORY------\n\n" +
				"Your only hope for defeating the\n" +
				"pandemic will be to research a cure.\n" +
				"However, the cure will be useless if\n" +
				"the pandemic reaches catastrophic\n" +
				"levels or if the people decide to riot.\n" +
				"Thus, it is important to keep morale\n" +
				"up and keep the threat level as low as\n"+
				"possible.\n\n" +
				"It's a race against the clock--with\n" +
				"each turn, the virus becomes more and\n"+
				"more vicious, causing the threat level\n" +
				"to slowly climb. As this plague\n"+
				"ravages the streets, the people become\n" +
				"more and more restless.";
		}
	}

}