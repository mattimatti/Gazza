define(['jquery','mixins.preloader','components.sound'], function($,MixinPreloader,ComponentSound){
	

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