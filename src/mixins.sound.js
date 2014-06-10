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

				if (!this.audioPlayerObj) {
					this.audioPlayerObj = new AudioPlayer("audio_" + this.elementId, this.$el , {
						controls:true
					});
					this.audioPlayerObj.setSource(source);
				}
			}

		},



		// Play the component sound
		// Seems like the audio tag must be redrawn evey time we want to play..
		// see http://stackoverflow.com/questions/8733330/why-cant-i-play-sounds-more-than-once-using-html5-audio-tag
		playSound: function() {
			console.debug('MixinSound:playSound');
			if (this.audioPlayerObj) {
				this.audioPlayerObj.play();
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