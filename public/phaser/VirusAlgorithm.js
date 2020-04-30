class VirusAlgorithm {
    
    /*
    * initialTiles : Array that has the indicies of the initially infected tiles.
    * difficultyRatio : the % at which the algorithm checks if the disease spreads to another tile. Based on game difficulty.
    * game : Game. Contains important global game data for this algorithm to use, such as the city we're using.
    * 
    * The constructor adds the initialTiles to an array of infectedTiles.
    * !!!IMPORTANT NOTE!!!
    * infectedTiles[] stores the INDEX of EACH INFECTED TILE, NOT THE ACTUAL TILE ITSELF.
    */

    constructor(initialTiles, game){
        this.game = game;
        this.infectedTiles = [];
        this.city = game.city;
        this.cityTiles = game.city.cityTiles;
        this.difficulty = game.difficulty;
        this.effects = game.effects;

        // the difficulty ratio
        // determines how many people must be infected in a tile before the algorithm checks if the virus spreads
        this.difficultyRatio = 0;
        if(this.difficulty.name === "easy"){
            this.difficultyRatio = 0.75
        }
        else if(this.difficulty.name === "medium"){
            this.difficultyRatio = 0.6
        }
        else{
            this.difficultyRatio = 0.5;
        }

        // push the initial tiles that have been infected to the infectedTiles array.
        // assume that the tiles we've read in are infectable.
        for(let i = 0; i < initialTiles.length; i++){
            this.infectedTiles.push(initialTiles[i]);
        }

        //calculate the tiles surrounding the infected tiles and adds them to a list.
        //if the tile is not infectable, do NOT add it to the list.
        // this.surroundingTiles = [];
        // for(let i = 0; i < this.infectedTiles.length; i++){
        //     let index = this.infectedTiles[i]; // the index of the infected tile we're checking

        //     //check north west
        //     if(this.cityTiles[index - 21].isInfectable()){
        //         this.surroundingTiles.push(index - 21);
        //     }

        //     //check north
        //     if(this.cityTiles[index - 20].isInfectable()){
        //         this.surroundingTiles.push(index - 20);
        //     }

        //     //check north east
        //     if(this.cityTiles[index - 19].isInfectable()){
        //         this.surroundingTiles.push(index - 19);
        //     }

        //     //check west
        //     if(this.cityTiles[index - 1].isInfectable()){
        //         this.surroundingTiles.push(index - 1);
        //     }

        //     //check east
        //     if(this.cityTiles[index + 1].isInfectable()){
        //         this.surroundingTiles.push(index + 1);
        //     }

        //     //check south west
        //     if(this.cityTiles[index + 19].isInfectable()){
        //         this.surroundingTiles.push(index + 19);
        //     }

        //     //check south
        //     if(this.cityTiles[index + 20].isInfectable()){
        //         this.surroundingTiles.push(index + 20);
        //     }

        //     //check south east
        //     if(this.cityTiles[index + 21].isInfectable()){
        //         this.surroundingTiles.push(index + 21);
        //     }
        // }
    }

    runVirusTurn(){
        // Check to see if any special events will occur. If so, apply the effects.
        // Check which tiles are currently infected (greater than 0% infected).
        let newInfectedTiles = [];
        for(let i = 0; i < this.infectedTiles.length; i++){
            let index = infectedTiles[i];
            //calculates the total original population of the tile
            let totalPopulation = this.cityTiles[index].population + this.cityTiles[index].dead;
            //reads in the current population (including those infected)
            let currentPopulation = this.cityTiles[index].population;
            //reads in the current amount of infected people in the tile
            let infectedPeople = this.cityTiles[index].infected;
            //calculates the number of healthy people in the tile
            let healthyPeople = currentPopulation - infectedPeople;
            //reads in the current amount of dead people in the tile
            let deadPeople = this.cityTiles[index].dead;

            //virus statistics
            var infectivity = this.difficulty.infectivity + this.effects.infectivity;
            var severity = this.difficulty.severity + this.effects.severity;
            var lethality = this.difficulty.lethality + this.effects.lethality;

            //individual tile statistics
            var recoveryRate = this.cityTiles[index].recovery + this.effects.recovery;
            var newMorale = this.cityTiles[index].morale + this.effects.morale;

            // @TODO
            // add temporary action effects for infectivity, recoveryRate, morale, etc

            // Calculate how many new people are infected for each tile
            // If necessary, apply the effects of certain actions to the calculations.
            var newInfected = 0;
            if(healthyPeople > 0){
                newInfected = healthyPeople * infectivity;
            }  
            // Calculates the number of recovered people.
            // If necessary, apply the effects of certain actions to the calculations.
            var recovered = 0;
            var random = Math.random();
            if(infectedPeople > 0 && deadPeople != totalPopulation && random <= recoveryRate){
                recovered = infectedPeople * recoveryRate;
                // @TODO
                // add action effects here
            }
            // Calculate how many people die within each tile, if any.
            // If necessary, apply the effects of certain actions to the calculations.
            var died = 0;
            random = Math.random();
            if(infectedPeople > 0 && deadPeople != totalPopulation && random <= lethality){
                died = infectedPeople * lethality;
                // @TODO
                // add action effects here
            }
            // apply the number of newly infected/recovered
            newInfected = newInfected - recovered;
            //if the amount of new infected exceeds the amount of healthy people
            //change the amount of newly infected to the amount of healthy people remaining
            if(newInfected > healthyPeople){
                newInfected = healthyPeople;
            }
            infectedPeople = infectedPeople + newInfected - died;
            currentPopulation = currentPopulation - died;

            // If # of infected exceeds a certain ratio, check to see if the infection spreads to surrounding tiles.
            if(infectedPeople/currentPopulation > this.difficultyRatio){
                random = Math.random();
                // If the random # is equal to or less than the infected tile's infectivity rate,
                // pick a random tile and add a random number of infected to the tile.
                if(random <= this.infectedTiles[i].infectivity){
                    // @TODO
                    // pick a random tile to infect from the surrounding tiles.
                    // add that tile to the newInfectedTiles list
                    // pick a random number of people to be infected (between 1,000-2,000 * virus infectivity)
                }
            }

            // Calculate the new morale for the tile using severity and morality.
            // If necessary, apply the effects of certain actions to the calculations.
            newMorale = newMorale - (severity + deadPeople/totalPopulation) * 2;

            // Apply the new numbers to the tile.
            this.infectedTiles[i].population = currentPopulation;
            this.infectedTiles[i].infected = infectedPeople;
            this.infectedTiles[i].dead = died;
            this.infectedTiles[i].morale = newMorale;
        }
        // Calculate overall threat level based on infection, severity, and morality of the disease.
        // Check for losing conditions.
        // Increase the cure progress.
        // Randomly pick infectivity, severity, or morality to increase.
        // The different chances of values being increased are weighed in favor of infectivity > severity > morality.

        //@TODO
        // append the newInfectedTiles to infectedTiles and add the surrounding tiles to surroundingTiles
    }
}