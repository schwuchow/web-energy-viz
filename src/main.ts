import { createApp } from 'vue';
//import { VueWebSpeech }from 'vue-web-speech'
import './style.scss';
import { createPinia } from 'pinia';
import App from './App.vue';

const pinia = createPinia()
const app = createApp(App);

app.use(pinia);
app.mount('#app');
//App.use(VueWebSpeech);
