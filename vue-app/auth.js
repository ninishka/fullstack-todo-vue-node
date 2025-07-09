// VUEX AUTHENTICATION MODULE
// This manages all authentication-related state in the application

// STATE: The single source of truth for authentication data
const state = {
  user: null,                                    // Current user object (null when not logged in)
  token: localStorage.getItem('token') || null,  // JWT token (persisted in localStorage)
  isAuthenticated: false,                        // Boolean flag for quick auth checks
  isLoading: false,                             // Loading state for auth operations
  error: null,                                  // Current error message
  guestTodoCount: 0,                           // How many todos guest has created
  guestLimit: 3                                // Maximum todos for guests
}

// GETTERS: Computed properties for the authentication state.
// These provide convenient access to derived(გამოტანილი მნიშვნელობა) values.
// Think of getters as:
// Smart computed values for your Vuex store.
// They're like computed properties(გამოთვლილი თვისებები), but for your global store.
// You use them when you want to derive(გამოტანა) or calculate data 
// based on what's in the store — and reuse that logic in different parts of your app.
const getters = {
  isAuthenticated: state => !!state.token && !!state.user,  // True if both token and user exist
  currentUser: state => state.user,                         // Current user object
  authToken: state => state.token,                          // JWT token
  authError: state => state.error,                          // Current error
  isAuthLoading: state => state.isLoading,                  // Loading state
  guestTodoCount: state => state.guestTodoCount,            // Guest todo count
  guestLimit: state => state.guestLimit,                    // Guest limit (3)
  guestRemaining: state => Math.max(0, state.guestLimit - state.guestTodoCount), // Remaining guest todos
  isGuestLimitReached: state => state.guestTodoCount >= state.guestLimit         // True if limit reached
}

// MUTATIONS: Synchronous functions that modify the state
// These are the ONLY way to change state in Vuex
const mutations = {
  // Loading state management
  SET_LOADING(state, loading) {
    state.isLoading = loading
  },
  
  // Error state management
  SET_ERROR(state, error) {
    state.error = error
  },
  
  CLEAR_ERROR(state) {
    state.error = null
  },
  
  // AUTHENTICATION SUCCESS: Store user data and token
  // This is a mutation that gets called when a user successfully logs in (or signs up).
  SET_AUTH_DATA(state, { user, token }) {
    state.user = user
    state.token = token
    state.isAuthenticated = true
    state.error = null
    
    // PERSISTENCE: Store in localStorage for browser refresh persistence
    // It saves the token and user info in the browser’s localStorage so that:
    // When you refresh the page, the user doesn’t get logged out immediately.
    // On app startup, you can load the user/token back from localStorage and restore the session.
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  },
  
  // LOGOUT: Clear all authentication data
  CLEAR_AUTH_DATA(state) {
    state.user = null
    state.token = null
    state.isAuthenticated = false
    state.error = null
    
    // CLEANUP: Remove from localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
  
  // GUEST LIMIT MANAGEMENT: Track guest todo usage
  SET_GUEST_TODO_COUNT(state, count) {
    //This sets the initial count of todos the guest has created.
    state.guestTodoCount = count
  },
  
  // Increases the number of guest-created todos by 1.
  // its used Every time a guest user adds a new todo.
  INCREMENT_GUEST_TODO_COUNT(state) {
    state.guestTodoCount++
  },
  
  // Decreases the count by 1, but only if the current count is more than 0.
  // it is used when a guest deletes a todo, or undoes an addition.
  DECREMENT_GUEST_TODO_COUNT(state) {
    if (state.guestTodoCount > 0) {
      state.guestTodoCount--
    }
  },
  
  // BROWSER REFRESH: Restore authentication state from localStorage
  // When the app starts, this checks if the user was already logged in before (by looking in localStorage).
  // If so, it restores the user’s login session — so they stay logged in after refresh.
  RESTORE_AUTH_STATE(state) {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      try {
        state.token = token
        state.user = JSON.parse(user)// parse(user) is used because objects are stored as strings in localStorage.
        state.isAuthenticated = true
      } catch (error) {
        // If something goes wrong (e.g., user string is broken or malformed), it clears localStorage so the app doesn’t break.
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }
}

// ACTIONS: Asynchronous functions that call APIs and commit mutations
// These handle the business logic and API communication
const actions = {
  // INITIALIZATION: Restore auth state when app loads
  initAuth({ commit }) {
    commit('RESTORE_AUTH_STATE')
  },
  
  // USER REGISTRATION: Create new account
  async register({ commit }, { username, email, password }) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    
    try {
      // API CALL: Send registration data to backend
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // SUCCESS: Store user data and token
        commit('SET_AUTH_DATA', { user: data.user, token: data.token })
        return { success: true, message: data.message }
      } else {
        // ERROR: Store error message
        commit('SET_ERROR', data.error)
        return { success: false, error: data.error }
      }
    } catch (error) {
      // NETWORK ERROR: Handle connection issues
      const errorMessage = 'Network error. Please try again.'
      commit('SET_ERROR', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      // CLEANUP: Always stop loading
      commit('SET_LOADING', false)
    }
  },
  
  // USER LOGIN: Authenticate existing user
  async login({ commit }, { usernameOrEmail, password }) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    
    try {
      // API CALL: Send login credentials to backend
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usernameOrEmail, password })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // SUCCESS: Store user data and token
        commit('SET_AUTH_DATA', { user: data.user, token: data.token })
        return { success: true, message: data.message }
      } else {
        // ERROR: Store error message
        commit('SET_ERROR', data.error)
        return { success: false, error: data.error }
      }
    } catch (error) {
      // NETWORK ERROR: Handle connection issues
      const errorMessage = 'Network error. Please try again.'
      commit('SET_ERROR', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      // CLEANUP: Always stop loading
      commit('SET_LOADING', false)
    }
  },
  
  // USER LOGOUT: Clear authentication data
  async logout({ commit }) {
    commit('CLEAR_AUTH_DATA')
  },
  
  // GUEST LIMIT: Fetch current guest todo count from backend
  async fetchGuestTodoCount({ commit }) {
    try {
      const response = await fetch('http://localhost:3000/guest/todo-count')
      const data = await response.json()
      
      if (response.ok) {
        commit('SET_GUEST_TODO_COUNT', data.count)
      }
    } catch (error) {
      console.error('Failed to fetch guest todo count:', error)
    }
  },
  
  // GUEST TRACKING: Increment guest todo count (when guest creates todo)
  incrementGuestCount({ commit }) {
    commit('INCREMENT_GUEST_TODO_COUNT')
  },
  
  // GUEST TRACKING: Decrement guest todo count (when guest deletes todo)
  decrementGuestCount({ commit }) {
    commit('DECREMENT_GUEST_TODO_COUNT')
  },
  
  // ERROR MANAGEMENT: Clear current error
  clearError({ commit }) {
    commit('CLEAR_ERROR')
  }
}

// EXPORT: Make this module available to the main store
export default {
  namespaced: true,  // All getters/actions/mutations are prefixed with 'auth/'
  state,
  getters,
  mutations,
  actions
} 