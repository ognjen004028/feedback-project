<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Feedback } from '../types/feedback';
import { getFeedback } from '../api/feedback';
import { BugAntIcon, LightBulbIcon } from '@heroicons/vue/24/outline';
import { formatDistanceToNow } from 'date-fns';

const props = defineProps<{
  selectedId?: string;
}>();

const emit = defineEmits<{
  'selectFeedback': [feedback: Feedback]
}>();

const feedbacks = ref<Feedback[]>([]);
const sortBy = ref<'date' | 'name'>('date');
const filterType = ref<'all' | 'bug' | 'suggestion'>('all');
const currentPage = ref(1);
const totalPages = ref(1);
const isLoading = ref(false);

const fetchFeedbacks = async () => {
  try {
    isLoading.value = true;
    const response = await getFeedback({
      page: currentPage.value,
      limit: 10,
      type: filterType.value === 'all' ? undefined : filterType.value,
      sortBy: sortBy.value,
    });
    feedbacks.value = response.feedbacks;
    totalPages.value = response.totalPages;
  } catch (error) {
    console.error('Error fetching feedback:', error);
  } finally {
    isLoading.value = false;
  }
};

watch([sortBy, filterType, currentPage], () => {
  fetchFeedbacks();
});

onMounted(() => {
  fetchFeedbacks();
});
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Filters -->
    <div class="p-4 border-b border-gray-200 space-y-4">
      <div class="flex space-x-4">
        <select
          v-model="filterType"
          class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        >
          <option value="all">All Types</option>
          <option value="bug">Bugs</option>
          <option value="suggestion">Suggestions</option>
        </select> &nbsp;&nbsp;&nbsp;&nbsp;Sort
        <select
          v-model="sortBy"
          class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        > 
          <option value="date">Date</option>
          <option value="name">Name</option>
        </select>
      </div>
    </div>

    <!-- Feedback items -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="isLoading" class="p-4 text-center text-gray-500">
        Loading...
      </div>
      <div v-else-if="feedbacks.length === 0" class="p-4 text-center text-gray-500">
        No feedback found
      </div>
      <div v-else class="divide-y divide-gray-200">
        <button
          v-for="feedback in feedbacks"
          :key="feedback.id"
          @click="emit('selectFeedback', feedback)"
          class="w-full text-left px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
          :class="{ 'bg-primary-50': feedback.id === selectedId }"
        >
          <div class="flex items-start space-x-3">
            <BugAntIcon v-if="feedback.type === 'bug'" class="h-5 w-5 text-red-500 mt-0.5" />
            <LightBulbIcon v-else class="h-5 w-5 text-green-500 mt-0.5" />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ feedback.title }}</p>
              <p class="text-sm text-gray-500 truncate">{{ feedback.name }}</p>
              <p class="text-xs text-gray-400 mt-1">
                {{ new Date(feedback.createdAt).toLocaleDateString() }} - {{ formatDistanceToNow(new Date(feedback.createdAt).toLocaleString()) }}
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div class="p-4 border-t border-gray-200 bg-white">
      <div class="flex items-center justify-between">
        <button
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span class="text-sm text-gray-700">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>