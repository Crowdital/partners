<template>
  <div class="login-container">
    <h2>Partner Portal Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post(
          'https://your-api-domain.com/auth/login',
          { email: this.email, password: this.password }
        )
        localStorage.setItem('token', response.data.token)
        this.$router.push('/dashboard')
      } catch (err) {
        this.errorMessage = 'Login failed. Check credentials.'
      }
    }
  }
}
</script>
