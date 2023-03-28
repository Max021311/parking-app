<script setup lang="ts">
  import Spinner from './../components/Spinner.vue'
  import { ipcRenderer } from 'electron'
  import { onUnmounted, watchEffect, ref } from 'vue'

  let isPrinting = ref(false)

  const stopWatch = watchEffect(() => console.log({ isPrinting: isPrinting.value }))

  const submit = async () => {
    isPrinting.value = true
    const ticketDate = { date: new Date().toString(), id: 1, position: 'A1' }
    await ipcRenderer.invoke('print-ticket', ticketDate)
      .then(filename => console.log({ filename }))
    isPrinting.value = false
  }
 
  onUnmounted(() => {
    stopWatch()
  })

</script>

<template>
  <div>
    <div>

    </div>
    <button
      :disabled="isPrinting"
      class="rounded bg-blue-600 text-gray-200 px-1 py-0.5 disabled:opacity-50 flex justify-center min-w-fit"
      @click="submit"
    >
    <div v-show="isPrinting" class="flex justify-center">
      <Spinner />
    </div>
    <p v-show="!isPrinting">Imprimir ticket</p>
    </button>
  </div>
</template>
