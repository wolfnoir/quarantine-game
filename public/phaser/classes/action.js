class Action{
    constructor(obj){
        this.name = obj.name;
        this.infectivity = obj.infectivity;
        this.severity = obj.severity;
        this.lethality = obj.lethality;
        this.recovery = obj.recovery;
        this.morale = obj.morale;
        this.cureProgress = obj.cureProgress;
        this.cost = obj.cost;
        this.taken = false;
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

    getRecovery(){
        return this.recovery;
    }

    getMoraleChange(){
        return this.morale;
    }

    getCureProgress(){
        return this.cureProgress;
    }

    getCost(){
        return this.cost;
    }

    hasBeenTaken(){
        return this.taken;
    }

    toggleTaken(){
        this.taken = !this.taken;
    }
}