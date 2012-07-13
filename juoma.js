/*
 * This is a simple drinking game. Juoma means "a drink" in Finnish.
 * Rules are simple:
 *   - List players
 *   - List available drinks
 *   - The person with the highest number has to drink the drink provided by the game, player can decide portion size
 *   - If you puke or pass out, you lose
 *   - If a drink runs out, it must be removed from the drink list
 *   - Last one who's not thrown up or passed out, IS THE WINNER!
 *   - Do not die
 *   - Have fun
 *
 *  Juha Tauriainen @juha_tauriainen juha@bin.fi
 *  https://github.com/JuhQ/juoma.js
 */

// list players here
var players = ["Juha", "Pekka", "Timo", "Liisa", "Maija"];

// list drinks here
var drinks = ["Beer", "Koskenkorva", "Whiskey", "Milk"];



// don't edit under this line :(
function juoma() {
	var game = [];
	var winner = 0;
	var winnerString = '';
	var playerCount = players.length;
	var drinkLength = drinks.length;
	while(playerCount--) {
		var random = Math.floor(Math.random() * 100);
		var randomDrink = Math.floor(Math.random() * drinkLength);
		
		var string = players[playerCount] + " rolls " + random + " for drink " + drinks[randomDrink];
		
		if(random > winner) {
			winnerString = string;
			winner = random;
		}
		
		// support for addons, for example frontend version
		game.push(string);
	
		if(typeof console != "undefined") {
			// print this to console so that node.js will print something ;)
			console.log(string);
		}
	}
	

	if(typeof console != "undefined") {
		console.log("WINNER: " + winnerString);
	}
	game.push("WINNER: " + winnerString);
	
	return game;
}

// ROLL!
var game = juoma();
