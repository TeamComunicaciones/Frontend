<script setup>
import { RouterView } from 'vue-router'
import SidebarMenu from '@/components/Intranet/SidebarMenu/SidebarMenu.vue'; // Asegúrate que la ruta sea correcta
import { authState } from '@/auth';
</script>

<template>
  <div id="app-wrapper">
    <SidebarMenu v-if="authState.isLoggedIn">
      <RouterView />
    </SidebarMenu>
    <div v-else>
      <RouterView />
    </div>
  </div>
</template>

<style>
/* Estilos globales básicos para la aplicación */
body {
  margin: 0;
  font-family: 'Comfortaa', sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: #f4f7fa; /* Un fondo neutro para el contenido principal */
  color: #212529;
}

#app-wrapper {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>