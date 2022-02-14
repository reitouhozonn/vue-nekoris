import { createApp } from 'vue'
import App from './App.vue'

import { RouteRecordRaw, createWebHistory, createRouter } from 'vue-router';


import TopPage from "./pages/TopPage.vue";
import PlayPage from "./pages/PlayPage.vue";


const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "TopPage",
        component: TopPage,
    },
    {
        path: "/play",
        name: "PlayPage",
        component: PlayPage
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});


createApp(App).use(router).mount('#app');
