<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Navigation from './components/Navigation.vue'
import { useMoviesStore } from './stores/movies'

const moviesStore = useMoviesStore()

onMounted(() => {
  // Initialize store if needed
})
</script>

<template>
  <div id="app">
    <Navigation />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  background: #0a0a0a;
  color: #fff;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 0;
}

/* Light theme */
.light-theme {
  background: #ffffff;
  color: #333;
}

.light-theme body {
  background: #ffffff;
  color: #333;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #666;
}

.light-theme ::-webkit-scrollbar-track {
  background: #f0f0f0;
}

.light-theme ::-webkit-scrollbar-thumb {
  background: #ccc;
}

.light-theme ::-webkit-scrollbar-thumb:hover {
  background: #999;
}

/* Utility classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.text-center {
  text-align: center;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
}
</style>
