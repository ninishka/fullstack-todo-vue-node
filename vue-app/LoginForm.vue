<template>
  <div class="auth-form-container">
    <form @submit.prevent="handleLogin" class="auth-form">
      <h2 class="auth-title">Login</h2>

      <!-- Show error message if there is one -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Username or email input -->
      <div class="form-group">
        <label for="usernameOrEmail">Username or Email</label>
        <input 
          id="usernameOrEmail"
          v-model="form.usernameOrEmail"
          type="text"
          required
          :disabled="isLoading"
          placeholder="Enter username or email"
        />
      </div>

      <!-- Password input -->
      <div class="form-group">
        <label for="password">Password</label>
        <input 
          id="password"
          v-model="form.password"
          type="password"
          required
          :disabled="isLoading"
          placeholder="Enter password"
        />
      </div>

      <!-- Submit button, disabled if loading or form is invalid -->
      <button 
        type="submit" 
        class="submit-btn"
        :disabled="isLoading || !isFormValid"
      >
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>

      <!-- Link to switch to signup form -->
      <div class="auth-switch">
        <p>Don't have an account? 
          <button type="button" @click="$emit('switch-to-signup')" class="switch-btn">
            Sign up here
          </button>
        </p>
      </div>
    </form>
  </div>
</template>


<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'LoginForm',

    data() {
      return {
        // Holds the form input values
        form: {
          usernameOrEmail: '',
          password: ''
        }
      }
    },

    computed: {
      // Use Vuex getters to access loading state and error message
      ...mapGetters('auth', ['isAuthLoading', 'authError']),

      // Shortcut to check if app is loading
      isLoading() {
        return this.isAuthLoading
      },

      // Shortcut to show any error message
      error() {
        return this.authError
      },

      // Form is valid only if both fields are filled
      isFormValid() {
        return this.form.usernameOrEmail.trim() && this.form.password.trim()
      }
    },

    methods: {
      // Map Vuex actions to call authentication logic
      ...mapActions('auth', ['login', 'clearError']),

      // Called when user submits the form
      async handleLogin() {
        if (!this.isFormValid) return  // Prevent submitting if form is incomplete

        this.clearError()  // Clear any previous error

        try {
          // Call Vuex login action and wait for result
          const result = await this.login({
            usernameOrEmail: this.form.usernameOrEmail.trim(),
            password: this.form.password
          })

          if (result.success) {
            // If login succeeded, emit event to parent component
            this.$emit('login-success')
            // Reset the form fields
            this.resetForm()
          }
        } catch (error) {
          // Handle unexpected errors (like network issues)
          console.error('Login failed:', error)
        }
      },

      // Clears form input fields
      resetForm() {
        this.form.usernameOrEmail = ''
        this.form.password = ''
      }
    },

    mounted() {
      // When the component loads, clear any existing auth error
      this.clearError()
    }
  }
</script>


<style scoped>
.auth-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.auth-form {
  background: rgba(76, 175, 80, 0.1);
  border: 2px solid #4CAF50;
  border-radius: 15px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
}

.auth-title {
  font-family: 'Courier New', monospace;
  color: #4CAF50;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  text-shadow: 0 0 15px rgba(76, 175, 80, 0.5);
}

.error-message {
  background: rgba(244, 67, 54, 0.2);
  border: 1px solid #f44336;
  color: #f44336;
  padding: 0.8rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-family: 'Courier New', monospace;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4CAF50;
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #2d5a27;
  border-radius: 8px;
  background: rgba(33, 33, 33, 0.8);
  color: #81C784;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.3);
}

.form-group input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-group input::placeholder {
  color: #666;
}

.submit-btn {
  width: 100%;
  background: linear-gradient(45deg, #4CAF50, #66BB6A);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(45deg, #66BB6A, #4CAF50);
  transform: scale(1.02);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.auth-switch {
  text-align: center;
  margin-top: 1.5rem;
}

.auth-switch p {
  color: #81C784;
  font-family: 'Courier New', monospace;
  margin: 0;
}

.switch-btn {
  background: none;
  border: none;
  color: #4CAF50;
  text-decoration: underline;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

.switch-btn:hover {
  color: #66BB6A;
}
</style> 