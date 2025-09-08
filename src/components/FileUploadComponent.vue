<template>
  <div class="modal-backdrop-custom">
    <div class="modal-custom product-card" @click.stop>
      <div class="card-header">
        <h5 class="card-title">Cargar Nuevo Reporte de Ventas</h5>
        <button type="button" class="btn-close" @click="$emit('close')" aria-label="Close"></button>
      </div>

      <div class="card-body">
        <div v-if="message" :class="`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`">
          {{ message }}
        </div>

        <div class="mb-3">
          <label for="fileInput" class="form-label">Selecciona el archivo Excel (.xlsx, .xls)</label>
          <input 
            class="form-control" 
            type="file" 
            id="fileInput" 
            @change="handleFileChange"
            accept=".xlsx, .xls"
            ref="fileInputRef"
          >
        </div>
      </div>

      <div class="card-footer">
        <button type="button" class="btn btn-secondary" @click="$emit('close')" :disabled="loading">
          Cancelar
        </button>
        <button type="button" class="btn btn-danger" @click="uploadFile" :disabled="!selectedFile || loading">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          {{ loading ? 'Cargando...' : 'Subir Archivo' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

// Definimos los eventos que este componente puede emitir hacia el padre
const emit = defineEmits(['close', 'upload-success']);

const selectedFile = ref(null);
const loading = ref(false);
const message = ref('');
const messageType = ref('danger'); // 'success' or 'danger'
const fileInputRef = ref(null); // Referencia al input del archivo

const API_UPLOAD_URL = 'http://127.0.0.1:8000/api/v1.0/sales-report/upload/'; // URL del backend

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
  message.value = ''; // Limpiar mensajes al seleccionar un nuevo archivo
};

const uploadFile = async () => {
  if (!selectedFile.value) {
    message.value = 'Por favor, selecciona un archivo primero.';
    messageType.value = 'danger';
    return;
  }

  loading.value = true;
  message.value = '';

  const formData = new FormData();
  formData.append('report_file', selectedFile.value);

  try {
    const response = await axios.post(API_UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // Si usas autenticación por token, deberías añadir el header aquí:
        // 'Authorization': `Bearer ${tu_token_jwt}`
      }
    });

    message.value = `${response.data.detail} (Nuevos: ${response.data.nuevos_registros}, Omitidos: ${response.data.registros_omitidos_por_duplicado})`;
    messageType.value = 'success';
    
    // Resetear el input
    if (fileInputRef.value) {
        fileInputRef.value.value = '';
    }
    selectedFile.value = null;

    // Emitir evento de éxito para que el padre pueda recargar los datos
    setTimeout(() => {
      emit('upload-success');
    }, 1500); // Esperar un poco para que el usuario lea el mensaje

  } catch (error) {
    // Extraer el mensaje de error específico del backend si está disponible
    message.value = error.response?.data?.detail || 'Ocurrió un error al subir el archivo.';
    messageType.value = 'danger';
    console.error('Error en la carga:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-custom {
  width: 100%;
  max-width: 500px;
  // product-card ya viene con los estilos de borde, sombra, etc.
}

// Para que el card-footer tenga los colores correctos
.card-footer {
  background-color: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
}

.btn-danger {
  background-color: #DF1115;
  border-color: #DF1115;
}
</style>