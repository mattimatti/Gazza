define(['jquery','html5.media'], function($,HTML5Media) {

	var console = window.console;

	if(window.REMOVECONSOLE){
		console = window.muteConsole;
	}	


	var HTML5AudioPlayer = function(elementId, container, options) {

		this.$container = container;


		this.defaultoptions = {
			flasCompatible: false
		};

		if(options){
			this.options = $.extend(this.defaultoptions, options);
		}

		this.elementId = elementId;

		

	};


	$.extend(HTML5AudioPlayer.prototype, HTML5Media);


	//extend prototype

	$.extend(HTML5AudioPlayer.prototype, {

		isAudio: true,


		// check if the browser can play a video
		hasHTML5MediaFeature: function() {
			return document.createElement('audio').canPlayType;
		},


		createMarkup : function(){

			console.debug('createMarkup');

			this.removeMarkup();

			var playerStyle = '';

			var flashHeight = 50;
			var flashExtension = '.mp3';
			var flashVars = "preload=true&amp;autoplay=true&amp;controls=true&amp;file=" + this.encodeUrl(this.absolutizePath(this._sourceWithoutExtension+flashExtension));
			var flashCode = "<object width='100%' height='"+flashHeight+"' type='application/x-shockwave-flash' data='./images/flashmediaelement.swf'><param name='movie' value='./images/flashmediaelement.swf' /><param name='flashvars' value='" + flashVars + "' /><img src='http://placehold.it/350x"+flashHeight+"' width='100%' height='"+flashHeight+"' title='No video playback capabilities' /></object>";
			

			if(!this.options.flasCompatible){
				flashCode = '';
				this.hasFlash = false;
			}

			this.$el = $("<audio id='" + this.getInstanceId() + "'  class='playSound responsive " + playerStyle + "' ><source src='" + this._sourceWithoutExtension + ".mp3' /><source src='" + this._sourceWithoutExtension + ".ogv' />"+flashCode+"</audio>");
			this.$el.appendTo(this.$container);


			//enable controls
			if(this.options.controls){
				this.$el.attr("controls","controls");
			}
			if(this.options.preload){
				this.$el.attr("preload","preload");
			}

			// the audio element control
			this.plugin = document.getElementById(this.getInstanceId());

		},



		removeMarkup : function(){

			console.debug('removeMarkup');

			this.plugin = document.getElementById(this.getInstanceId());

			if(this.plugin){

				try{

					this.plugin.setAttribute('src',null); //change the source
					this.plugin.load(); //load the new source
					this.plugin.play(); //play
				}catch(e){
					console.error('errore a stoppare',e);
				}

				try{
					this.plugin.pause();
				}catch(e){
					console.error('errore a pausare',e);
				}

				try{
					this.stop();
				}catch(e){
					console.error('errore a stoppare global',e);
				}


				console.debug('esiste lo rimouvo');

				var theEl = this.$container.find("#"+this.getInstanceId());

				console.debug(theEl);

				theEl.off().empty().remove();

				this.plugin = {};
				delete this.plugin;
			}

			this.increasePlayCount();
		}


	});


	return HTML5AudioPlayer;

});