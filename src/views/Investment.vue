<template>
  <v-app>
    <v-main class="main">

      <!-- Sidebar -->
      <Sidebar :drawerOpen="drawerOpen" :collapsed="isSidebarCollapsed" :isMobile="isMobile"
        @update:drawerOpen="drawerOpen = $event" />

      <v-container fluid class="main-content pa-4">

        <!-- Header -->
        <Header :isDarkMode="isDarkMode" :isMobile="isMobile" @toggle-sidebar="toggleSidebar" />

        <!-- Stats -->
        <v-row class="stats mt-4" dense>
          <v-col cols="12" sm="3">
            <StatCard title="Total Successful Investment" :value="formatCurrencyCompact(totalInvestmentAmount)" icon="mdi-transfer"
              iconColor="#22c55e" :subtext="`${formatCurrency(totalInvestmentAmount)} From ${totalInvestmentCount} Investments`" />
          </v-col>
          <v-col cols="12" sm="3">
            <StatCard title="Completed Investment" :value="completedInvestments" icon="mdi-cash-check"
              iconColor="#ef4444" :subtext="`From ${totalInvestmentCount} Investments`" />
          </v-col>
          <v-col cols="12" sm="3">
            <StatCard title="Investment Count" :value="totalInvestmentCount" icon="mdi-counter"
              iconColor="#22c55e" :subtext="`From ${totalInvestmentCount} Investments`" />
          </v-col>
          <v-col cols="12" sm="3">
            <StatCard title="Active Investment" :value="activeInvestments" icon="mdi-cash-fast"
              iconColor="#ef4444" :subtext="`From ${totalInvestmentCount} Investments`" />
          </v-col>
        </v-row>

        <!-- Stats row 2 -->
        <v-row class="stats mt-4" dense>
          <v-col cols="12" sm="3">
            <StatCard title="Accumulated Interest" :value="formatCurrencyCompact(totalInterestAmount)" icon="mdi-card-plus-outline"
              iconColor="#22c55e" :subtext="`From ${totalInvestmentCount} Investments`" />
          </v-col>
          <v-col cols="12" sm="3">
            <StatCard title="Pending Investment" :value="pendingInvestments" icon="mdi-cash-lock"
              iconColor="#ef4444" :subtext="`From ${totalInvestmentCount} Investments`" />
          </v-col>
          <!-- <v-col cols="12" sm="3">
            <StatCard title="Investment Count" :value="totalInvestmentCount" icon="mdi-cash-lock"
              iconColor="#22c55e" subtext="24 new since last visit" />
          </v-col>
          <v-col cols="12" sm="3">
            <StatCard title="Active Investment" :value="activeInvestments" icon="mdi-account-group-outline"
              iconColor="#ef4444" subtext="24 new since last visit" />
          </v-col> -->
        </v-row>

        <!-- Table Card -->
        <v-card class="table-card mt-6">

          <div class="table-header flex justify-between align-center flex-wrap">
            <!-- Left side: search + clear -->
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 8px;">
              <InputText v-model="filters['global'].value" placeholder="Search Investments..." />
              <Button type="button" icon="pi pi-filter-slash" label="Clear" variant="outlined" @click="clearFilters" />
            </div>
          </div>

          <!-- PrimeVue DataTable with search -->
          <DataTable v-model:filters="filters" :value="investments" paginator :rows="10" dataKey="id"
            stripedRows class="modern-table" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem"
            filterDisplay="menu" :globalFilterFields="['user.profile.firstname', 'user.profile.lastname', 'product.name', 'user.email']">

            <!-- Empty table -->
            <template #empty>
              No Investment found.
            </template>

            <!-- Loading state -->
            <template #loading>
              Loading Investment...
            </template>

            <!-- Product Column -->
            <Column header="Customer">
              <template #body="slotProps">
                <div class="product-cell">
                  <img
                    :src="slotProps.data.product.image ? `${STORAGE_URL}/${slotProps.data.product.image}` : defaultImage"
                    class="product-image" />
                  <div>
                    <div class="product-name">{{ slotProps.data.user.profile.account_id }}</div>
                    <div class="product-desc">{{ truncate(slotProps.data.user.profile.firstname) }} {{ truncate(slotProps.data.user.profile.lastname)[0] }}</div>
                  </div>
                </div>
              </template>
            </Column>

            <!-- Status Column -->
            <Column header="Product">
              <template #body="slotProps">
                <div class="product-name">{{ slotProps.data.product.name }}</div>
              </template>
            </Column>

            <!-- Status Column -->
            <Column header="Status">
              <template #body="slotProps">
                <span :class="['status-pill', slotProps.data.status ? 'status-active' : 'status-completed']">
                  {{ slotProps.data.status ? 'Active' : 'Completed' }}
                </span>
              </template>
            </Column>

            <!-- Status Column -->
            <Column header="Amount">
              <template #body="slotProps">
                {{ formatCurrency(slotProps.data.price) }}
              </template>
            </Column>

            <!-- Status Column -->
            <Column header="Interest">
              <template #body="slotProps">
                <div class="">{{ formatCurrency(slotProps.data.accumulated_yield) }}</div>
                <div class="">@ {{ parseFloat(slotProps.data.product.interest_rate) }}% p.a</div>
              </template>
            </Column>

            <!-- Created Column -->
            <Column header="Maturity Date">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.maturity_date) }}
              </template>
            </Column>

            <!-- Yield Column -->
            <Column header="Current Yield">
              <template #body="slotProps">
                {{ formatCurrency(slotProps.data.accumulated_yield) }}
              </template>
            </Column>

            <!-- Payout -->
            <Column header="Expected Payout">
              <template #body="slotProps">
                {{ formatCurrency(slotProps.data.expected_payout) }}
              </template>
            </Column>


          </DataTable>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue"
