<template>
  <div
    :class="[
      'rounded-r-md p-4 border-l-4',
      classes.container
    ]"
  >
    <div class="flex">
      <div class="flex-shrink-0">
        <component
          :is="icon"
          :class="[
            'h-5 w-5',
            classes.icon
          ]"
          aria-hidden="true"
        />
      </div>
      <div class="ml-3">
        <h3
          v-if="title"
          :class="[
            'text-sm font-medium mb-2',
            classes.title
          ]"
        >
          {{ title }}
        </h3>
        <div
          :class="[
            'text-sm',
            classes.description
          ]"
        >
          <p> {{ description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, computed } from 'vue'
  import CheckCircle from './CheckCircle.vue'
  import XCircle from './XCircle.vue'

  const colors = {
    success: {
      container: `border-green-400 bg-green-50`,
      icon: `text-green-400`,
      title: `text-green-800`,
      description: `text-green-700`
    },
    error: {
      container: `border-red-400 bg-red-50`,
      icon: `text-red-400`,
      title: `text-red-800`,
      description: `text-red-700`
    }
  }
  const props = defineProps<{ title: string, description: string, type: 'success' | 'error' }>()
  const icon = computed(() => props.type === 'success' ? CheckCircle : XCircle)
  const classes = computed(() => colors[props.type])

</script>
