import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { VueQueryPlugin } from '@tanstack/vue-query';
import App from './App.vue';
import router from './router/index.js';
import { pinia } from './stores/index.js';
import { i18n } from './i18n/index.js';
import { useAuthStore } from './stores/auth.js';
import './styles/main.css';

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(PrimeVue, { theme: { preset: Aura } });
app.use(VueQueryPlugin);

app.mount('#app');

const authStore = useAuthStore();
authStore.initFromKeycloak().catch(err => {
  console.error('[auth] init error:', err);
});
