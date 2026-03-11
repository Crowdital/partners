<template>
    <v-app class="login-page">
        <v-main class="login-wrapper">

            <!-- Left Pane (Desktop Only) -->
            <div class="login-left">
                <img src="@/assets/login-bg.jpg" class="bg-image" />
                <img src="@/assets/crowdital_partner.png" class="logo" />
            </div>

            <!-- Right Pane -->
            <div class="login-right">
                <div class="login-form">

                    <!-- Header -->
                    <div class="mb-8">
                        <img src="../assets/crowdital_partner.png" class="logo-img" alt="Crowdital Logo" />
                        <h3 class="text-2xl font-semibold text-gray-900 mt-8">
                            Log in to your account
                        </h3>
                        <p class="text-gray-400 text-xs mt-2">
                            Enter your email and password below to log in
                        </p>
                    </div>

                    <!-- Error -->
                    <v-alert v-if="error" type="error" density="compact" class="mb-4">
                        {{ error }}
                    </v-alert>

                    <!-- Form -->
                    <form @submit.prevent="handleLogin" class="w-full space-y-6">

                        <!-- Email -->
                        <div class="flex flex-col gap-2 spacing text-left">
                            <label class="text-sm font-medium text-gray-700 text-left">Email</label>
                            <input v-model="email" type="email" required placeholder="email@example.com"
                                class="modern-input" />
                        </div>

                        <!-- Password -->
                        <div class="flex flex-col gap-2 spacing text-left w-full mb-4 relative">
                            <label class="text-sm font-medium text-gray-700">Password</label>
                            <input v-model="password" :type="showPassword ? 'text' : 'password'" required
                                placeholder="••••••••" class="modern-input pr-10 w-full" />

                            <!-- Eye icon -->
                            <button type="button" @click="togglePassword"
                                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black">
                                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>

                                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.05 10.05 0 012.171-3.386m1.348-1.348A10.05 10.05 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.639 3.15M3 3l18 18" />
                                </svg>
                            </button>
                        </div>

                        <!-- Remember / Forgot -->
                        <div class="w-full flex justify-between justify-between mt-4 text-left spacing">
                            <!-- Left: Remember me -->
                            <!-- <label class="flex items-center cursor-pointer">
                                <input type="checkbox" v-model="remember" class="h-5 w-5 accent-black rounded-sm" />
                                <span class="text-sm font-medium text-gray-800">
                                    Remember me
                                </span>
                            </label> -->
                            <div class="flex items-center cursor-pointer">
                                <Checkbox v-model="pizza" inputId="ingredient1" name="pizza" value="Cheese" />
                                <label for="ingredient1"> Remember me </label>
                                <!-- Right: Forgot password -->
                                <button type="button" @click="forgotPassword"
                                    class="text-sm font-medium text-gray-600 hover:text-black transition-colors m-space">
                                    Forgot password?
                                </button>
                            </div>


                        </div>
                        <!-- Submit -->
                        <button type="submit" :disabled="loading" class="login-button">
                            <span v-if="!loading">Log in</span>
                            <span v-else>Signing in…</span>
                        </button>

                    </form>

                </div>
            </div>

        </v-main>
    </v-app>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { login } from "@/api/auth"
import Checkbox from 'primevue/checkbox';

const router = useRouter()

const email = ref("")
const password = ref("")
const error = ref("")
const loading = ref(false)

/**============= Show or hide password   ================*/
const showPassword = ref(false)

const togglePassword = () => {
    showPassword.value = !showPassword.value
}


const handleLogin = async () => {
    error.value = ""
    loading.value = true
    try {
        const res = await login({
            identifier: email.value,
            password: password.value,
        })
        localStorage.setItem("token", res.data.data.token)
        router.push("/dashboard")
    } catch (e) {
        error.value = e.response?.data?.message || "Login failed"; //e.message || "Invalid credentials"
    } finally {
        loading.value = false
    }
}

const forgotPassword = () => {
    router.push("/forgot-password")
}
</script>

<style scoped>
/* Layout */
.login-wrapper {
    display: flex;
    min-height: 100vh;
}

.login-left {
    flex: 1;
    position: relative;
    overflow: hidden;
}

.bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.logo-img {
    width: 20em;
}

.logo {
    position: absolute;
    bottom: 24px;
    left: 24px;
    width: 130px;
}

.login-right {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f9fafb;
    padding: 24px;
}

.login-form {
    width: 100%;
    max-width: 420px;
}

/* Inputs */
.modern-input {
    width: 100%;
    height: 46px;
    margin-top: 6px;
    padding: 10px 14px;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    font-size: 15px;
    background: transparent;
    transition: all 0.2s ease;
}

.modern-input:focus {
    outline: none;
    border-color: #000;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

/* Button */
.login-button {
    width: 100%;
    height: 46px;
    background: #000;
    color: #fff;
    border-radius: 10px;
    font-weight: 600;
    transition: all 0.25s ease;
}

.login-button:hover {
    background: #292828;
}

.login-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.spacing {
    margin-bottom: 1em;
}

.m-space {
    margin-left: 9.5rem !important;
}

.modern-input.pr-10 {
    padding-right: 2.5rem;
    /* enough space for eye button */
}

.relative {
    position: relative;
}

/* Button positioned over the input */
.absolute {
    position: absolute;
    cursor: pointer;
}

/* Mobile */
@media (max-width: 767px) {
    .login-wrapper {
        flex-direction: column;
    }

    .login-left {
        display: none;
    }

    .m-space {
        margin-left: 7rem !important;
    }
}
</style>
