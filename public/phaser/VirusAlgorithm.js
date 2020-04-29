class VirusAlgorithm {
    /*
    * Takes in a value initialTiles to initialize the virus algorithm.
    * initialTiles : Tile array
    * tileArray : Tile array, the whole map.
    * difficultyRatio : the % at which the algorithm checks if the disease spreads to another tile. Based on game difficulty.
    * game : Game. Contains important global game data for this algorithm to use.
    * Adds the initialTiles to an array of infectedTiles
    */
    constructor(initialTiles, tileArray, difficultyRatio, game){
        this.game = game;
        this.infectedTiles = [];
        this.map = tileArray;
        this.difficultyRatio = difficultyRatio;
        for(let i = 0; i < initialTiles.length; i++){
            this.infectedTiles.push(initialTiles[i]);
        }
        //@TODO
        //calculate the tiles surrounding the infected tiles and adds them to a list.
        //if the tile is not infectable, do NOT add it to the list.
        this.surroundingTiles = [];
    }

    runVirusTurn(){
        // Check to see if any special events will occur. If so, apply the effects.
        // Check which tiles are currently infected (greater than 0% infected).
        var newInfectedTiles = [];
        for(let i = 0; i < this.infectedTiles.length; i++){
            //calculates the total original population of the tile
            var totalPopulation = this.infectedTiles[i].population + this.infectedTiles[i].dead;
            //reads in the current population (including those infected)
            var currentPopulation = this.infectedTiles[i].population;
            //reads in the current amount of infected people in the tile
            var infectedPeople = this.infectedTiles[i].infected;
            //calculates the number of healthy people in the tile
            var healthyPeople = currentPopulation - infectedPeople;
            //reads in the current amount of dead people in the tile
            var deadPeople = this.infectedTiles[i].dead;

            var infectivity = this.game.gameData.infectivity;
            var severity = this.game.gameData.severity;
            var lethality = this.game.gameData.lethality;
            var recoveryRate = this.infectedTiles[i].recovery;
            var newMorale = this.infectedTiles[i].morale;

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
        // loop end.
        // Calculate overall threat level based on infection, severity, and morality of the disease.
        // Check for losing conditions.
        // Increase the cure progress.
        // Randomly pick infectivity, severity, or morality to increase.
        // The different chances of values being increased are weighed in favor of infectivity > severity > morality.

        //@TODO
        // append the newInfectedTiles to infectedTiles and add the surrounding tiles to surroundingTiles
    }
}