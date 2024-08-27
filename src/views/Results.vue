<!-- src/views/Results.vue -->
<template>
    <div class="container mx-auto p-4 max-w-4xl">
      <h1 class="text-4xl font-bold mb-8 text-center text-gradient">Generated Prompts</h1>
      <div v-if="isLoading" class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p class="mt-4 text-xl">Generating prompts...</p>
      </div>
      <div v-else-if="error" class="bg-red-500 bg-opacity-25 text-white p-4 rounded-lg mb-6">
        {{ error }}
      </div>
      <div v-else>
        <div class="mb-8 bg-glass backdrop-filter backdrop-blur-lg p-6 rounded-xl shadow-xl">
          <h2 class="text-2xl font-semibold mb-4 text-blue-300">Midjourney Parameters</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label for="aspectRatio" class="block text-sm font-medium mb-2 text-blue-300">Aspect Ratio</label>
              <select
                id="aspectRatio"
                v-model="aspectRatio"
                class="w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="">None</option>
                <option value="--ar 1:1">1:1</option>
                <option value="--ar 16:9">16:9</option>
                <option value="--ar 9:16">9:16</option>
                <option value="--ar 3:2">3:2</option>
              </select>
            </div>
            <div>
              <label for="stylize" class="block text-sm font-medium mb-2 text-blue-300">Stylize</label>
              <input
                id="stylize"
                v-model.number="stylize"
                type="number"
                min="0"
                max="1000"
                class="w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
              >
            </div>
            <div>
              <label for="chaos" class="block text-sm font-medium mb-2 text-blue-300">Chaos</label>
              <input
                id="chaos"
                v-model.number="chaos"
                type="number"
                min="0"
                max="100"
                class="w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
              >
            </div>
          </div>
        </div>
        <div class="overflow-x-auto bg-glass backdrop-filter backdrop-blur-lg rounded-xl shadow-xl">
          <table class="w-full table-auto">
            <thead>
              <tr class="bg-gray-800 bg-opacity-50">
                <th class="p-3 text-left text-blue-300">Original Prompt</th>
                <th class="p-3 text-left text-blue-300">Midjourney Optimized</th>
                <th class="p-3 text-left text-blue-300">Keywords</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(prompt, index) in prompts" :key="index" class="border-t border-gray-700">
                <td class="p-3">{{ prompt }}</td>
                <td class="p-3">{{ optimizedPrompt(prompt) }}</td>
                <td class="p-3">
                  <span class="font-bold">{{ getTopKeywords(prompt).join(', ') }}</span>
                  <span v-if="getAdditionalKeywords(prompt).length">, </span>
                  <span class="text-gray-400">{{ getAdditionalKeywords(prompt).join(', ') }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button @click="exportCSV" class="mt-8 w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
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
  
      const prompts = computed(() => store.getters.getPrompts.map(cleanPrompt))
      const isLoading = computed(() => store.getters.isLoading)
      const error = computed(() => store.getters.getError)
  
      const cleanPrompt = (prompt) => {
        // Remove numbering from the start of the prompt
        return prompt.replace(/^\d+\.\s*/, '').trim()
      }
  
      const optimizedPrompt = (prompt) => {
        let optimized = `/imagine prompt: ${prompt}`
        if (aspectRatio.value) optimized += ` ${aspectRatio.value}`
        if (stylize.value !== 100) optimized += ` --s ${stylize.value}`
        if (chaos.value !== 0) optimized += ` --c ${chaos.value}`
        return optimized
      }
  
      const generateKeywords = (prompt) => {
        // Convert prompt to lowercase and remove punctuation
        const cleanPrompt = prompt.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        
        // Split into words
        const words = cleanPrompt.split(/\s+/);
        
        // Remove common stop words and short words
        const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'over', 'after']);
        const filteredWords = words.filter(word => !stopWords.has(word) && word.length > 2);
        
        // Count word frequency
        const wordFrequency = {};
        filteredWords.forEach(word => {
          // Convert plural nouns to singular
          const singularWord = word.endsWith('s') ? word.slice(0, -1) : word;
          wordFrequency[singularWord] = (wordFrequency[singularWord] || 0) + 1;
        });
        
        // Sort words by frequency, then alphabetically
        const sortedWords = Object.keys(wordFrequency).sort((a, b) => {
          if (wordFrequency[b] !== wordFrequency[a]) {
            return wordFrequency[b] - wordFrequency[a];
          }
          return a.localeCompare(b);
        });
        
        // Add relevant two-word phrases
        const phrases = [];
        for (let i = 0; i < words.length - 1; i++) {
          const phrase = `${words[i]} ${words[i+1]}`;
          if (!stopWords.has(words[i]) && !stopWords.has(words[i+1]) && prompt.includes(phrase)) {
            phrases.push(phrase);
          }
        }
        
        // Combine and deduplicate keywords
        const allKeywords = [...new Set([...sortedWords, ...phrases])];
        
        // Ensure important words from the title (prompt) are in the top 10 keywords
        const titleWords = prompt.toLowerCase().split(/\s+/).filter(word => word.length > 2 && !stopWords.has(word));
        const topKeywords = titleWords.filter(word => allKeywords.includes(word));
        const remainingKeywords = allKeywords.filter(word => !topKeywords.includes(word));
        
        // Combine top keywords with remaining keywords, limiting to 35 total
        const finalKeywords = [...topKeywords, ...remainingKeywords].slice(0, 35);
        
        return finalKeywords;
      }
  
      const getTopKeywords = (prompt) => {
        return generateKeywords(prompt).slice(0, 15);
      }
  
      const getAdditionalKeywords = (prompt) => {
        return generateKeywords(prompt).slice(15);
      }
  
      const exportCSV = () => {
        const csvContent = prompts.value.map((prompt) => {
          const keywords = generateKeywords(prompt);
          return `"${prompt}","${optimizedPrompt(prompt)}","${keywords.join(', ')}"`
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
        getTopKeywords,
        getAdditionalKeywords,
        exportCSV
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
  </style>