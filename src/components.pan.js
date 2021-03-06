define(['jquery', 'mixins.preloader', 'mixins.sound','mixins.genericcomponent'], function($, MixinPreloader, MixinSound, MixinGenericComponent) {

	var console = window.console;

	if(window.REMOVECONSOLE){
		console = window.muteConsole;
	}	


	$.fn.draggable = function() {

		var offset = null;

		var start = function(e) {
			var orig = e.originalEvent;
			var pos = $(this).position();
			offset = {
				x: orig.changedTouches[0].pageX - pos.left,
				y: orig.changedTouches[0].pageY - pos.top
			};
		};


		var moveMe = function(e) {
			e.preventDefault();
			var orig = e.originalEvent;
			$(this).css({
				top: orig.changedTouches[0].pageY - offset.y,
				left: orig.changedTouches[0].pageX - offset.x
			});
		};


		this.on("touchstart", start);
		this.on("touchmove", moveMe);
	};

	$.fn.drags = function(opt) {

		opt = $.extend({
			handle: "",
			cursor: "move"
		}, opt);

		var $el, $drag;

		if (opt.handle === "") {
			$el = this;
		} else {
			$el = this.find(opt.handle);
		}

		return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
			if (opt.handle === "") {
				$drag = $(this).addClass('draggable');
			} else {
				$drag = $(this).addClass('active-handle').parent().addClass('draggable');
			}
			var z_idx = $drag.css('z-index'),
				drg_h = $drag.outerHeight(),
				drg_w = $drag.outerWidth(),
				pos_y = $drag.offset().top + drg_h - e.pageY,
				pos_x = $drag.offset().left + drg_w - e.pageX;
			$drag.css('z-index', 1000).parents().on("mousemove", function(e) {
				$('.draggable').offset({
					top: e.pageY + pos_y - drg_h,
					left: e.pageX + pos_x - drg_w
				}).on("mouseup", function() {
					$(this).removeClass('draggable').css('z-index', z_idx);
				});
			});

		}).on("mouseup", function(ee) {
			if (opt.handle === "") {
				$(this).removeClass('draggable');
			} else {
				$(this).removeClass('active-handle').parent().removeClass('draggable');
			}

		});

	};


	var ComponentPan = function(element, options) {

		this.$el = $(element);

		this.elementId = this.$el.attr('id');

		// Default options for the plugin
		this.defaults = {
			minScale: 0,
			hqSrc: null,
			maxZoom: 1
		};

		// merge default options with
		this.options = $.extend(this.defaults, options);
		console.debug(this.elementId + ' ComponentPan at constructor options', this.options);

	};

	// MIXIN

	$.extend(ComponentPan.prototype, MixinPreloader);
	$.extend(ComponentPan.prototype, MixinSound);
	$.extend(ComponentPan.prototype, MixinGenericComponent);

	//extend prototype	

	$.extend(ComponentPan.prototype, {

		// initial state
		zoomIn: false,

		originalImage: null,

		hqImage: null,

		initialize: function() {


			if (this.initialized) {
				console.warn(this.elementId + ' ComponentPan already initialized exit');
				return;
			}
			this.initialized = true;

			this.plugin = this.$el.find('.component');

			if (!this.plugin) {
				console.warn(this.elementId + ' ComponentPan non esiste .component');
				return;
			}

			if (this.isMobileBrowser()) {
				this.hideBlinker();
				console.warn(this.elementId + ' NO INTERACTIVITY IN MOBILE');
				return;
			}


			console.info(this.elementId + ' ComponentPan initialize');


			this.originalimage = this.plugin.attr("src");
			console.debug(this.elementId + ' ComponentPan originalimage', this.originalimage);


			if (this.options.hqSrc) {
				console.debug(this.elementId + ' ComponentPan has a different HQ source', this.options.hqSrc);
				this.hqImage = this.options.hqSrc;
				this.options.maxZoom = 1.2;
			} else {
				this.hqImage = this.originalimage;
			}

			this.enableInteraction();

			// create a wrapper
			this.wrapperObj = $("<div style='position: relative; overflow: hidden;'/>");
			// Disable. this breaks responsiveness
			//this.wrapperObj.css('width', this.plugin.width());
			this.wrapperObj.css('height', this.plugin.height());


			// create a new image to drag
			this.contentObj = $('<img class="component responsive draggable-pan"/>');
			// this.contentObj = $('<img class="component responsive "/>');
			this.contentObj.attr("src", this.hqImage);
			this.contentObj.appendTo(this.$el);
			this.contentObj.load();


			this.$el.find('img').wrapAll(this.wrapperObj);

			this.contentObj.css('position', 'absolute');
			this.contentObj.css('zIndex', 100);
			this.contentObj.css('left', 0);
			this.contentObj.css('right', 0);
			this.contentObj.css('zIndex', 100);
			this.contentObj.hide();



			this.plugin.css('position', 'absolute');
			this.plugin.css('zIndex', 101);
			this.plugin.css('left', 0);
			this.plugin.css('right', 0);

			if(this.options.soundControls){
				this.initSound();
			}

		},


		enableInteraction: function() {
			console.debug(this.elementId + ' ComponentPan enableInteraction');
			
			this.disposeEventsSafe();

			// uso il doubleclick perchè il click bubblea..
			this.$el.hammer();
			this.$el.on('tap', $.proxy(this.toggleZoom, this));
			//this.$el.on('pinch', $.proxy(this.toggleZoom, this));
			this.$el.addClass("interactive");

		},


		clickComponent: function(event) {
			console.debug(this.elementId + ' ComponentPan clickComponent', event);

			if(this.options.soundControls){
				// prevent overlapping commands
				try{
					if($(event.target).hasClass("playSound")){
						return;
					}
				}catch(soundex){}
			}

			this.playSound();
			this.toggleZoom();
		},


		swapSource: function(newSource) {
			this.plugin.attr("src", newSource);
		},


		// Toggle the zoom in the pan viewer
		toggleZoom: function(event) {

			//if($(event.target).hasClass("draggable-pan")){
			//	console.error(event.type, 'delegateTarget',event.delegateTarget,'target', event.target,'currentTarget', event.currentTarget);
			//	return;
			//}



			console.error(event.target);
			console.error(this.elementId + ' ComponentPan toggleZoom actually this.zoomIn? ', this.zoomIn);

			var duration = 0.5;

			var self = this;

			console.debug(this.elementId + ' ComponentPan toggleZoom this.zoomIn', this.zoomIn);

			if (!this.zoomIn) {
				this.zoomIn = true;

				this.plugin.hide();
				this.contentObj.show();

				TweenMax.to(this.contentObj, duration, {
					alpha: 1,
					css: {
						zIndex: 101,
						scaleX: this.options.maxZoom,
						scaleY: this.options.maxZoom,
						transformOrigin: "center center"
					},
					onComplete: $.proxy(this.applyDragEvents, this)
					/*,
					ease: Power3.easeInOut*/
				});

				this.plugin.css('zIndex', 100);

			} else {
				this.zoomIn = false;

				TweenMax.to(this.plugin, duration, {
					alpha: 1,
					delay: 0.5
				});
				this.plugin.show();
				this.contentObj.hide();

				console.error("scale to ", this.wrapperObj.width());

				TweenMax.to(this.contentObj, duration, {
					alpha: 0,
					css: {
						zIndex: 100
					}
				});


				TweenMax.to(this.contentObj, duration, {
					delay: duration,
					css: {
						scaleX: 1,
						scaleY: 1,
						left:0,
						right:0,
						transformOrigin: "center center"
					},
					onComplete: $.proxy(this.detachDragEvents, this)
					/*,
					ease: Power3.easeInOut*/
				});


				this.plugin.css('zIndex', 101);


			}
		},


		applyDragEvents: function() {

			// apply mobile drag
			this.contentObj.draggable();

			//apply desktop drag
			this.contentObj.drags();
		},


		detachDragEvents: function() {
			this.contentObj.off();
		},



		dispose: function() {

			if (!this.initialized) {
				console.warn(this.elementId + ' Component not initialized no dispose');
				return;
			}

			this.disposeSound();

			console.info(this.elementId + ' ComponentPan dispose');

			if (this.panObject) {

				this.zoomIn = false;

				this.panObject.destroy();

				// remove click
				this.disposeEventsSafe();

				this.plugin = null;
				this.panObject = null;
				delete this.plugin;
				delete this.panObject;
			}

			delete this.$el;
		}



	});

	return ComponentPan;

});