(function() {

	var Component = function(element, options) {

		this.$el = $(element);

		// Default options for the plugin
		this.defaults = {
			autoplay: true,
			interactive: false,
			controls: false,
			preload: 'none',
			sound:null
		};

		// merge default options with
		this.options = $.extend(this.defaults, options);
	}

	// MIXIN
	
	$.extend(Component.prototype, window.MixinPreloader);

	//extend prototype

	$.extend(Component.prototype, {



		initialize: function() {

			//var $video = this.$el.find('video');
		
			this.video =this.options.id //this.$el.find('.video-js').get(0);

console.debug('video initialize',this.options.id);

			if (!this.options.id) {
				return;
			}



			//
			

			// if interactive set autoplay at false
			if (this.options.interactive) {
				this.options.autoplay = false;
			}


			//instance the videojs object
			this.plugin = videojs(this.options.id, this.options).ready($.proxy(this.checkInteract, this));
			
			
			


			// make the video interactive on click
		



		},
		
		checkInteract:function(){
				if (this.options.interactive) {
					this.$el.on("click", $.proxy(this.toggleVideoPlayback, this));
					this.$el.addClass('interactive');
					//this.initSound();
					console.log('VID')
				} else {
					this.plugin.play();
				}
			
			},


		toggleVideoPlayback: function() {
			if (!this.plugin) {
				console.error("clicking a video not inited");
			}

			this.initSound();
			this.sound.playSound('click');

			// put it in try catch.. if the video is not playing fires an error..
			// HTML5 full of Bullshit .

			var isPaused = true;
			try {
				isPaused = this.plugin.paused();
			} catch (e) {}

			console.debug("toggleVideoPlayback", this.plugin, this.plugin.paused());
			if (!isPaused) {
				this.plugin.pause();
			} else {
				this.plugin.play();
			}

		},

		initSound : function(){
			this.sound = new window.ComponentSound();
			if(this.options.sound){
				this.sound.registerSoundFullPath(this.options.sound);
			}
		},


		disposeSound : function(){
			if(this.sound){
				this.sound.removeAllSounds();
				delete this.sound;
			}
		},

		dispose: function() {

			if (this.plugin) {
				this.disposeSound();
				
				console.log('--->',this.plugin);
				
				try{
					this.plugin.pause();
				this.plugin.currentTime(0);
				this.plugin.controlBar.hide();
				this.plugin.controls(false);
				this.$el.off();
					
					}catch(e){
						
						
						}
			  
				
				
				//this.plugin.dispose();
			}
			
			delete this.$el;
			delete this.plugin;

		}



	});


	window.ComponentVideo = Component;

}());