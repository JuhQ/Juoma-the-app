/*
 * juoma.js v1.1, the cocktail hour
 * 
 * This is a simple drinking game. Juoma means "a drink" in Finnish.
 * Rules are simple:
 *   - List players
 *   - List available drinks
 *   - The person with the highest number has to drink the drink provided by the game,
 *       player can decide portion size
 *   - If you puke or pass out, you lose
 *   - If a drink runs out, it must be removed from the drink list
 *   - Last one who's not thrown up or passed out, IS THE WINNER!
 *   - Do not die
 *   - Have fun
 *
 *  Juha Tauriainen @juha_tauriainen juha@bin.fi
 *  https://github.com/JuhQ/juoma.js
 *  By playing this game you acknowledge that I am not responsible if you die. Drink responsibly!
 */

// list players here
var players = ["Juha", "Pekka", "Timo", "Liisa", "Maija"];

// list drinks here
var drinks = ["Beer", "Koskenkorva", "Whiskey", "Milk"];

// enable "the cocktail hour" -mode
var config = {cocktails: false};

// don't edit under this line :(
var juoma = function() {
	var playerCount = players.length;
	var drinkLength = drinks.length-1;
	function juoma() {
		var game = [];
		var winner = 0;
		var winnerString = '';
		while(playerCount--) {
			var random = rand(0, 100);
			
			// if "Cocktail hour" enabled and at least two drinks added
			if(config.cocktails === true && drinkLength >= 2) {
				var string = cocktails(random);
			} else {
				var string = classic(random);
			}
				
			if(random > winner) {
				winnerString = string;
				winner = random;
			}
			// support for addons, for example frontend version
			game.push(string);
			
			// print game situation if running from cli
			if(typeof window == "undefined" && typeof console != "undefined") {
				// print this to console so that node.js will print something ;)
				console.log(string);
			}
		}

		if(typeof window == "undefined" && typeof console != "undefined") {
			console.log("WINNER: " + winnerString);
		}
		game.push("WINNER: " + winnerString);
		
		return game;
	}
	
	/**
	 * Classic roll
 	 * @param int random
	 */
	function classic(random) {
		return players[playerCount] + " rolls " + random + " for drink " + drinks[rand(0, drinkLength)];
	}
	
	/**
	 * Cocktail roll, yay for cocktails!
	 * The player with the highest roll must drink the cocktail they are given
 	 * @param int random
	 */
	function cocktails(random) {
		var randomAmount = rand(2,drinkLength+1);
		
		var ingredients = [], recipe = {};
		
		// first get drinks, duplicates are are ok, as one drink is one part of the final cocktail
		for(i = 1; i <= randomAmount; i++) {
			var drink = drinks[rand(0, drinkLength)];
			ingredients.push(drink);
		}
		
		var totalIngredients = ingredients.length-1
		for(i = 0; i <= totalIngredients; i++) {
			var drink = ingredients[i], part = 0;
			for(j = 0; j <= totalIngredients; j++) {
				if(ingredients[j] === drink) {
					++part;
				}
			}

			recipe[drink] = (part + "/" + randomAmount + " " + drink);
		}

		var final = [];
		for(i in recipe) {
			final.push(recipe[i]);
		}
		
		return players[playerCount] + " rolls " + random + ", ingredients: " + final.join(", ");
	}
	
	function rand(min, max) {
		return min + Math.round(Math.random() * (max-min));
	}
	
	return juoma();
};

// ROLL!
var game = juoma();
