define(['jquery', 'mixins.preloader', 'mixins.sound'], function($, MixinPreloader, MixinSound) {

	var console = window.console;

	var Component = function(element, options) {

		this.$el = $(element);

		this.elementId = this.$el.attr('id');

		// Default options for the fade plugin

		this.defaults = {
			loop: true,
			delay: 0,
			duration: 2,
			sound: null,
			datasrc: ""
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
				console.warn(this.elementId + ' Missing required element');
				return;
			}

			if (this.initialized) {
				console.error(this.elementId + ' Component already initialized exit');
				return;
			}

			this.initialized = true;

			console.info(this.elementId + ' ComponentFade initialize');

			this.initSound();


			// ensure we have no wrapper 
			this.disposeWrapper(this.$el.find(".force-h"));


			// hide the forst image
			this.originalImage = this.$el.find("img").first();
			this.originalImage.hide();


			this.buildImagesFormDatasource();


			//if interactive is set disable loop
			if (this.options.interactive) {
				this.options.loop = false;
			}

			// if no loop enable click
			if (this.options.interactive) {

				// slow down the animation duration
				this.options.duration /= 2;

				// assign click event
				this.wrapperObj.on('click', $.proxy(this.clickComponent, this));
				this.wrapperObj.addClass('interactive');

				this.initSound();
			}

			// if loopstart toggling
			if (this.options.loop) {
				this.toggleImage();
			}


		},


		buildImagesFormDatasource: function() {

			this.cntObj = $("<div/>").addClass('component min-h');


			// Build images from datasource

			this.pt_Img = this.options.datapt;
			this.Img_ar = this.options.datasrc.split(",");


			// get the front and back image
			this.front = $("<img>").attr('src', this.pt_Img + this.Img_ar[0]);
			// set the FRONT AND BACK elements as absolute
			this.front.css("position", "relative");
			this.front.css("top", 0);
			this.front.css("left", 0);
			this.cntObj.append(this.front);



			this.back = $("<img>").attr('src', this.pt_Img + this.Img_ar[1]);
			this.back.css("position", "absolute");
			this.back.css("top", 0);
			this.back.css("left", 0);
			this.cntObj.append(this.back);


			// create an outer wrapper
			this.wrapperObj = $("<div/>").addClass('force-h');
			this.wrapperObj.css("position", "relative");
			this.wrapperObj.append(this.cntObj);

			this.$el.prepend(this.wrapperObj);


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

			console.log('toggleImage', this.frontVisible);

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

			console.debug('showBack');

			self.transitioning = true;


			this.back.css('position', 'relative');
			this.front.css('position', 'absolute');

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

			console.debug('showFront');

			this.transitioning = true;

			this.front.css('position', 'relative');
			this.back.css('position', 'absolute');


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


		disposeWrapper: function(objWrapper) {
			if (objWrapper) {
				console.debug(this.elementId + ' ComponentFade disposeWrapper!');
				objWrapper.off();
				objWrapper.empty();
				objWrapper.remove();
				if (objWrapper) {
					console.error(this.elementId + ' ComponentFade still has wrapper!');
				}
			}

		},



		dispose: function() {

			if (!this.initialized) {
				console.warn(this.elementId + ' Component not initialized no dispose');
				return;
			}

			console.info(this.elementId + ' ComponentFade dispose');

			this.disposeSound();

			this.stopLooping();

			if (this.wrapperObj.length > 0) {
				this.disposeWrapper(this.wrapperObj);
			}

			// show the original image
			this.$el.find('img').first().show();

			delete this.$el;


		}



	});

	return Component;


});