<template>
  <div class="textos">
    <Carrito ref="carrito"/>
    <MenuLanding/>
    <div class="row">
      <section v-for="producto in productos" :key="producto.id" class="col-4">
          <a href="#" style="text-decoration:none; color: black;">
              <img
              :src="getImageUrl(producto.img)" 
              style="width: auto; height: 200px;"/>
              <h5>{{ producto.name }}</h5>
              <p style="color: red;">{{ formatoMoneda(producto.value) }} iva incluido</p>
          </a>
          <b-button class="m-4" variant="danger" @click="agregarAlCarrito(producto)">Agregar al carrito</b-button>
      </section>
    </div>
    
  

  </div>
</template>

<script>
  import MenuLanding from '../MenuLanding/MenuLanding.vue'
  import VueHorizontal from 'vue-horizontal';
  import backendRouter from '@/components/BackendRouter/BackendRouter'
  import Carrito from '@/components/MainPage/Carrito/Carrito.vue'
  import axios from 'axios';
  export default{
    data(){
      return{
        productos:[],
      }
    },
    components:{  
      MenuLanding,
      Carrito,
      VueHorizontal,
    },
    setup(){
        const getImageUrl = (name) => {
            var nombreUrl = 'logo.png'
            return new URL(`../../../assets/${name}`, import.meta.url).href
        }
        return {getImageUrl }
    },
    methods:{
      formatoMoneda(valor) {
          const resultado = parseFloat(valor).toLocaleString('es-CO', {
              style: 'currency',
              currency: 'COP',
          })
          return resultado
      },
      getProductos(){
          const path = backendRouter.data+'tienda'
          axios.get(path).then((response)=>{
              
              response.data.data.map(plan =>{
                  
                  // if (plan.marca == 'Planes'){
                  //   plan.img = require(`@/assets/planes/${plan.img}`)
                  // }
                  // else{
                  //   plan.img = require(`@/assets/productos/${plan.img}`)
                  // }
                  this.productos.push({id:plan.id, img: plan.img, name:plan.titulo, value:plan.precio})
                  
              }) 
          })
      },
      agregarAlCarrito: function(producto) {
        this.$refs.carrito.agregarAlCarritoCarrito(producto)
      },
    },
    created(){
        this.getProductos()
    }, 
  }
</script>

<style scoped>
.textos{
    color: black; 
    text-align: center;
  }

</style>