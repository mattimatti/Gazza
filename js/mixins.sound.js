define(['jquery', 'mediaelement'], function($) {

	var console = window.console;

	var MixinSound = {


		// video has no sound
		initSound: function() {
			console.debug('MixinSound:initSound');

			if (this.options.sound) {

				var source = this.options.sound;
				source = source.substr(0, source.lastIndexOf('.'));

				var $embed = $("<audio id='audio_" + this.elementId + "' style='display:none;' class='playSound' ><source src='" + source + ".mp3' /><source src='" + source + ".ogv' /><object width='320' height='240' type='application/x-shockwave-flash' data='./images/flashmediaelement.swf'><param name='movie' value='flashmediaelement.swf' /><param name='flashvars' value='controls=false&file='" + source + ".mp3' /><img src='http://placehold.it/350x150' width='320' height='240' title='No video playback capabilities' /></object></audio>");
				this.$el.append($embed);

				this.audioPlayerObj = window.MediaElementPlayer("#audio_" + this.elementId);

			}


		},



		// Play the component sound
		playSound: function() {
			console.debug('MixinSound:playSound');
			if (this.audioPlayerObj) {
				this.audioPlayerObj.setSrc(this.options.sound);
				this.audioPlayerObj.play();
			}

		},


		// remove sound
		disposeSound: function() {

			this.$el.find('.playSound').remove();

			this.audioPlayerObj = null;
			delete this.audioPlayerObj;

		}


	};

	return MixinSound;

});