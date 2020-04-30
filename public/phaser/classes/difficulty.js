class Difficulty{
    constructor(obj){
        this.name = name;
        this.infectivity = obj.infectivity;
        this.severity = obj.severity;
        this.lethality = obj.lethality;
        this.cureProgressPerDay = obj.cureProgressPerDay;

        //The i-th element of the list corresponds to the amount of energy the player will start to get on the i-th day
        this.energyPerDay = obj.energyPerDay;
    }

    getName(){
        return this.name;
    }

    getInfectivity(){
        return this.infectivity;
    }

    getSeverity(){
        return this.severity;
    }

    getLethality(){
        return this.lethality;
    }

    getDailyCureProgress(){
        return this.cureProgressPerDay;
    }

    //Returns the amount of energy that the player should receive on this turn
    //If past the last turn of the array, give the maximum amount of energy possible, 7
    getEnergyToday(turn){
        var i = 0;
        
        while(i < this.energyPerDay.length){
            if(this.energyPerDay[i] > turn)
                return i;
            
            i++;
        }

        return i;
    }
}