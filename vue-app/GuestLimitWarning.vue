<template>
  <div class="guest-warning" v-if="showWarning">
    <div class="warning-content">
      <div class="warning-icon">⚠️</div>
      <div class="warning-text">
        <h3 v-if="isLimitReached">Guest Limit Reached!</h3>
        <h3 v-else>Limited Guest Access</h3>
        
        <p v-if="isLimitReached">
          You've created {{ guestTodoCount }}/{{ guestLimit }} guest todos. 
          <strong>Sign up or login to create unlimited todos!</strong>
        </p>
        <p v-else>
          You can create {{ guestRemaining }} more todo{{ guestRemaining !== 1 ? 's' : '' }} as a guest. 
          Sign up for unlimited access!
        </p>
        
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: progressPercentage + '%' }"
            :class="{ 'near-limit': guestTodoCount >= 2, 'at-limit': isLimitReached }"
          ></div>
        </div>
        <div class="progress-text">{{ guestTodoCount }}/{{ guestLimit }} todos used</div>
      </div>
      
      <div class="warning-actions">
        <button @click="$emit('show-signup')" class="action-btn signup">
          Sign Up Free
        </button>
        <button @click="$emit('show-login')" class="action-btn login">
          Login
        </button>
        <button v-if="!isLimitReached" @click="dismiss" class="action-btn dismiss">
          Continue as Guest
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'GuestLimitWarning',
  
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      dismissed: false
    }
  },
  
  computed: {
    ...mapGetters('auth', [
      'isAuthenticated',
      'guestTodoCount', 
      'guestLimit', 
      'guestRemaining', 
      'isGuestLimitReached'
    ]),
    
    showWarning() {
      return (
        !this.isAuthenticated && 
        (this.show || this.guestTodoCount >= 2) && 
        !this.dismissed
      )
    },
    
    isLimitReached() {
      return this.isGuestLimitReached
    },
    
    progressPercentage() {
      return Math.min((this.guestTodoCount / this.guestLimit) * 100, 100)
    }
  },
  
  methods: {
    dismiss() {
      this.dismissed = true
      this.$emit('dismissed')
    }
  },
  
  watch: {
    guestTodoCount() {
      // Show warning again if they create more todos
      if (this.guestTodoCount >= 2) {
        this.dismissed = false
      }
    }
  }
}
</script>

<style scoped>
.guest-warning {
  position: fixed;
  bottom: 20px;
  right: 20px;
  max-width: 400px;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.warning-content {
  background: rgba(255, 193, 7, 0.15);
  border: 2px solid #FFC107;
  border-radius: 15px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(255, 193, 7, 0.3);
}

.warning-icon {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 0.5rem;
}

.warning-text h3 {
  font-family: 'Courier New', monospace;
  color: #FFC107;
  margin: 0 0 0.5rem 0;
  text-align: center;
  font-size: 1.2rem;
}

.warning-text p {
  font-family: 'Courier New', monospace;
  color: #FFD54F;
  margin: 0 0 1rem 0;
  line-height: 1.4;
  font-size: 0.9rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: #4CAF50;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.progress-fill.near-limit {
  background: #FFC107;
}

.progress-fill.at-limit {
  background: #f44336;
}

.progress-text {
  font-family: 'Courier New', monospace;
  color: #FFD54F;
  font-size: 0.8rem;
  text-align: center;
  margin-bottom: 1rem;
}

.warning-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.action-btn {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 80px;
}

.action-btn.signup {
  background: linear-gradient(45deg, #4CAF50, #66BB6A);
  color: white;
}

.action-btn.signup:hover {
  background: linear-gradient(45deg, #66BB6A, #4CAF50);
  transform: scale(1.05);
}

.action-btn.login {
  background: linear-gradient(45deg, #2196F3, #42A5F5);
  color: white;
}

.action-btn.login:hover {
  background: linear-gradient(45deg, #42A5F5, #2196F3);
  transform: scale(1.05);
}

.action-btn.dismiss {
  background: rgba(255, 255, 255, 0.1);
  color: #FFD54F;
  border: 1px solid #FFD54F;
}

.action-btn.dismiss:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .guest-warning {
    bottom: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .warning-actions {
    flex-direction: column;
  }
  
  .action-btn {
    flex: none;
  }
}
</style> 