<template>
    <v-app>
        <!-- Sidebar -->
        <Sidebar :collapsed="isSidebarCollapsed" />

        <!-- Header -->
        <Header :isDarkMode="isDarkMode" @toggle-sidebar="toggleSidebar" @toggle-darkmode="toggleDarkMode" />
        <!-- Main content -->
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'

// Reactive state
const isSidebarCollapsed = ref(false)
const isDarkMode = ref(false)

// Toggle sidebar collapse
const toggleSidebar = () => {
    console.log('Layout: toggleSidebar called! Current:', isSidebarCollapsed.value)
    isSidebarCollapsed.value = !isSidebarCollapsed.value
    console.log('Layout: new isSidebarCollapsed:', isSidebarCollapsed.value)
}

// Toggle dark mode
const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    // optional: also toggle Vuetify theme
    // $vuetify.theme.global.name = isDarkMode.value ? 'dark' : 'light'
}
</script>
