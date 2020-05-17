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
		this.pageCounter = this.add.text(this.game.config.width/2, this.game.config.height - 50, this.currentPage + "/10",
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
		
		this.pageCounter.setText(this.currentPage + "/10");
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
		
		this.pageCounter.setText(this.currentPage + "/10");
		this.textInfo.setText(updateText(this.currentPage));
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
				return "page 2";
			case 3:
				return "page 3";
			case 4:
				return "page 4";
		}
	}

}