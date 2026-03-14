<template>
  <v-app>
    <v-main class="main">

      <!-- Sidebar -->
      <Sidebar
        :drawerOpen="drawerOpen"
        :collapsed="isSidebarCollapsed"
        :isMobile="isMobile"
        @update:drawerOpen="drawerOpen = $event"
      />

      <!-- Main Content -->
      <v-container fluid class="main-content pa-4">

        <!-- Header -->
        <Header
          :isDarkMode="isDarkMode"
          :isMobile="isMobile"
          @toggle-sidebar="toggleSidebar"
          @toggle-darkmode="toggleDarkMode"
        />

        <!-- PROFILE PAGE -->
        <div class="profile-page">

          <div class="grid">

            <!-- LEFT PROFILE CARD -->
            <div class="col-12 md:col-4">
              <Card class="profile-card">

                <template #content>
                  <div class="profile-header">

                    <Avatar
                      image="https://i.pravatar.cc/150"
                      size="xlarge"
                      shape="circle"
                    />

                    <h3>{{ user.name }}</h3>
                    <p class="role">{{ user.role }}</p>

                    <Button
                      label="Upload Photo"
                      icon="pi pi-upload"
                      class="p-button-sm p-button-outlined mt-3"
                    />

                  </div>
                </template>

              </Card>
            </div>

            <!-- PROFILE DETAILS -->
            <div class="col-12 md:col-8">

              <Card>

                <template #title>
                  Profile Information
                </template>

                <template #content>

                  <div class="grid formgrid">

                    <div class="field col-12 md:col-6">
                      <label>Full Name</label>
                      <InputText v-model="user.name" />
                    </div>

                    <div class="field col-12 md:col-6">
                      <label>Email</label>
                      <InputText v-model="user.email" />
                    </div>

                    <div class="field col-12 md:col-6">
                      <label>Phone</label>
                      <InputText v-model="user.phone" />
                    </div>

                    <div class="field col-12 md:col-6">
                      <label>Company</label>
                      <InputText v-model="user.company" />
                    </div>

                    <div class="field col-12">
                      <label>Address</label>
                      <InputText v-model="user.address" />
                    </div>

                  </div>

                  <Button
                    label="Save Changes"
                    icon="pi pi-check"
                    class="mt-3"
                  />

                </template>

              </Card>

              <!-- PASSWORD SECTION -->

              <Card class="mt-4">

                <template #title>
                  Change Password
                </template>

                <template #content>

                  <div class="grid">

                    <div class="field col-12 md:col-6">
                      <label>Current Password</label>
                      <Password toggleMask />
                    </div>

                    <div class="field col-12 md:col-6">
                      <label>New Password</label>
                      <Password toggleMask />
                    </div>

                  </div>

                  <Button
                    label="Update Password"
                    icon="pi pi-lock"
                    class="p-button-warning mt-3"
                  />

                </template>

              </Card>

            </div>

          </div>

        </div>

      </v-container>

    </v-main>
  </v-app>
</template>

<script setup>

import { ref, onMounted, onUnmounted } from "vue"

import Sidebar from "@/components/Sidebar.vue"
import Header from "@/components/Header.vue"

import { useAuthStore } from "@/store/auth"

/* PrimeVue Components */
import Card from "primevue/card"
import Button from "primevue/button"
import InputText from "primevue/inputtext"
import Avatar from "primevue/avatar"
import Password from "primevue/password"

/* User Data */
const user = ref({
  name: "John Doe",
  email: "john@company.com",
  phone: "+234 801 234 5678",
  company: "Crowdital",
  role: "Partner Admin",
  address: "Lagos, Nigeria"
})

/* Layout States */
const isSidebarCollapsed = ref(false)
const isDarkMode = ref(false)
const drawerOpen = ref(false)
const isMobile = ref(false)

const auth = useAuthStore()

/* Toggle Sidebar */
const toggleSidebar = () => {

  if (isMobile.value) {
    drawerOpen.value = !drawerOpen.value
  } else {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
  }

}

/* Detect Mobile */
const checkMobile = () => {

  isMobile.value = window.innerWidth < 768

  if (!isMobile.value) {
    drawerOpen.value = true
  } else {
    drawerOpen.value = false
  }

}

/* Dark Mode */
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
}

/* Lifecycle */
onMounted(async () => {

  checkMobile()
  window.addEventListener("resize", checkMobile)

  await auth.loadPartner()

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
  background-color: #e5e7eb;
}

/* Profile */

.profile-page {
  padding: 20px;
}

.profile-card {
  text-align: center;
}

.profile-header h3 {
  margin-top: 10px;
}

.role {
  color: #6b7280;
  font-size: 14px;
}

.field label {
  display: block;
  font-weight: 500;
  margin-bottom: 6px;
}

</style>
