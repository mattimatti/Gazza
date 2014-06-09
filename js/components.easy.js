define(['jquery','mixins.preloader','mixins.sound'], function($,MixinPreloader,MixinSound){
	
	var console = window.console;

	var Component = function(element, options) {
		this.options = options;
		this.$el = $(element);
		this.elementId = this.$el.attr('id');
	};

	// MIXIN
	
	$.extend(Component.prototype, MixinPreloader);
	$.extend(Component.prototype, MixinSound);

	//extend prototype

	$.extend(Component.prototype, {



		initialize: function() {

			if(this.initialized){
				console.warn(this.elementId + ' Component already initialized exit');
				return;
			}
			this.initialized = true;
			
			console.info(this.elementId + ' ComponentEasy initialize');
			

			if(this.options.sound){
				this.$el.hammer().on("tap",$.proxy(this.clickComponent, this));
				this.$el.on("click", $.proxy(this.elementClick,this));
				this.$el.addClass("interactive");
			}
		},


		elementClick: function(){
			console.debug(this.elementId + ' ComponentEasy elementClick');
			this.initSound();
			this.playSound();
		},


		dispose: function() {
			if(!this.initialized){
				console.warn(this.elementId + ' Component not initialized no dispose');
				return;
			}
			this.disposeSound();
			this.$el.off();
			this.$el.hammer().off();
			console.info(this.elementId + ' ComponentEasy dispose');
			delete this.$el;
			delete this.options;
		}



	});

	return Component;

});