define(['jquery','mixins.preloader','mixins.sound'], function($,MixinPreloader,MixinSound){

	var console = window.console;

	var Component = function(element, options) {
		console.debug('constructor', arguments);
		this.options = options;
		this.$el = element;
	};

	// MIXIN

	$.extend(Component.prototype, MixinPreloader);
	$.extend(Component.prototype, MixinSound);

	//extend prototype	

	$.extend(Component.prototype, {



		initialize: function() {
			console.debug('Menu initialize', arguments);

			this.populate();

		},


		populate: function(){
			console.debug('Menu populate');

			// leggo tutti gli elementi con class anno

				
		},

		createItem: function(data){
			console.debug('Menu populate');


				
		},


		dispose: function() {
			console.debug('Menu dispose');
		}



	});


	return Component;

});