<template>
  <v-app-bar app height="64" color="white" flat class="header-bar">
    <!-- Left section: menu icon + title -->
    <div class="header-left">
      <!-- <v-btn icon @click="toggleSidebar">
        <v-icon size="24">mdi-menu</v-icon>
      </v-btn>
      <v-btn icon v-if="isMobile" @click="drawerOpen = false" class="close-btn">
        <v-icon>mdi-close</v-icon>
      </v-btn> -->
      <v-btn icon @click="$emit('toggle-sidebar')">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-toolbar-title class="dashboard-title">{{ $route.meta.title }}</v-toolbar-title>
    </div>

    <!-- Spacer pushes right section to the far right -->
    <v-spacer />

    <!-- Right section: dark mode + profile -->
    <div class="header-right">
      <!-- Dark mode toggle -->
      <!--v-btn icon @click="toggleDarkMode">
        <v-icon>{{ props.isDarkMode ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn-->

      <!-- Profile Menu -->
      <v-menu offset-y>
        <template #activator="{ props }">
          <!-- <v-btn v-bind="props" icon class="profile-btn">
            <v-avatar size="40">
              <img :src="profileImageUrl" alt="Profile" />
            </v-avatar>
          </v-btn> -->
          <div class="profile-wrapper" v-bind="props">
      
            <v-avatar size="40">
              <img :src="profileImageUrl" alt="Profile" />
            </v-avatar>

            <div class="profile-text">
              <div class="profile-name">{{ partnerName }}</div>
              <div class="profile-email">{{ partnerEmail }}</div>
            </div>

          </div>
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
import { computed, onMounted } from "vue"
import { useRouter } from 'vue-router'
import { useAuthStore } from "@/store/auth"
import { STORAGE_URL } from "@/api/env"

// const props = defineProps({
//   isMobile: { type: Boolean, default: false }
// })
//const emit = defineEmits(['toggle-sidebar', 'toggle-darkmode'])


const auth = useAuthStore()
const router = useRouter()

// const toggleSidebar = () => {
//   console.log('Header: toggle-sidebar clicked!')
//   emit('toggle-sidebar')
// }


const profileImageUrl = computed(() => {
  // Check if partner is loaded
  if (!auth.partner || Object.keys(auth.partner).length === 0) return "https://i.pravatar.cc/100"

  // Return full URL
  return `${STORAGE_URL}/${auth.partner.partner.partner_image}`
})

const partnerName = computed(() => auth.partner?.partner?.name || "Administrator")
const partnerEmail = computed(() => auth.partner?.partner?.email || "")

onMounted(async () => {
  //await auth.loadPartner()
  // console.log("Auth store:", auth.partner.partner)
  // console.log("Partner image:", auth.partner.partner.partner_image)
})


const goToProfile = () => router.push('/profile')
const goToSettings = () => router.push('/settings')
const logout = () => {
  // localStorage.removeItem('token')
  // router.push('/login')
  auth.logout()
  router.push({ name: "Login" })
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
  margin-left: 4px;
  /* snug against menu icon */
  font-size: 1.25rem;
  /* optional, match text-h6 */
}

/* Right section: dark mode + profile */
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 1em;
  /* space between dark mode and profile */
}

.profile-btn {
  padding: 0;
}

.profile-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.profile-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.profile-name {
  font-weight: 600;
  font-size: 14px;
}

.profile-email {
  font-size: 12px;
  color: #777;
}
</style>
