define(['jquery','mixins.preloader','mixins.sound','panzoom'], function($,MixinPreloader,MixinSound){

	var console = window.muteConsole;

	var Component = function(element, options) {

		this.$el = $(element);

		this.elementId = this.$el.attr('id');

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
	
	$.extend(Component.prototype, MixinPreloader);
	$.extend(Component.prototype, MixinSound);

	//extend prototype	

	$.extend(Component.prototype, {

		// initial state
		zoomIn : false,

		originalImage : null,

		hqImage: null,

		initialize: function() {


			if(this.initialized){
				console.warn(this.elementId + ' Component already initialized exit');
				return;
			}
			this.initialized = true;
			
			this.plugin = this.$el.find('.component');

			if(!this.plugin){
				return;
			}

			
			console.info(this.elementId + ' ComponentPan initialize');

			this.initSound();

			// must be wrapped in a container div
			var container = $("<div class='pancontainer'></div>");
			//container.attr("width", this.plugin.width());
			//container.attr("height", this.plugin.height());
			//container.css("width", this.plugin.width());
			//container.css("height", this.plugin.height());
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

		dispose: function() {

			if(!this.initialized){
				console.warn(this.elementId + ' Component not initialized no dispose');
				return;
			}
			
			this.disposeSound();

			console.info(this.elementId + ' ComponentPan dispose');

			if (this.plugin) {
				this.plugin.panzoom('reset');
				this.zoomIn = false;
				this.swapSource(this.originalimage);
				// remove click
				this.plugin.off();
				this.plugin.panzoom("destroy");
				this.plugin.unwrap();
			}

			delete this.$el;
		}



	});

	return Component;

});