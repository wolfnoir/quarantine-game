class CityTile {
    constructor(obj){
        this.population = obj.population;
        this.infected = obj.infected;
        this.dead = obj.dead;
        this.morale = obj.morale;
        this.infectivity = obj.infectivity;
        this.recovery = obj.recovery;
        this.isInfectable = obj.isInfectable;
        
        this.effects = new Effects();
        this.actions = [];
        //@TODO: add all tile-specific actions to this list
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
}