import Sidebar from "@/components/Sidebar.vue"
import Header from "@/components/Header.vue"
import StatCard from "@/components/StatCard.vue"
import { useAuthStore } from "@/store/auth"
import { useInvStore } from "@/store/investment"
import { STORAGE_URL } from "@/api/env"
import { formatCurrencyCompact, formatCurrency, formatDate } from "@/util"

import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Button from "primevue/button"
import InputText from "primevue/inputtext"


const inv = useInvStore();
const auth = useAuthStore()

const isSidebarCollapsed = ref(false)
const drawerOpen = ref(false)
const isMobile = ref(false)
const filters = ref({ global: { value: null, matchMode: "contains" } })
const defaultImage = "https://gravatar.com/avatar/"

/* Mobile */
const toggleSidebar = () => {
  if (isMobile.value) drawerOpen.value = !drawerOpen.value
  else isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  drawerOpen.value = !isMobile.value
}

/* Lifecycle */
onMounted(async () => {
  checkMobile()
  window.addEventListener("resize", checkMobile)
  await inv.loadInvestment()
  await auth.loadPartner()
})

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile)
})

/* Products */
const investments = computed(() => inv.investments || [])

/* Utils */
const truncate = (text) => !text ? "" : text.length > 150 ? text.substring(0, 150) + "..." : text


//Stat Card
const activeInvestments = computed(() =>
  investments.value.filter(i => i.status === "active").length
)

const completedInvestments = computed(() =>
  investments.value.filter(i => i.status === "completed").length
)

const pendingInvestments = computed(() =>
  investments.value.filter(i => i.status === "pending").length
)

const totalInvestmentCount = computed(() => investments.value.length)

const totalInvestmentAmount = computed(() =>
  investments.value.reduce((sum, inv) => sum + Number(inv.price || 0), 0)
)

const totalInterestAmount = computed(() =>
  investments.value.reduce((sum, inv) => sum + Number(inv.accumulated_yield || 0), 0)
)


// /* Actions */
// const editProduct = (product) => console.log("Edit", product)
// const deleteProduct = (product) => console.log("Delete", product)

/* Clear filters */
const clearFilters = () => {
  filters.value = { global: { value: null, matchMode: "contains" } }
}

// Edit Modal
// const editDialog = ref(false)
// const selectedProduct = ref({})

// const openEditModal = (product) => {
//   selectedProduct.value = { ...product } // copy to avoid mutating table directly
//   editDialog.value = true
// }

// const closeEditModal = () => editDialog.value = false
// const saveEdit = () => {
//   console.log("Save", selectedProduct.value)
//   editDialog.value = false
// }
</script>

<style scoped>
.main {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  background: #f8fafc;
}

/* Card */
.table-card {
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
}

/* Header */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* Table */
.modern-table {
  border: none;
}

/* Product */
.product-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-image {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}

.product-name {
  font-weight: 700;
}

.product-desc {
  font-size: 16px;
  color: #64748b;
}

/* Status */
.status-pill {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status-active {
  background: #ecfdf5;
  color: #0b8ba4;
}

.status-inactive {
  background: #fef2f2;
  color: #dc2626;
}

.status-completed {
  background: #fef2f2;
  color: #16a34a;
}

/* Search input */
.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 8px;
  color: #64748b;
}

.search-wrapper input {
  padding-left: 28px;
}

/* Button */
.theme-button {
  height: 46px;
  background: #000;
  color: #fff;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.25s ease;
}
:deep(.modern-table .p-datatable-thead > tr > th) {
  background: #eef7f0;
  color: #065f46;
  font-weight: 600;
  border-bottom: 2px solid #c1edc3;
}
</style>
