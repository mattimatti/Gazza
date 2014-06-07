define(['jquery', 'mixins.preloader', 'mixin.sound'], function($, MixinPreloader, MixinSound) {


	var Component = function(element, options) {

		this.$el = $(element);

		this.elementId = this.$el.attr('id');

		// Default options for the fade plugin

		this.defaults = {
			loop: true,
			delay: 0,
			duration: 2,
			sound: null,
			datasrc:""
		};

		// merge default options with
		this.options = $.extend(this.defaults, options);

	};

	// MIXIN

	$.extend(Component.prototype, MixinPreloader);
	$.extend(Component.prototype, MixinSound);

	//extend prototype	

	$.extend(Component.prototype, {

		transitioning: false,

		frontVisible: false,

		initialize: function() {

			this.plugin = this.$el.find('.component');

			if (!this.plugin) {
				return;
			}


			console.info(this.elementId + ' ComponentFade initialize');

			this.initSound();



			this.pt_Img = this.options.datapt;
			this.Img_ar = this.options.datasrc.split(",");



			// get the front and back image
			this.front = $("<img>").attr('src', this.pt_Img + this.Img_ar[0]);


			this.back = $("<img>").attr('src', this.pt_Img + this.Img_ar[1]);


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


			//if interactive is set disable loop
			if (this.options.interactive) {
				this.options.loop = false;
			}

			// if no loop enable click
			if (this.options.interactive) {
				
				// slow down the animation duration
				this.options.duration /= 2;

				// assign click event
				this.wrapper_.on('click', $.proxy(this.clickComponent, this));
				this.wrapper_.addClass('interactive');

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

			console.error('toggleImage', this.frontVisible);

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

			console.error('showBack');

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



			TweenMax.killTweensOf(this.front);
			TweenMax.killTweensOf(this.back);

			console.error('showFront');

			this.transitioning = true;

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


		dispose: function() {


			console.info(this.elementId + ' ComponentFade dispose');

			this.disposeSound();
			
			this.stopLooping();

			if (this.wrapper_.length > 0 ) {
				this.wrapper_.off();
				this.wrapper_.next('img').show();
				this.wrapper_.empty();
				this.wrapper_.remove();
				delete this.wrapper_;
				if(this.wrapper_){
					console.error('still has wrapper!');
				}
			}

			delete this.$el;

			console.debug(this);

		}



	});

	return Component;


});