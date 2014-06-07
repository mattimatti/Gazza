(function() {

	// component Easy do nothing it's just for completeness of the api

	var Component = function(element, options) {
		this.options = options;
		this.$el = $(element);
	};

	// MIXIN
	
	$.extend(Component.prototype, window.MixinPreloader);

	//extend prototype

	$.extend(Component.prototype, {



		initialize: function() {
			
			console.debug('ComponentEasy initialize');
		},


		dispose: function() {
		}



	});

	window.ComponentEasy = Component;

}());