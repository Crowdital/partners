<template>
    <v-app>
        <v-main class="main">

            <!-- Sidebar -->
            <Sidebar :drawerOpen="drawerOpen" :collapsed="isSidebarCollapsed" :isMobile="isMobile"
                @update:drawerOpen="drawerOpen = $event" />

            <v-container fluid class="main-content pa-4">

                <!-- Header -->
                <Header :isDarkMode="isDarkMode" :isMobile="isMobile" @toggle-sidebar="toggleSidebar" />

                <!-- Back button -->
                <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-4" @click="$router.back()">
                    Back
                </v-btn>

                <!-- Loading -->
                <div v-if="loading" class="loader">
                    <v-progress-circular indeterminate color="primary" />
                </div>

                <!-- Product Card -->
                <v-card v-else-if="product" class="product-card pa-6">

                    <!-- Top Section -->
                    <v-row>

                        <!-- Product Image -->
                        <v-col cols="12" md="3">
                            <img :src="imageUrl" class="product-detail-image" />
                        </v-col>

                        <!-- Product Info -->
                        <v-col cols="12" md="9">

                            <div class="product-title">
                                {{ product.product_name }}
                            </div>

                            <div class="product-description">
                                {{ product.description }}
                            </div>

                            <div class="status-section mt-3">
                                <span :class="[
                                    'status-pill',
                                    product.is_active ? 'status-active' : 'status-inactive'
                                ]">
                                    {{ product.is_active ? "Active" : "Inactive" }}
                                </span>
                            </div>

                        </v-col>

                    </v-row>

                    <v-divider class="my-6" />

                    <!-- Product Details -->
                    <v-row>

                        <v-col cols="12" md="4">
                            <div class="detail-label">Maturity Date</div>
                            <div class="detail-value">
                                {{ formatDate(product.maturity_date) }}
                            </div>
                        </v-col>

                        <v-col cols="12" md="4">
                            <div class="detail-label">Available Volume</div>
                            <div class="detail-value">
                                {{ formatNumber(product.available_volume) }}
                            </div>
                        </v-col>

                        <v-col cols="12" md="4">
                            <div class="detail-label">Purchased Volume</div>
                            <div class="detail-value">
                                {{ formatNumber(product.purchased_volume) }}
                            </div>
                        </v-col>

                        <v-col cols="12" md="4">
                            <div class="detail-label">Total Volume</div>
                            <div class="detail-value">
                                {{ Number(product.purchased_volume || 0) + Number(product.available_volume || 0) }}
                            </div>
                        </v-col>

                        <v-col cols="12" md="4">
                            <div class="detail-label">Balance Withdrawn</div>
                            <div class="detail-value">
                                {{ formatCurrency(product.balance_withdrawn) }}
                            </div>
                        </v-col>

                        <v-col cols="12" md="4">
                            <div class="detail-label">Interest</div>
                            <div class="detail-value">
                                {{ parseFloat(product.interest_rate) }}%
                            </div>
                        </v-col>

                        <v-col cols="12" md="4">
                            <div class="detail-label">Minimum Tenure</div>
                            <div class="detail-value">
                                {{ formatDate(product.minimum_tenure) }}
                            </div>
                        </v-col>

                        <v-col cols="12" md="4">
                            <div class="detail-label">Minimum Amount</div>
                            <div class="detail-value">
                                {{ formatDate(product.minimum_amount) }}
                            </div>
                        </v-col>

                        <v-col cols="12" md="4">
                            <div class="detail-label">Created</div>
                            <div class="detail-value">
                                {{ formatDate(product.created_at) }}
                            </div>
                        </v-col>
                        <v-col cols="12" md="12">
                            <div class="mt-6">

                                <button type="submit" :disabled="loading" class="withdraw-button"
                                    @click="withdrawDialog = true">
                                    <span v-if="!loading">Withdraw Fund <v-icon
                                            start>mdi-arrow-top-right</v-icon></span>
                                    <span v-else>Processing Withdrawal… <v-icon start>mdi-loading</v-icon></span>
                                </button>

                            </div>
                        </v-col>
                    </v-row>

                </v-card>
                <!-- Withdraw Modal -->
                <v-dialog v-model="withdrawDialog" max-width="500">
                    <v-card class="pa-6">

                        <v-card-title class="text-h6">
                            Withdraw Funds
                        </v-card-title>

                        <v-card-text>

                            <!-- Amount Input -->
                            <v-text-field v-model="withdrawAmount" label="Enter Amount" type="number" variant="outlined"
                                density="comfortable" :error-messages="withdrawError" />

                        </v-card-text>

                        <v-card-actions>
                            <v-spacer />

                            <v-btn variant="text" @click="withdrawDialog = false">
                                Cancel
                            </v-btn>

                            <v-btn color="black" :loading="withdrawLoading" @click="handleWithdraw">
                                Confirm
                            </v-btn>

                        </v-card-actions>

                    </v-card>
                </v-dialog>

            </v-container>
            <v-snackbar
            v-model="snackbar"
            :color="snackbarColor"
            timeout="3000"
            location="top right"
            >
            {{ snackbarText }}
            </v-snackbar>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue"
