<template>
  <div class="form-container">
    <form @submit.prevent="submitForm" class="todo-form">
      <input 
        v-model="newTodo" 
        placeholder="Write your todo here..." 
        class="todo-input"
        maxlength="100"
      />
      <textarea  
        v-model="description" 
        placeholder="Description" 
        class="todo-textarea"
        >
      </textarea>
      <TodoImageUploader :key="resetKey" @image-selected="handleImageSelect" />
      <button type="submit" class="todo-button">
        Add Todo
      </button>
    </form>
  </div>
</template>

<script>
import TodoImageUploader from './TodoImageUploader.vue'

export default {
  components: {
    TodoImageUploader
  },
  data() {
    return {
      //declaring variables and defining defoult values 
      newTodo: '',
      selectedImage: null,
      description: '',
      resetKey: 0 // to force re-render
    }
  },
  methods: {
    handleImageSelect(file) {
      this.selectedImage = file  
    //  This method takes the file selected by the user and stores it in the 
    // component's state so it can be used later.
    },
    async submitForm() {

      if (this.newTodo.trim()) { //Checks that the todo text isn’t empty or just spaces.
        const formData = new FormData()//creates a special object (formData) that is used to bundle data — 
        // -like text and files — and send them to a backend server.

      formData.append('text', this.newTodo)//adding the task text to the formData under the key "text".

      if (this.selectedImage) {//If the user has selected an image, then this condition is true.
        formData.append('image', this.selectedImage)//adding selected image to the formData
      }

      formData.append('description', this.description)

        try {
          this.$emit('add-todo', formData)//This sends the formData up to the parent component(todo-interaction) using a event called add-todo.
          //Hey parent, here's the new todo + image!

          this.newTodo = ''
          this.description = ''
          //| clearing the input fields after submitting |
          this.resetKey += 1
          this.selectedImage = null  

        } catch (e) {
          console.error("Emit wrong")//shows error in console if something wrong
        }
      }
    }
  }
}
</script>

<style scoped>
.form-container {
  margin-bottom: 2rem;

}

.todo-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #2a2a2a;
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid #2d5a27;
}

.todo-input {
  flex: 1;
  padding: 1rem 1.5rem;
  background: #333333;
  border: 2px solid #2d5a27;
  border-radius: 25px;
  font-size: 1.1rem;
  color: #ffffff;
  transition: all 0.3s ease;
  font-family: 'Courier New', Courier, monospace;
  white-space: nowrap;        
  overflow: hidden;         
  text-overflow: ellipsis;     
}

.todo-textarea {
  min-height: 50px;          
  max-height: 300px;         
  resize: vertical;        
  overflow-y: auto;    
  
  padding: 1rem 1.5rem;
  background: #333333;
  border: 2px solid #2d5a27;
  border-radius: 25px;
  font-size: 1.1rem;
  color: #ffffff;
  font-family: 'Courier New', Courier, monospace;
  transition: all 0.3s ease;
}

.todo-textarea::placeholder {
  color: #666666;
}

.todo-textarea:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 15px rgba(76, 175, 80, 0.2);
}

.todo-input::placeholder {
  color: #666666;
}

.todo-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 15px rgba(76, 175, 80, 0.2);
}

.todo-button {
  padding: 0.75rem 2rem;
  background: #2d5a27;
  color: #ffffff;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Courier New', Courier, monospace;
}

.todo-button:hover {
  background: #4CAF50;
  transform: translateY(-2px);
}

.todo-button:active {
  transform: translateY(0);
}

@media (max-width: 480px) {
  .todo-form {
    flex-direction: column;
    padding: 1rem;
  }

  .todo-button {
    width: 100%;
  }
}
</style> 