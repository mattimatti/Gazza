(function() {


	var Component = function(element, options) {
		console.debug('ComponentFade constructor', arguments);
		this.$el = $(element);


		// Default options for the fade plugin
	
		this.defaults = {
			loop: true,
			delay: 0,
			duration: 2,
			sound:null
		};

		// merge default options with
		this.options = $.extend(this.defaults, options);

	};

	$.extend(Component.prototype, {

		transitioning: false,

		frontVisible: true,

		initialize: function() {

			this.plugin = this.$el.find('.component');

			if(!this.plugin){
				return;
			}

			console.clear();
			console.debug('ComponentFade initialize');

			this.initSound();


			// get the front and back image
			this.front = this.$el.find('.front').show();
			this.back = this.$el.find('.back').show();

			// set the image size explicitly
			this.front.attr("width", this.front.width());
			this.front.attr("height", this.front.height());

			// set the size of the container MANTAIN VERTICAL SPACING
			this.plugin.css("width", this.front.width());
			this.plugin.css("height", this.front.height());


			// set the FRONT AND BACK elements as absolute
			this.front.css("position", "absolute");
			this.front.css("top", 0);
			this.front.css("left", 0);
			this.front.css("height", this.plugin.height());
			this.front.css("width", this.plugin.width());


			this.back.css("position", "absolute");
			this.back.css("top", 0);
			this.back.css("left", 0);
			this.back.css("height", this.plugin.height());
			this.back.css("width", this.plugin.width());

			//if interactive is set disable loop
			if (this.options.interactive) {
				this.options.loop = false;
			}

			// if no loop enable click
			if (this.options.interactive) {
				// slow down the animation duration
				this.options.duration /= 2;
				// assign click event
				this.plugin.on('click', $.proxy(this.clickComponent, this));
				this.plugin.addClass('interactive');
			}

			// if loopstart toggling
			if (this.options.loop) {
				this.toggleImage();
			}


		},


		// the user click
		clickComponent : function(){
			console.debug('clickComponent');
			if(this.transitioning){
				return;
			}

			this.sound.playSound('click');
			this.toggleImage();
		},



		toggleImage: function() {
			// TODO: maybe tweenmax is excessive for this behaviour..

			console.debug('toggleImage', this.frontVisible);

			if (this.frontVisible) {
				this.showBack();
			} else {
				this.showFront();
			}
		},


		showBack: function() {

			var self = this;

			TweenMax.killTweensOf(this.front);
			TweenMax.killTweensOf(this.back);

			self.transitioning = true;
			TweenMax.to(this.front, this.options.duration, {
				alpha: 0
			});
			TweenMax.to(this.back, this.options.duration, {
				delay: this.options.delay,
				alpha: 1,
				onComplete: function() {
					self.frontVisible = false;
					self.transitioning = false;
					if (self.options.loop) {
						self.toggleImage();
					}
				}
			});

		},

		showFront: function() {

			var self = this;

			this.transitioning = true;

			TweenMax.killTweensOf(this.front);
			TweenMax.killTweensOf(this.back);

			TweenMax.to(this.front, this.options.duration, {
				alpha: 1
			});
			TweenMax.to(this.back, this.options.duration, {
				delay: this.options.delay,
				alpha: 0,
				onComplete: function() {
					self.frontVisible = true;
					self.transitioning = false;
					if (self.options.loop) {
						self.toggleImage();
					}
				}
			});

		},


		stopLooping: function() {
			if(this.options){
				this.options.loop = false;
			}
		},

		initSound : function(){
			if(this.options.sound){
			this.sound = new window.ComponentSound();
			this.sound.registerSoundFullPath('click', this.options.sound);
			}
		},


		disposeSound : function(){
			if(this.sound){
				this.sound.removeAllSounds();
				delete this.sound;
			}
		},

		dispose: function() {
			this.disposeSound();
			this.$el.off();
			this.stopLooping();
			if (!this.frontVisible) {
				this.showFront();
				this.back.hide();
			}

		}



	});

	window.ComponentFade = Component;


}());