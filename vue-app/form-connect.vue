<template>
  <div>
    <form @submit.prevent="submitData">
      <input id="id" v-model="inputData" placeholder="Enter some data" />
      <button type="submit">Submit</button>
    </form>
    <p v-if="responseMessage">{{ responseMessage }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputData: '',
      responseMessage: ''
    }
  },
  methods: {
    async submitData() {
      try {
        const response = await fetch('http://localhost:3000/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ data: this.inputData })
        });
        const result = await response.text();
        this.responseMessage = result;
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
}
</script>