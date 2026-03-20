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
            <StatCard title="Total Investor" :value="totalInvestor" subtext="Across all investment"
              icon="mdi-account-group-outline" iconColor="#64cf69" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <StatCard title="Total Investment" :value="formatCurrencyCompact(totalInvestment)"
              subtext="Across all investment" icon="mdi-transfer" iconColor="#64cf69" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <StatCard title="Total Product" :value="totalProducts" subtext="Found in portfolio"
              icon="mdi-briefcase-outline" iconColor="#64cf69" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <StatCard title="Wallet Balance" :value="formatCurrencyCompact(walletBalnce)" subtext="As of today"
              icon="mdi-wallet-outline" iconColor="#64cf69" />
          </v-col>
        </v-row>

        <!-- Stat Cards row 2-->
        <v-row class="stats mt-4" dense>
          <v-col cols="12" sm="6" md="3">
            <StatCard title="Average Investment" :value="formatCurrency(averageInvestment)"
              subtext="Across all investment" icon="mdi-ab-testing" iconColor="#64cf69" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <StatCard title="Investments This Month" :value="formatCurrency(monthInvestment)"
              subtext="Across all investment" icon="mdi-calendar-start-outline" iconColor="#64cf69" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <StatCard title="Estimated Payout" :value="formatCurrencyCompact(expectedPayout)"
              subtext="Across all investment" icon="mdi-bank-transfer-out" iconColor="#64cf69" />
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <StatCard title="Matured Investment" :value="formatCurrency(matureThisMonth)" subtext="As of today"
              icon="mdi-gauge-full" iconColor="#64cf69" />
          </v-col>
        </v-row>

        <!-- Large content box (chart) -->
        <v-card class="large-box mt-6 pa-4">
          <!-- Placeholder: Table or Chart -->
          <v-row>
            <v-col cols="12" sm="3">
              <Skeleton v-if="loading" height="250px" />
              <Chart v-if="!loading && stat" type="doughnut" :data="chartData" :options="chartOptions" :key="doughnutKey" class="w-full" />
            </v-col>

            <v-col cols="12" sm="9">
              <div class="chart-container"><Chart type="bar" :data="barChartData" :options="barChartOptions" style="height:400px" /></div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Large content box (Investor table) -->
        <v-card class="large-box mt-6 pa-4">
          <!-- Placeholder: Table or Chart -->
          <v-row>
            <v-col cols="12" sm="12">
              <h5>Investors Log</h5>
              <!-- PrimeVue DataTable with search -->
              <DataTable v-model:expandedRows="expandedRows" :value="investors" dataKey="id" paginator :rows="10"
                stripedRows class="modern-table" tableStyle="min-width: 60rem" @rowExpand="onRowExpand"
                @rowCollapse="onRowCollapse">

                <!-- Empty table -->
                <template #empty>
                  No Data found.
                </template>

                <!-- Loading state -->
                <template #loading>
                  Loading Data...
                </template>
                <Column expander style="width: 3rem" />
                <!-- Product Column -->
                <Column header="Customer ID">
                  <template #body="slotProps">
                    <div class="product-cell">
                      <div>
                        <div class="product-name">{{ slotProps.data.user?.profile?.account_id }}</div>
                      </div>
                    </div>
                  </template>
                </Column>

                <!--User Column-->
                <Column header="Total Invested">
                  <template #body="slotProps">
                    <div class="product-cell">
                      <div>
                        <div class="product-name">{{ formatCurrency(slotProps.data.total_invested) }}
                        </div>
                      </div>
                    </div>
                  </template>
                </Column>

                <!--Amount Column-->
                <Column header="Total Portfolio">
                  <template #body="slotProps">
                    <div class="product-cell">
                      <div>
                        {{ slotProps.data.total_investments }}
                      </div>
                    </div>
                  </template>
                </Column>

                <!--Type Column-->
                <!-- <Column header="Type">
                  <template #body="slotProps">
                    <div class="product-cell">
                      <div>
                        {{ slotProps.data.type }}
                      </div>
                    </div>
                  </template>
                </Column> -->

                <!-- Status Column -->
                <!-- <Column header="Status">
                  <template #body="slotProps">
                    <span :class="['status-pill', slotProps.data.status ? 'status-active' : 'status-inactive']">
                      {{ slotProps.data.status ? 'Successful' : 'Pending' }}
                    </span>
                  </template>
                </Column> -->

                <!--Source Column-->
                <!-- <Column header="Source">
                  <template #body="slotProps">
                    <div class="product-cell">
                      <div>
                        {{ slotProps.data.transaction_source }}
                      </div>
                    </div>
                  </template>
                </Column> -->

                <!-- Created Column -->
                <Column header="Last Investment Date">
                  <template #body="slotProps">
                    {{ formatDate(slotProps.data.last_investment_date) }}
                  </template>
                </Column>

                <template #expansion="slotProps">
                  <div class="p-4">
                    <h5>Investment Details</h5>

                    <DataTable class="inner" :value="slotProps.data.user?.orders || []">

                      <Column header="Order ID">
                        <template #body="order">
                          {{ order.data.order_id }}
                        </template>
                      </Column>

                      <Column header="Product">
                        <template #body="order">
                          {{ order.data.product?.product_name }}
                        </template>
                      </Column>

                      <Column header="Amount">
                        <template #body="order">
                          {{ formatCurrency(order.data.price) }}
                        </template>
                      </Column>

                      <Column header="Current Yield">
                        <template #body="order">
                          {{ formatCurrency(order.data.accumulated_yield) }}
                        </template>
                      </Column>

                      <Column header="Payout">
                        <template #body="order">
                          {{ formatCurrency(order.data.expected_payout) }}
                        </template>
                      </Column>

                      <Column header="Order Date">
                        <template #body="order">
                          {{ formatDate(order.data.created_at) }}
                        </template>
                      </Column>

                      <Column header="Maturity Date">
                        <template #body="order">
                          {{ formatDate(order.data.maturity_date) }}
                        </template>
                      </Column>

                    </DataTable>
                  </div>
                </template>


              </DataTable>
            </v-col>
          </v-row>
        </v-card>

      </v-container>

    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue"
