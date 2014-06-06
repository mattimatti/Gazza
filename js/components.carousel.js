(function() {


	var Component = function(element, options) {
		this.$el = $(element);


		// Default options for the fade plugin

		this.defaults = {
			loop: true,
			delay: .5,
			duration: 1
		};

		// merge default options with
		this.options = $.extend(this.defaults, options);

	};

	$.extend(Component.prototype, {

		transitioning: false,

		frontVisible: true,

		imageIndex: -1,

		sound : null,

		initialize: function() {

			console.debug('ComponentCarousel::initialize');

			this.initSound();

			this.plugin = this.$el.find('.component');

			this.items = this.$el.find('.item');

			this.itemsCount = this.items.length;
			console.debug('this.itemsCount', this.itemsCount);

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
			console.debug('prepareItems');

			// hide all images
			this.items.hide();

			var self = this;

			this.items.each(function(index, item) {
				var element = $(item);
				element.css("position", "absolute");
				element.css("top", 0);
				element.css("left", 0);
				//element.css("zIndex", index);
				element.css("height", self.plugin.height());
				element.css("width", self.plugin.width());
			});


			// show teh first

			$(this.items.get(0)).show();

		},



		setupNextPair: function() {

			console.debug('setupNextPair');

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
			console.debug('clickComponent', this.frontVisible);
			this.setupNextPair();
			this.showNext();
			this.sound.playSound('click');
		},


		showNext: function() {

			console.debug('showNext', this.frontVisible, 'duration', this.options.duration);

			this.disposeTransitions();

			// show only current pair
			this.front.show().css('zIndex', 1001);
			this.back.show().css('zIndex', 1000);

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
			console.debug('onNextVisible frontVisible?', this.frontVisible);
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


		initSound : function(){
			this.sound = new window.ComponentSound();
			this.sound.registerSoundById('click');
		},


		disposeSound : function(){
			this.sound.removeAllSounds();
			delete this.sound;
		},


		dispose: function() {
			console.debug('dispose carousel');

			this.$el.off();

			this.stopLooping();
			this.disposeTransitions();

			this.setupNextPair();
			this.showNext();

			console.clear();

		}



	});

	window.ComponentCarousel = Component;

}());