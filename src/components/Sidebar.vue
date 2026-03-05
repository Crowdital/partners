<template>
  <v-navigation-drawer
    v-model="drawerOpen"
    :temporary="isMobile"
    app
    floating
    :permanent="!isMobile"
    :width="(!isMobile && collapsed) ? 80 : 265"
    class="sidebar"
  >
    <!-- Logo -->
    <div class="logo-container">
      <img
        src="../assets/crowdital_logo_dark.png"
        class="logo-img"
        :style="{ width: collapsed ? '40px' : '12em' }"
        alt="Crowdital Logo"
      />
    </div>

    <!-- GENERAL -->
    <v-list nav density="compact" class="sidebar-list">
      <v-list-subheader v-if="!collapsed" class="section-title">GENERAL</v-list-subheader>

      <v-list-item
        v-for="item in generalLinks"
        :key="item.title"
        :to="item.to"
        router
        link
        class="sidebar-item"
        active-class="router-link-active"
      >
        <template #prepend>
          <v-icon :icon="item.icon" class="sidebar-icon" />
        </template>

        <v-list-item-title v-if="!collapsed" class="sidebar-text">
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <!-- ADMIN -->
    <v-list nav density="compact" class="sidebar-list mt-4">
      <v-list-subheader v-if="!collapsed" class="section-title">ADMIN</v-list-subheader>

      <v-list-item
        v-for="item in adminLinks"
        :key="item.title"
        :to="item.to"
        router
        link
        class="sidebar-item"
        active-class="router-link-active"
      >
        <template #prepend>
          <v-icon :icon="item.icon" class="sidebar-icon" />
        </template>

        <v-list-item-title v-if="!collapsed" class="sidebar-text">
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <!-- SETTINGS -->
    <v-list nav density="compact" class="sidebar-list mt-4">
      <v-list-subheader v-if="!collapsed" class="section-title">SETTINGS</v-list-subheader>

      <v-list-item
        v-for="item in settingsLinks"
        :key="item.title"
        :to="item.to"
        router
        link
        class="sidebar-item"
        active-class="router-link-active"
      >
        <template #prepend>
          <v-icon :icon="item.icon" class="sidebar-icon" />
        </template>

        <v-list-item-title v-if="!collapsed" class="sidebar-text">
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  collapsed: { type: Boolean, default: false }
})

//const emit = defineEmits(['update:collapsed'])

const drawerOpen = ref(true)
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  drawerOpen.value = !isMobile.value // desktop: open, mobile: closed initially
}

// const toggleDrawer = () => {
//   drawerOpen.value = true // always fully open on toggle
// }
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Watch prop to reactively collapse
watch(() => props.collapsed, () => {
  drawerOpen.value = true // keep drawer open but width will shrink via :style
})

const generalLinks = [
  { title: "Dashboard", to: "/dashboard", icon: "mdi-view-dashboard-outline" },
  { title: "Users", to: "/users", icon: "mdi-account-outline" },
  { title: "Transactions", to: "/transactions", icon: "mdi-swap-horizontal" },
  { title: "Investments", to: "/investments", icon: "mdi-briefcase-outline" },
  { title: "Wallets", to: "/wallets", icon: "mdi-wallet-outline" },
  { title: "Charges & Fees", to: "/fees", icon: "mdi-cash-multiple" },
  { title: "Taxes", to: "/taxes", icon: "mdi-receipt-outline" },
]

const adminLinks = [
  { title: "Products", to: "/products", icon: "mdi-package-variant-closed-check" },
  { title: "Product Types", to: "/product-types", icon: "mdi-shape-outline" },
  { title: "Interest Types", to: "/interest-types", icon: "mdi-percent-outline" },
  { title: "Risk Categories", to: "/risk-categories", icon: "mdi-alert-circle-outline" },
  { title: "Partners", to: "/partners", icon: "mdi-handshake-outline" },
]

const settingsLinks = [
  { title: "Roles", to: "/roles", icon: "mdi-account-key-outline" },
  { title: "Permissions", to: "/permissions", icon: "mdi-lock-outline" },
]
</script>

<style scoped>
/* Sidebar base */
.sidebar {
  /* background: #ffffff; */
  border-right: 1px solid #eee;
  font-family: "Roboto", sans-serif;
  transition: width 0.3s ease;
  background-color: #f3f4f6;
  padding: 12px; /* space around inner drawer */
  height: 100vh;
  display: flex;
  align-items: flex-start;
}

/* Logo */
.logo-container {
  display: flex;
  justify-content: center;
  padding: 16px 10px;
}

.logo-img {
  transition: width 0.3s ease;
}

/* FORCE list items to align left */
.sidebar-list {
  text-align: left;
}

/* Section titles */
.section-title {
  font-size: 12px;
  color: #9aa0a6;
  text-transform: uppercase;
  margin: 16px 0 8px;
  padding-left: 18px;
  justify-content: flex-start !important;
}

/* List item spacing */
.sidebar-item {
  padding-left: 18px !important;
  padding-right: 16px !important;
  min-height: 44px;
}

/* Force content to the left */
.sidebar-item .v-list-item__content {
  justify-content: flex-start !important;
  text-align: left !important;
}

/* Tighten icon → text spacing */
::v-deep(.v-list-item__prepend) {
  display: block !important;     /* overrides flex */
  min-width: unset !important;   /* removes reserved space */
  margin-inline-end: 0px;        /* control spacing */
  font-size: 20px;     /* try 14px – 16px */
  font-weight: 500;   /* optional: makes it cleaner */
  line-height: 1.4;
}

/* Remove extra content padding */
::v-deep(.v-list-item__content) {
  padding-left: 0 !important;
}

/* Icon appearance */
.sidebar-icon {
  color: #64cf69 !important;
  opacity: 1 !important;
  font-size: 20px;
}

/* Text */
.sidebar-text {
  font-size: 5rem;
  font-weight: 500;
  color: #1f2937;
  text-align: left;
  transition: opacity 0.2s ease;
}

/* Active item */
.router-link-active {
  background: rgba(100, 207, 105, 0.12);
}

.router-link-active .sidebar-text {
  color: #0f9d58;
  font-weight: 600;
}
</style>
