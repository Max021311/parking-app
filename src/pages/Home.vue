<script setup lang="ts">
  import Spinner from './../components/Spinner.vue'
  import Button from './../components/Button.vue'
  import { ipcRenderer, clipboard } from 'electron'
  import { ref, reactive } from 'vue'
  import Card from './../components/Card.vue'
  import Message from './../components/Message.vue'

  const placesDict = {
    normal: 'Normal',
    big: 'Grande',
    worker: 'Trabajador',
    special: 'Discapacitado'
  }

  let isPrinting = ref(false)
  let messageType = ref<InstanceType<typeof Message>['$props']['type']>('success')
  let showMessage = ref(false)
  let message = ref('')
  let placeType = ref<TicketData['placeType']>('normal')

  interface Form {
    placeType: string | null
  }

  const form = reactive<Form>({
    placeType: null
  })

  const printTickt = async () => {
    try {
      isPrinting.value = true
      console.log(`Request place of type: ${placeType.value}`)
      await new Promise(resolve => setTimeout(resolve, 1000))
      const ticketData = {
        date: new Date().toISOString(),
        id: 1,
        position: 'A1',
        placeType: placeType.value
      }
      const filename = await ipcRenderer.invoke('print-ticket', ticketData)
      console.log(`Copying "${filename}" to clipboard`)
      clipboard.writeText(filename, 'clipboard')

      isPrinting.value = false

      messageType.value = "success"
      message.value = "Se te asigno el lugar A1"
    } catch (err) {
      messageType.value = 'error',
      message.value = 'Hubo un error asignandote un lugar. Intentalo de nuevo, si el problema persiste contacta a soporte.'
    }
    showMessage.value = true
    setTimeout(() => {
      showMessage.value = false
    }, 5000)
  }
</script>

<template>
  <Card class="m-4 h-full">
    <div class="grid grid-cols-5 gap-3 text-black dark:text-white h-full">
      <div class="col-span-2 gap-2 flex flex-col">
        <p class="text-2xl">Seleccione el tipo de cajón</p>
        <Button
          v-for="(value, key) in placesDict"
          :name="key"
          :color="key === placeType ? 'primary' : 'secondary'"
          class="w-auto text-xl"
          @click="() => placeType = key"
        >
          {{ value }}
        </Button>
        <Button
          class="mt-4"
          type="button"
          color="primary"
          :disabled="isPrinting"
          @click="printTickt"
        >
          <div class="flex justify-center items-center py-1">
            <Spinner class="fixed" v-show="isPrinting" />
            <p>Imprimir boleto</p>
          </div>
        </Button>
      </div>
      <div class="text-xl col-span-3 text-center">
        <p>Bienvenido a Parqueen S.A. de C.V.</p>
        <p>Cuida tu boleto.</p>
        <p>Estaciónate en el lugar que el boleto indique</p>
        <p>Respete los lugares de estacionamiento</p>
        <p>Procure no generar conflictos</p>
        <p>Saludos crack</p>
      </div>
    </div>
    <Message
      v-if="showMessage"
      class="mt-4 p-2 shadow-sm rounded-md w-fit"
      :type="messageType"
      :title="messageType === 'success' ? 'Cuida bien tu boleto' : 'Error'"
      :description="message"
    />
  </Card>
</template>
