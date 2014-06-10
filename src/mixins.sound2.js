define(['jquery', 'html5.audio'], function($, AudioPlayer) {

	var console = window.muteConsole;

	var MixinSound = {


		// video has no sound
		initSound: function() {
	

			// toggle visibility
			var playerStyle = 'hide';


			if (this.options.soundControls) {
				playerStyle = '';
			}


			// idf we have a sound source we do initialize

			if (this.options.sound ) {

				console.debug('MixinSound:initSound');

				var source = this.options.sound;
				source = source.substr(0, source.lastIndexOf('.'));

				// encodeuricomponent to print in flashvars!
				var flashSource = window.escape(source);

				console.debug('setting source: ', source);

				var flashCode = "<object width='320' height='240' type='application/x-shockwave-flash' data='./images/flashmediaelement.swf'><param name='movie' value='./images/flashmediaelement.swf' /><param name='flashvars' value='controls=false&file='" + flashSource + ".mp3' /><img src='http://placehold.it/350x150' width='320' height='240' title='No video playback capabilities' /></object>";

				var $embed = $("<audio id='audio_" + this.elementId + "'  class='playSound responsive " + playerStyle + "' ><source src='" + source + ".mp3' /><source src='" + source + ".ogv' />"+flashCode+"</audio>");
				this.$el.append($embed);


				this.audioPlayerObj = new AudioPlayer();

				console.debug('MediaElementPlayer: inited', this.audioPlayerObj, $embed);

			}


		},



		// Play the component sound
		// Seems like the audio tag must be redrawn evey time we want to play..
		// see http://stackoverflow.com/questions/8733330/why-cant-i-play-sounds-more-than-once-using-html5-audio-tag
		playSound: function() {
			
			if(!this.audioPlayerObj){
				this.initSound();
			}

			if (this.audioPlayerObj) {
				this.audioPlayerObj.play();
			}

		},


		// remove sound
		disposeSound: function() {

			this.$el.find("audio_" + this.elementId).empty().remove();

			this.audioPlayerObj.dispose();

			this.audioPlayerObj = null;
			delete this.audioPlayerObj;

		}


	};

	return MixinSound;

});