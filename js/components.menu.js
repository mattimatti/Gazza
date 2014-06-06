(function() {

	var Component = function(element, options) {
		console.debug('constructor', arguments);
		this.options = options;
		this.$el = element;
	}

	$.extend(Component.prototype, {



		initialize: function() {
			console.debug('initialize', arguments);
		},


		dispose: function() {
			console.debug('dispose');
		}



	});


	window.ComponentMenu = Component;

}());