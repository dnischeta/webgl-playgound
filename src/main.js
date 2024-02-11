import { createApp } from "vue";
import PrimeVue from "primevue/config";
import App from "./App.vue";
import { router } from "./router";

import "primevue/resources/themes/aura-light-green/theme.css";

createApp(App).use(router).use(PrimeVue).mount("#app");
