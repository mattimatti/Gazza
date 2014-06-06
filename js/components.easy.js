(function() {

	// component Easy do nothing it's just for completeness of the api

	var Component = function(element, options) {
		this.options = options;
		this.$el = element;
	}

	$.extend(Component.prototype, {



		initialize: function() {
			console.clear();
			console.debug('ComponentEasy initialize');
		},


		dispose: function() {
		}



	});

	window.ComponentEasy = Component;

}());