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
/*! skrollr 0.6.25 (2014-05-24) | Alexander Prinzhorn - https://github.com/Prinzhorn/skrollr | Free to use under terms of MIT license */
(function(e,t,r){"use strict";function n(r){if(o=t.documentElement,a=t.body,K(),it=this,r=r||{},ut=r.constants||{},r.easing)for(var n in r.easing)U[n]=r.easing[n];yt=r.edgeStrategy||"set",ct={beforerender:r.beforerender,render:r.render,keyframe:r.keyframe},ft=r.forceHeight!==!1,ft&&(Vt=r.scale||1),mt=r.mobileDeceleration||x,dt=r.smoothScrolling!==!1,gt=r.smoothScrollingDuration||E,vt={targetTop:it.getScrollTop()},Gt=(r.mobileCheck||function(){return/Android|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent||navigator.vendor||e.opera)})(),Gt?(st=t.getElementById("skrollr-body"),st&&at(),X(),Dt(o,[y,S],[T])):Dt(o,[y,b],[T]),it.refresh(),St(e,"resize orientationchange",function(){var e=o.clientWidth,t=o.clientHeight;(t!==$t||e!==Mt)&&($t=t,Mt=e,_t=!0)});var i=Y();return function l(){Z(),bt=i(l)}(),it}var o,a,i={get:function(){return it},init:function(e){return it||new n(e)},VERSION:"0.6.25"},l=Object.prototype.hasOwnProperty,s=e.Math,c=e.getComputedStyle,f="touchstart",u="touchmove",m="touchcancel",p="touchend",d="skrollable",g=d+"-before",v=d+"-between",h=d+"-after",y="skrollr",T="no-"+y,b=y+"-desktop",S=y+"-mobile",k="linear",w=1e3,x=.004,E=200,A="start",F="end",C="center",D="bottom",H="___skrollable_id",I=/^(?:input|textarea|button|select)$/i,P=/^\s+|\s+$/g,N=/^data(?:-(_\w+))?(?:-?(-?\d*\.?\d+p?))?(?:-?(start|end|top|center|bottom))?(?:-?(top|center|bottom))?$/,O=/\s*(@?[\w\-\[\]]+)\s*:\s*(.+?)\s*(?:;|$)/gi,V=/^([a-z\-]+)\[(\w+)\]$/,z=/-([a-z0-9_])/g,q=function(e,t){return t.toUpperCase()},L=/[\-+]?[\d]*\.?[\d]+/g,M=/\{\?\}/g,$=/rgba?\(\s*-?\d+\s*,\s*-?\d+\s*,\s*-?\d+/g,_=/[a-z\-]+-gradient/g,B="",G="",K=function(){var e=/^(?:O|Moz|webkit|ms)|(?:-(?:o|moz|webkit|ms)-)/;if(c){var t=c(a,null);for(var n in t)if(B=n.match(e)||+n==n&&t[n].match(e))break;if(!B)return B=G="",r;B=B[0],"-"===B.slice(0,1)?(G=B,B={"-webkit-":"webkit","-moz-":"Moz","-ms-":"ms","-o-":"O"}[B]):G="-"+B.toLowerCase()+"-"}},Y=function(){var t=e.requestAnimationFrame||e[B.toLowerCase()+"RequestAnimationFrame"],r=Pt();return(Gt||!t)&&(t=function(t){var n=Pt()-r,o=s.max(0,1e3/60-n);return e.setTimeout(function(){r=Pt(),t()},o)}),t},R=function(){var t=e.cancelAnimationFrame||e[B.toLowerCase()+"CancelAnimationFrame"];return(Gt||!t)&&(t=function(t){return e.clearTimeout(t)}),t},U={begin:function(){return 0},end:function(){return 1},linear:function(e){return e},quadratic:function(e){return e*e},cubic:function(e){return e*e*e},swing:function(e){return-s.cos(e*s.PI)/2+.5},sqrt:function(e){return s.sqrt(e)},outCubic:function(e){return s.pow(e-1,3)+1},bounce:function(e){var t;if(.5083>=e)t=3;else if(.8489>=e)t=9;else if(.96208>=e)t=27;else{if(!(.99981>=e))return 1;t=91}return 1-s.abs(3*s.cos(1.028*e*t)/t)}};n.prototype.refresh=function(e){var n,o,a=!1;for(e===r?(a=!0,lt=[],Bt=0,e=t.getElementsByTagName("*")):e.length===r&&(e=[e]),n=0,o=e.length;o>n;n++){var i=e[n],l=i,s=[],c=dt,f=yt,u=!1;if(a&&H in i&&delete i[H],i.attributes){for(var m=0,p=i.attributes.length;p>m;m++){var g=i.attributes[m];if("data-anchor-target"!==g.name)if("data-smooth-scrolling"!==g.name)if("data-edge-strategy"!==g.name)if("data-emit-events"!==g.name){var v=g.name.match(N);if(null!==v){var h={props:g.value,element:i,eventType:g.name.replace(z,q)};s.push(h);var y=v[1];y&&(h.constant=y.substr(1));var T=v[2];/p$/.test(T)?(h.isPercentage=!0,h.offset=(0|T.slice(0,-1))/100):h.offset=0|T;var b=v[3],S=v[4]||b;b&&b!==A&&b!==F?(h.mode="relative",h.anchors=[b,S]):(h.mode="absolute",b===F?h.isEnd=!0:h.isPercentage||(h.offset=h.offset*Vt))}}else u=!0;else f=g.value;else c="off"!==g.value;else if(l=t.querySelector(g.value),null===l)throw'Unable to find anchor target "'+g.value+'"'}if(s.length){var k,w,x;!a&&H in i?(x=i[H],k=lt[x].styleAttr,w=lt[x].classAttr):(x=i[H]=Bt++,k=i.style.cssText,w=Ct(i)),lt[x]={element:i,styleAttr:k,classAttr:w,anchorTarget:l,keyFrames:s,smoothScrolling:c,edgeStrategy:f,emitEvents:u,lastFrameIndex:-1},Dt(i,[d],[])}}}for(Et(),n=0,o=e.length;o>n;n++){var E=lt[e[n][H]];E!==r&&(J(E),et(E))}return it},n.prototype.relativeToAbsolute=function(e,t,r){var n=o.clientHeight,a=e.getBoundingClientRect(),i=a.top,l=a.bottom-a.top;return t===D?i-=n:t===C&&(i-=n/2),r===D?i+=l:r===C&&(i+=l/2),i+=it.getScrollTop(),0|i+.5},n.prototype.animateTo=function(e,t){t=t||{};var n=Pt(),o=it.getScrollTop();return pt={startTop:o,topDiff:e-o,targetTop:e,duration:t.duration||w,startTime:n,endTime:n+(t.duration||w),easing:U[t.easing||k],done:t.done},pt.topDiff||(pt.done&&pt.done.call(it,!1),pt=r),it},n.prototype.stopAnimateTo=function(){pt&&pt.done&&pt.done.call(it,!0),pt=r},n.prototype.isAnimatingTo=function(){return!!pt},n.prototype.isMobile=function(){return Gt},n.prototype.setScrollTop=function(t,r){return ht=r===!0,Gt?Kt=s.min(s.max(t,0),Ot):e.scrollTo(0,t),it},n.prototype.getScrollTop=function(){return Gt?Kt:e.pageYOffset||o.scrollTop||a.scrollTop||0},n.prototype.getMaxScrollTop=function(){return Ot},n.prototype.on=function(e,t){return ct[e]=t,it},n.prototype.off=function(e){return delete ct[e],it},n.prototype.destroy=function(){var e=R();e(bt),wt(),Dt(o,[T],[y,b,S]);for(var t=0,n=lt.length;n>t;t++)ot(lt[t].element);o.style.overflow=a.style.overflow="",o.style.height=a.style.height="",st&&i.setStyle(st,"transform","none"),it=r,st=r,ct=r,ft=r,Ot=0,Vt=1,ut=r,mt=r,zt="down",qt=-1,Mt=0,$t=0,_t=!1,pt=r,dt=r,gt=r,vt=r,ht=r,Bt=0,yt=r,Gt=!1,Kt=0,Tt=r};var X=function(){var n,i,l,c,d,g,v,h,y,T,b,S;St(o,[f,u,m,p].join(" "),function(e){var o=e.changedTouches[0];for(c=e.target;3===c.nodeType;)c=c.parentNode;switch(d=o.clientY,g=o.clientX,T=e.timeStamp,I.test(c.tagName)||e.preventDefault(),e.type){case f:n&&n.blur(),it.stopAnimateTo(),n=c,i=v=d,l=g,y=T;break;case u:I.test(c.tagName)&&t.activeElement!==c&&e.preventDefault(),h=d-v,S=T-b,it.setScrollTop(Kt-h,!0),v=d,b=T;break;default:case m:case p:var a=i-d,k=l-g,w=k*k+a*a;if(49>w){if(!I.test(n.tagName)){n.focus();var x=t.createEvent("MouseEvents");x.initMouseEvent("click",!0,!0,e.view,1,o.screenX,o.screenY,o.clientX,o.clientY,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,0,null),n.dispatchEvent(x)}return}n=r;var E=h/S;E=s.max(s.min(E,3),-3);var A=s.abs(E/mt),F=E*A+.5*mt*A*A,C=it.getScrollTop()-F,D=0;C>Ot?(D=(Ot-C)/F,C=Ot):0>C&&(D=-C/F,C=0),A*=1-D,it.animateTo(0|C+.5,{easing:"outCubic",duration:A})}}),e.scrollTo(0,0),o.style.overflow=a.style.overflow="hidden"},j=function(){var e,t,r,n,a,i,l,c,f,u,m,p=o.clientHeight,d=At();for(c=0,f=lt.length;f>c;c++)for(e=lt[c],t=e.element,r=e.anchorTarget,n=e.keyFrames,a=0,i=n.length;i>a;a++)l=n[a],u=l.offset,m=d[l.constant]||0,l.frame=u,l.isPercentage&&(u*=p,l.frame=u),"relative"===l.mode&&(ot(t),l.frame=it.relativeToAbsolute(r,l.anchors[0],l.anchors[1])-u,ot(t,!0)),l.frame+=m,ft&&!l.isEnd&&l.frame>Ot&&(Ot=l.frame);for(Ot=s.max(Ot,Ft()),c=0,f=lt.length;f>c;c++){for(e=lt[c],n=e.keyFrames,a=0,i=n.length;i>a;a++)l=n[a],m=d[l.constant]||0,l.isEnd&&(l.frame=Ot-l.offset+m);e.keyFrames.sort(Nt)}},W=function(e,t){for(var r=0,n=lt.length;n>r;r++){var o,a,s=lt[r],c=s.element,f=s.smoothScrolling?e:t,u=s.keyFrames,m=u.length,p=u[0],y=u[u.length-1],T=p.frame>f,b=f>y.frame,S=T?p:y,k=s.emitEvents,w=s.lastFrameIndex;if(T||b){if(T&&-1===s.edge||b&&1===s.edge)continue;switch(T?(Dt(c,[g],[h,v]),k&&w>-1&&(xt(c,p.eventType,zt),s.lastFrameIndex=-1)):(Dt(c,[h],[g,v]),k&&m>w&&(xt(c,y.eventType,zt),s.lastFrameIndex=m)),s.edge=T?-1:1,s.edgeStrategy){case"reset":ot(c);continue;case"ease":f=S.frame;break;default:case"set":var x=S.props;for(o in x)l.call(x,o)&&(a=nt(x[o].value),0===o.indexOf("@")?c.setAttribute(o.substr(1),a):i.setStyle(c,o,a));continue}}else 0!==s.edge&&(Dt(c,[d,v],[g,h]),s.edge=0);for(var E=0;m-1>E;E++)if(f>=u[E].frame&&u[E+1].frame>=f){var A=u[E],F=u[E+1];for(o in A.props)if(l.call(A.props,o)){var C=(f-A.frame)/(F.frame-A.frame);C=A.props[o].easing(C),a=rt(A.props[o].value,F.props[o].value,C),a=nt(a),0===o.indexOf("@")?c.setAttribute(o.substr(1),a):i.setStyle(c,o,a)}k&&w!==E&&("down"===zt?xt(c,A.eventType,zt):xt(c,F.eventType,zt),s.lastFrameIndex=E);break}}},Z=function(){_t&&(_t=!1,Et());var e,t,n=it.getScrollTop(),o=Pt();if(pt)o>=pt.endTime?(n=pt.targetTop,e=pt.done,pt=r):(t=pt.easing((o-pt.startTime)/pt.duration),n=0|pt.startTop+t*pt.topDiff),it.setScrollTop(n,!0);else if(!ht){var a=vt.targetTop-n;a&&(vt={startTop:qt,topDiff:n-qt,targetTop:n,startTime:Lt,endTime:Lt+gt}),vt.endTime>=o&&(t=U.sqrt((o-vt.startTime)/gt),n=0|vt.startTop+t*vt.topDiff)}if(Gt&&st&&i.setStyle(st,"transform","translate(0, "+-Kt+"px) "+Tt),ht||qt!==n){zt=n>qt?"down":qt>n?"up":zt,ht=!1;var l={curTop:n,lastTop:qt,maxTop:Ot,direction:zt},s=ct.beforerender&&ct.beforerender.call(it,l);s!==!1&&(W(n,it.getScrollTop()),qt=n,ct.render&&ct.render.call(it,l)),e&&e.call(it,!1)}Lt=o},J=function(e){for(var t=0,r=e.keyFrames.length;r>t;t++){for(var n,o,a,i,l=e.keyFrames[t],s={};null!==(i=O.exec(l.props));)a=i[1],o=i[2],n=a.match(V),null!==n?(a=n[1],n=n[2]):n=k,o=o.indexOf("!")?Q(o):[o.slice(1)],s[a]={value:o,easing:U[n]};l.props=s}},Q=function(e){var t=[];return $.lastIndex=0,e=e.replace($,function(e){return e.replace(L,function(e){return 100*(e/255)+"%"})}),G&&(_.lastIndex=0,e=e.replace(_,function(e){return G+e})),e=e.replace(L,function(e){return t.push(+e),"{?}"}),t.unshift(e),t},et=function(e){var t,r,n={};for(t=0,r=e.keyFrames.length;r>t;t++)tt(e.keyFrames[t],n);for(n={},t=e.keyFrames.length-1;t>=0;t--)tt(e.keyFrames[t],n)},tt=function(e,t){var r;for(r in t)l.call(e.props,r)||(e.props[r]=t[r]);for(r in e.props)t[r]=e.props[r]},rt=function(e,t,r){var n,o=e.length;if(o!==t.length)throw"Can't interpolate between \""+e[0]+'" and "'+t[0]+'"';var a=[e[0]];for(n=1;o>n;n++)a[n]=e[n]+(t[n]-e[n])*r;return a},nt=function(e){var t=1;return M.lastIndex=0,e[0].replace(M,function(){return e[t++]})},ot=function(e,t){e=[].concat(e);for(var r,n,o=0,a=e.length;a>o;o++)n=e[o],r=lt[n[H]],r&&(t?(n.style.cssText=r.dirtyStyleAttr,Dt(n,r.dirtyClassAttr)):(r.dirtyStyleAttr=n.style.cssText,r.dirtyClassAttr=Ct(n),n.style.cssText=r.styleAttr,Dt(n,r.classAttr)))},at=function(){Tt="translateZ(0)",i.setStyle(st,"transform",Tt);var e=c(st),t=e.getPropertyValue("transform"),r=e.getPropertyValue(G+"transform"),n=t&&"none"!==t||r&&"none"!==r;n||(Tt="")};i.setStyle=function(e,t,r){var n=e.style;if(t=t.replace(z,q).replace("-",""),"zIndex"===t)n[t]=isNaN(r)?r:""+(0|r);else if("float"===t)n.styleFloat=n.cssFloat=r;else try{B&&(n[B+t.slice(0,1).toUpperCase()+t.slice(1)]=r),n[t]=r}catch(o){}};var it,lt,st,ct,ft,ut,mt,pt,dt,gt,vt,ht,yt,Tt,bt,St=i.addEvent=function(t,r,n){var o=function(t){return t=t||e.event,t.target||(t.target=t.srcElement),t.preventDefault||(t.preventDefault=function(){t.returnValue=!1,t.defaultPrevented=!0}),n.call(this,t)};r=r.split(" ");for(var a,i=0,l=r.length;l>i;i++)a=r[i],t.addEventListener?t.addEventListener(a,n,!1):t.attachEvent("on"+a,o),Yt.push({element:t,name:a,listener:n})},kt=i.removeEvent=function(e,t,r){t=t.split(" ");for(var n=0,o=t.length;o>n;n++)e.removeEventListener?e.removeEventListener(t[n],r,!1):e.detachEvent("on"+t[n],r)},wt=function(){for(var e,t=0,r=Yt.length;r>t;t++)e=Yt[t],kt(e.element,e.name,e.listener);Yt=[]},xt=function(e,t,r){ct.keyframe&&ct.keyframe.call(it,e,t,r)},Et=function(){var e=it.getScrollTop();Ot=0,ft&&!Gt&&(a.style.height=""),j(),ft&&!Gt&&(a.style.height=Ot+o.clientHeight+"px"),Gt?it.setScrollTop(s.min(it.getScrollTop(),Ot)):it.setScrollTop(e,!0),ht=!0},At=function(){var e,t,r=o.clientHeight,n={};for(e in ut)t=ut[e],"function"==typeof t?t=t.call(it):/p$/.test(t)&&(t=t.slice(0,-1)/100*r),n[e]=t;return n},Ft=function(){var e=st&&st.offsetHeight||0,t=s.max(e,a.scrollHeight,a.offsetHeight,o.scrollHeight,o.offsetHeight,o.clientHeight);return t-o.clientHeight},Ct=function(t){var r="className";return e.SVGElement&&t instanceof e.SVGElement&&(t=t[r],r="baseVal"),t[r]},Dt=function(t,n,o){var a="className";if(e.SVGElement&&t instanceof e.SVGElement&&(t=t[a],a="baseVal"),o===r)return t[a]=n,r;for(var i=t[a],l=0,s=o.length;s>l;l++)i=It(i).replace(It(o[l])," ");i=Ht(i);for(var c=0,f=n.length;f>c;c++)-1===It(i).indexOf(It(n[c]))&&(i+=" "+n[c]);t[a]=Ht(i)},Ht=function(e){return e.replace(P,"")},It=function(e){return" "+e+" "},Pt=Date.now||function(){return+new Date},Nt=function(e,t){return e.frame-t.frame},Ot=0,Vt=1,zt="down",qt=-1,Lt=Pt(),Mt=0,$t=0,_t=!1,Bt=0,Gt=!1,Kt=0,Yt=[];"function"==typeof define&&define.amd?define("skrollr",function(){return i}):"undefined"!=typeof module&&module.exports?module.exports=i:e.skrollr=i})(window,document);