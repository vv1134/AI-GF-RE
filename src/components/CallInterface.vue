<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { chatWithAIGirlfriend } from '../api/openrouter';
import type { Message } from '../types';

const messages = ref<Message[]>([]);
const isCallActive = ref(false);
const error = ref<string | null>(null);
const isLoading = ref(false);
const isListening = ref(false);

let recognition: SpeechRecognition | null = null;
const synth = window.speechSynthesis;

onMounted(() => {
  try {
    // Initialize speech recognition
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = async (event) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript;
      
      await sendMessage(text);
    };

    recognition.onerror = (event) => {
      error.value = `Speech recognition error: ${event.error}`;
      isListening.value = false;
    };
  } catch (e) {
    error.value = 'Speech recognition is not supported in your browser';
  }
});

onUnmounted(() => {
  if (recognition) {
    recognition.stop();
  }
  synth.cancel();
});

async function startCall() {
  isCallActive.value = true;
  error.value = null;
  messages.value = [{
    role: 'assistant',
    content: "Hi sweetie! It's Luna. I've been looking forward to talking with you. How has your day been?"
  }];
  
  // Configure voice for Luna
  const voices = synth.getVoices();
  const femaleVoice = voices.find(voice => voice.name.includes('female') || voice.name.includes('woman'));
  
  // Speak the initial greeting
  speakText(messages.value[0].content, femaleVoice);
  
  // Start listening
  if (recognition) {
    try {
      recognition.start();
      isListening.value = true;
    } catch (e) {
      error.value = 'Failed to start voice recognition';
    }
  }
}

async function endCall() {
  if (recognition) {
    recognition.stop();
  }
  synth.cancel();
  isCallActive.value = false;
  isListening.value = false;
  messages.value.push({
    role: 'assistant',
    content: "I'll miss you! Call me again soon, okay? Take care, sweetie! 💕"
  });
  speakText(messages.value[messages.value.length - 1].content);
  setTimeout(() => {
    messages.value = [];
    error.value = null;
  }, 3000);
}

function speakText(text: string, voice?: SpeechSynthesisVoice) {
  const utterance = new SpeechSynthesisUtterance(text);
  if (voice) utterance.voice = voice;
  utterance.rate = 1;
  utterance.pitch = 1.2; // Slightly higher pitch for more feminine voice
  utterance.volume = 1;
  synth.speak(utterance);
}

async function sendMessage(text: string) {
  if (!text || isLoading.value) return;
  
  error.value = null;
  isLoading.value = true;
  
  // Add user message
  messages.value.push({
    role: 'user',
    content: text
  });

  try {
    // Get AI response
    const response = await chatWithAIGirlfriend(messages.value);
    messages.value.push({
      role: 'assistant',
      content: response
    });
    
    // Speak the AI's response
    speakText(response);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'An error occurred';
    console.error('Chat error:', e);
  } finally {
    isLoading.value = false;
  }
}

function toggleMicrophone() {
  if (!recognition) return;
  
  if (isListening.value) {
    recognition.stop();
    isListening.value = false;
  } else {
    try {
      recognition.start();
      isListening.value = true;
    } catch (e) {
      error.value = 'Failed to start voice recognition';
    }
  }
}
</script>

<template>
  <div class="call-interface">
    <div class="header">
      <h1>Call with Luna 💝</h1>
      <p class="subtitle">Your AI Girlfriend</p>
    </div>

    <div class="controls">
      <button 
        v-if="!isCallActive"
        @click="startCall"
        class="start-btn"
      >
        <span class="icon">📞</span> Call Luna
      </button>
      <button 
        v-else
        @click="endCall"
        class="end-btn"
      >
        <span class="icon">📞</span> End Call
      </button>
    </div>

    <div v-if="isCallActive" class="chat-container">
      <div class="messages">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.role]"
        >
          {{ message.content }}
        </div>
        <div v-if="isLoading" class="message assistant loading">
          Luna is thinking...
        </div>
        <div v-if="error" class="message error">
          {{ error }}
        </div>
      </div>

      <div class="input-container">
        <button 
          @click="toggleMicrophone" 
          :class="['mic-btn', { active: isListening }]"
          :disabled="!isCallActive"
        >
          {{ isListening ? '🎤 Luna is listening...' : '🎤 Click to Talk to Luna' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.call-interface {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #FF69B4;
  margin: 0;
  font-size: 2.5em;
}

.subtitle {
  color: #666;
  margin: 5px 0 0 0;
  font-size: 1.2em;
}

.controls {
  text-align: center;
  margin-bottom: 20px;
}

.start-btn, .end-btn {
  padding: 15px 30px;
  font-size: 1.2em;
  border-radius: 25px;
  cursor: pointer;
  border: none;
  color: white;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: transform 0.2s ease;
}

.start-btn:hover, .end-btn:hover {
  transform: scale(1.05);
}

.icon {
  font-size: 1.2em;
}

.start-btn {
  background-color: #FF69B4;
}

.end-btn {
  background-color: #f44336;
}

.chat-container {
  background-color: #FFF0F5;
  border-radius: 20px;
  padding: 20px;
  height: 500px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 10px;
}

.message {
  margin: 10px;
  padding: 12px 18px;
  border-radius: 20px;
  max-width: 80%;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.user {
  background-color: #E8F5E9;
  margin-left: auto;
  color: #2E7D32;
}

.assistant {
  background-color: #FFE4E1;
  margin-right: auto;
  color: #D81B60;
}

.loading {
  font-style: italic;
  color: #666;
}

.error {
  background-color: #ffebee;
  color: #c62828;
  margin: 10px auto;
}

.input-container {
  display: flex;
  justify-content: center;
  padding: 10px;
}

.mic-btn {
  padding: 15px 30px;
  font-size: 1.2em;
  background-color: #FF69B4;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.mic-btn.active {
  background-color: #D81B60;
  animation: pulse 1.5s infinite;
}

.mic-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>