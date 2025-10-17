<template>
  <div>
    <!-- Se mantiene el menú y el carrito en la parte superior -->
    <MenuLanding />
    <Carrito ref="carrito" />

    <!-- Carrusel Principal (Hero Section) -->
    <BCarousel controls>
      <BCarouselSlide :img-src="getImageUrl('slide1.png')" />
      <BCarouselSlide :img-src="getImageUrl('slide2.png')" />
    </BCarousel>

    <!-- NUEVA SECCIÓN: Botones de Acción Principales (Calls to Action) -->
    <div class="cta-section text-center py-4 bg-light">
      <div class="container">
        <h3 class="mb-3">Bienvenido a Nuestra Plataforma</h3>
        <BButton to="/login" variant="primary" size="lg" class="mx-2">
          <i class="bi bi-box-arrow-in-right me-2"></i> Iniciar Sesión
        </BButton>
        <BButton to="/consulta-pdv" variant="outline-secondary" size="lg" class="mx-2">
          <i class="bi bi-graph-up me-2"></i> Consultas TAT
        </BButton>
      </div>
    </div>

    <!-- Sección de Planes -->
    <section id="planes" class="py-5">
      <div class="container">
        <h2 class="text-center mb-4 section-title">Nuestros Planes</h2>
        <VueHorizontal responsive>
          <div v-for="plan in planes" :key="plan.id" class="plan-card m-3">
            <a href="#" class="text-decoration-none text-dark">
              <img :src="getImageUrl(plan.img)" class="img-fluid plan-image" alt="Imagen del Plan"/>
            </a>
          </div>
        </VueHorizontal>
        <div class="text-center mt-4">
            <BButton to="/tienda" size="lg" variant="danger">Adquiere tu plan pospago ahora</BButton>
        </div>
      </div>
    </section>

    <!-- Carrusel Intermedio -->
    <div class="py-5">
        <BCarousel controls>
            <BCarouselSlide :img-src="getImageUrl('slide3.png')" />
            <BCarouselSlide :img-src="getImageUrl('slide4.jpg')" />
            <BCarouselSlide :img-src="getImageUrl('slide5.jpg')" />
        </BCarousel>
    </div>

    <!-- Sección de Productos Destacados -->
    <section id="productos" class="py-5 bg-light">
      <div class="container">
        <h2 class="text-center mb-4 section-title">Productos Destacados</h2>
        <VueHorizontal responsive>
          <div v-for="producto in productos" :key="producto.id" class="product-card m-3">
            <img :src="getImageUrl(producto.img)" class="product-image" alt="Imagen del Producto"/>
            <div class="product-info p-3">
              <h5 class="product-name">{{ producto.name }}</h5>
              <p class="product-price">{{ formatoMoneda(producto.value) }} IVA incluido</p>
              <BButton variant="danger" class="w-100" @click="agregarAlCarrito(producto)">
                Agregar al carrito
              </BButton>
            </div>
          </div>
        </VueHorizontal>
      </div>
    </section>

    <!-- Sección de Aliados Estratégicos (Portafolio) -->
    <section id="portafolio" class="py-5">
      <div class="container">
        <h2 class="text-center mb-5 section-title">Nuestros Aliados Estratégicos</h2>
        <div class="row align-items-center justify-content-center">
            <div v-for="portafolio in portafolios" :key="portafolio.id" class="col-6 col-md-4 col-lg-3 text-center mb-4">
                <img
                    :src="getImageUrl(portafolio.img)"
                    class="ally-logo"
                    :class="{'zoomed': portafolio.var}"
                    @mouseover="zoomIn(portafolio.id)"
                    @mouseout="zoomOut(portafolio.id)"
                    alt="Logo de aliado"
                />
            </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
import VueHorizontal from 'vue-horizontal';
import MenuLanding from '../MenuLanding/MenuLanding.vue'
import Carrito from '@/components/MainPage/Carrito/Carrito.vue'
import backendRouter from '@/components/BackendRouter/BackendRouter';
import axios from 'axios';

export default {
  data() {
    return {
      portafolios: [
        { id: 1, img: 'portafolio1.jpg', var: false },
        { id: 2, img: 'portafolio2.jpg', var: false },
        { id: 3, img: 'portafolio3.jpg', var: false },
      ],
      planes: [],
      productos: [],
    }
  },
  components: {
    VueHorizontal,
    MenuLanding,
    Carrito,
  },
  setup() {
    const getImageUrl = (name) => {
      // Maneja posibles errores si el nombre es nulo o indefinido
      if (!name) return '';
      try {
        return new URL(`../../../assets/${name}`, import.meta.url).href
      } catch (error) {
        console.error(`No se pudo cargar la imagen: ${name}`, error);
        // Retorna una imagen placeholder en caso de error
        return 'https://placehold.co/400x400?text=Imagen+no+encontrada';
      }
    }
    return { getImageUrl }
  },
  methods: {
    formatoMoneda(valor) {
      return parseFloat(valor).toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
    },
    zoomIn(num) {
      const item = this.portafolios.find(p => p.id === num);
      if (item) item.var = true;
    },
    zoomOut(num) {
      const item = this.portafolios.find(p => p.id === num);
      if (item) item.var = false;
    },
    async getPlanes() {
      try {
        const path = backendRouter.data + 'planes';
        const response = await axios.get(path);
        this.planes = response.data.data.map(plan => ({
          id: plan.id,
          img: plan.img
        }));
      } catch (error) {
        console.error("Error al obtener los planes:", error);
      }
    },
    async getProductos() {
      try {
        const path = backendRouter.data + 'productos';
        const response = await axios.get(path);
        this.productos = response.data.data.map(producto => ({
          id: producto.id,
          img: producto.img,
          name: producto.titulo,
          value: producto.precio
        }));
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    },
    agregarAlCarrito(producto) {
      if (this.$refs.carrito) {
        this.$refs.carrito.agregarAlCarritoCarrito(producto);
      }
    },
  },
  created() {
    this.getPlanes();
    this.getProductos();
  },
}
</script>

<style scoped>
/* Estilos Generales y de Sección */
.section-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 2.5rem !important;
  position: relative;
  display: inline-block;
  padding-bottom: 10px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background-color: #dc3545; /* Rojo de Bootstrap */
  border-radius: 2px;
}

.cta-section {
  border-bottom: 1px solid #e0e0e0;
}

/* Estilos para Tarjetas de Planes */
.plan-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
}
.plan-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
.plan-image {
  width: 250px;
  height: 250px;
  object-fit: cover;
}


/* Estilos para Tarjetas de Productos */
.product-card {
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 280px;
  text-align: left;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.product-image {
  width: 100%;
  height: 280px;
  object-fit: cover;
}

.product-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #212529;
  min-height: 44px; /* Asegura altura consistente */
}

.product-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #dc3545;
  margin-bottom: 1rem;
  margin-top: auto; /* Empuja el precio hacia abajo */
}


/* Estilos para Aliados (Portafolio) */
.ally-logo {
    width: 150px;
    height: auto;
    object-fit: contain;
    filter: grayscale(100%);
    opacity: 0.7;
    transition: all 0.3s ease;
}

.ally-logo:hover, .ally-logo.zoomed {
    filter: grayscale(0%);
    opacity: 1;
    transform: scale(1.1);
}

</style>
