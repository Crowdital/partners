<template>
  <v-app-bar
    app
    height="64"
    color="white"
    flat
    class="header-bar"
  >
    <!-- Left section: menu icon + title -->
    <div class="header-left">
      <v-btn icon @click="toggleSidebar">
        <v-icon size="28">mdi-menu</v-icon>
      </v-btn>
      <v-toolbar-title class="dashboard-title">Dashboard</v-toolbar-title>
    </div>

    <!-- Spacer pushes right section to the far right -->
    <v-spacer />

    <!-- Right section: dark mode + profile -->
    <div class="header-right">
      <!-- Dark mode toggle -->
      <v-btn icon @click="toggleDarkMode">
        <v-icon>{{ props.isDarkMode ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>

      <!-- Profile Menu -->
      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            class="profile-btn"
          >
            <v-avatar size="40">
              <img src="https://i.pravatar.cc/100" alt="Profile" />
            </v-avatar>
          </v-btn>
        </template>

        <v-list min-width="180">
          <v-list-item @click="goToProfile">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>

          <v-list-item @click="goToSettings">
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>

          <v-divider />

          <v-list-item @click="logout">
            <v-list-item-title class="text-error">Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  isDarkMode: { type: Boolean, default: false }
})
const emit = defineEmits(['toggle-sidebar', 'toggle-darkmode'])

const router = useRouter()

const toggleSidebar = () => {
  console.log('Header: toggle-sidebar clicked!')
  emit('toggle-sidebar')
}
const toggleDarkMode = () => {
  console.log('Header: toggle-darkmode clicked!', props.isDarkMode)
  emit('toggle-darkmode')
}

const goToProfile = () => router.push('/profile')
const goToSettings = () => router.push('/settings')
const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
}

/* Left section: menu + title */
.header-left {
  display: flex;
  align-items: center;
}

.dashboard-title {
  margin-left: 4px; /* snug against menu icon */
  font-size: 1.25rem; /* optional, match text-h6 */
}

/* Right section: dark mode + profile */
.header-right {
  display: flex;
  align-items: center;
  gap: 12px; /* space between dark mode and profile */
}

.profile-btn {
  padding: 0;
}
</style>
