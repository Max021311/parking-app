<script setup lang="ts">
  import Spinner from './../components/Spinner.vue'
  import Button from './../components/Button.vue'
  import { ipcRenderer, clipboard } from 'electron'
  import { ref, onMounted } from 'vue'
  import Card from './../components/Card.vue'
  import Message from './../components/Message.vue'
  import axios from './../common/axios'
  import { isAxiosError } from 'axios'
  import { Html5Qrcode, QrcodeSuccessCallback } from 'html5-qrcode'

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
  let placeType = ref<ParkingPlace['type']>('normal')
  let isProcessingQr = ref<boolean>(false)
  let isCanvasEnabled = ref<boolean>(false)

  const onQrSuccess: QrcodeSuccessCallback = async function (decodedText, decodedResult) {
    if (isProcessingQr.value) { return }
    isProcessingQr.value = true
    console.log({ decodedText, decodedResult })
    try {
      const id = parseInt(decodedText, 10)
      await axios.post(`/ticket/${id}/register-exit`)
    } catch (err) {
      console.error(err)
    }
    isProcessingQr.value = false
  }

  onMounted(async () => {
    const [camera] = await Html5Qrcode.getCameras()
    const scanner = new Html5Qrcode('reader')
    scanner.start(
      camera.id,
      { fps: 1 },
      onQrSuccess,
      () => {}
    )
  })

  window.addEventListener('keydown', (event: KeyboardEvent) => {
    if(event.key === 'C') {
      isCanvasEnabled.value = !isCanvasEnabled.value
    }
  })

  const printTickt = async () => {
    try {
      isPrinting.value = true
      console.log(`Request place of type: ${placeType.value}`)
      const res = await axios.post<TicketData>('/assign-parking-place', {
        type: placeType.value
      })
      const filename = await ipcRenderer.invoke('print-ticket', res.data)
      console.log(`Copying "${filename}" to clipboard`)
      clipboard.writeText(filename, 'clipboard')

      messageType.value = "success"
      message.value = "Se te asigno el lugar " + res.data.parking_place.slug
    } catch (err) {
      console.error(err)
      if (isAxiosError(err) && err.response?.status === 503) {
        messageType.value = 'error',
        message.value = 'Lo sentimos, pero no hay lugares disponibles de ese tipo en este momento.'
      } else {
        messageType.value = 'error',
        message.value = 'Hubo un error asignandote un lugar. Intentalo de nuevo, si el problema persiste contacta a soporte.'
      }
    }
    isPrinting.value = false
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
  <div class="flex justify-center">
    <div id="reader" :class="[
      'w-1/2',
      isCanvasEnabled ? 'visible' : 'invisible'
    ]" />
  </div>
</template>
