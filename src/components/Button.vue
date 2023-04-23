<template>
  <button
    :class="[
      'border rounded-md px-5 disabled:opacity-50 w-fit',
      classes
    ]"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  color: 'primary' | 'secondary',
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary'
})

const classesDictionary = {
  primary: 'bg-emerald-500 text-black dark:text-white border-emerald-300',
  secondary: 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white border-gray-500 dark:border-gray-600 '
}

const classes = computed(() => classesDictionary[props.color])
</script>
