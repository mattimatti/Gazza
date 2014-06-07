define(['jquery', 'mixins.preloader', 'components.sound'], function($, MixinPreloader, ComponentSound) {


	var Component = function(element, options) {

		this.$el = $(element);

		// Default options for the fade plugin

		this.defaults = {
			loop: true,
			delay: 0,
			duration: 2,
			sound: null
		};

		// merge default options with
		this.options = $.extend(this.defaults, options);

	};

	// MIXIN

	$.extend(Component.prototype, MixinPreloader);

	//extend prototype	

	$.extend(Component.prototype, {

		transitioning: false,

		frontVisible: true,

		initialize: function() {

			this.plugin = this.$el.find('.component');

			if (!this.plugin) {
				return;
			}


			console.debug('ComponentFade initialize', this.options.datasrc.split(","));

			this.initSound();



			this.pt_Img = this.options.datapt;
			this.Img_ar = this.options.datasrc.split(",");



			// get the front and back image
			this.front = $("<img>"); //this.$el.find('.front').show();
			this.front.attr('src', this.pt_Img + this.Img_ar[0]);


			this.back = $("<img>"); //this.$el.find('.front').show();
			this.back.attr('src', this.pt_Img + this.Img_ar[1]);


			this.wrapper_ = $("<div/>").addClass('force-h');
			this.cnt_ = $("<div/>").addClass('component min-h');



			// set the FRONT AND BACK elements as absolute
			this.front.css("position", "absolute");
			this.front.css("top", 0);
			this.front.css("left", 0);



			this.back.css("position", "absolute");

			this.back.css("top", 0);
			this.back.css("left", 0);


			this.cnt_.append(this.front);
			this.cnt_.append(this.back);
			this.wrapper_.append(this.cnt_);

			this.$el.prepend(this.wrapper_);

			this.$el.addClass('is_loaded');


			this.wrapper_.next('img').hide();

			console.log('--->', this.wrapper_);



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

				this.initSound();
			}

			// if loopstart toggling
			if (this.options.loop) {
				this.toggleImage();
			}


		},


		// the user click
		clickComponent: function() {
			console.debug('clickComponent');

			if (this.transitioning) {
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
			if (this.options) {
				this.options.loop = false;
			}
		},

		initSound: function() {
			console.debug('initSound', this.options.sound);
			this.sound = new ComponentSound();
			if (this.options.sound) {
				this.sound.registerSoundFullPath(this.options.sound);
			}
		},


		disposeSound: function() {
			if (this.sound) {
				this.sound.removeAllSounds();
				delete this.sound;
			}
		},

		dispose: function() {
			this.disposeSound();
			this.$el.off();
			this.stopLooping();
			this.wrapper_.next('img').show();
			this.wrapper_.remove();
			/*if (!this.frontVisible) {
				this.showFront();
				this.back.hide();
			}*/

		}



	});

	return Component;


});