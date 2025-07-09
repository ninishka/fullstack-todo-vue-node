<template>
  <div class="todo-detail-page">
    <nav class="page-nav">
      <button @click="goBack" class="nav-btn">← Back to Todos</button>
      <h1 class="page-title">Todo Details</h1>
    </nav>
    
    <div class="content">
      <div v-if="loading" class="loading">
        <p>Loading todo details...</p>
      </div>
      
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="fetchTodo" class="retry-btn">Retry</button>
      </div>
      
      <div v-else-if="todo" class="todo-details">
        <div class="todo-header">
          <h2 class="todo-name">{{ todo.name }}</h2>
          <span class="todo-status" :class="{ completed: todo.completed }">
            {{ todo.completed ? 'Completed' : 'Pending' }}
          </span>
        </div>
        
        <div class="todo-content">
          <div class="description-section">
            <h3>Description</h3>
            <p class="description">{{ todo.description || 'No description provided' }}</p>
          </div>
          
          <div class="image-section" v-if="todo.image_path">
            <h3>Image</h3>
            <img :src="getImageUrl(todo.image_path)" :alt="todo.name" class="todo-image" />
          </div>
          
          <div class="meta-section">
            <h3>Details</h3>
            <div class="meta-info">
              <p><strong>ID:</strong> {{ todo.id }}</p>
              <p><strong>Created:</strong> {{ formatDate(todo.created_at) }}</p>
              <p><strong>Last Updated:</strong> {{ formatDate(todo.updated_at) }}</p>
            </div>
          </div>
        </div>
        
        <div class="actions">
          <button @click="toggleComplete" class="action-btn" :class="{ completed: todo.completed }">
            {{ todo.completed ? 'Mark as Pending' : 'Mark as Complete' }}
          </button>
          <button @click="editTodo" class="action-btn edit">
            Edit Todo
          </button>
          <button @click="deleteTodo" class="action-btn delete">
            Delete Todo
          </button>
        </div>
      </div>
      
      <div v-else class="not-found">
        <p>Todo not found</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'TodoDetailPage',

  //Props in Vue are like inputs to a component. When you pass data from a parent 
  // (like a router or another component) into a child component, you do it using props.

  //defines a prop that the component expects to receive — in this case, id.
  props: {
    id: {
      type: String,
      required: true //This prop is mandatory – Vue will warn you if it's missing
    }
  },//<= That all means: this.id 

  // BEFORE VUEX: We had local state here
  // data() {//component's internal state
  //   return {
  //     todo: null, //todo holds the fetched item
  //     loading: true,//loading is for spinner logic
  //     error: null
  //   }
  // },

  computed: {
    ...mapGetters('todos', [
      'currentTodo',
      'isLoading',
      'hasError'
    ]),
    
    // Use currentTodo from store, fallback to local computed
    todo() {
      return this.currentTodo
    },
    
    loading() {
      return this.isLoading
    },
    
    error() {
      return this.hasError
    }
  },

  methods: {
    ...mapActions('todos', [
      'fetchTodoById',
      'toggleTodoComplete',
      'clearError'
    ]),
    
    ...mapActions('todos', {
      deleteTodoAction: 'deleteTodo'
    }),

    async fetchTodo() {
      // BEFORE VUEX: Direct API fetch —fetches the todo from backend
      // this.loading = true
      // this.error = null
      // 
      // try {
      //   const response = await fetch(`http://localhost:3000/api/todos/${this.id}`)
      //   
      //   if (!response.ok) {
      //     throw new Error(`Todo not found (${response.status})`)
      //   }
      //   
      //   this.todo = await response.json()
      // } catch (error) {
      //   console.error('Error fetching todo:', error)
      //   this.error = error.message
      // } finally {
      //   this.loading = false
      // }
      
      // NOW WITH VUEX: Use action
      try {
        await this.fetchTodoById(this.id)
      } catch (error) {
        console.error('Error fetching todo:', error)
      }
    },
    
    async toggleComplete() {
      // BEFORE VUEX: Two different approaches were shown in comments
      // // async toggleComplete() { //toggles completed status
      // //   try {
      // //     const response = await fetch(`http://localhost:3000/todo/${this.id}`, {
      // //       method: 'PUT',
      // //       headers: {
      // //         'Content-Type': 'application/json',
      // //       },
      // //       body: JSON.stringify({
      // //         ...this.todo,
      // //         completed: !this.todo.completed
      // //       })
      // //     })
      // //     
      // //     if (response.ok) {
      // //       this.todo.completed = !this.todo.completed
      // //     } else {
      // //       throw new Error('Failed to update todo')
      // //     }
      // //   } catch (error) {
      // //     console.error('Error updating todo:', error)
      // //     alert('Failed to update todo')
      // //   }
      // // },

      // BEFORE VUEX: The working version was:
      // try {
      //   const response = await fetch(`http://localhost:3000/todo/${this.id}`, {
      //     method: 'PUT',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       data: {
      //         name: this.todo.name,
      //         description: this.todo.description,
      //         completed: !this.todo.completed
      //       }
      //     })
      //   })
      //
      //   if (response.ok) {
      //     this.todo.completed = !this.todo.completed
      //   } else {
      //     throw new Error('Failed to update todo')
      //   }
      // } catch (error) {
      //   console.error('Error updating todo:', error)
      //   alert('Failed to update todo')
      // }
      
      // NOW WITH VUEX: Use action
      try {
        await this.toggleTodoComplete(parseInt(this.id))
      } catch (error) {
        console.error('Error updating todo:', error)
        alert('Failed to update todo')
      }
    },

    async deleteTodo() {
      if (!confirm('Are you sure you want to delete this todo?')) return

      // BEFORE VUEX: Import and direct call
      // import { deleteTodo } from '@/api/todoService'
      // try {
      //   await deleteTodo(this.id);
      //   alert('Todo deleted successfully');
      //   this.$router.push('/todos'); // navigate back to list
      // } catch (error) {
      //   alert('Failed to delete todo');
      // }
      
      // NOW WITH VUEX: Use action
      try {
        await this.deleteTodoAction(parseInt(this.id))
        alert('Todo deleted successfully')
        this.$router.push('/todos')
      } catch (error) {
        alert('Failed to delete todo')
      }
    },
    
    editTodo() {
      // (FOR NOW ONLY)redirects to /todos
      // For now, just go back to the list where editing can happen
      // In a real app, you might have a separate edit page
      this.$router.push('/todos')
    },
    
    goBack() {
      // same as edit — goes back to list
      this.$router.push('/todos')
    },
    
    formatDate(dateString) {
      //formats timestamps
      if (!dateString) return 'N/A'
      // BEFORE: More detailed formatting
      // return new Date(dateString).toLocaleDateString('en-US', {
      //   year: 'numeric',
      //   month: 'long',
      //   day: 'numeric',
      //   hour: '2-digit',
      //   minute: '2-digit'
      // })
      return new Date(dateString).toLocaleString()
    },
    
    getImageUrl(imagePath) {
      // builds a URL to show image NOT WORKING -> FIXED
      // BEFORE: return `http://localhost:3000/${imagePath}`
      if (!imagePath) return ''
      return `http://localhost:3000${imagePath}`
    }
  },

  // BEFORE VUEX: mounted() { //fetch the todo when page loads
  //   this.fetchTodo() 
  // },
  async mounted() {
    await this.fetchTodo()
  },

  //Route Watching
  watch: { //This lets the component react to route changes.
    id() {
      this.fetchTodo()
    }
    //FE
    //User is on /todos/5, then navigates to /todos/6 without leaving the page.
    //This watch ensures fetchTodo() runs again when id changes.
  }
}
</script>

