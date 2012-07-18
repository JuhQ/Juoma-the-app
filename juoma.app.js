$(document).ready(function(){
	var $document = $(this);
	$(".collapse").collapse();
	var gamelog = $(".gamelog");
	var playerContainer = $(".player-container");
	var drinkContainer = $(".drink-container");
	
	renderIngredient();
	
	function renderIngredient() {
		playerContainer.html('');
		drinkContainer.html('');
		$.each(players, function(i, player) {
			playerContainer.append('<span><span>' + player + '</span><button type="button" class="close delete delete-player">x</button></span><br />');
		});
		$.each(drinks, function(i, drink) {
			drinkContainer.append('<span><span>' + drink + '</span><button type="button" class="close delete delete-drink">x</button></span><br />');
		});
	}
	function toggleCocktailHour() {
		config.cocktails = $("input[name='cocktails']").is(":checked");
		if(config.cocktails === true) {
			$(".cocktail-rule").show();
			$(".collapse:not(.in)").collapse('show');
		} else {
			$(".cocktail-rule").hide();
		}
	}

	toggleCocktailHour();
	$document.on("change", "input[name='cocktails']", toggleCocktailHour);

	$document.on("click", ".delete", function(event) {
		event.preventDefault();
		var $this = $(this);
		var value = $this.parent("span").find("span").text();
		var target = ($this.hasClass("delete-player") ? players : drinks);
		
		target.splice(target.indexOf(value),1);
		renderIngredient();
	});

	$document.on("click", ".roll", function(event) {
		event.preventDefault();
		var result = juoma();
		var winner = "<p><strong>" + result[result.length-1] + "</strong></p>";
		result.splice(result.length-1,1);
		result.push(winner);
		gamelog.html(result.join("<br/>"));
	});
	
	$document.on("submit", "form", function(event) {
		event.preventDefault();
		var $this = $(this);
		var value = $.trim($this.find("input").val());
		if(value === "") {
			$('#error').modal();
			return false;
		}
		$this.find("input").val("");
		($this.hasClass("players") ? players : drinks).push(value);
		renderIngredient();
	});
	
});