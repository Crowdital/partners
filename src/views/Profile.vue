<template>
  <v-app>
    <v-main class="main">

      <!-- Sidebar -->
      <Sidebar :drawerOpen="drawerOpen" :collapsed="isSidebarCollapsed" :isMobile="isMobile"
        @update:drawerOpen="drawerOpen = $event" />

      <!-- Main Content -->
      <v-container fluid class="main-content pa-6">

        <!-- Header -->
        <Header :isDarkMode="isDarkMode" :isMobile="isMobile" @toggle-sidebar="toggleSidebar"
          @toggle-darkmode="toggleDarkMode" />

        <!-- Loading -->
        <div v-if="loading" class="loader">
          <v-progress-circular indeterminate color="primary" />
        </div>

        <!-- PROFILE CARD -->
        <v-card v-else class="profile-card pa-6">

          <!-- Top Section -->
          <v-row align="center">

            <!-- Avatar -->
            <v-col cols="12" md="3" class="text-center">
              <v-avatar size="120">
                <img :src="user.avatar" />
              </v-avatar>

              <div class="mt-4 profile-name">
                {{ user.name }}
              </div>

            </v-col>

            <!-- Basic Info -->
            <v-col cols="12" md="9">

              <v-row>

                <v-col cols="12" md="6">
                  <div class="detail-label">Full Name</div>
                  <v-text-field v-model="user.name" variant="outlined" density="comfortable" />
                </v-col>

                <v-col cols="12" md="6">
                  <div class="detail-label">Email</div>
                  <v-text-field v-model="user.email" variant="outlined" density="comfortable" />
                </v-col>

                <v-col cols="12" md="6">
                  <div class="detail-label">Phone</div>
                  <v-text-field v-model="user.phone" variant="outlined" density="comfortable" />
                </v-col>

                <v-col cols="12" md="6">
                  <div class="detail-label">Company</div>
                  <v-text-field v-model="user.company" variant="outlined" density="comfortable" />
                </v-col>

              </v-row>

            </v-col>

          </v-row>

          <v-divider class="my-6" />

          <!-- Address Section -->
          <v-row>

            <v-col cols="12">
              <div class="detail-label">Address</div>
              <v-text-field v-model="user.address" variant="outlined" density="comfortable" />
            </v-col>

          </v-row>

          <v-divider class="my-6" />



          <!-- Save Button -->
          <div class="mt-6">

            <button type="submit" :disabled="loading" class="save-button">
              <span v-if="!loading">Save Changes</span>
              <span v-else>Saving Details…</span>
            </button>
          </div>

        </v-card>

      </v-container>

    </v-main>
  </v-app>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import Sidebar from "@/components/Sidebar.vue"
import Header from "@/components/Header.vue"
import { useAuthStore } from "@/store/auth"

const auth = useAuthStore()

const loading = ref(false)

//const partnerName = computed(() => auth.partner?.partner?.name || '')
// const partnerEmail = computed(() => auth.partner?.email || '')
// const partnerPhone = computed(() => auth.partner?.phone || '')
// const partnerWebsite = computed(() => auth.partner?.website || '')
// const partnerAddress = computed(() => auth.partner?.address || '')
// const partnerLogo = computed(() => auth.partner?.partner_image|| '')
//const defaultImage = "https://gravatar.com/avatar/"

const user = ref({
  //name: auth.partner?.partner?.name,
  email: auth.partner?.email,
 phone: auth.partner?.phone,
  // website: auth.partner?.website,
  // address: auth.partner?.address,
  // avatar: auth.partner?.partner_image || defaultImage
})

const isSidebarCollapsed = ref(false)
const isDarkMode = ref(false)
const drawerOpen = ref(false)
const isMobile = ref(false)

const toggleSidebar = () => {
  if (isMobile.value) {
    drawerOpen.value = !drawerOpen.value
  } else {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
  }
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  drawerOpen.value = !isMobile.value
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
}

onMounted(async () => {
  checkMobile()
  window.addEventListener("resize", checkMobile)
  await auth.loadPartner()
  console.log(auth.partner)
})

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile)
})
</script>


<style scoped>
.main {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  background: #f3f4f6;
}

.profile-card {
  border-radius: 16px;
}

.profile-name {
  font-size: 20px;
  font-weight: 600;
}

.profile-role {
  font-size: 14px;
  color: #6b7280;
}

.detail-label {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #374151;
}

/* Button */
.save-button {
  width: 40%;
  height: 46px;
  background: #000;
  color: #fff;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.25s ease;
}

.save-button:hover {
  background: #292828;
}

.save-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
