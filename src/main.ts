import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { i18n } from "./i18n";
import "./style.css";
import App from "./App.vue";
import Calendar from "./pages/Calendar.vue";
import "./fontawesome";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { loadGoogleMaps } from "./utils/loadGoogleMaps";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const routes = [
  { path: "/monthly-view2", component: Calendar },
  { path: "/monthly-view2/:taskId", component: Calendar },
];

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
      .use(VueQueryPlugin)
      .use(i18n)
      .use(Toast)
      .component("font-awesome-icon", FontAwesomeIcon)
      .mount("#app");
  })
  .catch((error) => {
    console.error("Google Maps failed to load:", error);
  });