import { useRoute } from "vue-router"
import Sidebar from "@/components/Sidebar.vue"
import Header from "@/components/Header.vue"

import { useAuthStore } from "@/store/auth"
import { executeWithdrawFunds } from "@/api/transaction"
import { STORAGE_URL } from "@/api/env"

import { formatNumber, formatDate, formatCurrency } from "@/util"

const route = useRoute()
const auth = useAuthStore()

/* Layout State */

const isSidebarCollapsed = ref(false)
const drawerOpen = ref(false)
const isMobile = ref(false)
const loading = ref(true)

const withdrawDialog = ref(false)
const withdrawAmount = ref("")
const withdrawLoading = ref(false)
const withdrawError = ref("")

const defaultImage = "https://gravatar.com/avatar/"

//Success message
const snackbar = ref(false)
const snackbarText = ref("")
const snackbarColor = ref("success") // success | error


/* Sidebar Toggle */

const toggleSidebar = () => {
    if (isMobile.value) {
        drawerOpen.value = !drawerOpen.value
    } else {
        isSidebarCollapsed.value = !isSidebarCollapsed.value
    }
}

/* Mobile Check */

const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
    drawerOpen.value = !isMobile.value
}

/* Product */

const product = computed(() => auth.singleProduct)
const partnerInfo = computed(() => auth.partner)
const walletId = computed(() => partnerInfo.value?.partner.wallet.uuid)
const productId = computed(() => product.value?.uuid)

/* Product Image */

const imageUrl = computed(() => {
    if (!product.value?.product_image) return defaultImage
    return `${STORAGE_URL}/${product.value.product_image}`
})

const handleWithdraw = async () => {

    withdrawError.value = ""

    if (!withdrawAmount.value || withdrawAmount.value <= 0) {
        withdrawError.value = "Please enter a valid amount"
        return
    }

    withdrawLoading.value = true
    try {
        await executeWithdrawFunds({
            wallet_id: walletId.value,
            product_id: productId.value,
            amount: Number(withdrawAmount.value)
        })

        // ✅ SUCCESS MESSAGE
        snackbarText.value = "Withdrawal request sent successfully"
        snackbarColor.value = "success"
        snackbar.value = true

        withdrawDialog.value = false
        withdrawAmount.value = ""

    } catch (e) {
        withdrawError.value =
            e.response?.data?.message || "Withdrawal failed"
        withdrawAmount.value = ""
        // console.log(e.response)
        // console.log(e.response?.data)

    } finally {
        withdrawLoading.value = false
    }
}

/* Load Product */

onMounted(async () => {

    checkMobile()
    window.addEventListener("resize", checkMobile)
    await auth.loadPartner()
    try {
        await auth.loadSingleProduct(route.params.id)
    } catch (error) {
        console.error("Failed to load product:", error)
    } finally {
        loading.value = false
    }
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
    background: #f8fafc;
}

/* Loader */

.loader {
    display: flex;
    justify-content: center;
    margin-top: 80px;
}

/* Product Card */

.product-card {
    border-radius: 14px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
}

/* Image */

.product-detail-image {
    width: 100%;
    max-width: 200px;
    border-radius: 12px;
}

/* Title */

.product-title {
    font-size: 26px;
    font-weight: 700;
}

.product-description {
    margin-top: 10px;
    color: #64748b;
    line-height: 1.6;
}

/* Status */

.status-pill {
    padding: 5px 12px;
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

/* Details */

.detail-label {
    font-size: 13px;
    color: #64748b;
}

.detail-value {
    font-size: 18px;
    font-weight: 600;
    margin-top: 4px;
}

/* Button */
.withdraw-button {
    width: 30%;
    height: 46px;
    background: #000;
    color: #fff;
    border-radius: 10px;
    font-weight: 600;
    transition: all 0.25s ease;
}

.withdraw-button:hover {
    background: #292828;
}

.withdraw-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

/* Mobile */
@media (max-width: 767px) {
    .withdraw-button {
        width: 50%;
        height: 46px;
        background: #000;
        color: #fff;
        border-radius: 10px;
        font-weight: 600;
        transition: all 0.25s ease;
    }
}
</style>
