import * as todoService from '@/api/todoService'

////*Purpose* Complete todos module following Vue 2 Vuex patterns



// State  Manages `todos`, `currentTodo`, `loading`, and `error`
const state = {
  todos: [],
  currentTodo: null,
  loading: false,
  error: null
}

// Getters Provide computed values like `allTodos`, `completedTodos`, `pendingTodos`, `todoCount`, etc.
const getters = {
  allTodos: state => state.todos,
  completedTodos: state => state.todos.filter(todo => todo.completed),
  pendingTodos: state => state.todos.filter(todo => !todo.completed),
  currentTodo: state => state.currentTodo,
  isLoading: state => state.loading,
  hasError: state => state.error,
  todoCount: state => state.todos.length,
  completedCount: (state, getters) => getters.completedTodos.length,
  pendingCount: (state, getters) => getters.pendingTodos.length,
  getTodoById: state => id => state.todos.find(todo => todo.id === parseInt(id))
}


//In Vuex, mutations are synchronous functions that are the only legal way to directly modify the state.
////Each mutation:
//////*Accepts state as the first argument (so it can mutate it)
//////*Optionally accepts a payload (second argument) that carries the data for the mutation
const mutations = {
  SET_LOADING(state, loading) { //Sets a loading flag in your state.
    state.loading = loading
  },
  
  SET_ERROR(state, error) { //Stores an error message or object in state when something fails.
    state.error = error
  },
  
  SET_TODOS(state, todos) { //Sets the whole list of todos (used after fetching from API).
    state.todos = todos
  },
  
  SET_CURRENT_TODO(state, todo) { //Stores the currently viewed or edited todo item.
    state.currentTodo = todo
  },
  
  ADD_TODO(state, todo) { //Adds a new todo to the state.
    state.todos.push(todo)
  },
  
  UPDATE_TODO(state, updatedTodo) { //Updates a todo in place (both in the list and current selection if it's the same one).
    // Find the index of the todo in the state that matches the updated one
    const index = state.todos.findIndex(todo => todo.id === updatedTodo.id)

    if (index !== -1) {
      // If found, replace it with the updated todo object
      state.todos.splice(index, 1, updatedTodo)
    }

    if (state.currentTodo && state.currentTodo.id === updatedTodo.id) {
      // If the current selected todo is the one being updated, update it too
      state.currentTodo = updatedTodo
    }
  },
  
  DELETE_TODO(state, todoId) { //Removes a todo from the list, and clears currentTodo if it was deleted.
    // Filter out (i.e., remove) the todo that matches the given ID
    state.todos = state.todos.filter(todo => todo.id !== todoId)

    if (state.currentTodo && state.currentTodo.id === todoId) {
      // If the currently viewed todo was just deleted, clear it
      state.currentTodo = null
    }
  },
  
  CLEAR_ERROR(state) { //Resets error state to null.
    state.error = null
  },
  
  CLEAR_CURRENT_TODO(state) { //Clears the currently selected todo.
    state.currentTodo = null
  }
}

// Actions Async operations that call API and commit mutations (`fetchTodos`, `createTodo`, `updateTodo`, `deleteTodo`, etc.)
const actions = {
  // Fetches all todos from the backend
  async fetchTodos({ commit }) {
    commit('SET_LOADING', true)         // Show loading indicator
    commit('CLEAR_ERROR')               // Clear any existing errors

    try {
      const todos = await todoService.fetchTodos() // Call API to get todos
      commit('SET_TODOS', todos)                   // Save todos to the state
    } catch (error) {
      commit('SET_ERROR', error.message)           // Save error to state
      throw error                                   // Rethrow in case caller wants to handle it
    } finally {
      commit('SET_LOADING', false)                 // Hide loading indicator
    }
  },

  // Fetches a single todo by its ID
  async fetchTodoById({ commit }, id) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')

    try {
      const todo = await todoService.fetchTodoById(id) // Call API with ID
      commit('SET_CURRENT_TODO', todo)                 // Set as current todo in state
      return todo                                      // Return in case component needs it
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Sends new todo to the backend and updates the store
  async createTodo({ commit }, formData) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')

    try {
      const newTodo = await todoService.createTodo(formData) // Send form data to API
      commit('ADD_TODO', newTodo)                            // Add the new todo to the list
      return newTodo
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Sends updated data for a todo to the backend
  async updateTodo({ commit }, { id, data }) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')

    try {
      const updatedTodo = await todoService.updateTodo(id, data) // Call API to update
      commit('UPDATE_TODO', updatedTodo)                          // Replace the todo in store
      return updatedTodo
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Deletes a todo and updates the store
  async deleteTodo({ commit }, id) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')

    try {
      await todoService.deleteTodo(id)     // Call delete endpoint
      commit('DELETE_TODO', id)            // Remove todo from store
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Toggles the completed state of a todo
  async toggleTodoComplete({ dispatch, getters }, id) {
    const todo = getters.getTodoById(id)  // Get the todo from store by ID
    if (!todo) {
      throw new Error('Todo not found')   // If not found, throw error
    }

    // Prepare updated data with flipped "completed" status
    const data = {
      name: todo.name,
      description: todo.description,
      completed: !todo.completed
    }

    // Reuse the updateTodo action to send changes
    return dispatch('updateTodo', { id, data })
  },

  // Clears any error from the store
  clearError({ commit }) {
    commit('CLEAR_ERROR')
  },

  // Clears the currently selected todo
  clearCurrentTodo({ commit }) {
    commit('CLEAR_CURRENT_TODO')
  }
}
// Actions are used for asynchronous operations, usually involving an API.

// Each action starts by showing loading and clearing previous errors.

// On success: commits data to mutations (which updates the state).

// On failure: stores the error.

// toggleTodoComplete cleverly reuses updateTodo for less code duplication.


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} 