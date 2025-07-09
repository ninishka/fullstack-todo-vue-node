<template>
  <div class="todo-container">
    <h1 class="todo-title">Tasks</h1>
    
    <!-- Error display -->
    <div v-if="hasError" class="error-message">
      <p>{{ hasError }}</p>
      <button @click="clearError" class="retry-btn">Clear Error</button>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="isLoading" class="loading">
      <p>Loading...</p>
    </div>
    
    <div class="todo-content">
      <TodoForm @add-todo="addTodo" />
      <TodoList 
        :todos="allTodos"
        @edit-todo="editTodo"
        @delete-todo="deleteTodo"
        @view-todo="viewTodo"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TodoForm from './todo-form.vue'
import TodoList from './todo-list.vue'

export default {
  components: {
    TodoForm,
    TodoList
  },
  
  // BEFORE VUEX: We had local state here
  // data() {
  //   return {
  //     todos: [] ///compos--const todos = ref([])
  //   }
  // },
  
  computed: {
    // Map Vuex getters to component computed properties
    ...mapGetters('todos', [
      'allTodos',
      'isLoading',
      'hasError'
    ]),
    
    ...mapGetters('auth', [
      'isAuthenticated'
    ])
  },
  
  methods: {
    // Map Vuex actions to component methods
    ...mapActions('todos', [
      'fetchTodos',
      'createTodo',
      'updateTodo',
      'clearError'
    ]),
    
    ...mapActions('todos', {
      deleteTodoAction: 'deleteTodo'
    }),

    // BEFORE VUEX: Direct API fetch method
    // async fetchTodos() { //Declares an asynchronous method
    //   try {
    //     const response = await fetch('http://localhost:3000/todos');//Makes a GET request to backend at /todos
    //     //tells JavaScript to wait until it gets a response.
    //     //The result is saved into response.
    //     this.todos = await response.json();//Waits for the response body to be converted from -
    //     // -JSON text to a JavaScript object (an array of todos). Then assigns that array to this.todos.
    //   } catch (error) {
    //     console.error('Error:', error);
    //   }
    // },
    //compos>
    // const fetchTodos = async () => {
    //   try {
    //     const response = await fetch('http://localhost:3000/todos')
    //     todos.value = await response.json()
    //   } catch (error) {
    //     console.error('Error fetching todos:', error)
    //   }
    // }

    async addTodo(formData) {
      // NOW WITH VUEX: Use action
      try {
        await this.createTodo(formData)
        
        // Increment guest count if not authenticated
        if (!this.isAuthenticated) {
          this.$store.dispatch('auth/incrementGuestCount')
        }
      } catch (error) {
        console.error('Error adding todo:', error)
        
        // Handle guest limit reached
        if (error.guestLimitReached) {
          // The error message will be shown by the error handling in the store
          // The guest warning component will automatically show
        }
      }
    },

    async editTodo({ id, newName, newDesq }) {
      // BEFORE VUEX: Direct API call with manual state update
      // try {
      //   await fetch(`http://localhost:3000/todo/${id}`, { //Sends a PUT request to /todo/{id} — updating a specific todo by its ID.
      //     method: 'PUT',
      //     headers: { 'Content-Type': 'application/json' },// Sets header to indicate we're sending JSON, not FormData.
      //     body: JSON.stringify({ data: {name: newName, description: newDesq},  }) //Converts an object { data: newName } to a JSON string to send as the body.
      //   });
      //   
      //   // const updatedTodo = await response.json();
      //   // const index = this.todos.findIndex(t => t.id === id);
      //   // //"Only update the todo if it actually exists in the array."
      //   // if (index !== -1) {//This checks:Did findIndex() actually find the item?
      //   //   //If it did, the index will be 0, 1, 2, etc.
      //   //  //If it didn't, the index will be -1.
      //   //   this.todos[index] = updatedTodo;
      //   //   //replaces the old todo object in the array with the new one returned from the backend.
      //   // }
      //   this.fetchTodos()
      // } catch (error) {
      //   console.error('Error editing todo:', error);
      // }
      
      // NOW WITH VUEX: Uses object destructuring to pull out id and newName from the argument.
      try {
        const data = {
          name: newName,
          description: newDesq
        }
        await this.updateTodo({ id, data })
      } catch (error) {
        console.error('Error editing todo:', error)
      }
    },

    async deleteTodo(id) {
      if (!confirm('Are you sure you want to delete this todo?')) return
      
      // BEFORE VUEX: Direct API call with manual state refresh
      // try {
      //   await deleteTodo(id);
      //   this.fetchTodos();
      //   alert('Todo deleted successfully');
      // } catch (error) {
      //   alert('Failed to delete todo');
      // }
      
      // NOW WITH VUEX: Use action
      try {
        await this.deleteTodoAction(id)
        alert('Todo deleted successfully')
      } catch (error) {
        alert('Failed to delete todo')
      }
    },

    viewTodo(todoId) {
      // Emit event to parent view to navigate to todo details
      this.$emit('todo-selected', todoId)
    }
  },
  
  async mounted() {
    // BEFORE VUEX: Direct method call
    // this.fetchTodos();
    
    // NOW WITH VUEX: Use action
    try {
      await this.fetchTodos()
      } catch (error) {
      console.error('Error fetching todos:', error)
      }
    }
  //onMounted(fetchTodos)
}
</script>

<style scoped>
.todo-container {
  width: 50%;
  margin: 0px 172px;
  padding: 2rem;
  background: #1a1a1a;
  border-radius: 30px;
  box-shadow: 0 8px 32px rgba(76, 175, 80, 0.2);
  border: 2px solid #2d5a27;
  position: relative;
  overflow: hidden;

}

.todo-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top left, #2d5a2722, transparent 70%),
              radial-gradient(circle at bottom right, #4a782722, transparent 70%);
  pointer-events: none;
}

.todo-title {
  color: #4CAF50;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  font-family: 'Courier New', Courier, monospace;
  letter-spacing: 3px;
  position: relative;
}

.todo-content {
  background: #212121;
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid #2d5a27;
  position: relative;
  z-index: 1;
}

.error-message {
  background: #d32f2f;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  text-align: center;
}

.retry-btn {
  background: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
}

.retry-btn:hover {
  background: #d32f2f;
}

.loading {
  text-align: center;
  color: #4CAF50;
  font-size: 1.2rem;
  margin: 2rem 0;
}

@media (max-width: 768px) {
  .todo-container {
    margin: 1rem;
    padding: 1rem;
}

  .todo-title {
    font-size: 2.5rem;
  }

  .todo-content {
    padding: 1rem;
  }
}
</style>