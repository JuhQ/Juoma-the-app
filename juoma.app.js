$(document).ready(function(){
	var $document = $(this);
	$(".collapse").collapse();
	var gamelog = $(".gamelog"), errorModal = $("#error");
	var playerContainer = $(".player-container");
	var drinkContainer = $(".drink-container");
	var russianDropdown = $("#russianRouletteDropdown");
	var languages = $(".languages");
	russianDropdown.html('');
	for(i=1;i<=100;i++) {
		var selected = '';
		if(config.russianRouletteChances === i) {
			selected = 'selected="selected"';
		}
		russianDropdown.append('<option value="'+i+'" ' + selected + '">'+i+'%</option>');
	}
	$.each(i18n, function(i, item) {
		languages.append('<a href="#" data-lang="' + i + '">' + item.name + '</a> ');
	});

	if(typeof localStorage != "undefined") {
		if(localStorage.getItem("language") !== null) {
			config.language = localStorage.getItem("language");
		}
	}
	
	// check hash for possible players & drinks, possibility to share an "invitation" to a game by listing players and drinks
	if(window.location.hash.length > 0 && /\:/.test(window.location.hash)) {
		var array = window.location.hash.replace("#","").split(":");
		players = array[0].split(",");
		drinks = array[1].split(",");
	}
	
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
		if(players.length == 1) {
			$("html").addClass("forever-alone");
		} else {
			$("html").removeClass("forever-alone");
		}
	}
	function toggleCocktailHour() {
		var input = $("input[name='cocktails']");
		config.cocktails = input.is(":checked");
		if(config.cocktails === true) {
			if(drinks.length <= 1) {
				input.removeAttr("checked");
				config.cocktails = false;
				errorModal.find(".modal-body").html("You need more ingredients for a cocktail :(");
				errorModal.modal();
				return false;
			}
			$(".cocktail-rule").show();
			$(".collapse:not(.in)").collapse('show');
		} else {
			$(".cocktail-rule").hide();
		}
	}
	function toggleRussianRoulette() {
		var input = $("input[name='russianroulette']");
		config.russianroulette = input.is(":checked");
		$("#russianLabel").toggle();
	}

	toggleCocktailHour();
	toggleRussianRoulette();
	
	$document.on("change", "input[name='cocktails']", toggleCocktailHour);
	$document.on("change", "input[name='russianroulette']", toggleRussianRoulette);
	$document.on("change", "#russianRouletteDropdown", function() {
		config.russianRouletteChances = $(this).val();
	});
	
	$document.on("click", ".languages a", function(event) {
		event.preventDefault();
		config.language = $(this).data("lang");
		
		if(typeof localStorage != "undefined") {
			localStorage.setItem("language", config.language);
		}
	});
	$document.on("click", ".delete", function(event) {
		event.preventDefault();
		var $this = $(this);
		var value = $this.parent("span").find("span").text();
		var target = ($this.hasClass("delete-player") ? players : drinks);
		
		target.splice(target.indexOf(value),1);
		window.location.hash = players.join(",") + ":" + drinks.join(",");
		renderIngredient();
	});

	$document.on("click", ".roll", function(event) {
		event.preventDefault();
		roll();
	});
	$document.on("click", ".clear", function(event) {
		event.preventDefault();
		gamelog.empty();
		$(this).hide();
	});
	function roll() {
		$(".clear").show();
		var result = juoma();
		var winner = "<p><strong>" + result[result.length-1] + "</strong></p>";
		result.splice(result.length-1,1);
		result.push(winner);
		gamelog.html(result.join("<br/>"));
	}
	$document.on("submit", "form", function(event) {
		event.preventDefault();
		var $this = $(this);
		var value = $.trim($this.find("input").val());
		if(value === "") {
			errorModal.find(".modal-body").html("The form can't be empty!");
			errorModal.modal();
			return false;
		}
		$this.find("input").val("");
		($this.hasClass("players") ? players : drinks).push(value);
		window.location.hash = players.join(",") + ":" + drinks.join(",");
		renderIngredient();
	});
	
	$document.on("keydown", function(event) {
		if($("input:focus").length > 0) {
			return true;
		}

		// r = roll
		if(event.keyCode == 82) {
			roll();
		}
	});
});