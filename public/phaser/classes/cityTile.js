class CityTile {
    constructor(obj){
        this.population = obj.population;
        this.infected = obj.infected;
        this.dead = obj.dead;
        this.morale = obj.morale;
        this.infectivity = obj.infectivity;
        this.recovery = obj.recovery;
        this.isInfectable = obj.isInfectable;
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
    addInfected(num){
        this.infected += num;
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