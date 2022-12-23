<template>
	<div class="voice col-7">
			<div class="voice__bar">
			<button @click="toggleMic"><img :src="voiceWaveImg" id="voice__icon-wave" class="icon" /></button>
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
					const result = evt.results[i];
					if (result.isFinal) checkForCommand(result);
				}
				const t = Array.from(evt.results)
					.map(result => result[0])
					.map(result => result.transcript)
					.join('');
				
				transcript.value = t;
			}
		})
		const checkForCommand = (result) => {
			const t = result[0].transcript;
			if (t.includes('stop recording') || 
						t.includes('stop')) {
				sr.stop()
						transcript.value = 'Ask me something about your devices energy consumption!';
			} else if (
				t.includes('what is the time') ||
				t.includes('what\'s the time') ||
						t.includes('time is')
			) {
				sr.stop();
				alert(new Date().toLocaleTimeString());
				setTimeout(() => sr.start(), 100);
			}
		}
		const toggleMic = () => {
			if (isRecording.value) {
				sr.stop();
			} else {
				sr.start();
			}
		}

    return { voiceWaveImg, toggleMic, transcript };
  }
}
</script>

<style lang="scss" scoped>
.voice {
  grid-row: span 1;
  background-color: var(--color-light);
  border-radius: 10px;

  .voice__bar {
    height: 50px;
    margin: auto;
    color: var(--color-secondary);
    display: flex;
    align-items: center;
    font-size: 20px;
    padding-left: 50px;
    background-color: var(--color-tertiary);
    margin: 30px 0;

    #voice__icon-wave {
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