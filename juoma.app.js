$(document).ready(function(){
	var $document = $(this);
	$(".collapse").collapse();
	var log = $(".gamelog");
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

	$document.on("click", ".delete", function(event) {
		event.preventDefault();
		var $this = $(this);
		var value = $this.parent("span").find("span").text();
		console.log(value);
		var target = ($this.hasClass("delete-player") ? players : drinks);
		
		target.splice(target.indexOf(value),1);
		renderIngredient();
	});

	$document.on("click", ".roll", function(event) {
		event.preventDefault();
		log.html(juoma().join("<br/>"));
	});
	$document.on("submit", "form", function(event) {
		event.preventDefault();
		var $this = $(this);
		var value = $.trim($this.find("input").val());
		if(value === "") {
			$('#error').modal();
			return false;
		}
		($this.hasClass("players") ? players : drinks).push(value);
		renderIngredient();
	});
	
});