import Sidebar from "@/components/Sidebar.vue"
import Header from "@/components/Header.vue"
import StatCard from "@/components/StatCard.vue"
import Chart from 'primevue/chart'
import { useAuthStore } from "@/store/auth"
import { formatCurrencyCompact, formatCurrency, formatDate } from "@/util"

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

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
const stat = computed(() => auth.stat)

const totalInvestor = computed(() => stat.value?.totalInvestors)
const totalInvestment = computed(() => stat.value?.totalInvestments)
const walletBalnce = computed(() => stat.value?.walletBalance)
const totalProducts = computed(() => stat.value?.totalProducts)
const averageInvestment = computed(() => stat.value?.averageInvestment)
const monthInvestment = computed(() => stat.value?.investmentsThisMonth)
const expectedPayout = computed(() => stat.value?.totalExpectedPayout)
const matureThisMonth = computed(() => stat.value?.maturingThisMonth)
const investors = computed(() => stat.value?.investors || [])
const doughnutKey = ref(0)

const loading = ref(true)

onMounted(async () => {
  checkMobile()
  window.addEventListener("resize", checkMobile)
  await auth.loadPartner()
  await auth.loadPartnerStat()
  loading.value = false
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
  labels: ['Total Investments', 'Withdrawals'],
  datasets: [
    {
      data: [
        stat.value?.totalInvestments || 0,
        stat.value?.totalWithdrawal || 0
      ],
      backgroundColor: [
        '#66BB6A',
        '#EF5350'
      ],
      hoverBackgroundColor: [
        '#81C784',
        '#E57373'
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

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

const formatMonthlyData = (apiData) => {
  const result = new Array(12).fill(0)

  apiData?.forEach(item => {
    const date = new Date(item.month)
    const monthIndex = date.getMonth() // 0 = Jan

    result[monthIndex] = Number(item.total)
  })

  return result
}

const barChartData = computed(() => {
  return {
    labels: months,
    datasets: [
      {
        label: 'Investments',
        data: formatMonthlyData(stat.value?.monthlyInvestments),
        backgroundColor: '#64cf69'
      },
      {
        label: 'Withdrawals',
        data: formatMonthlyData(stat.value?.monthlyWithdrawals),
        backgroundColor: '#EF5350'
      }
    ]
  }
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

/**===================== Table ================== */
const expandedRows = ref([])

const onRowExpand = (event) => {
  console.log("Row Expanded:", event.data)
}

const onRowCollapse = (event) => {
  console.log("Row Collapsed:", event.data)
}

watch(stat, () => {
  doughnutKey.value++
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

:deep(.modern-table .inner .p-datatable-thead > tr > th) {
  background: #ffffff;
  color: #065f46;
  font-weight: 600;
  border-bottom: 2px solid #c1edc3;
}
</style>
