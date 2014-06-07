(function() {


	var Component = function(element, options) {

		this.$el = $(element);

		// Default options for the reel plugin
		this.defaults = {
			images: null,
			cursor: 'default', // define the cursor
			draggable:false
		};

		// merge default options with
		this.options = $.extend(this.defaults, options);

	};

	// MIXIN
	
	$.extend(Component.prototype, window.MixinPreloader);

	//extend prototype

	$.extend(Component.prototype, {

		initialize: function() {


			if(this.options.interactive){
				this.options.cursor = 'pointer';
				this.options.draggable = true;
			}

			this.plugin = this.$el.find('.component');

			// override the size. plugin needs them explicitly
			this.plugin.attr("width", this.plugin.width());
			this.plugin.attr("height", this.plugin.height());


			console.debug('instance reel with options', this.options);
			// setup the plugin
			this.plugin.reel(this.options);
		},



		
		


		dispose: function() {

			if(this.plugin){
				this.plugin.unreel();
			}
			
		}



	});

	window.ComponentReel = Component;

}());
(function() {


	var Component = function(element, options) {
		this.$el = $(element);

		this.elementId = this.$el.attr('id');


		// Default options for the fade plugin

		this.defaults = {
			loop: true,
			delay: .5,
			duration: 1,
			sound: null
		};

		// merge default options with
		this.options = $.extend(this.defaults, options);

	};

	// MIXIN

	$.extend(Component.prototype, window.MixinPreloader);

	//extend prototype

	$.extend(Component.prototype, {

		transitioning: false,

		frontVisible: true,

		imageIndex: -1,

		sound: null,

		initialize: function() {



			this.initSound();

			this.plugin = this.$el.find('.component');

			this.items = this.$el.find('.item');

			this.itemsCount = this.items.length;
			console.debug('this.itemsCount', this.itemsCount);

			// if no items no carousel
			if (this.itemsCount === 0) {
				console.error("carousel must have at least one item");
				return;
			}

			

			console.error(this.elementId + ': Carousel initialize');

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
				element.css("height", self.plugin.height());
				element.css("width", self.plugin.width());


				console.debug('index', index, element.css('zIndex'));
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
			this.sound = new window.ComponentSound();
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
			

			if (this.plugin) {

				console.error(this.elementId + ': Carousel dispose');

				this.$el.off();

				this.stopLooping();
				this.disposeTransitions();

				this.prepareItems();

				this.imageIndex = -1;
				this.transitioning = false;
			}



		}



	});

	window.ComponentCarousel = Component;

}());
(function() {


	var Component = function(element, options) {

		this.$el = $(element);

		// Default options for the reel plugin
		this.defaults = {
			mode: 'fade',
			pager: false,
			controls:false,
			responsive:true,
			auto:true
		};

		// merge default options with
		this.options = $.extend(this.defaults, options);

	};

	// MIXIN
	
	$.extend(Component.prototype, window.MixinPreloader);

	//extend prototype

	$.extend(Component.prototype, {

		initialize: function() {


			if(this.options.interactive){
				this.options.auto = false;
				delete this.options.interactive;
			}

			delete this.options.sound;
			delete this.options.duration;

			console.debug('instance bxSlider with options', this.options);

			//console.debug(this.$el.find('.component'));
			///console.debug($('.component'));

			//this.plugin = $(this.$el.find('.component')).bxSlider(this.options);

			var parentId = this.$el.attr('id');

			 //this.plugin = $('.bxslider',this.$el).bxSlider(this.options);
			 this.plugin = $('.bxslider').bxSlider(this.options);
			//console.debug(this.plugin);

			

		},
		


		dispose: function() {

			if(this.plugin){
				//this.plugin.destroySlider();
			}
			
		}



	});

	window.ComponentCarousel = Component;

}());
(function() {

	// component Easy do nothing it's just for completeness of the api

	var Component = function(element, options) {
		this.options = options;
		this.$el = $(element);
	}

	// MIXIN
	
	$.extend(Component.prototype, window.MixinPreloader);

	//extend prototype

	$.extend(Component.prototype, {



		initialize: function() {
			
			console.debug('ComponentEasy initialize');
		},


		dispose: function() {
		}



	});

	window.ComponentEasy = Component;

}());
(function() {


	var Component = function(element, options) {

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

	// MIXIN
	
	$.extend(Component.prototype, window.MixinPreloader);

	//extend prototype	

	$.extend(Component.prototype, {

		transitioning: false,

		frontVisible: true,

		initialize: function() {

			this.plugin = this.$el.find('.component');

			if(!this.plugin){
				return;
			}

			
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

				this.initSound();
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
			console.debug('initSound', this.options.sound);
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
(function() {

	var Component = function(element, options) {
		console.debug('constructor', arguments);
		this.options = options;
		this.$el = element;
	}

	// MIXIN
	
	$.extend(Component.prototype, window.MixinPreloader);

	//extend prototype	

	$.extend(Component.prototype, {



		initialize: function() {
			console.debug('initialize', arguments);
		},


		dispose: function() {
			console.debug('dispose');
		}



	});


	window.ComponentMenu = Component;

}());
(function() {


	var Component = function(element, options) {

		this.$el = $(element);


		// Default options for the plugin
		this.defaults = {
			minScale: 0,
			hqSrc: null,
			maxZoom:1
		};

		// merge default options with
		this.options = $.extend(this.defaults, options);

	};

	// MIXIN
	
	$.extend(Component.prototype, window.MixinPreloader);

	//extend prototype	

	$.extend(Component.prototype, {

		// initial state
		zoomIn : false,

		originalImage : null,

		hqImage: null,

		initialize: function() {
			
			this.plugin = this.$el.find('.component');

			if(!this.plugin){
				return;
			}

			
			console.debug('initialize', arguments);

			this.initSound();

			// must be wrapped in a container div
			var container = $("<div class='pancontainer'></div>");
			container.attr("width", this.plugin.width());
			container.attr("height", this.plugin.height());
			container.css("width", this.plugin.width());
			container.css("height", this.plugin.height());
			this.plugin.wrap(container);

			this.originalimage = this.plugin.attr("src");
			console.debug("original", this.originalimage);


			if(this.options.hqSrc){
				this.hqImage = this.options.hqSrc;
			}else{
				this.hqImage = this.originalimage;
			}

			// setup interaction on double click
			// having interaction on click interferes with the pan

			// TODO: check on mobile.. 

			this.plugin.on("dblclick", $.proxy(this.clickComponent,this));
			this.plugin.addClass('interactive');

			console.debug('Instance plugin  panzoom with options', this.options);

			this.plugin.panzoom({});

		},


		clickComponent : function(){
			console.debug('clickComponent');
			this.sound.playSound('click');
			this.toggleZoom();
		},


		swapSource : function(newSource){
			this.plugin.attr("src",newSource);
		},

		// Toggle the zoom in the pan viewer
		toggleZoom: function() {
			console.debug('toggleZoom this.zoomIn' , this.zoomIn);
			if(!this.zoomIn){
				this.swapSource(this.hqImage);
				this.plugin.panzoom('zoom',this.options.maxZoom,{ animate: true });
				this.zoomIn = true;
			}else{
				this.plugin.panzoom('reset');
				this.zoomIn = false;
				this.swapSource(this.originalimage);
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

			this.disposeSound();

			if (this.plugin) {
				this.plugin.panzoom('reset');
				this.zoomIn = false;
				this.swapSource(this.originalimage);
				// remove click
				this.plugin.off();
				this.plugin.panzoom("destroy");
				this.plugin.unwrap();
			}
		}



	});

	window.ComponentPan = Component;

}());
	var instancesPool = [];

	var preloadAssets = function() {


	}


	var Modules = {

		'image-fade': {

			preload: function(a, b) {
				var obj = new window.ComponentFade(a, b);
				obj.preload();
				instancesPool[a.id] = obj;
			},
			init: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].initialize();
				}

			},
			remove: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].dispose();
				}
			}

		},

		'image-360': {

			preload: function(a, b) {
				var obj = new window.ComponentReel(a, b);
				obj.preload();
				instancesPool[a.id] = obj;
			},
			init: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].initialize();
				}

			},
			remove: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].dispose();
				}
			}
		},

		'video-clip': {

			preload: function(a, b) {
				var obj = new window.ComponentVideo(a, b);
				obj.preload();
				instancesPool[a.id] = obj;
			},
			init: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].initialize();
				}

			},
			remove: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].dispose();
				}
			}
		},

		'image-easy': {

			preload: function(a, b) {
				var obj = new window.ComponentEasy(a, b);
				obj.preload();
				instancesPool[a.id] = obj;

			},
			init: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].initialize();
				}

			},
			remove: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].dispose();
				}
			}

		},

		'image-pan': {

			preload: function(a, b) {
				var obj = new window.ComponentPan(a, b);
				obj.preload();
				instancesPool[a.id] = obj;

			},

			init: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].initialize();
				}

			},

			remove: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].dispose();
				}

			}

		},

		'carousel': {

			preload: function(a, b) {
				if (!instancesPool[a.id]) {
					var obj = new window.ComponentCarousel(a, b);
					obj.preload();
					instancesPool[a.id] = obj;
				}

			},

			init: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].initialize();
				}

			},

			remove: function(a, b) {
				if (instancesPool[a.id]) {
					instancesPool[a.id].dispose();
					delete instancesPool[a.id];
				}

			}

		}

	};

	// append behaviours
	$(".box").attr("data-emit-events", "data-emit-events");
	//$(".box").attr("data-top-bottom", "").attr("data-100-bottom", "").attr("data-bottom-top", "").attr("data-bottom", "");
	$(".box").attr("data-top-bottom", "").attr("data-bottom-top", "");
	
	skrollr.init({
		forceHeight: true,
		keyframe: function(element, name, direction) {
console.log( name, direction );

			var elm = Modules[element.getAttribute('obj-type')];
			var cfg = (element.getAttribute('obj-config'));

			// parse to json object
			cfg = $.parseJSON(cfg);

			//element.className='box skrollable '+direction;

			if (direction === 'down') {
				switch (name) {
					
					case 'dataTopBottom':
					console.log('REMOVE',element.id);
						elm.remove(element, cfg);
						break;
						
						
					case 'dataBottomTop':
					
					console.log('INIT',element.id);
					
						elm.preload(element, cfg);
						elm.init(element, cfg);
						break;	
					
					/*
					case 'dataTopBottom':
						elm.remove(element, cfg);
						break;
					case 'dataBottomTop':
					case 'dataBottom':
						elm.preload(element, cfg);
						break;
					default:
						elm.init(element, cfg);
						break;*/
				}
			} else {
				
				switch (name) {
					
					case 'dataTopBottom':
					console.log('INIT',element.id);
					
						elm.preload(element, cfg);
						elm.init(element, cfg);
						
						break;
						
						
					case 'dataBottomTop':
					
					console.log('REMOVE',element.id);
					
					elm.remove(element, cfg);
						break;	
					
					/*case 'data100Bottom':
						elm.remove(element, cfg);
						break;
					case 'dataBottomTop':
					case 'dataBottom':
						elm.preload(element, cfg);
						break;
					default:
						elm.init(element, cfg);
						break;*/
				}

			}

		}
	});
