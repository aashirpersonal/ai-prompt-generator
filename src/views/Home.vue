<!-- src/views/Home.vue -->
<template>
    <div class="container mx-auto p-4 max-w-2xl">
      <h1 class="text-4xl font-bold mb-8 text-center text-gradient">AI Prompt Generator</h1>
      <form @submit.prevent="generatePrompts" class="bg-glass backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-2xl">
        <div class="mb-6">
          <label for="topic" class="block text-sm font-medium mb-2 text-blue-300">Topic</label>
          <input
            id="topic"
            v-model="topic"
            type="text"
            class="w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
            required
            placeholder="Enter your topic"
          >
        </div>
        <div class="mb-6">
          <label for="promptCount" class="block text-sm font-medium mb-2 text-blue-300">Number of Prompts</label>
          <input
            id="promptCount"
            v-model.number="promptCount"
            type="number"
            min="1"
            max="1000"
            class="w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
            required
          >
        </div>
        <div class="mb-6">
          <label for="detailLevel" class="block text-sm font-medium mb-2 text-blue-300">Detail Level: {{ detailLevel }}</label>
          <input
            id="detailLevel"
            v-model.number="detailLevel"
            type="range"
            min="1"
            max="10"
            class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          >
        </div>
        <div class="mb-6">
          <span class="block text-sm font-medium mb-2 text-blue-300">Image Type</span>
          <div class="flex space-x-4">
            <label class="inline-flex items-center">
              <input type="radio" v-model="imageType" value="photo" class="form-radio text-blue-500">
              <span class="ml-2">Photo-realistic</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" v-model="imageType" value="illustration" class="form-radio text-blue-500">
              <span class="ml-2">Illustration</span>
            </label>
          </div>
        </div>
        <div v-if="error" class="mb-4 text-red-500 text-sm">
          {{ error }}
        </div>
        <button 
          type="submit" 
          class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </span>
          <span v-else>Generate Prompts</span>
        </button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  
  export default {
    name: 'Home',
    setup() {
      const store = useStore()
      const router = useRouter()
      const topic = ref('')
      const promptCount = ref(10)
      const detailLevel = ref(5)
      const imageType = ref('photo')
  
      const isLoading = computed(() => store.getters.isLoading)
      const error = computed(() => store.getters.getError)
  
      const generatePrompts = async () => {
        try {
          await store.dispatch('generatePrompts', {
            topic: topic.value,
            promptCount: promptCount.value,
            detailLevel: detailLevel.value,
            imageType: imageType.value
          })
          router.push({ name: 'Results' })
        } catch (error) {
          console.error('Error generating prompts:', error)
        }
      }
  
      return {
        topic,
        promptCount,
        detailLevel,
        imageType,
        generatePrompts,
        isLoading,
        error
      }
    }
  }
  </script>

<style scoped>
.text-gradient {
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(45deg, #3b82f6, #8b5cf6);
}

.bg-glass {
  background-color: rgba(17, 25, 40, 0.75);
}

.backdrop-blur-lg {
  backdrop-filter: blur(20px);
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #3b82f6;
  cursor: pointer;
  border-radius: 50%;
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #3b82f6;
  cursor: pointer;
  border-radius: 50%;
}
</style>