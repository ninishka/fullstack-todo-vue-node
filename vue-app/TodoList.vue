<template>
  <div class="todo-list-page">
    <nav class="page-nav">
      <button @click="goHome" class="nav-btn">← Back to Home</button>
      <h1 class="page-title">Todo List</h1>
    </nav>
    
    <div class="content">
      <todo-interaction @todo-selected="viewTodoDetail"></todo-interaction>
    </div>
  </div>
</template>

<script>
import TodoInteraction from '@/components/todo-interaction.vue'

export default {
  name: 'TodoListPage',
  components: {
    TodoInteraction
  },
  methods: {
    goHome() {
      this.$router.push('/')
    },
    viewTodoDetail(todoId) {
      // This method will be called when a todo is selected for viewing
      this.$router.push(`/todo/${todoId}`)
    }
  }
}
</script>

<style scoped>
.todo-list-page {
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
}
</style> 