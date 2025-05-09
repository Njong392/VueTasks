import { createRouter, createWebHistory } from "vue-router";
import ListOfCommandsView from "@/components/Order.vue";
import CreateCommandView from "@/views/CreateCommandView.vue";
import ClientTable from "@/components/Client.vue";
import CustomerType from "@/components/CustomerType.vue";
import NamingSeries from "@/components/NamingSeries.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: ListOfCommandsView,
    },
    {
      path: "/create",
      name: "create",
      component: CreateCommandView,
    },
    {
      path: "/client",
      name: "client",
      component: ClientTable,
    },
    {
      path: "/types",
      name: "types",
      component: CustomerType,
    },
    {
      path: "/naming",
      name: "naming",
      component: NamingSeries,
    }
  ],
});

export default router;
