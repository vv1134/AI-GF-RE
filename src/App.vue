<script setup lang="ts">
import CallInterface from './components/CallInterface.vue'
</script>

<template>
  <div class="app">
    <h1>AI Companion Call App</h1>
    <CallInterface />
  </div>
</template>

<style>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1 {
  color: #2196F3;
  margin-bottom: 30px;
}
</style>