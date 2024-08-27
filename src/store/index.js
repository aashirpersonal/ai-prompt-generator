import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    prompts: [],
    loading: false,
    error: null
  },
  mutations: {
    setPrompts(state, prompts) {
      state.prompts = prompts
    },
    setLoading(state, loading) {
      state.loading = loading
    },
    setError(state, error) {
      state.error = error
    }
  },
  actions: {
    async generatePrompts({ commit }, { topic, promptCount, detailLevel, imageType }) {
      commit('setLoading', true)
      commit('setError', null)
      try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a creative prompt generator for AI image generation. Generate prompts that are detailed, imaginative, and suitable for Midjourney image generation. Each prompt should be a single sentence."
            },
            {
              role: "user",
              content: `Generate ${promptCount} unique and creative ${imageType} prompts about ${topic}. Make them suitable for Midjourney image generation. Detail level: ${detailLevel}/10. Separate each prompt with a newline.`
            }
          ],
          max_tokens: 2048,
          n: 1,
          stop: null,
          temperature: 0.8
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.VUE_APP_OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        })

        const generatedPrompts = response.data.choices[0].message.content.split('\n').filter(prompt => prompt.trim() !== '')
        commit('setPrompts', generatedPrompts)
      } catch (error) {
        console.error('Error generating prompts:', error)
        commit('setError', 'Failed to generate prompts. Please try again.')
      } finally {
        commit('setLoading', false)
      }
    }
  },
  getters: {
    getPrompts: (state) => state.prompts,
    isLoading: (state) => state.loading,
    getError: (state) => state.error
  }
})