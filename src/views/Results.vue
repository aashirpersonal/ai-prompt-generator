<template>
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Generated Prompts</h1>
      <div v-if="isLoading" class="text-center">
        <p class="text-xl">Generating prompts...</p>
        <!-- You can add a loading spinner here -->
      </div>
      <div v-else-if="error" class="bg-red-500 text-white p-4 rounded">
        {{ error }}
      </div>
      <div v-else>
        <div class="mb-4">
          <h2 class="text-2xl font-semibold mb-2">Midjourney Parameters</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label for="aspectRatio" class="block mb-1">Aspect Ratio</label>
              <select
                id="aspectRatio"
                v-model="aspectRatio"
                class="w-full p-2 bg-gray-800 rounded"
              >
                <option value="">None</option>
                <option value="--ar 1:1">1:1</option>
                <option value="--ar 16:9">16:9</option>
                <option value="--ar 9:16">9:16</option>
                <option value="--ar 3:2">3:2</option>
              </select>
            </div>
            <div>
              <label for="stylize" class="block mb-1">Stylize</label>
              <input
                id="stylize"
                v-model.number="stylize"
                type="number"
                min="0"
                max="1000"
                class="w-full p-2 bg-gray-800 rounded"
              >
            </div>
            <div>
              <label for="chaos" class="block mb-1">Chaos</label>
              <input
                id="chaos"
                v-model.number="chaos"
                type="number"
                min="0"
                max="100"
                class="w-full p-2 bg-gray-800 rounded"
              >
            </div>
          </div>
        </div>
        <table class="w-full bg-glass backdrop-filter backdrop-glass">
          <thead>
            <tr>
              <th class="p-2 text-left">Original Prompt</th>
              <th class="p-2 text-left">Midjourney Optimized</th>
              <th class="p-2 text-left">Keywords</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(prompt, index) in prompts" :key="index" class="border-t border-gray-700">
              <td class="p-2">{{ prompt }}</td>
              <td class="p-2">{{ optimizedPrompt(prompt) }}</td>
              <td class="p-2">{{ generateKeywords(prompt) }}</td>
            </tr>
          </tbody>
        </table>
        <button @click="exportCSV" class="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Export CSV
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue'
  import { useStore } from 'vuex'
  
  export default {
    name: 'Results',
    setup() {
      const store = useStore()
      const aspectRatio = ref('')
      const stylize = ref(100)
      const chaos = ref(0)
  
      const prompts = computed(() => store.getters.getPrompts)
      const isLoading = computed(() => store.getters.isLoading)
      const error = computed(() => store.getters.getError)
  
      const optimizedPrompt = (prompt) => {
        let optimized = `/imagine prompt: ${prompt}`
        if (aspectRatio.value) optimized += ` ${aspectRatio.value}`
        if (stylize.value !== 100) optimized += ` --s ${stylize.value}`
        if (chaos.value !== 0) optimized += ` --c ${chaos.value}`
        return optimized
      }
  
      const generateKeywords = (prompt) => {
        // This is a simple implementation. You might want to use a more sophisticated method or API for keyword extraction.
        const words = prompt.toLowerCase().split(' ')
        const keywords = [...new Set(words)].filter(word => word.length > 3).slice(0, 10)
        return keywords.join(', ')
      }
  
      const exportCSV = () => {
        const csvContent = prompts.value.map((prompt, index) => {
          return `"${prompt}","${optimizedPrompt(prompt)}","${generateKeywords(prompt)}"`
        }).join('\n')
  
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', 'generated_prompts.csv')
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
  
      return {
        prompts,
        isLoading,
        error,
        aspectRatio,
        stylize,
        chaos,
        optimizedPrompt,
        generateKeywords,
        exportCSV
      }
    }
  }
  </script>