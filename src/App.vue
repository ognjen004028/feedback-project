<script setup lang="ts">
import { ref } from 'vue';
import FeedbackModal from './components/FeedbackModal.vue';
import FeedbackList from './components/FeedbackList.vue';
import FeedbackDetail from './components/FeedbackDetail.vue';
import { CheckCircleIcon } from '@heroicons/vue/24/solid';
import type { Feedback, FeedbackFormData } from './types/feedback';
import { submitFeedback } from './api/feedback';

const isModalOpen = ref(false);
const selectedFeedback = ref<Feedback | null>(null);

const handleSubmit = async (feedback: FeedbackFormData) => {
  try {
    await submitFeedback(feedback);
    window.location.reload();
  } catch (error) {
    console.error('Error submitting feedback:', error);
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header banner -->
    <header class="bg-white border-b border-gray-200">
      <div class="w-full px-6">
        <div class="flex h-16 justify-between items-center">
          <div class="flex items-center">
            <CheckCircleIcon class="h-8 w-8 text-primary-600" />
            <!-- <h1 class="ml-3 text-xl font-semibold text-gray-900">Feedback System</h1> -->
          </div>
          <button
            @click="isModalOpen = true"
            class="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            New Feedback
          </button>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1 flex">
      <div class="flex-1 flex">
        <!-- Left side feedback list -->
        <div class="w-1/4 border-r border-gray-200 bg-white">
          <FeedbackList @select-feedback="selectedFeedback = $event" :selected-id="selectedFeedback?.id" />
        </div>

        <!-- Right side feedback detail -->
        <div class="w-3/4 bg-white">
          <FeedbackDetail
            v-if="selectedFeedback"
            :feedback="selectedFeedback"
            @close="selectedFeedback = null"
          />
          <div v-else class="h-full flex items-center justify-center text-gray-500">
            Select a feedback item to view details
          </div>
        </div>
      </div>
    </main>

    <FeedbackModal :is-open="isModalOpen" @close="isModalOpen = false" @submit="handleSubmit" />
  </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  min-height: 100vh;
}

#app {
  width: 100%;
  height: 100vh;
}
</style>