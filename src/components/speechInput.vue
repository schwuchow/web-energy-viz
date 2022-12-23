<template>
<div class="speech-input col-7">
	<div class="speech-input__bar">
		<button @click="toggleMic"><img :src="voiceWaveImg" id="speech-input__icon-wave" class="icon" /></button>
		<div class="transcript" v-text="transcript"></div>
	</div>
</div>
</template>

<script lang="js">
import { ref, onMounted } from 'vue'
import voiceWaveImg from '../assets/voice_wave.svg';

export default {
  setup() {
		const transcript = ref('Ask me something about your devices energy consumption!');
		const isRecording = ref(false);
		const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		const sr = new Recognition();
		sr.lang = 'en-US';

		onMounted(() => {
			sr.continuous = true;
			sr.interimResults = true;
			sr.onstart = () => {
				console.log('SR Started');
				isRecording.value = true;
			}
			sr.onend = () => {
				console.log('SR Stopped');
				isRecording.value = false;
			}
			sr.onresult = (evt) => {
				for (let i = 0; i < evt.results.length; i++) {
					const result = evt.results[i]
					if (result.isFinal) intentMatching(result)
				}
				const t = Array.from(evt.results)
					.map(result => result[0])
					.map(result => result.transcript)
					.join('');
				
				transcript.value = t;
			}
		});

		const toggleMic = () => {
			if (isRecording.value) {
				sr.stop();
			} else {
				sr.start();
			}
		};

		const intentMatching = (result) => {
			const t = result[0].transcript;
			console.log("IntentMatching called with:", t);
			if (t.includes('show me') || t.includes('tell me') || t.includes('energy consumption')) {
				sr.stop();
				if (t.includes("the most")){
					runVisualisation("the MOST", "not implemented");
				} else {
					console.log("the MOST usecase - not implemented yet");
				var timePeriod = checkForTimePeriod(t);
				var devicesSelected = checkForDevices(t);
				runVisualisation(timePeriod, devicesSelected);
				}

					
			} else if (t.includes('stop')|| t.includes('stop recording')|| t.includes('thank you') ) {
				sr.stop();
			} else if (
			t.includes('what is the time') ||
			t.includes('what\'s the time') ||
					t.includes('time is')
			) {
				sr.stop();
				alert(new Date().toLocaleTimeString());
				setTimeout(() => sr.start(), 100);
			}
		};

		// Machine selected
		// - all machines = 0
		// - washing machine = 1
		// - dryer = 2
		// - dishwasher = 3
		// - freezer = 4
		// - refrigerator = 5
		function checkForDevices(t) {
			var devicesList = [];
			if (t.includes("all") || t.includes("all devices") || t.includes("old devices")) {
				devicesList.push(0);
			}
			if (t.includes("washing machine")) {
					devicesList.push(1);
			}
			if (t.includes("dryer")) {
					devicesList.push(2);
			}
			if (t.includes("dishwasher")) {
					devicesList.push(3);
			}
			if (t.includes("freezer")) {
					devicesList.push(4);
			}
			if (t.includes("refrigerator") || t.includes("fridge")) {
					devicesList.push(5);
			}
			
			if (devicesList.length === 0) {
			devicesList.push(0);
			}

			return devicesList;
		}


		// Time Periods
		// -1 = yesterday;
		// 0 = all time;
		// 1 = last week;
		// 2 = last two weeks;
		// 3 = last month
		function checkForTimePeriod(t) {
			var timePeriod = 0;
			if (t.includes("yesterday")) {
				timePeriod = -1;
			} else if (t.includes("last two weeks")) {
				timePeriod = 2;
			} else if (t.includes("last week")) {
				timePeriod = 1;
			} else if (t.includes("last month")) {
				timePeriod = 3;
			}
			return timePeriod;
		}

		function runVisualisation(time, devices) {
			console.log("time: " + time + " - selected device:" + devices);
			alert("time: " + time + " - selected device:" + devices);
		}

		return { voiceWaveImg, toggleMic, transcript };
	}
}
</script>

<style lang="scss" scoped>
.speech-input {
  grid-row: span 1;
  background-color: var(--color-light);
  border-radius: 10px;

  .speech-input__bar {
    height: 50px;
    margin: auto;
    color: var(--color-secondary);
    display: flex;
    align-items: center;
    font-size: 20px;
    padding-left: 50px;
    background-color: var(--color-tertiary);
    margin: 30px 0;

    #speech-input__icon-wave {
      width: 25px;
      height: 100%;
      vertical-align: middle;
    }
  }

	.transcript {
		padding-left: 20px;
	}
}
</style>