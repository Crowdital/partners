import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/PartnerDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  // add more routes here
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
