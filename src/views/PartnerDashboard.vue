<template>
  <v-app>
    <v-main class="main">

      <!-- Sidebar -->

      <!-- <Sidebar :collapsed="isSidebarCollapsed" /> -->
      <Sidebar :drawerOpen="drawerOpen" :collapsed="isSidebarCollapsed" :isMobile="isMobile"
        @update:drawerOpen="drawerOpen = $event" />


      <!-- Main content -->
      <v-container fluid class="main-content pa-4">

        <!-- Header -->
        <Header :isDarkMode="isDarkMode" :isMobile="isMobile" @toggle-sidebar="toggleSidebar"
          @toggle-darkmode="toggleDarkMode" />

        <!-- Stat Cards -->
        <v-row class="stats mt-4" dense>
          <v-col cols="12" sm="6" md="3">
            <StatCard title="Total Investor" value="1,234" subtext="24 new since last visit"
              icon="mdi-account-group-outline" iconColor="#64cf69" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <StatCard title="Total Invested" value="&#8358;56,700" subtext="24 new since last visit" icon="mdi-transfer"
              iconColor="#64cf69" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <StatCard title="Total Portfolio" value="890" subtext="24 new since last visit" icon="mdi-briefcase-outline"
              iconColor="#64cf69" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <StatCard title="Investment Balance" value="&#8358;12,345" subtext="24 new since last visit"
              icon="mdi-wallet-outline" iconColor="#64cf69" />
          </v-col>
        </v-row>

        <!-- Large content box (table/chart) -->
        <v-card class="large-box mt-6 pa-4">
          <!-- Placeholder: Table or Chart -->
         <v-row>
    <v-col cols="12" sm="3">
      <Chart
        type="doughnut"
        :data="chartData"
        :options="chartOptions"
        class="w-full"
      />
    </v-col>

    <v-col cols="12" sm="9">
      <Chart
        type="bar"
        :data="barChartData"
        :options="barChartOptions"
        class="h-[30rem] w-full"
      />
    </v-col>
  </v-row>
        </v-card>

      </v-container>

    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import Sidebar from "@/components/Sidebar.vue"
import Header from "@/components/Header.vue"
import StatCard from "@/components/StatCard.vue"
import Chart from 'primevue/chart'
import { useAuthStore } from "@/store/auth"

//const stats = ref();

const isSidebarCollapsed = ref(false)
const isDarkMode = ref(false)
const drawerOpen = ref(false)
const isMobile = ref(false)

const auth = useAuthStore()

/**============= handle Header emits ============*/
const toggleSidebar = () => {
  if (isMobile.value) {
    // On mobile: open/close drawer
    drawerOpen.value = !drawerOpen.value
  } else {
    // On desktop: collapse/expand sidebar
    isSidebarCollapsed.value = !isSidebarCollapsed.value
  }
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) drawerOpen.value = true // desktop always open
  else drawerOpen.value = false                 // mobile closed by default
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  //console.log('Layout: new isDarkMode:', isDarkMode.value)
}

onMounted(async () => {
  checkMobile()
  window.addEventListener("resize", checkMobile)
  await auth.loadPartner()
  // const res = await fetchDashboardData()
  // console.log(res.data) // partner info, investments, etc.
});

// Reactive computed properties
//const partnerName = computed(() => auth.partner?.partner?.name || '')
// const partnerEmail = computed(() => auth.partner?.email || '')
// const partnerPhone = computed(() => auth.partner?.phone || '')
// const partnerWebsite = computed(() => auth.partner?.website || '')
// const partnerAddress = computed(() => auth.partner?.address || '')

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile)
})

/**============= doughnut Chart option ============*/
const chartData = ref({
  labels: ['Outflow', 'Investment'],
  datasets: [
    {
      data: [70000, 120000],
      backgroundColor: [
        '#EF5350',
        '#66BB6A'
      ],
      hoverBackgroundColor: [
        '#E57373',
        '#81C784'
      ]
    }
  ]
})

const chartOptions = ref({
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
})

/**============= Bar chart option ===============*/
const barChartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Investments',
      data: [65, 59, 80, 81, 56, 55],
      backgroundColor: '#64cf69'
    },
    {
      label: 'Withdrawals',
      data: [28, 48, 40, 19, 86, 27],
      backgroundColor: '#EF5350'
    }
  ]
})

const barChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    }
  }
})
</script>

<style scoped>
.main {
  display: flex;
  min-height: 100vh;
  /* font-family: sans-serif; */
}

.sidebar {
  background-color: #f3f4f6;
  padding: 20px;
}

.main-content {
  flex: 1;
  background-color: #e5e7eb;
  /* rounded top corners */
  /* border-top-left-radius: 24px;
  border-top-right-radius: 24px; */

  /* background color */
  /* background-color: #ffffff; */

  /* ensure content below sidebar is clipped */
  /* overflow: hidden; */
}

.large-box {
  min-height: 300px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background-color: #fff;
}

/* Override v-card inside StatCard if needed */
.stats .v-card {
  text-align: center;
}
:deep(.modern-table .p-datatable-thead > tr > th) {
  background: #eef7f0;
  color: #065f46;
  font-weight: 600;
  border-bottom: 2px solid #c1edc3;
}
</style>
