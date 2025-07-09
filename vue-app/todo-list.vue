<template>
  <div class="list-container">

    <ul class="todo-list">

      <li v-for="todo in todos" :key="todo.id" class="todo-item">
        <!-- Loops through all the todos using v-for. -->
        <!-- :key="todo.id" helps Vue track which item is which (important for performance). -->
        <div class="todo-content">
          
          <div>
            <img v-if="todo.image_path" :src="`http://localhost:3000${todo.image_path}`"
            />
          </div>

          <p v-if="!isEditing || editedTodoId !== todo.id" class="todo-text">
            <!-- //If you're not editing, or you're editing a different todo, -->
             <!-- show the todo's name as normal text. ||-or -->
            {{ todo.name }}
          </p>

          <input
            v-else
            v-model="editedTodo"
            class="todo-input"
            @keyup.enter="saveEdit(todo.id)"
            maxlength="100"
          />

          <div v-if="!isEditing || editedTodoId !== todo.id" class="todo-text">
            <!-- //If you're not editing, or you're editing a different todo, -->
             <!-- show the todo's name as normal text. ||-or -->
            {{ todo.description }}
          </div>
          <textarea
            v-else
            v-model="editedDesq"
            class="todo-textarea"
            @keyup.enter="saveEdit(todo.id)"
            color="red"
            > 
          </textarea>
          <!-- //Otherwise (if editing this todo), show an input field. -->
          <!-- //When you press Enter, it triggers saveEdit(todo.id). -->
        </div>

        <div class="todo-actions">

          <button
            @click="viewDetails(todo.id)"
            class="action-button view-button"
          >
            View Details
          </button>

          <button
            v-if="!isEditing || editedTodoId !== todo.id"
            @click="startEditing(todo.id, todo.name, todo.description)"
            class="action-button edit-button"
          > 
          <!-- //Show the Edit button if you're not editing, or editing a different item. -->

            Edit
          </button>

          <button
            v-else
            @click="saveEdit(todo.id)"
            class="action-button save-button"
          > 
          <!-- //If you are editing this todo, show a Save button. -->
            Save
          </button>

          <button
            @click="$emit('delete-todo', todo.id)"
            class="action-button delete-button"
          > 
          <!-- //Always show a Delete button. -->
          <!-- //Clicking it emits a delete-todo event to the parent, passing the todo's ID. -->
            Delete
          </button>

        </div>

      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    todos: { //This component receives todos from the parent.
    //It must be an array and is required.
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isEditing: false, //True/false — whether the user is currently editing.
      editedTodo: '',
      editedDesq: '', //The current input value when editing a todo.
      editedTodoId: null //The ID of the todo being edited.
    }
  },
  methods: {
    viewDetails(todoId) {
      // Emit event to parent to navigate to todo detail page
      this.$emit('view-todo', todoId)
    },
    startEditing(id, name, description) { //Triggered when Edit is clicked.
      this.isEditing = true; //Enables editing mode.
      this.editedTodo = name ;//Sets the current text (editedTodo)
      this.editedDesq = description;
      // and which todo is being edited (editedTodoId).
      this.editedTodoId = id;
    },
    saveEdit(id) { //Triggered when Save is clicked or Enter is pressed.
      if (this.editedTodo.trim()) { //If the edited text isn't empty:
        this.$emit('edit-todo', { id, newName: this.editedTodo, newDesq: this.editedDesq });//Emits edit-todo event to parent with the new data.
        //Exits editing mode and clears input state.
        this.isEditing = false;
        this.editedTodo = '';
        this.editedDesq = '';
        this.editedTodoId = null;
      }
    }
  }
}
</script>

<style scoped>
.list-container {
  background: #2a2a2a;
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid #2d5a27;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem;
  border-bottom: 1px solid #2d5a27;
  transition: all 0.3s ease;
  background: #2a2a2a;
}

.todo-item:hover {
  background: #333333;
  transform: translateX(5px);
}

.todo-content {
  /* flex: 1; */
  display: flex;
  flex-direction: column;
  margin-right: 1rem;
}

.todo-text {
  color: #ffffff;
  font-size: 1.1rem;
  display: block;
  padding: 0.5rem;
  font-family: 'Courier New', Courier, monospace;
  word-wrap: break-word;   
  white-space: normal;     
}

.todo-input {
  /* width: 100%; */
  padding: 0.8rem 1rem;
  background: #333333;
  border: 2px solid #2d5a27;
  border-radius: 25px;
  font-size: 1.1rem;
  color: #ffffff;
  font-family: 'Courier New', Courier, monospace;
  white-space: nowrap;        
  overflow: hidden;           
  text-overflow: ellipsis;
}

.todo-textarea {
  min-height: 80px;         
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


.todo-actions {
  display: flex;
  gap: 0.8rem;
}

.action-button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Courier New', Courier, monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.edit-button {
  background: transparent;
  color: #4CAF50;
  border: 2px solid #4CAF50;
}

.edit-button:hover {
  background: rgba(76, 175, 80, 0.1);
}

.view-button {
  background: transparent;
  color: #2196F3;
  border: 2px solid #2196F3;
}

.view-button:hover {
  background: rgba(33, 150, 243, 0.1);
}

.save-button {
  background: #4CAF50;
  color: #ffffff;
}

.save-button:hover {
  background: #2d5a27;
}

.delete-button {
  background: transparent;
  color: #e57373;
  border: 2px solid #e57373;
}

.delete-button:hover {
  background: rgba(229, 115, 115, 0.1);
}

@media (max-width: 640px) {
  .todo-item {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .todo-actions {
    justify-content: space-between;
  }

  .action-button {
    flex: 1;
    text-align: center;
  }
}
</style>