<template>
  <div id="app">
    <!-- Global user navigation -->
    <div v-if="showUserNav" class="user-nav">
      <div class="user-info" v-if="isAuthenticated">
        <span class="welcome-text">Welcome, {{ currentUser.username }}!</span>
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </div>
      <div class="auth-links" v-else>
        <router-link to="/login" class="auth-link">Login</router-link>
        <router-link to="/signup" class="auth-link">Sign Up</router-link>
      </div>
    </div>

    <router-view></router-view>
    
    <!-- Guest limit warning (floating) -->
    <GuestLimitWarning 
      :show="showGuestWarning"
      @show-signup="goToSignup"
      @show-login="goToLogin"
      @dismissed="onWarningDismissed"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import GuestLimitWarning from '@/components/GuestLimitWarning.vue'

export default {
  name: 'App',
  
  components: {
    GuestLimitWarning
  },
  
  data() {
    return {
      showGuestWarning: false
    }
  },
  
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'currentUser', 'guestTodoCount']),
    
    showUserNav() {
      // Don't show user nav on auth page
      return this.$route.name !== 'Auth'
    }
  },
  
  methods: {
    ...mapActions('auth', ['initAuth', 'logout', 'fetchGuestTodoCount']),
    
    async handleLogout() {
      await this.logout()
      // Refresh guest count after logout
      await this.fetchGuestTodoCount()
      this.$router.push('/')
    },
    
    goToSignup() {
      this.$router.push('/signup')
    },
    
    goToLogin() {
      this.$router.push('/login')
    },
    
    onWarningDismissed() {
      this.showGuestWarning = false
    }
  },
  
  async mounted() {
    // Initialize auth state from localStorage
    await this.initAuth()
    
    // Fetch guest todo count for non-authenticated users
    if (!this.isAuthenticated) {
      await this.fetchGuestTodoCount()
    }
  },
  
  watch: {
    // Watch for guest todo count changes
    guestTodoCount(newCount) {
      if (!this.isAuthenticated && newCount >= 2) {
        this.showGuestWarning = true
      }
    },
    
    // Hide warning when user authenticates
    isAuthenticated(newValue) {
      if (newValue) {
        this.showGuestWarning = false
      }
    }
  }
}
</script>

<style>
body {
  background: #2c2c54;
  margin: 0;
  padding: 0;
  font-family: 'Courier New', monospace;
}

#app {
  min-height: 100vh;
}

.user-nav {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid #4CAF50;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  backdrop-filter: blur(10px);
}

.welcome-text {
  color: #4CAF50;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.logout-btn {
  background: linear-gradient(45deg, #f44336, #ef5350);
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: linear-gradient(45deg, #ef5350, #f44336);
  transform: scale(1.05);
}

.auth-links {
  display: flex;
  gap: 0.5rem;
}

.auth-link {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border: 1px solid #4CAF50;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.auth-link:hover {
  background: rgba(76, 175, 80, 0.2);
  transform: scale(1.05);
}

.auth-link.router-link-active {
  background: rgba(76, 175, 80, 0.3);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .user-nav {
    top: 10px;
    right: 10px;
    left: 10px;
    justify-content: flex-end;
  }
  
  .user-info {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
  }
  
  .welcome-text {
    font-size: 0.8rem;
  }
  
  .auth-links {
    flex-direction: column;
    gap: 0.3rem;
  }
  
  .auth-link {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  text-align: center;
  }
}
</style>
