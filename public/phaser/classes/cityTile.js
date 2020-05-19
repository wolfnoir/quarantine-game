class CityTile {
    constructor(obj, actionjs){
        this.name = obj.name;
        this.population = obj.population;
        this.infected = obj.infected;
        this.dead = obj.dead;
        this.morale = obj.morale;
        this.infectivity = obj.infectivity;
        this.recovery = obj.recovery;
        this.isInfectable = obj.isInfectable;
        
        this.effects = new Effects();
        this.actions = [];
        
        //@TODO: make tile-specific actions for this list
        for (let i = 0; i < 6; i++) {
			var obj = new Action(actionjs[i.toString()]);
			this.actions.push(obj);
		}
    }

    getPopulation(){
        return this.population;
    }

    getInfected(){
        return this.infected;
    }

    getDead(){
        return this.dead;
    }

    getInfectedPercentage(){
        return this.infected / this.population;
    }

    getName(){
        return this.name;
    }

    //Infects num people in this tile
    //If all people are infected, cap it
    addInfected(num){
        this.infected += num;

        if(this.infected > this.population)
            this.infected = this.population;
    }

    //num infected people will recover from the virus
    //If there are less infected than num, infected will be set to 0
    recover(num){
        this.infected -= num;
        
        if(this.infected < 0)
            this.infected = 0;
    }

    //increments the number of dead by num
    //decreases the infected and population by num
    incrementDead(num){
        this.dead += num;
        this.infected -= num;
        this.population -= num;
    }

    getMorale(){
        return this.morale;
    }

    getInfectivityRate(){
        return this.infectivity;
    }

    getRecoveryRate(){
        return this.recovery;
    }

    infectable(){
        return this.isInfectable;
    }

    getEffects(){
        return this.effects;
    }

    getAction(actionNum){
        return this.actions[actionNum];
    }

    //Reads all actions that have been taken and updates effects
    //Used to update effects at the end of turn
    updateEffects(){
        for (let i = 0; i < this.actions.length; i++) {
			let action = this.actions[i];

			if (action.hasBeenTaken()) {
				this.effects.addAction(this.game.actions[i]);
				action.toggleTaken();
			}
		}
    }

    //Used to clear effects at the end of turn
    clearEffects(){
        this.effects.clear()
    }
}