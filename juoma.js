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

// configuration
var config = {cocktails: false, russianroulette: false, russianRouletteChances: 25, language: "en"};

// don't edit under this line :(
var i18n = {en:{name:"English"},fi:{name:"Suomi"},se:{name:"Svenska"}};
var juoma = function() {
	var playerCount = players.length;
	var drinkLength = drinks.length-1;
	
	// yay translations!
	i18n.en.classic = "%player rolls %roll for drink %drink";
	i18n.en.cocktails = "%player rolls %roll, ingredients: %ingredients";
	i18n.en.russianroulette = "%player, even though you rolled %roll, you don't get to drink this time!";

	i18n.fi.classic = "%player rollasi %roll juomalle %drink";
	i18n.fi.cocktails = "%player rollasi %roll, drinkin ainekset: %ingredients";
	i18n.fi.russianroulette = "%player, vaikka rollasit %roll, et pääse juomaan tällä kierroksella!";

	i18n.se.classic = "%player kastar %roll för drycken %drink";
	i18n.se.cocktails = "%player kastar %roll, ingredienser: %ingredients";
	i18n.se.russianroulette = "%player, fast du kastade %roll, får du inte dricka denna tur!";

	// chances can't be more than 100%
	if(config.russianRouletteChances>100) {
		config.russianRouletteChances = 100;
	}

	function juoma() {
		var game = [];
		var winner = 0;
		var winnerString = '', winnerName = '', winnerDrink = '';
		while(playerCount--) {
			var roll = rand(0, 100), string;
			
			// if "Cocktail hour" enabled and at least two drinks added
			if(config.cocktails === true && drinkLength >= 2) {
				string = cocktails(roll);
			} else {
				string = classic(roll);
			}
			
			if(config.russianroulette === true) {
				if(rand(0,100) <= config.russianRouletteChances) {
					string = russianRoulette(roll);
				}
			}
			
			if(roll > winner) {
				winner = roll;
				winnerString = string.str;
				winnerName = string.player;
				winnerDrink = string.drink;
			}
			
			// support for addons, for example frontend version
			game.push(string.str);
			
			// print game situation if running from cli
			if(typeof window == "undefined" && typeof console != "undefined") {
				// print this to console so that node.js will print something ;)
				console.log(string.str);
			}
		}

		if(typeof window == "undefined" && typeof console != "undefined") {
			console.log("WINNER: " + winnerString);
		}
		game.push("WINNER: " + winnerString);
		
		// log winner
		log(winnerName, winner, winnerDrink);
		
		return game;
	}
	
	/**
	 * Classic roll
 	 * @param int roll
	 */
	function classic(roll) {
		var str = i18n[config.language].classic, drink = drinks[rand(0, drinkLength)], player = players[playerCount], find = ["%player", "%roll", "%drink"], replace = [player, roll, drink];
		for(i in find) str = str.replace(find[i],replace[i]);
		return {str:str,drink:drink,player:player};
	}
	
	/**
	 * Russian roulette roll
	 * @param int roll 
	 */
	function russianRoulette(roll) {
		var str = i18n[config.language].russianroulette, player = players[playerCount], find = ["%player", "%roll"], replace = [player, roll];
		for(i in find) str = str.replace(find[i],replace[i]);
		return {str:str,player:player,drink:"no drink"};
	}
	
	/**
	 * Cocktail roll, yay for cocktails!
	 * The player with the highest roll must drink the cocktail they are given
 	 * @param int roll
	 */
	function cocktails(roll) {
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
		
		var str = i18n[config.language].cocktails, player = players[playerCount], ingredientStr = final.join(", "), find = ["%player", "%roll", "%ingredients"], replace = [player, roll, ingredientStr];
		for(i in find) str = str.replace(find[i],replace[i]);
		return {str:str, player: player, drink: ingredientStr};
	}
	
	function rand(min, max) {
		return min + Math.round(Math.random() * (max-min));
	}
	
	// log winner if localStorage enabled, will not work on node.js, need to implement database
	function log(winner, roll, drink) {
		if(typeof localStorage == "undefined") {
			return false;
		}
		
		var db = "drinkingGame";
		if(localStorage.getItem(db) === null) {
			localStorage.setItem(db, JSON.stringify([]));
		}
		
		var log = JSON.parse(localStorage.getItem(db));
		log.push({winner:winner, roll:roll, drink:drink, time: new Date()});
		localStorage.setItem(db, JSON.stringify(log));
	}
	
	return juoma();
};

// ROLL!
var game = juoma();
