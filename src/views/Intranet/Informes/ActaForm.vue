<template>
  <div class="container py-4">
    <h1 class="display-6 fw-bold mb-4" style="font-family: 'Comfortaa', sans-serif;">
      {{ isEdit ? 'Editar' : 'Crear' }} Acta
    </h1>

    <form @submit.prevent="guardar" class="bg-white p-4 shadow rounded" style="font-family: 'Open Sans', sans-serif;">
      
      <div class="mb-3">
        <label for="proyecto" class="form-label">Proyecto</label>
        <input v-model="acta.proyecto" id="proyecto" type="text" class="form-control" required aria-label="Nombre del proyecto" />
      </div>

      <div class="mb-3">
        <label for="fecha_entrega" class="form-label">Fecha de Entrega</label>
        <input v-model="acta.fecha_entrega" id="fecha_entrega" type="date" class="form-control" required aria-label="Fecha de entrega" />
      </div>

      <div class="mb-3">
        <label for="version_software" class="form-label">Versión del Software</label>
        <input v-model="acta.version_software" id="version_software" type="text" class="form-control" required aria-label="Versión del software" />
      </div>

      <div class="mb-3">
        <label for="responsable" class="form-label">Responsable</label>
        <input v-model="acta.responsable" id="responsable" type="text" class="form-control" required aria-label="Responsable" />
      </div>

      <div class="mb-4">
        <label for="estado" class="form-label">Estado</label>
        <select v-model="acta.estado" id="estado" class="form-select" aria-label="Estado del acta">
          <option value="Pendiente">Pendiente</option>
          <option value="Aprobado">Aprobado</option>
          <option value="Rechazado">Rechazado</option>
        </select>
      </div>

      <button type="submit" class="btn btn-danger px-4" style="background-color: #DF1115; border-color: #DF1115;">
        Guardar
      </button>
    </form>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import backendRoute from '@/components/BackendRouter/BackendRouter'; // Importamos el archivo backendRouter.js
import { useCookies } from 'vue3-cookies'; // Para acceder a las cookies

const { cookies } = useCookies(); // Inicializa el uso de cookies
const acta = ref({
  proyecto: '',
  fecha_entrega: '',
  version_software: '',
  responsable: '',
  estado: 'Pendiente'
});

const route = useRoute();
const router = useRouter();
const isEdit = ref(false);

onMounted(async () => {
  if (route.params.id) {
    isEdit.value = true;
    const response = await getActa(route.params.id);
    acta.value = response.data;
  }
});

// Función para obtener una acta por su ID
const getActa = async (id) => {
  const token = cookies.get('jwt'); // Obtén el token de las cookies
  const response = await axios.get(`${backendRoute.data}actas-entrega/${id}/`, {
    headers: { Authorization: `Token ${token}` }
  });
  return response;
};

// Función para guardar una nueva acta o actualizar una existente
const guardar = async () => {
  try {
    const token = cookies.get('jwt'); // Obtén el token de las cookies
    if (isEdit.value) {
      // Si estamos editando, hacemos PUT
      await axios.put(`${backendRoute.data}actas-entrega/${route.params.id}/`, acta.value, {
        headers: { Authorization: `Token ${token}` }
      });
    } else {
      // Si estamos creando, hacemos POST
      await axios.post(`${backendRoute.data}actas-entrega/`, acta.value, {
        headers: { Authorization: `Token ${token}` }
      });
    }
    router.push('/actas'); // Redirigir después de guardar
  } catch (error) {
    console.error("Error al guardar el acta: ", error);
    alert("Hubo un error al guardar el acta");
  }
};
</script>
<style lang="scss" scoped>
@use './style.scss' as *;
</style>
