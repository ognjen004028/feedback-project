<script setup lang="ts">
import { BugAntIcon, LightBulbIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import type { Feedback } from '../types/feedback';
import { formatDistanceToNow } from 'date-fns';

const props = defineProps<{
  feedback: Feedback;
}>();

const emit = defineEmits<{
  'close': []
}>();
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="border-b border-gray-200 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <h2 class="text-lg font-medium text-gray-900">Feedback details</h2>
        </div>
        <button
          @click="emit('close')"
          class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>
    </div>

    <div class="flex-1 p-6 overflow-y-auto">
      <div class="space-y-6">
          <div>
            <div class="flex items-center space-x-3">
            <BugAntIcon v-if="feedback.type === 'bug'" class="h-6 w-6 text-red-500" />
            <LightBulbIcon v-else class="h-6 w-6 text-green-500" />
            <h2 class="text-lg font-medium text-gray-900">{{ feedback.title }}</h2>
          </div>
          <h3 class="text-sm font-medium text-gray-500">{{ feedback.name }} ({{ feedback.email }})</h3>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Type</h3>
          <p class="mt-1">
            <span
              :class="{
                'inline-flex rounded-full px-2 text-xs font-semibold leading-5': true,
                'bg-red-100 text-red-800': feedback.type === 'bug',
                'bg-green-100 text-green-800': feedback.type === 'suggestion'
              }"
            >
              {{ feedback.type }}
            </span>
          </p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Date</h3>
          <p class="mt-1 text-sm text-gray-900">
            {{ new Date(feedback.createdAt).toLocaleString() }} - {{ formatDistanceToNow(new Date(feedback.createdAt).toLocaleString()) }}
          </p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Message</h3>
          <p class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{{ feedback.message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>