<template>
  <div class="container py-4">
    <h1 class="display-6 fw-bold mb-4" style="font-family: 'Comfortaa', sans-serif;">
      Listado de Actas
    </h1>

    <button @click="nuevaActa" class="btn btn-primary mb-4">
      Nueva Acta
    </button>

    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th class="text-center">ID</th>
          <th class="text-center">Proyecto</th>
          <th class="text-center">Fecha Entrega</th>
          <th class="text-center">Estado</th>
          <th class="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="acta in actas" :key="acta.id">
          <td class="text-center">{{ acta.id }}</td>
          <td class="text-center">{{ acta.proyecto }}</td>
          <td class="text-center">{{ acta.fecha_entrega }}</td>
          <td class="text-center">{{ acta.estado }}</td>
          <td class="text-center">
            <button @click="editarActa(acta.id)" class="btn btn-warning btn-sm mr-2">
              Editar
            </button>
            <button @click="eliminarActa(acta.id)" class="btn btn-danger btn-sm">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import actaService from '@/services/actaService';
import { useRouter } from 'vue-router';

const actas = ref([]);
const router = useRouter();

const cargarActas = async () => {
  const response = await actaService.getActas();
  actas.value = response.data;
};

const nuevaActa = () => {
  router.push('/actas/nueva');
};

const editarActa = (id) => {
  router.push(`/actas/${id}/editar`);
};

const eliminarActa = async (id) => {
  if (confirm('¿Seguro que quieres eliminar esta acta?')) {
    await actaService.deleteActa(id);
    cargarActas();
  }
};

onMounted(cargarActas);
</script>
<style lang="scss" scoped>
@use './style.scss' as *;
</style>
