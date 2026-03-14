import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/PartnerDashboard.vue'
import Product from '@/views/Product.vue'
import Transaction from '@/views/Transaction.vue'
import Investment from '@/views/Investment.vue'
import Wallet from '@/views/Wallet.vue'
import Login from '@/views/Login.vue'
import Profile from '@/views/Profile.vue'
import ProductDetail from '@/views/ProductDetails.vue'

const routes = [
    {
        path: '/',
        redirect: "/dashboard",
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true, title: 'Dashboard' },  //checks if a user is logged in before allowing them in
    },
    {
        path: '/products',
        name: 'Products',
        component: Product,
        meta: { requiresAuth: true, title: 'Products' },
    },
    {
        path: "/products/:id",
        name: "ProductDetails",
        component: ProductDetail,
        meta: { requiresAuth: true, title: 'Details' },
    },
    {
        path: '/transactions',
        name: 'Transactions',
        component: Transaction,
        meta: { requiresAuth: true, title: 'Transactions' },
    },
    {
        path: '/investments',
        name: 'Investments',
        component: Investment,
        meta: { requiresAuth: true, title: 'Investments' },
    },
    {
        path: '/wallets',
        name: 'Wallets',
        component: Wallet,
        meta: { requiresAuth: true, title: 'Wallets' },
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        meta: { requiresAuth: true, title: 'Profile' },
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
