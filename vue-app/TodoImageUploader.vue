<template>
  <div class="image-uploader">
    <button 
      @click="triggerFileInput" 
      class="upload-btn"
      type="button">
      Upload Image
    </button>
    <input 
      type="file" 
      ref="fileInput"
      @change="handleFileSelect"
      accept="image/*"
      class="hidden-input"
    />
    <div v-if="selectedFile" class="preview-container">
      <div class="file-info">
        <span>{{ selectedFile.name }}</span>
        <button @click="removeImage" class="remove-btn" type="button">×</button>
      </div>
      <img v-if="imagePreview" :src="imagePreview" class="image-preview" alt="Preview" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TodoImageUploader',
  data() {
    return {
      selectedFile: null,
      imagePreview: null
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file && file.type.startsWith('image/')) {
        this.selectedFile = file
        this.createPreview(file)
        this.$emit('image-selected', file)
      }
    },
    createPreview(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.imagePreview = e.target.result
      }
      reader.readAsDataURL(file)
    },
    removeImage() {
      this.selectedFile = null
      this.imagePreview = null
      this.$emit('image-selected', null)
      this.$refs.fileInput.value = ''
    }
  }
}
</script>

<style scoped>
.image-uploader {
  margin: 1rem 0;
}

.upload-btn {
  background-color: #2d5a27;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  transition: background-color 0.3s;
}

.upload-btn:hover {
  background-color: #4CAF50;
}

.hidden-input {
  display: none;
}

.preview-container {
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #2a2a2a;
  border-radius: 4px;
}

.file-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #fff;
  font-family: 'Courier New', monospace;
}

.remove-btn {
  background: none;
  border: none;
  color: #ff4444;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 0.5rem;
}

.image-preview {
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
}
</style> 