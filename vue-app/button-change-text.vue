<template>
    <div class="text-container">
      <h1 class="text-display">{{ text }}</h1>
      <button @click="changeText()" class="change-button">Change Text</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        text: 'hello world',
        isChanged: false
      }
    },
    methods: {
      changeText() {
        if(this.text === 'you clicked the button') {
          console.log('IF')
          return this.text = 'hello world'
        }
        else {
          console.log('else')
          return this.text = 'you clicked the button'
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .text-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background: #1a1a1a;
    border-radius: 30px;
    border: 2px solid #2d5a27;
    box-shadow: 0 8px 32px rgba(76, 175, 80, 0.2);
    position: relative;
    overflow: hidden;
    text-align: center;
  }

  .text-container::before {
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
  
  .text-display {
    font-size: 2.5rem;
    color: #4CAF50;
    margin-bottom: 2rem;
    font-family: 'Courier New', Courier, monospace;
    letter-spacing: 2px;
    position: relative;
  }
  
  .change-button {
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
  
  .change-button:hover {
    background: #4CAF50;
    transform: translateY(-2px);
  }

  .change-button:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    .text-container {
      margin: 1rem;
      padding: 1rem;
    }

    .text-display {
      font-size: 2rem;
    }
  }
  </style>