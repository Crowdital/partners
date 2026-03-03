import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/PartnerDashboard.vue'
import Login from '@/views/Login.vue'

const routes = [
    {
        path: '/',
        redirect: "/dashboard",
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true },  //checks if a user is logged in before allowing them in
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { guestOnly: true }, //prevents logged in user from going back to login
    },
    // add more routes here
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    next({ name: "Login" });
  }
  else if (to.meta.guestOnly && token) {
    next({ name: "Dashboard" });
  }
   else {
    next();
  }
});

export default router
