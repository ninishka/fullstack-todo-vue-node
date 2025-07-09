<template>
    <div class="binding-container">
      <input id="id" v-model="message" placeholder="Add to the list..." class="binding-input">
      <p class="message-display">Message is: {{ message }}</p>
      <p v-if="message.length > 0" class="entered-message">You have entered: {{ message }}</p>
      <ul class="item-list">
        <li v-for="items in items" :key="items" class="item">{{ items }}</li>
      </ul>
      <button @click="addToItem()" class="add-button">Add to List</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        message: '',
        items: ['dog', 'cat', 'alpaka']
      }
    },
    methods: {
      addToItem() {
        this.items = [this.message, ...this.items]
        this.message = ''
      }
    }
  }
  </script>
  
  <style scoped>
  .binding-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background: #1a1a1a;
    border-radius: 30px;
    border: 2px solid #2d5a27;
    box-shadow: 0 8px 32px rgba(76, 175, 80, 0.2);
    position: relative;
    overflow: hidden;
  }

  .binding-container::before {
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
  
  .binding-input {
    width: -webkit-fill-available;
    padding: 1rem 1.5rem;
    background: #333333;
    border: 2px solid #2d5a27;
    border-radius: 25px;
    font-size: 1.1rem;
    color: #ffffff;
    margin-bottom: 1.5rem;
    font-family: 'Courier New', Courier, monospace;
  }

  .binding-input:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 15px rgba(76, 175, 80, 0.2);
  }
  
  .message-display, .entered-message {
    font-size: 1.2rem;
    color: #4CAF50;
    margin: 1rem 0;
    font-family: 'Courier New', Courier, monospace;
  }
  
  .item-list {
    list-style: none;
    padding: 0;
    margin: 2rem 0;
    background: #212121;
    border-radius: 15px;
    border: 1px solid #2d5a27;
  }
  
  .item {
    padding: 1rem;
    border-bottom: 1px solid #2d5a27;
    color: #ffffff;
    font-family: 'Courier New', Courier, monospace;
    transition: all 0.3s ease;
  }

  .item:last-child {
    border-bottom: none;
  }

  .item:hover {
    background: #333333;
    transform: translateX(5px);
  }
  
  .add-button {
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
  
  .add-button:hover {
    background: #4CAF50;
    transform: translateY(-2px);
  }

  .add-button:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    .binding-container {
      margin: 1rem;
      padding: 1rem;
    }
  }
  </style>