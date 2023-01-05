<template>
<div class="speech-input col-7">
	<div class="speech-input__bar">
		<button @click="toggleMic" class="speech-input__btn"><img :src="voiceWaveImg" id="speech-input__icon-wave" class="icon" /></button>
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
		const { visualization, focusedDevices } = storeToRefs(store);
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
				transcript.value = 'Ask me something about your devices energy consumption!';
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
				} else {
				var timePeriod = checkForTimePeriod(t);
				var devicesSelected = checkForDevices(t);
                var resultsRanked = false;
                if (t.includes("ranked") || t.includes("ranking") || t.includes("order")){
                    resultsRanked = true;
                }
                console.log(timePeriod, devicesSelected, resultsRanked);

				const newVisualization = {
					timePeriod: timePeriod,
					deviceIds: devicesSelected,
					ranking: resultsRanked,
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
            const { devices } = storeToRefs(store)
			if (t.includes("all") || t.includes("all devices") || t.includes("old devices")) {
                if (t.includes("from the kitchen") || t.includes("kitchen")) {
                devicesList.push(deviceIds.kitchenDishWasher1);
                devicesList.push(deviceIds.kitchenDishWasher2);
                devicesList.push(deviceIds.kitchenFridge1);
                devicesList.push(deviceIds.kitchenFridge2);
                devicesList.push(deviceIds.kitchenCoffeeMachine1);
                devicesList.push(deviceIds.kitchenCoffeeMachine2);
			    }else if (t.includes("bathroom") || t.includes("from the bathroom")) {
                devicesList.push(deviceIds.bathroomWashingMashine1);
                devicesList.push(deviceIds.bathroomWashingMashine2);
                devicesList.push(deviceIds.bathroomDryer1);
                devicesList.push(deviceIds.bathroomDryer2);
			    }else{
                devicesList.push(deviceIds.kitchenDishWasher1);
                devicesList.push(deviceIds.kitchenDishWasher2);
                devicesList.push(deviceIds.kitchenFridge1);
                devicesList.push(deviceIds.kitchenFridge2);
                devicesList.push(deviceIds.kitchenCoffeeMachine1);
                devicesList.push(deviceIds.kitchenCoffeeMachine2);
                devicesList.push(deviceIds.bathroomWashingMashine1);
                devicesList.push(deviceIds.bathroomWashingMashine2);
                devicesList.push(deviceIds.bathroomDryer1);
                devicesList.push(deviceIds.bathroomDryer2);
                }
			}
			if (t.includes("washing machine")) {
                if(t.includes("upper")){
					devicesList.push(deviceIds.bathroomWashingMashine1);
                }else if(t.includes("both machines") || t.includes("both washing machines")){
                    devicesList.push(deviceIds.bathroomWashingMashine1);
                    devicesList.push(deviceIds.bathroomWashingMashine2);
                }else{
                    devicesList.push(deviceIds.bathroomWashingMashine2);
                }
			}
			if (t.includes("dryer")) {
                if(t.includes("the small") || t.includes("smaller")){
                    devicesList.push(deviceIds.bathroomDryer2);
                }else if(t.includes("both dryers")){
                    devicesList.push(deviceIds.bathroomDryer1);
                    devicesList.push(deviceIds.bathroomDryer2);
                }else{
                    devicesList.push(deviceIds.bathroomDryer1);
                }
			}
			if (t.includes("dishwasher")) {
                if(t.includes("next to the sink") || t.includes("left of the sink")){
                    devicesList.push(deviceIds.kitchenDishWasher2);
                }else{
                    devicesList.push(deviceIds.kitchenDishWasher1);
                }
			}
			if (t.includes("freezer")) {
					devicesList.push(deviceIds.kitchenFreezer);
			}
			if (t.includes("refrigerator") || t.includes("fridge")) {
                if(t.includes("upper") || t.includes("left")){
					devicesList.push(deviceIds.kitchenFridge2);
                }else if(t.includes("both fridges")){
                    devicesList.push(deviceIds.kitchenFridge1);
                    devicesList.push(deviceIds.kitchenFridge2);
                }else{
                    devicesList.push(deviceIds.kitchenFridge1);
                }
			}
            if (t.includes("coffee") || t.includes("coffee machine")) {
                if( t.includes("left")){
					devicesList.push(deviceIds.kitchenCoffeeMachine1);
                }else if(t.includes("both coffe machines") || t.includes("both machines") || t.includes("machines")){
                    devicesList.push(deviceIds.kitchenCoffeeMachine1);
                    devicesList.push(deviceIds.kitchenCoffeeMachine2);
                }else{
                    devicesList.push(deviceIds.kitchenCoffeeMachine2);
                }
			}
			
			if (devicesList.length === 0) {
                focusedDevices.value.forEach(device => {
                devicesList.push(device);
            });
			
			}

			return devicesList;
		}

        // the big and small dryer
        // the big and small washing machine
        // the upper fridge / the lower fridge
    function checkForTimePeriod(t) {
			var timePeriod = TimePeriod.YESTERDAY;

			if (t.includes("today")) {
				timePeriod = TimePeriod.TODAY;
			} else if (t.includes("yesterday")) {
				timePeriod = TimePeriod.YESTERDAY;
			} else if (t.includes("last week") || t.includes("week")) {
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
  border-radius: 10px 10px 0 0;

  .speech-input__bar {
    height: 50px;
    margin: auto;
    color: var(--color-primary);
    display: flex;
    align-items: center;
    font-size: 20px;
    background-color: var(--color-tertiary);
    margin: 30px 0;
    padding: 10px 0 10px 50px;

    #speech-input__icon-wave {
      width: 25px;
      height: 100%;
      vertical-align: middle;
    }
  }

	.speech-input__btn {
		border-color: var(--color-primary);
	}

	.transcript {
		padding-left: 20px;
	}
}
</style>