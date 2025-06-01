import { createApp, defineCustomElement } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { i18n } from "./i18n";
import "./style.css";
import App from "./App.vue";
import Calendar from "./pages/Calendar.vue";
import "./fontawesome";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const routes = [
  { path: "/monthly-view2", component: Calendar },
  { path: "/monthly-view2/:taskId", component: Calendar },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const pinia = createPinia();

createApp(App)
  .use(router)
  .use(pinia)
  .use(VueQueryPlugin)
  .use(i18n)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
