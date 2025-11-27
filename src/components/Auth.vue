<template>
  <div class="auth-container">
    <div class="tabs">
      <button
        :class="['tab-btn', { active: activeTab === 'login' }]"
        @click="activeTab = 'login'"
      >
        Login
      </button>
      <button
        :class="['tab-btn', { active: activeTab === 'register' }]"
        @click="activeTab = 'register'"
      >
        Register
      </button>
    </div>

    <div class="tab-content">
      <!-- Login Form -->
      <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="login-email">Email</label>
          <input
            type="email"
            id="login-email"
            v-model="loginForm.email"
            required
            class="form-input"
          >
        </div>
        <div class="form-group">
          <label for="login-password">Password</label>
          <input
            type="password"
            id="login-password"
            v-model="loginForm.password"
            required
            class="form-input"
          >
        </div>
        <button type="submit" class="submit-btn">Login</button>
      </form>

      <!-- Registration Form -->
      <form v-if="activeTab === 'register'" @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label>Register as:</label>
          <div class="radio-group">
            <label>
              <input
                type="radio"
                v-model="registerForm.type"
                value="user"
              > User
            </label>
            <label>
              <input
                type="radio"
                v-model="registerForm.type"
                value="storehouse"
              > Storehouse
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="register-email">Email</label>
          <input
            type="email"
            id="register-email"
            v-model="registerForm.email"
            required
            class="form-input"
          >
        </div>
        <div class="form-group">
          <label for="register-password">Password</label>
          <input
            type="password"
            id="register-password"
            v-model="registerForm.password"
            required
            class="form-input"
          >
        </div>

        <!-- Storehouse specific field -->
        <div class="form-group" v-if="registerForm.type === 'storehouse'">
          <label for="location">Location</label>
          <input
            type="text"
            id="location"
            v-model="registerForm.location"
            required
            class="form-input"
          >
        </div>

        <button type="submit" class="submit-btn">Register</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'

export default defineComponent({
  name: 'Auth',
  setup() {
    const activeTab = ref('login')

    const loginForm = reactive({
      email: '',
      password: ''
    })

    const registerForm = reactive({
      type: 'user',
      email: '',
      password: '',
      location: ''
    })

    const handleLogin = () => {
      // TODO: Implement login logic
      console.log('Login:', loginForm)
    }

    const handleRegister = () => {
      // TODO: Implement registration logic
      console.log('Register:', registerForm)
    }

    return {
      activeTab,
      loginForm,
      registerForm,
      handleLogin,
      handleRegister
    }
  }
})
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tabs {
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e2e8f0;
}

.tab-btn {
  flex: 1;
  padding: 1rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  color: #64748b;
  transition: all 0.3s ease;
}

.tab-btn.active {
  color: #3b82f6;
  border-bottom: 2px solid #3b82f6;
  margin-bottom: -2px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
}

.radio-group {
  display: flex;
  gap: 1rem;
}

.submit-btn {
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #2563eb;
}
</style>
