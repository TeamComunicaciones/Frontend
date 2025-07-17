<template>
  <div class="container py-5">
    <!-- Loader -->
    <div class="vld-parent">
      <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage" />
    </div>

    <!-- Tarjeta para subir imagen -->
    <div class="card shadow-sm p-4 mt-4 upload-card">
      <h3 class="mb-3 titulo">Actualizar Imagen del Login</h3>
      <input type="file" class="form-control mb-4" @change="uploadImage" />

      <div v-if="previewUrl" class="text-center">
        <p class="texto mb-2">Vista previa:</p>
        <img :src="previewUrl" alt="Vista previa" class="img-preview rounded shadow-sm" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import backendRouter from '@/components/BackendRouter/BackendRouter'

export default {
  data() {
    return {
      previewUrl: null,
    };
  },
  methods: {
    async uploadImage(event) {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "login_image");

      try {
        const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/dqfchbn0v/image/upload", {
          method: "POST",
          body: formData
        });

        const data = await cloudinaryRes.json();
        this.previewUrl = data.secure_url;

        const backendPath = backendRouter.data + "api/imagen-login/actualizar/";
        await axios.post(backendPath, { url: this.previewUrl });

        Swal.fire({
          icon: "success",
          title: "Imagen actualizada correctamente",
          showConfirmButton: false,
          timer: 2000,
        });

      } catch (error) {
        console.error("Error al subir imagen:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar la imagen. Intenta nuevamente.",
        });
      }
    }
  }
};
</script>

<style scoped>
.upload-card {
  background-color: #fff;
  border-radius: 1rem;
  font-family: 'Open Sans', sans-serif;
}

.titulo {
  font-family: 'Comfortaa', cursive;
  font-weight: bold;
  color: #000;
}

.texto {
  font-size: 1rem;
  color: #333;
}

.img-preview {
  max-width: 100%;
  max-height: 400px;
  border: 3px solid #DF1115;
  padding: 4px;
  background-color: #fff;
}
</style>
