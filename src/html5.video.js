define(['jquery','html5.media'], function($,HTML5Media) {

	var console = window.muteConsole;

	var HTML5VideoPlayer = function(elementId, container, options) {

		this.$container = container;


		this.defaultoptions = {
			flasCompatible: false
		};

		if(options){
			this.options = $.extend(this.defaultoptions, options);
		}

		this.elementId = elementId;

		
	};


	// extend from media
	$.extend(HTML5VideoPlayer.prototype, HTML5Media);



/*
var testEl = document.createElement( "video" ),
    mpeg4, h264, ogg, webm;
if ( testEl.canPlayType ) {
    // Check for MPEG-4 support
    mpeg4 = "" !== testEl.canPlayType( 'video/mp4; codecs="mp4v.20.8"' );

    // Check for h264 support
    h264 = "" !== ( testEl.canPlayType( 'video/mp4; codecs="avc1.42E01E"' )
        || testEl.canPlayType( 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"' ) );

    // Check for Ogg support
    ogg = "" !== testEl.canPlayType( 'video/ogg; codecs="theora"' );

    // Check for Webm support
    webm = "" !== testEl.canPlayType( 'video/webm; codecs="vp8, vorbis"' );
}
*/



	//extend prototype

	$.extend(HTML5VideoPlayer.prototype, {


		isAudio: false,

		// check if the browser can play a video
		hasHTML5MediaFeature: function() {
			return document.createElement('video').canPlayType;
		},

		// override the 
		play: function() {

			if (!this.plugin) {
				this.applySource();
			}

			if (this.plugin) {
				if(this.isPlayable()){
					console.debug('play');
					this.plugin.play();
				}else{
					console.error('not playable');
				}
			}
		},



		createMarkup : function(){

			var self = this;
			console.debug('createMarkup');

			this.removeMarkup();

			var playerStyle = '';


			var flashHeight = 500;
			var flashExtension = '.mp4';
			var flashVars = "preload=true&amp;autoplay=true&amp;controls=true&amp;file=" + this.encodeUrl(this.absolutizePath(this._sourceWithoutExtension+flashExtension));
			var flashCode = "<object width='100%' height='"+flashHeight+"' type='application/x-shockwave-flash' data='./images/flashmediaelement.swf'><param name='movie' value='./images/flashmediaelement.swf' /><param name='flashvars' value='" + flashVars + "' /><img src='http://placehold.it/350x"+flashHeight+"' width='100%' height='"+flashHeight+"' title='No video playback capabilities' /></object>";
			

			if(!this.options.flashCompatible){
				this.hasFlash = false;
			}

			var videoOpenCode = "<video id='" + this.getInstanceId() + "'  class='responsive " + playerStyle + "' poster='" + this.options.poster + "'>";
			var videoCloseCode = "</video>";
			var videoSourcesCode = "<source src='" + this._sourceWithoutExtension + ".mp4' type='video/mp4' /><source src='" + this._sourceWithoutExtension + ".webm' type='video/webm' /><source src='" + this._sourceWithoutExtension + ".ogv' type='video/ogg' />";

			this.$el = $(videoOpenCode + videoSourcesCode + flashCode + videoCloseCode);
			//this.$el = $(flashCode );
			

			this.$el.appendTo(this.$container);

			//enable controls
			if(this.options.controls){
				this.$el.attr("controls","controls");
			}
			if(this.options.preload){
				this.$el.attr("preload","true");
			}
			if(this.options.poster){
				this.$el.attr("poster",this.options.poster);
			}
			if(this.options.className){

				var classes = this.options.className.split(',');
				$.each(classes, function(index, elm){
					self.$el.addClass(elm);
				});
				
			}

			// the audio element control
			this.plugin = document.getElementById(this.getInstanceId());

			console.error("THE PLUGIN!!!", this.plugin);

		},



		removeMarkup : function(){

			console.debug('removeMarkup');

			this.plugin = document.getElementById(this.getInstanceId());

			if(this.plugin){
				console.error('esiste lo rimouvo');

				var theEl = this.$container.find("#"+this.getInstanceId());

				console.error(theEl);

				theEl.off().empty().remove();
				delete this.plugin;
			}

			this.increasePlayCount();
		}


	});


	return HTML5VideoPlayer;

});