(function() {


	var DEFAULT_SOUND_ID = 'click';


	// component Easy do nothing it's just for completeness of the api

	var Component = function(options) {

		if (!options) {
			options = {};
		}

		this.defaults = {
			audioPath: "sounds/"
		};

		this.options = $.extend(this.defaults, options);

		this.initialize();

	};

	$.extend(Component.prototype, {


		initialize: function(){
			createjs.Sound.alternateExtensions = ["mp3"];
		},


		// register a sound full path
		registerSoundFullPath: function(fullPath, soundid) {

			// if no id default to 
			if(!soundid){
				soundid = DEFAULT_SOUND_ID;
			}

			console.debug('registerSoundFullPath', fullPath, soundid);

			createjs.Sound.registerSound(fullPath, soundid);
		},


		// register a sound just by id. the defalt folder 
		registerSoundById: function(soundid, customAudioPath) {

			var path = this.options.audioPath;
			var fullPath;

			if (customAudioPath) {
				path = customAudioPath;
			}
			
			fullPath = path + soundid + '.ogg';

			createjs.Sound.registerSound(fullPath, soundid);
		},



		// play an arbitrary sound
		playSound: function(soundId) {

			if(!soundId){
				soundId = DEFAULT_SOUND_ID;
			}

			if (!createjs.Sound.initializeDefaultPlugins()) {
				return;
			}

			createjs.Sound.play(soundId);
		},

		stopSound: function() {
			createjs.Sound.stop();
		},


		removeAllSounds: function() {
			if(createjs.Sound){
				try{
					createjs.Sound.removeAllSounds();
				}catch(e){
				}
				
			}
			
		}

	});

	window.ComponentSound = Component;

}());
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
(function() {


	var MixinPreloader = {

		preloaded: false,

		preload: function() {
			//

			if (!this.$el) {
				console.error('This component has no el');
				return;
			}

			if (this.preloaded) {
				this.initialize();
				return;
			}

			// for each element
			this.$el.find('*').each($.proxy(this.eachImage, this));

			this.preloaded = true;


		},


		// iterate all elements
		eachImage: function(index, element) {
			var item = $(element);
			if (item.attr("data-src") && item.attr("data-src") !== '') {
				this.preloadElement(item);
			}
		},


		preloadElement: function(item) {
			console.error('preloadElement', item);

			item.attr("src", item.attr("data-src"));

			var enableCallbacks = true;
			var timeout = null;
			var self = this;

			console.error('load Ajax', item.attr("data-src"));

			// $.ajax({
			// 	url:item.attr("data-src"),
			// 	beforeSend: function(xhr) {
			// 		timeout = setTimeout(function() {
			// 			xhr.abort();
			// 			enableCallbacks = false;
			// 			// Handle the timeout

			// 		}, 5000);
			// 	},
			// 	error: function(xhr, textStatus, errorThrown) {
			// 		clearTimeout(timeout);
			// 		if (!enableCallbacks) {
			// 			return;
			// 		}
			// 	},
			// 	success: function(data, textStatus) {
			// 		clearTimeout(timeout);
			// 		if (!enableCallbacks) {
			// 			return;
			// 		}

			// 	}
			// });

		},

		// once one element is loaded
		loadedElement: function(){
			console.error('loadedElement', arguments);
		},


		stopPreload: function() {
			console.error('stopPreload', arguments);

		}


	};


	window.MixinPreloader = MixinPreloader;

}());