<template>
  <div class="auth-form-container">
    <form @submit.prevent="handleSignup" class="auth-form">
      <h2 class="auth-title">Sign Up</h2>
      
      <!-- Show error from Vuex store if it exists -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <!-- Username field with basic validation -->
      <div class="form-group">
        <label for="username">Username</label>
        <input 
          id="username"
          v-model="form.username"
          type="text"
          required
          :disabled="isLoading"
          placeholder="Choose a username"
          minlength="3"
        />
        <!-- Show error if username is too short -->
        <div v-if="form.username && form.username.length < 3" class="field-error">
          Username must be at least 3 characters
        </div>
      </div>

      <!-- Email field with basic format check -->
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          id="email"
          v-model="form.email"
          type="email"
          required
          :disabled="isLoading"
          placeholder="Enter your email"
        />
        <!-- Show error if email is not valid -->
        <div v-if="form.email && !isValidEmail" class="field-error">
          Please enter a valid email address
        </div>
      </div>
      
      <!-- Password field with minimum length check -->
      <div class="form-group">
        <label for="password">Password</label>
        <input 
          id="password"
          v-model="form.password"
          type="password"
          required
          :disabled="isLoading"
          placeholder="Choose a password"
          minlength="6"
        />
        <!-- Show error if password is too short -->
        <div v-if="form.password && form.password.length < 6" class="field-error">
          Password must be at least 6 characters
        </div>
      </div>
      
      <!-- Confirm password field with match check -->
      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input 
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          required
          :disabled="isLoading"
          placeholder="Confirm your password"
        />
        <!-- Show error if passwords don’t match -->
        <div v-if="form.confirmPassword && !passwordsMatch" class="field-error">
          Passwords do not match
        </div>
      </div>
      
      <!-- Submit button is disabled if form is invalid or loading -->
      <button 
        type="submit" 
        class="submit-btn"
        :disabled="isLoading || !isFormValid"
      >
        {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
      </button>
      
      <!-- Button to switch to login form (emits an event) -->
      <div class="auth-switch">
        <p>Already have an account? 
          <button type="button" @click="$emit('switch-to-login')" class="switch-btn">
            Login here
          </button>
        </p>
      </div>
    </form>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SignupForm',

  // Local state for form fields
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    }
  },

  computed: {
    // Map loading and error from Vuex store
    ...mapGetters('auth', ['isAuthLoading', 'authError']),

    // Shortcut for checking loading state
    isLoading() {
      return this.isAuthLoading
    },

    // Shortcut for showing any auth error
    error() {
      return this.authError
    },

    // Simple email validation using regex
    isValidEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(this.form.email)
    },

    // Check if password and confirmPassword match
    passwordsMatch() {
      return this.form.password === this.form.confirmPassword
    },

    // Form is valid only when all fields meet their conditions
    isFormValid() {
      return (
        this.form.username.trim().length >= 3 &&
        this.form.email.trim() &&
        this.isValidEmail &&
        this.form.password.length >= 6 &&
        this.passwordsMatch
      )
    }
  },

  methods: {
    // Vuex actions for register and clearing errors
    ...mapActions('auth', ['register', 'clearError']),

    // Called when user submits the form
    async handleSignup() {
      if (!this.isFormValid) return  // Don’t proceed if form is invalid

      this.clearError()  // Clear previous error

      try {
        // Send registration request via Vuex
        const result = await this.register({
          // .trim() is a built-in JavaScript string method that 
          // removes whitespace (spaces, tabs, or new lines) from beginning and the end of a string.
          username: this.form.username.trim(),
          email: this.form.email.trim(),
          // Why use .trim() in a form?
          // When users type into input fields, they might accidentally add extra spaces.
          password: this.form.password
        })

        // If registration was successful
        if (result.success) {
          this.$emit('signup-success')  // Notify parent component
          this.resetForm()              // Clear the form
        }
      } catch (error) {
        console.error('Signup failed:', error)
      }
    },

    // Reset all form fields
    resetForm() {
      this.form.username = ''
      this.form.email = ''
      this.form.password = ''
      this.form.confirmPassword = ''
    }
  },

  mounted() {
    // Clear any auth errors when component is mounted
    this.clearError()
  }
}
</script>


<style scoped>
.auth-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
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
  margin-bottom: 1.2rem;
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

.field-error {
  color: #f44336;
  font-size: 0.8rem;
  font-family: 'Courier New', monospace;
  margin-top: 0.3rem;
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