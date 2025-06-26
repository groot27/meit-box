import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import { i18n } from "@/i18n";
import "@/style.css";
import App from "@/App.vue";
import "@/fontawesome";
import { loadGoogleMaps } from "@/utils/loadGoogleMaps";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import Dashboard from "@/pages/Dashboard.vue";

const routes = [{ path: "/dashboard", component: Dashboard }];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const pinia = createPinia();

const GOOGLE_API_KEY = "AIzaSyD7fBBrfAmRTdLCO549jxZP3ofuw763zuQ";

loadGoogleMaps(GOOGLE_API_KEY)
  .then(() => {
    createApp(App)
      .use(router)
      .use(pinia)
      .use(i18n)
      .use(Toast)
      .component("font-awesome-icon", FontAwesomeIcon)
      .mount("#app");
  })
  .catch((error) => {
    console.error("Google Maps failed to load:", error);
  });
