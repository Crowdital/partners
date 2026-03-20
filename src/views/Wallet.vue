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
            <StatCard title="Wallet Balance" :value="formatCurrencyCompact(walletBalance)" icon="mdi-cash-multiple"
              iconColor="#22c55e" :subtext="`From ${totalTransationsCount} Requests`" />
          </v-col>
          <v-col cols="12" sm="3">
            <StatCard title="Completed Withrawal Request" :value="completedTransations" icon="mdi-cash-check"
              iconColor="#ef4444" :subtext="`From ${totalTransationsCount} Requests`" />
          </v-col>
          <v-col cols="12" sm="3">
            <StatCard title="Pending Withrawal Request" :value="pendingTransations" icon="mdi-cash-lock"
              iconColor="#22c55e" :subtext="`From ${totalTransationsCount} Requests`" />
          </v-col>
          <v-col cols="12" sm="3">
            <StatCard title="Total Withdrawal" :value="totalSuccesfullTransations" icon="mdi-account-group-outline"
              iconColor="#ef4444" :subtext="`From ${totalTransationsCount} Transaction`" />
          </v-col>
        </v-row>

        <!-- Table Card -->
        <v-card class="table-card mt-6">

          <div class="table-header flex justify-between align-center flex-wrap">
            <!-- Left side: search + clear -->
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 8px;">
              <InputText v-model="filters['global'].value" placeholder="Search Wallets..." />
              <Button type="button" icon="pi pi-filter-slash" label="Clear" variant="outlined" @click="clearFilters" />
            </div>
          </div>

          <!-- PrimeVue DataTable with search -->
          <DataTable v-model:filters="filters" :value="walletTr" paginator :rows="10" dataKey="id"
            stripedRows class="modern-table" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem"
            filterDisplay="menu" :globalFilterFields="['product_name', 'description']">

            <!-- Empty table -->
            <template #empty>
              No Transaction found.
            </template>

            <!-- Loading state -->
            <template #loading>
              Loading Transactions...
            </template>

           <!-- Product Column -->
            <Column header="Transaction ID">
              <template #body="slotProps">
                <div class="product-cell">
                  <div>
                    <div class="product-name">{{ slotProps.data.transaction_id }}</div>
                    <div class="product-desc">Reference: {{ slotProps.data.uuid }}</div>
                  </div>
                </div>
              </template>
            </Column>

            <!--User Column-->
            <Column header="Description">
              <template #body="slotProps">
                <div class="product-cell">
                  <div>
                    <div class="product-name">{{ slotProps.data.description }}</div>
                  </div>
                </div>
              </template>
            </Column>

            <!--Amount Column-->
            <Column header="Amount">
              <template #body="slotProps">
                <div class="product-cell">
                  <div>
                    {{ formatCurrency(slotProps.data.amount) }}
                  </div>
                </div>
              </template>
            </Column>

            <!--Type Column-->
            <Column header="Type">
              <template #body="slotProps">
                <div class="product-cell">
                  <div>
                    {{ slotProps.data.type }}
                  </div>
                </div>
              </template>
            </Column>

            <!-- Status Column -->
            <Column header="Status">
              <template #body="slotProps">
                <span :class="[
                  'status-pill',
                  slotProps.data.status === 'successful'
                    ? 'status-active'
                    : 'status-inactive'
                ]">
                  {{ slotProps.data.status === 'successful' ? 'Successful' : 'Pending' }}
                </span>
              </template>
            </Column>

            <!--Source Column-->
            <Column header="Source">
              <template #body="slotProps">
                <div class="product-cell">
                  <div>
                    {{ slotProps.data.transaction_source }}
                  </div>
                </div>
              </template>
            </Column>

            <!-- Created Column -->
            <Column header="Date and Time">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.transaction_date) }}
                <div class="product-desc">{{ slotProps.data.transaction_time }}</div>
              </template>
            </Column>

          </DataTable>
        </v-card>
        <!-- Edit Modal -->
        <v-dialog v-model="editDialog" max-width="500px">
          <v-card>
            <v-card-title>Edit Product</v-card-title>
            <v-card-text>
              <v-text-field v-model="selectedProduct.product_name" label="Product Name" />
              <v-textarea v-model="selectedProduct.description" label="Description" />
              <v-switch v-model="selectedProduct.is_active" label="Active" />
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="closeEditModal">Cancel</v-btn>
              <v-btn color="primary" @click="saveEdit">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
import { useTransactStore } from "@/store/transaction"
import { formatCurrencyCompact, formatDate, formatCurrency } from "@/util"

import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Button from "primevue/button"
import InputText from "primevue/inputtext"

const auth = useAuthStore()
const tr = useTransactStore()

const isSidebarCollapsed = ref(false)
const drawerOpen = ref(false)
const isMobile = ref(false)
const filters = ref({ global: { value: null, matchMode: "contains" } })

const stat = computed(() => auth.stat)
const walletBalance = computed(() => stat.value?.walletBalance)
const walletTr = computed(() => tr.walletTr || [])

//const transactionTab = transactions.value.filter(tr => tr.type==="withdrawal")

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
  await auth.loadPartner()
  await auth.loadPartnerStat()
  await tr.loadWalletTransaction()
  console.log(walletTr.value)
})

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile)
})


const totalSuccesfullTransations = computed(() =>
  walletTr.value
    ?.filter(tr => tr.status === "successful" && tr.type === "withdrawal")
    .reduce((sum, tr) => sum + Number(tr.amount || 0), 0)
)

const completedTransations = computed(() =>
  walletTr.value.filter(i => i.status === "successful" && i.type === "withdrawal").length
)

const pendingTransations = computed(() =>
  walletTr.value.filter(i => i.status === "pending" && i.type === "withdrawal").length
)

// const failedTransations = computed(() =>
//   transactions.value.filter(i => i.status === "failed" && i.type === "withdrawal").length
// )

const totalTransationsCount = computed(() => walletTr.value.filter(i => i.status === "pending" && i.type === "withdrawal").length)

/* Clear filters */
const clearFilters = () => {
  filters.value = { global: { value: null, matchMode: "contains" } }
}

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
  color: #16a34a;
}

.status-inactive {
  background: #fef2f2;
  color: #dc2626;
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
</style>
