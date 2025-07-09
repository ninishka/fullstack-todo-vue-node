<template>
  <div class="auth-page">
    
    <!-- Top navigation bar -->
    <nav class="page-nav">
      <button @click="goHome" class="nav-btn">← Back to Home</button>
      <h1 class="page-title">Authentication</h1>
    </nav>
    
    <!-- Authentication content wrapper -->
    <div class="auth-container">
      
      <!-- Tabs to switch between Login and Signup -->
      <div class="auth-tabs">
        <button 
          @click="currentMode = 'login'" 
          class="tab-btn"
          :class="{ active: currentMode === 'login' }"  <!-- Highlight active tab -->
        >
          Login
        </button>
        <button 
          @click="currentMode = 'signup'" 
          class="tab-btn"
          :class="{ active: currentMode === 'signup' }"
        >
          Sign Up
        </button>
      </div>
      
      <!-- Area where LoginForm or SignupForm appears -->
      <div class="auth-content">
        <!-- Animation for switching forms -->
        <transition name="slide" mode="out-in">
          <!-- Login form is shown if currentMode is 'login' -->
          <LoginForm 
            v-if="currentMode === 'login'"
            key="login"
            @switch-to-signup="currentMode = 'signup'"      <!-- Switch to signup tab when clicked from inside form -->
            @login-success="handleAuthSuccess"             <!-- After login success, redirect to /todos -->
          />
          <!-- Signup form is shown if currentMode is 'signup' -->
          <SignupForm 
            v-else
            key="signup"
            @switch-to-login="currentMode = 'login'"        <!-- Switch to login tab when clicked from inside form -->
            @signup-success="handleAuthSuccess"            <!-- After signup success, redirect to /todos -->
          />
        </transition>
      </div>
      
      <!-- Guest user option (limited features) -->
      <div class="guest-info">
        <p>
          <strong>Continue as guest?</strong> You can create up to 3 todos without an account.
        </p>
        <button @click="goToTodos" class="guest-btn">
          Continue as Guest
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/auth/LoginForm.vue'
import SignupForm from '@/components/auth/SignupForm.vue'

export default {
  name: 'AuthPage',
  
  // Register the login and signup form components for use
  components: {
    LoginForm,
    SignupForm
  },
  
  // Accept an optional prop to pre-select login or signup tab
  props: {
    mode: {
      type: String,
      default: 'login', // Default tab is 'login'
      validator: value => ['login', 'signup'].includes(value) // Only allow valid values
    }
  },
  
  data() {
    return {
      // This controls which form is currently visible (login/signup)
      currentMode: this.mode
    }
  },
  
  methods: {
    // Go back to the homepage
    goHome() {
      this.$router.push('/')
    },
    
    // Go to the todo list page (either guest or after auth)
    goToTodos() {
      this.$router.push('/todos')
    },
    
    // Called when login or signup is successful
    // Redirects to the main todo list page
    handleAuthSuccess() {
      this.$router.push('/todos')
    }
  },
  
  watch: {
    // If the `mode` prop changes from the outside, update the tab view accordingly
    mode(newMode) {
      this.currentMode = newMode
    }
  }
}
</script>


<style scoped>
.auth-page {
  min-height: 100vh;
  background: #2c2c54;
}

.page-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: rgba(76, 175, 80, 0.1);
  border-bottom: 2px solid #4CAF50;
}

.nav-btn {
  background: linear-gradient(45deg, #4CAF50, #66BB6A);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: linear-gradient(45deg, #66BB6A, #4CAF50);
  transform: scale(1.05);
}

.page-title {
  font-family: 'Courier New', monospace;
  color: #4CAF50;
  margin: 0;
  font-size: 2rem;
  text-shadow: 0 0 15px rgba(76, 175, 80, 0.5);
}

.auth-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.auth-tabs {
  display: flex;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 15px 15px 0 0;
  border: 2px solid #4CAF50;
  border-bottom: none;
  overflow: hidden;
}

.tab-btn {
  flex: 1;
  padding: 1rem;
  background: none;
  border: none;
  color: #81C784;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.tab-btn:not(.active):hover {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.tab-btn.active {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #4CAF50;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.auth-content {
  background: rgba(76, 175, 80, 0.05);
  border: 2px solid #4CAF50;
  border-top: none;
  border-radius: 0 0 15px 15px;
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

.guest-info {
  text-align: center;
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 1px solid #2d5a27;
}

.guest-info p {
  color: #81C784;
  font-family: 'Courier New', monospace;
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.guest-btn {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  border: 2px solid #4CAF50;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.guest-btn:hover {
  background: rgba(76, 175, 80, 0.3);
  transform: scale(1.05);
}

/* Transition animations */
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .page-nav {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .auth-container {
    margin: 1rem auto;
  }
  
  .tab-btn {
    font-size: 1rem;
    padding: 0.8rem;
  }
}
</style> 