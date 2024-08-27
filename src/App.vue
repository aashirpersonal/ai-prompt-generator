<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <nav class="p-4">
      <router-link to="/" class="text-xl font-bold">AI Prompt Generator</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import './assets/tailwind.css';

body {
  font-family: 'Arial', sans-serif;
}
</style>