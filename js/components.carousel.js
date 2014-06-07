define(['jquery', 'mixins.preloader', 'components.sound'], function($, MixinPreloader, ComponentSound) {


	var Component = function(element, options) {
		this.$el = $(element);

		this.elementId = this.$el.attr('id');


		// Default options for the fade plugin

		this.defaults = {
			loop: true,
			delay: 0.5,
			duration: 1,
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

		imageIndex: -1,

		sound: null,

		initialize: function() {


			this.plugin = this.$el.find('.component');


			if(!this.plugin){
				console.error("component not found");
				return;
			}

			this.items = this.$el.find('.item');

			this.itemsCount = this.items.length;

			console.debug('this.itemsCount', this.itemsCount);

			// if no items no carousel
			if (this.itemsCount === 0) {
				console.error("carousel must have at least one item");
				return;
			}


			this.initSound();

			console.info(this.elementId + ': Carousel initialize');

			var firstElement = $(this.items.get(0));

			firstElement.css("width", firstElement.width());
			firstElement.css("height", firstElement.height());


			// set the size of the container MANTAIN VERTICAL SPACING
			this.plugin.css("width", $(this.items.get(0)).width());
			this.plugin.css("height", $(this.items.get(0)).height());


			this.prepareItems();

			// setup which will be the first pair



			//if interactive is set disable loop
			if (this.options.interactive) {
				this.options.loop = false;
			}

			// if no loop enable click
			if (this.options.interactive) {
				// assign click event
				this.$el.on('click', $.proxy(this.clickComponent, this));
				this.$el.addClass('interactive');
			}

			// if loopstart toggling
			if (this.options.loop) {
				this.setupNextPair();
				this.showNext();
			}


		},

		prepareItems: function() {
			console.debug(this.elementId + ':prepareItems');

			if (!this.items) {
				this.items = this.$el.find('.item');
			}

			// hide all images
			this.items.hide();

			var self = this;

			this.items.each(function(index, item) {
				var element = $(item);
				element.css("position", "absolute");
				element.css("top", 0);
				element.css("left", 0);
				element.css("zIndex", self.items.length - 1 - index);

				// check if plugin exists
				if(self.plugin){
					element.css("height", self.plugin.height());
					element.css("width", self.plugin.width());
				}
			});



			// show the first

			$(this.items.get(0)).show().fadeTo(0, 1).css('zIndex', 1001);

		},



		setupNextPair: function() {

			console.debug(this.elementId + ':setupNextPair');

			if (this.imageIndex + 1 >= this.itemsCount) {
				this.imageIndex = -1;
			}

			this.imageIndex++;

			var frontIndex = this.imageIndex;
			var backIndex = this.imageIndex + 1;

			if (backIndex >= this.itemsCount) {
				backIndex = 0;
			}

			console.debug('will transition from ', frontIndex, ' to ', backIndex);

			this.front = $(this.items.get(frontIndex));
			this.back = $(this.items.get(backIndex));

			// hide all 
			this.items.hide();
		},


		// the user click
		clickComponent: function() {
			if (this.transitioning) {
				return;
			}
			console.debug(this.elementId + ':clickComponent', this.frontVisible);
			this.setupNextPair();
			this.showNext();
			this.sound.playSound('click');
		},


		showNext: function() {

			console.debug(this.elementId + ': showNext', this.frontVisible, 'duration', this.options.duration);

			this.disposeTransitions();

			// show only current pair
			this.front.show().css('zIndex', 1001);
			this.back.show().css('zIndex', 1000);

			this.transitioning = true;

			TweenMax.to(this.front, this.options.duration, {
				alpha: 0,
				delay: this.options.delay
			});

			TweenMax.to(this.back, this.options.duration, {
				delay: this.options.delay,
				alpha: 1,
				onComplete: $.proxy(this.onNextVisible, this)
			});

		},

		onNextVisible: function() {

			this.frontVisible = false;
			console.debug(this.elementId + ':onNextVisible frontVisible?', this.frontVisible);
			this.transitioning = false;
			if (this.options.loop) {
				this.setupNextPair();
				this.showNext();
			}

		},


		disposeTransitions: function() {
			TweenMax.killTweensOf(this.front);
			TweenMax.killTweensOf(this.back);
		},


		stopLooping: function() {
			if (this.options.loop) {
				this.options.loop = false;
			}
		},


		initSound: function() {
			console.error(this.sound);
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


			console.info(this.elementId + ': Carousel dispose');
			
			try {

				this.disposeSound();

				this.$el.off();

				this.$el.removeClass('interactive');

				this.stopLooping();
				this.disposeTransitions();

				this.prepareItems();

				this.imageIndex = -1;
				this.transitioning = false;

			} catch (ex) {
				console.error(this.elementId + ': Error in Carousel dispose');
				console.error(ex);
			}



		}



	});

	return Component;

});