<!-- | Concept                   | How It's Used                                         |
| ------------------------- | ----------------------------------------------------- |
| **Dynamic Route**         | `/todos/:id` – shows detail based on `id` param       |
| **Props from Route**      | `props: true` – passes `id` as a prop                 |
| **Programmatic Nav**      | `this.$router.push()` – go back or after delete       |
| **Route Watching**        | `watch: { id() {} }` – refetch if route param changes |
| **Route-Based Component** | Only shows data **when mounted based on URL**         | -->


<style scoped>
.todo-detail-page {
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

.content {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.loading, .error, .not-found {
  text-align: center;
  padding: 2rem;
  color: #81C784;
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
}

.retry-btn {
  background: linear-gradient(45deg, #4CAF50, #66BB6A);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  margin-top: 1rem;
  cursor: pointer;
}

.todo-details {
  background: rgba(76, 175, 80, 0.1);
  border: 2px solid #4CAF50;
  border-radius: 15px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #4CAF50;
}

.todo-name {
  font-family: 'Courier New', monospace;
  color: #4CAF50;
  margin: 0;
  font-size: 2rem;
}

.todo-status {
  font-family: 'Courier New', monospace;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: rgba(255, 193, 7, 0.2);
  border: 1px solid #FFC107;
  color: #FFC107;
}

.todo-status.completed {
  background: rgba(76, 175, 80, 0.2);
  border-color: #4CAF50;
  color: #4CAF50;
}

.todo-content h3 {
  font-family: 'Courier New', monospace;
  color: #4CAF50;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.description-section, .image-section, .meta-section {
  margin-bottom: 2rem;
}

.description {
  font-family: 'Courier New', monospace;
  color: #81C784;
  line-height: 1.6;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid #4CAF50;
}

.todo-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  border: 2px solid #4CAF50;
}

.meta-info {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid #4CAF50;
}

.meta-info p {
  font-family: 'Courier New', monospace;
  color: #81C784;
  margin: 0.5rem 0;
}

.meta-info strong {
  color: #4CAF50;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #4CAF50;
}

.action-btn {
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

.action-btn:hover {
  transform: scale(1.05);
}

.action-btn.completed {
  background: linear-gradient(45deg, #FFC107, #FFD54F);
  color: #1a1a2e;
}

.action-btn.edit {
  background: linear-gradient(45deg, #2196F3, #42A5F5);
}

.action-btn.delete {
  background: linear-gradient(45deg, #f44336, #ef5350);
}

.action-btn.completed:hover {
  background: linear-gradient(45deg, #FFD54F, #FFC107);
}

.action-btn.edit:hover {
  background: linear-gradient(45deg, #42A5F5, #2196F3);
}

.action-btn.delete:hover {
  background: linear-gradient(45deg, #ef5350, #f44336);
}
</style> 