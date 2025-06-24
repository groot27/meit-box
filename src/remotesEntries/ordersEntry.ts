import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import { i18n } from "@/i18n";
import "@/style.css";
import App from "@/App.vue";
import "@/fontawesome";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import Orders from "@/pages/Orders.vue";
import { createVfm } from "vue-final-modal";
import "vue-final-modal/style.css";
const vfm = createVfm();

const routes = [{ path: "/order-list2", component: Orders }];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const pinia = createPinia();

createApp(App)
  .use(router)
  .use(pinia)
  .use(i18n)
  .use(Toast)
  .use(vfm)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
