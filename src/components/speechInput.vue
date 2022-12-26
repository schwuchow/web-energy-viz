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
import { TimePeriod } from '../types/enums';
import { useDevicesStore } from '../store';
import { storeToRefs } from 'pinia';

export default {
  setup() {
		const store = useDevicesStore();
		const { deviceIds } = store;
		const { visualization } = storeToRefs(store);
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

				const newVisualization = {
					timePeriod: timePeriod,
					deviceId: devicesSelected
				};

				visualization.value = newVisualization;
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

		function checkForDevices(t) {
			var devicesList = [];

			if (t.includes("all") || t.includes("all devices") || t.includes("old devices")) {
				devicesList.push("all");
			}
			if (t.includes("washing machine")) {
					devicesList.push(deviceIds.bathroomWashingMashine);
			}
			if (t.includes("dryer")) {
					devicesList.push(deviceIds.bathroomDryer);
			}
			if (t.includes("dishwasher")) {
					devicesList.push(deviceIds.kitchenDishWasher);
			}
			if (t.includes("freezer")) {
					devicesList.push(deviceIds.kitchenFreezer);
			}
			if (t.includes("refrigerator") || t.includes("fridge")) {
					devicesList.push(deviceIds.kitchenFridge);
			}
			
			if (devicesList.length === 0) {
			devicesList.push(0);
			}

			return devicesList;
		}

		function checkForTimePeriod(t) {
			var timePeriod = TimePeriod.ALL_TIME;

			if (t.includes("yesterday")) {
				timePeriod = TimePeriod.YESTERDAY;
			} else if (t.includes("last two weeks")) {
				timePeriod = TimePeriod.LAST_TWO_WEEEKS;
			} else if (t.includes("last week")) {
				timePeriod = TimePeriod.LAST_WEEK;
			} else if (t.includes("last month")) {
				timePeriod = TimePeriod.LAST_MONTH;
			}
			return timePeriod;
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