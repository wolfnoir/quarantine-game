class ActionButton extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, title, desc){
        super(scene, x, y, 150, 100, 0xffffff);
        this.fillColor = 0xffffff;
        this.energyCost = 0;
        this.title = scene.add.text(x, y - 30, title,
            { fontFamily: '"Courier New"', fontSize: '18px', fontWeight: 900, color: '0xffffff' }).setOrigin(0.5).setDepth(2);
        this.energyText = scene.add.text(x, y, this.energyCost + " energy",
                { fontFamily: '"Courier New"', fontSize: '18px', fontWeight: 900, color: '0xffffff' }).setOrigin(0.5).setDepth(2);
        this.text = scene.add.text(x, y + 30, desc,
            { fontFamily: '"Courier New"', fontSize: '14px', fontWeight: 900, color: '0xffffff' }).setOrigin(0.5).setDepth(2);

        this.allowHover = true;
        scene.add.existing(this);
        scene.add.existing(this.text);

        this.setInteractive({ useHandCursor: true });
        super.on('pointerover', () => this.hoverOver());
        super.on('pointerout', () => this.hoverOut());
    }

    setEnergyCost(cost){
        this.energyCost = cost;
        this.energyText.setText(cost + " energy");
    }

    setText(desc){
        this.text.setText(desc);
    }

    hideButton(){
        this.title.setAlpha(0);
        this.energyText.setAlpha(0);
        this.text.setAlpha(0);
        super.setAlpha(0);
    }

    showButton(){
        this.title.setAlpha(1);
        this.energyText.setAlpha(1);
        this.text.setAlpha(1);
        super.setAlpha(1);
    }

    toggleHover(){
        this.allowHover = !this.allowHover;
    }

    setHover(bool){
        this.allowHover = bool;
    }

    hoverOver(){
        if(this.allowHover){
            super.setFillStyle(0x696969);
        }
    }

    hoverOut(){
        if(this.allowHover){
            super.setFillStyle(0xffffff);
        }
    }
}