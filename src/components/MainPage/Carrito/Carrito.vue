<template>
    <div class="carrito-container">
      <!-- Botón flotante -->
      <button class="carrito-btn" @click="toggleCarrito">
        <i class="fas fa-shopping-cart"> <IBiCart /></i>
      </button>
  
      <!-- Cuadro del resumen del carrito -->
      <div class="carrito-resumen textos" v-if="mostrarCarrito">
        <h3 class="textos">Carrito de Compras</h3>
        <div class="row row-container">
            <section v-for="producto in carrito" :key="producto.id" class="col-12 producto-card">
                <div style="text-decoration:none; color: black;" class="row">
                    <div class="col-4">
                      <div class="imagen-container">
                        <div class="numero-bola">x {{ producto.cantidad }}</div>
                        <img :src="getImageUrl(producto.img)" alt="Producto" class="producto-imagen" />
                      </div>
                    </div>
                    <div class="col-8">
                      <div class="row">
                        <h5 class="col-10 titulo">{{ producto.name }}</h5>
                        <button style="border: none; width: 10%; background-color: white;" class="" @click="eliminarProducto(producto)">
                          <IBiTrash/>
                        </button>
                      </div>
                      <div style="margin-top: 20px;">
                        <p class="precios">{{ formatoMoneda(producto.value) }} x und</p>
                        <p class="precios">Total: {{ formatoMoneda(producto.total) }}</p>
                      </div>                        
                    </div>
                </div>
            </section>
        </div>
        <h1 style="margin-top: 10px;"> A pagar: {{ formatoMoneda(totalCarrito) }}</h1>
        <b-button variant="danger" class="m-3" @click="toggleCarrito">Cerrar</b-button>
        <b-button variant="danger" class="m-3" @click="enviarCompra">Enviar</b-button>
      </div>
    </div>
  </template>
  
  <script>
  import backendRouter from '../../BackendRouter/BackendRouter'
  import VueHorizontal from 'vue-horizontal';
  import axios from 'axios';
  // import { 
  //   BIconCart4,
  //   BIconTrash
  //   } from 'bootstrap-vue'
  // import IBi0Circle from '~icons/bi/0-circle'
  export default {
    data() {
      return {
        totalCarrito: 0,
        mostrarCarrito: false,
        carrito:[],
        nombre:null,
        correo:null,
        // Otros datos del carrito (por ejemplo, la lista de productos)
      };
    },
    mounted(){
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            this.carrito = JSON.parse(carritoGuardado);
        }
        const totalCarritoGuardado = localStorage.getItem('totalCarrito');
        if (totalCarritoGuardado) {
            this.totalCarrito = parseFloat(totalCarritoGuardado);
        }
    },
    setup(){
        const getImageUrl = (name) => {
            return new URL(`../../../assets/${name}`, import.meta.url).href
        }
        return {getImageUrl }
    },
    methods: {
      enviarCompra(){
        const numeroEmpresa = '3113698212';
        const items = this.carrito.map(item => {
          return `Nombre: ${item.name}\nCantidad: ${item.cantidad}\nTotal: ${item.total}\n\n`;
        }).join('');
        console.log(items)
        const mensajeFinal = `¡Hola! Me gustaria realizar esta compra:\n\n${items}Total: ${this.totalCarrito}`;
        const mensaje = encodeURIComponent(mensajeFinal);
        const enlaceWhatsApp = `https://wa.me/${numeroEmpresa}?text=${mensaje}`;
        this.carrito = []
        this.totalCarrito = 0
        localStorage.setItem('carrito', JSON.stringify(this.carrito));
        localStorage.setItem('totalCarrito', this.totalCarrito);
        window.open(enlaceWhatsApp, '_blank');
      },
      agregarAlCarritoCarrito(producto) {
        console.log('de carrito', producto)
        const index = this.carrito.findIndex(item => item.id === producto.id);
        if (index !== -1) {
          this.carrito[index].cantidad++;
          this.carrito[index].total = this.carrito[index].value * this.carrito[index].cantidad
        }
        else {
          this.carrito.push({ ...producto, cantidad: 1,  total: producto.value});
        }
        this.totalCarrito = this.totalCarrito + parseFloat(producto.value)
        localStorage.setItem('carrito', JSON.stringify(this.carrito));
        localStorage.setItem('totalCarrito', this.totalCarrito);
        this.$swal({
          title: 'Agregado al carrito con éxito',
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Ver carrito',
          cancelButtonText: 'Seguir comprando'
        }).then((result) => {
          if (result.isConfirmed) {
            if(!this.mostrarCarrito){
              this.toggleCarrito()
            }
          } else if (result.dismiss === this.$swal.DismissReason.cancel) {
            
          }
        });
        },
      toggleCarrito() {
        this.mostrarCarrito = !this.mostrarCarrito;
        // this.getProductos()
        // if (this.mostrarCarrito){
        //     this.getProductos()
        // }
      },
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
                if (plan.marca == 'Planes'){
                plan.img = require(`@/assets/planes/${plan.img}`)
                }
                else{
                plan.img = require(`@/assets/productos/${plan.img}`)
                }
                this.carrito.push({id:plan.id, img: plan.img, name:plan.titulo, value:plan.precio})
            }) 
            
        })
      },
      eliminarProducto(producto) {
        // Encuentra el índice del producto en el array carrito
        const index = this.carrito.indexOf(producto);
        console.log(index)
        if (this.carrito[index].cantidad > 1){
            this.carrito[index].cantidad--;
        }else{
            this.carrito.splice(index, 1);
        }
        this.totalCarrito = this.totalCarrito - producto.value
        localStorage.setItem('carrito', JSON.stringify(this.carrito));
        localStorage.setItem('totalCarrito', this.totalCarrito);
        },
        
      // Otros métodos para manejar la lógica del carrito
    },
    components:{
        // BIconCart4,
        // BIconTrash, 
        VueHorizontal,
    }
  };
  </script>
  
  <style scoped>
  .carrito-container {
    position: relative;
    z-index: 999;
  }
  
  .carrito-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    font-size: 20px;
    padding: 10px;
    background-color: #cc2c17;
    color: #fff;
    border: none;
    border-radius: 50%;
    cursor: pointer;
  }
  
  .carrito-resumen {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    background-color: #ffffff;
    border: 1px solid #ddd;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 999;
    /* display: none; Se mostrará cuando mostrarCarrito sea true */
  }
  
  .carrito-resumen h3 {
    margin-bottom: 10px;
  }
  .textos{
    color: black; 
    text-align: center;
  }
  .row-container {
    max-height: 250px; /* ajusta el valor según tus necesidades */
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px;
  }
  .producto-card {
  border: 1px solid #ddd; /* Borde */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra */
  margin-bottom: 10px; /* Espaciado exterior */
  padding: 10px; /* Espaciado interior */
}
.eliminar-btn {
  /* float: right; */
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

}
.imagen-container {
  position: relative;
}
.numero-bola {
  position: absolute;
  top: -10px;
  right: 0px;
  background-color: #ff0000; /* Color de fondo de la bola */
  color: #fff; /* Color del número */
  border-radius: 20%;
  padding: 5px;
}
.producto-imagen {
  width: 60px;
  height: auto;
}
.info-container {
  padding-left: 10px; /* Espaciado a la izquierda de la información */
}
.precio-info {
  color: red;
}
.titulo{
  padding: 0px;
  margin: 0px;
}
.precios{
  font-size: 12px;
  margin: 0px;
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
  
  /* Agrega estilos adicionales según tus necesidades */
  </style>