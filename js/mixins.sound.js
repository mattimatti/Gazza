define(['jquery', 'mediaelement'], function($) {

	var console = window.console;

	var MixinSound = {


		// video has no sound
		initSound: function() {
			console.debug('MixinSound:initSound');

			// toggle visibility
			var playerStyle = 'hide';

			var soundOptions = {
				alwaysShowControls: false,
				iPadUseNativeControls: false,
				iPhoneUseNativeControls: false,
				AndroidUseNativeControls: false,
				isVideo: false
			};



			if (this.options.soundControls) {

				playerStyle = '';

				soundOptions.alwaysShowControls = true;
				soundOptions.iPadUseNativeControls = true;
				soundOptions.iPhoneUseNativeControls = true;
				soundOptions.AndroidUseNativeControls = true;
				soundOptions.features =  ['playpause', 'progress', 'duration'];

			}else{

				soundOptions.audioWidth = -1;
				soundOptions.audioHeight = -1;
			}



			if (this.options.sound) {


				var source = this.options.sound;
				source = source.substr(0, source.lastIndexOf('.'));
				// encodeuricomponent to print in flashvars!
				source = encodeURIComponent(source);


				console.debug('setting source: ', source);


				var flashCode = "<object width='320' height='240' type='application/x-shockwave-flash' data='./images/flashmediaelement.swf'><param name='movie' value='./images/flashmediaelement.swf' /><param name='flashvars' value='controls=false&file='" + source + ".mp3' /><img src='http://placehold.it/350x150' width='320' height='240' title='No video playback capabilities' /></object>";

				var $embed = $("<audio id='audio_" + this.elementId + "'  class='playSound responsive " + playerStyle + "' ><source src='" + source + ".mp3' /><source src='" + source + ".ogv' />"+flashCode+"</audio>");
				this.$el.append($embed);

				this.audioPlayerObj = window.MediaElementPlayer("#audio_" + this.elementId, soundOptions);

			}


		},



		// Play the component sound
		playSound: function() {
			console.debug('MixinSound:playSound');
			if (this.audioPlayerObj) {
				console.debug(this.audioPlayerObj);
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