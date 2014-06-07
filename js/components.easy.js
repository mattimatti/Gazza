define(['jquery','mixins.preloader','components.sound'], function($,MixinPreloader,ComponentSound){
	// component Easy do nothing it's just for completeness of the api

	var Component = function(element, options) {
		this.options = options;
		this.$el = $(element);
	};

	// MIXIN
	
	$.extend(Component.prototype, MixinPreloader);

	//extend prototype

	$.extend(Component.prototype, {



		initialize: function() {
			
			console.debug('ComponentEasy initialize');
		},


		dispose: function() {
		}



	});

	return Component;

})