(function() {

	// component Easy do nothing it's just for completeness of the api

	var Component = function(element, options) {
		this.options = options;
		this.$el = element;
	}

	$.extend(Component.prototype, {



		initialize: function() {

		},


		dispose: function() {
			console.clear();
		}



	});

	window.ComponentEasy = Component;

}());