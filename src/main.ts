import { createApp } from 'vue';
import Notifications from 'notiwind';
import './index.css';
import App from './App.vue';

createApp(App).use(Notifications).mount('#app');
