define(['jquery','mixins.preloader','mixins.sound'], function($,MixinPreloader,MixinSound){
	
	var console = window.console;

	if(window.REMOVECONSOLE){
		console = window.muteConsole;
	}	

	var ComponentEasy = function(element, options) {
		
		this.$el = $(element);
		this.elementId = this.$el.attr('id');

		this.defaults = {
			interactive: false,
			sound: null
		};

		// merge default options with
		this.options = $.extend(this.defaults, options);

	};

	// MIXIN
	
	$.extend(ComponentEasy.prototype, MixinPreloader);
	$.extend(ComponentEasy.prototype, MixinSound);

	//extend prototype

	$.extend(ComponentEasy.prototype, {



		initialize: function() {

			if(this.initialized){
				console.warn(this.elementId + ' Component already initialized exit');
				return;
			}
			this.initialized = true;
			
			console.info(this.elementId + ' ComponentEasy initialize');


			if(this.options.sound){
				this.options.interactive  = true;
			}

			if(this.options.soundControls){
				this.initSound();
			}
			

			if(this.options.interactive){
				this.$el.hammer();
				//this.$el.on("tap",$.proxy(this.elementClick, this));
				this.$el.on("click", $.proxy(this.elementClick,this));
				this.$el.addClass("interactive");
			}
		},


		elementClick: function(event){
			console.debug(this.elementId + ' ComponentEasy elementClick', event);

			if(this.options.soundControls){
				// prevent overlapping commands
				try{
					if($(event.target).hasClass("playSound")){
						return;
					}
				}catch(soundex){}
			}
			


			this.initSound();
			this.playSound();
		},


		dispose: function() {
			if(!this.initialized){
				console.warn(this.elementId + ' ComponentEasy not initialized no dispose');
				return;
			}
			this.disposeSound();
			this.disposeEventsSafe();
			console.info(this.elementId + ' ComponentEasy dispose');
			delete this.$el;
			delete this.options;
		}



	});

	return ComponentEasy;

});