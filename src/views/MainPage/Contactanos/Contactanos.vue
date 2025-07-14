<template>
  <div>
    <Carrito/>
    <MenuLanding/>
    <h1 class="textos">Contáctanos</h1>
    <p class="textos">Registra tus solicitudes, felicitaciones, sugerencias y quejas. Con gusto las atenderemos.</p>
    <div class="row p-5">
      <div class="textos2 col-6">
        <form @submit.prevent="enviarFormulario">
          <div>
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" v-model="nombre" required  class="input-gris"/>
          </div>
    
          <div>
            <label for="correo">Correo:</label>
            <input type="email" id="correo" v-model="correo" required class="input-gris"/>
          </div>
    
          <div>
            <label for="asunto">Asunto:</label>
            <input type="text" id="asunto" v-model="asunto" class="input-gris"/>
          </div>
    
          <div>
            <label for="mensaje">Mensaje:</label>
            <textarea id="mensaje" v-model="mensaje" rows="4" class="input-gris"></textarea>
          </div>
    
          <div>
            <b-button type="submit" class="m-4" variant="danger">Enviar</b-button>
          </div>
        </form>
      </div>
      <img class="col-6" :src="getImageUrl(imgContactanos)" alt="">
    </div>
  </div>
</template>

<script>
  import MenuLanding from '@/components/MainPage/MenuLanding/MenuLanding.vue'
  import Carrito from '@/components/MainPage/Carrito/Carrito.vue'
  import backendRouter from '@/components/BackendRouter/BackendRouter';
  import axios from 'axios';
  export default{
    components:{  
      MenuLanding,
      Carrito,
    },
    data() {
      return {
        nombre: '',
        correo: '',
        asunto: '',
        mensaje: '',
        imgContactanos: 'img1.jpg',
      };
    },
    setup(){
        const getImageUrl = (name) => {
            var nombreUrl = 'logo.png'
            return new URL(`../../../assets/${name}`, import.meta.url).href
        }
        return {getImageUrl }
    },
    methods: {
    enviarFormulario() {
      // Aquí puedes manejar la lógica para enviar el formulario
      console.log('Formulario enviado con éxito');
      const data = {
        nombre: this.nombre,
        correo: this.correo,
        asunto: this.asunto,
        mensaje: this.mensaje,
      }
      const path = backendRouter.data + 'contactanos'
      axios.post(path, data).then((response)=>{
        this.nombre = ''
        this.correo = ''
        this.asunto = ''
        this.mensaje = ''
        this.$swal({
            title: 'Mensaje enviado con exito',
            icon: 'success',
        })
      })
      
    }
  }
  }
</script>

<style scoped>

.textos{
    color: black; 
    text-align: center;
  }
.textos2{
    color: gray; 
    text-align: start;
  }
.input-gris {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc; /* Añade un borde gris */
}

</style>