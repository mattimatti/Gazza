define(['jquery', 'html5.audio'], function($, AudioPlayer) {


	var console = window.console;


	var MixinSound = {


		// video has no sound
		initSound: function() {
	

			// toggle visibility
			var playerStyle = 'hide';


			var soundOptions = {};


			if (this.options.soundControls) {
				playerStyle = '';
				soundOptions.controls = true;
				soundOptions.preload = true;
			}

			// idf we have a sound source we do initialize

			if (this.options.sound ) {

				console.debug('MixinSound:initSound','sound', this.options.sound,'soundControls', this.options.soundControls);

				var source = this.options.sound;
				source = source.substr(0, source.lastIndexOf('.'));

				if (!this.audioPlayerObj) {
					
					this.audioPlayerObj = new AudioPlayer("audio_" + this.elementId, this.$el , soundOptions);
					this.audioPlayerObj.setSource(source);
				}

				if (this.options.soundControls) {
					this.audioPlayerObj.applySource();
				}
			}

		},



		// Play the component sound
		// Seems like the audio tag must be redrawn evey time we want to play..
		// see http://stackoverflow.com/questions/8733330/why-cant-i-play-sounds-more-than-once-using-html5-audio-tag
		playSound: function() {
			if (this.audioPlayerObj) {
				console.debug('MixinSound:playSound');
				this.audioPlayerObj.play();
			}else{
				console.warn('MixinSound:playSound no player');
			}
		},


		// dispose soundObject instance
		disposeSound: function() {

			console.debug('MixinSound:disposeSound');

			if (this.audioPlayerObj) {
				this.audioPlayerObj.dispose();
				this.audioPlayerObj = null;
				delete this.audioPlayerObj;
			}


		}


	};

	return MixinSound;

});