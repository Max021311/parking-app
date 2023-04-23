<script setup lang="ts">
  import Button from './components/Button.vue'
</script>

<template>
  <div class='h-full w-full'>
    <header class="grid grid-cols-3 p-3 gap-2 shadow-md shadow-gray-700 justify-center">
      <div class="col-span-1"></div>
      <div class="col-span-1 flex justify-center items-center">
        <img class="rounded-full w-24" src="./assets/parqueen-log.png" />
        <p class="text-black dark:text-white text-xl">Parqueen</p>
      </div>
      <!-- <div class="flex justify-end items-center"> -->
      <!--   <Button color="primary" class="h-fit text-xl">Administración</Button> -->
      <!-- </div> -->
    </header>
    <router-view></router-view>
  </div>
</template>
