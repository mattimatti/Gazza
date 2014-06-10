define(['jquery','html5.media'], function($,HTML5Media) {

	var console = window.muteConsole;


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

		// check if the browser can play a video
		hasFeature: function() {
			return !!document.createElement('audio').canPlayType;
		},


		createMarkup : function(){

			console.error('createMarkup');

			this.removeMarkup();

			var playerStyle = '';

			var flashCode = "<object width='320' height='240' type='application/x-shockwave-flash' data='./images/flashmediaelement.swf'><param name='movie' value='./images/flashmediaelement.swf' /><param name='flashvars' value='controls=false&file='" + this._sourceWithoutExtension + ".mp3' /><img src='http://placehold.it/350x150' width='320' height='240' title='No video playback capabilities' /></object>";
			
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


			// the audio element control
			this.plugin = document.getElementById(this.getInstanceId());

		},



		removeMarkup : function(){

			console.error('removeMarkup');

			this.plugin = document.getElementById(this.getInstanceId());

			if(this.plugin){
				console.error('esiste lo rimouvo');

				var theEl = this.$container.find("#"+this.getInstanceId());

				console.error(theEl);

				theEl.off().empty().remove();
				delete this.plugin;
			}

			this.increasePlayCount();
		},




		applySource: function(){
			console.error('applySource');
			this.createMarkup();
		},

		setSource : function(source){
			console.error('setSource', source);
			this._sourceWithoutExtension = window.escape(source);
		}





	});


	return HTML5AudioPlayer;

});