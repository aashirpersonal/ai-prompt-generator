<template>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Generate AI Prompts</h1>
      <form @submit.prevent="generatePrompts" class="bg-glass backdrop-filter backdrop-glass p-6 rounded-lg shadow-lg">
        <div class="mb-4">
          <label for="topic" class="block mb-2">Topic</label>
          <input
            id="topic"
            v-model="topic"
            type="text"
            class="w-full p-2 bg-gray-800 rounded"
            required
          >
        </div>
        <div class="mb-4">
          <label for="promptCount" class="block mb-2">Number of Prompts</label>
          <input
            id="promptCount"
            v-model.number="promptCount"
            type="number"
            min="1"
            max="1000"
            class="w-full p-2 bg-gray-800 rounded"
            required
          >
        </div>
        <div class="mb-4">
          <label for="detailLevel" class="block mb-2">Detail Level</label>
          <input
            id="detailLevel"
            v-model.number="detailLevel"
            type="range"
            min="1"
            max="10"
            class="w-full"
          >
          <span>{{ detailLevel }}</span>
        </div>
        <div class="mb-4">
          <label class="block mb-2">Image Type</label>
          <div>
            <label class="inline-flex items-center mr-4">
              <input type="radio" v-model="imageType" value="photo" class="form-radio">
              <span class="ml-2">Photo-realistic</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" v-model="imageType" value="illustration" class="form-radio">
              <span class="ml-2">Illustration</span>
            </label>
          </div>
        </div>
        <div v-if="error" class="mb-4 text-red-500">
        {{ error }}
      </div>
      
      <button 
        type="submit" 
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Generating...' : 'Generate Prompts' }}
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