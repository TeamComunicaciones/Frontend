<template>
  <div class="page">
    <Carrito ref="carrito" />
    <MenuLanding />

    <!-- HERO simple (sin overlays raros) -->
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-left">
          <p class="hero-kicker">
            <span class="dot" aria-hidden="true"></span>
            Tienda
          </p>
          <h1 class="hero-title">Productos disponibles</h1>
          <p class="hero-subtitle">
            Busca, ordena y agrega al carrito en un clic.
          </p>
        </div>

        <div class="hero-right">
          <div class="stat">
            <p class="stat-label">Resultados</p>
            <p class="stat-value">{{ filteredProductos.length }}</p>
          </div>
          <div class="stat">
            <p class="stat-label">Estado</p>
            <p class="stat-value" :class="loading ? 'text-warn' : 'text-ok'">
              {{ loading ? 'Cargando' : 'Listo' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTROLS -->
    <section class="section">
      <div class="container">
        <div class="toolbar">
          <div class="control">
            <label class="label">Buscar</label>
            <input
              v-model.trim="q"
              type="search"
              class="form-control input"
              placeholder="Ej: Módem, SIM, Plan..."
            />
          </div>

          <div class="control">
            <label class="label">Ordenar</label>
            <select v-model="sort" class="form-select input">
              <option value="featured">Destacados</option>
              <option value="priceAsc">Precio: menor a mayor</option>
              <option value="priceDesc">Precio: mayor a menor</option>
              <option value="nameAsc">Nombre: A → Z</option>
            </select>
          </div>

          <div class="control">
            <label class="label">Acciones</label>
            <button class="btn btn-outline-secondary w-100 btn-soft" type="button" @click="resetFilters">
              Limpiar filtros
            </button>
          </div>
        </div>

        <!-- STATES -->
        <div v-if="loading" class="grid">
          <div v-for="n in 8" :key="n" class="skeleton" aria-hidden="true"></div>
        </div>

        <div v-else-if="error" class="state state-error">
          <div class="state-left">
            <i class="bi bi-exclamation-triangle"></i>
            <div>
              <p class="state-title">No pudimos cargar los productos</p>
              <p class="state-text">{{ error }}</p>
            </div>
          </div>
          <button class="btn btn-outline-danger" @click="getProductos">
            Reintentar
          </button>
        </div>

        <div v-else-if="filteredProductos.length === 0" class="state">
          <div class="state-left">
            <i class="bi bi-search"></i>
            <div>
              <p class="state-title">Sin resultados</p>
              <p class="state-text">Prueba con otra búsqueda o cambia el orden.</p>
            </div>
          </div>
        </div>

        <!-- GRID -->
        <div v-else class="grid">
          <article
            v-for="producto in filteredProductos"
            :key="producto.id"
            class="card"
          >
            <a href="#" class="card-media" @click.prevent>
              <img
                class="card-img"
                :src="getImageUrl(producto.img)"
                :alt="producto.name"
                loading="lazy"
              />
              <span class="chip">IVA incluido</span>
            </a>

            <div class="card-body">
              <h3 class="card-title" :title="producto.name">{{ producto.name }}</h3>

              <p class="card-price">
                {{ formatoMoneda(producto.value) }}
              </p>

              <div class="card-actions">
                <button
                  class="btn btn-danger w-100 btn-cta"
                  type="button"
                  @click="agregarAlCarrito(producto)"
                >
                  <i class="bi bi-cart-plus me-2"></i>
                  Agregar al carrito
                </button>
              </div>
            </div>
          </article>
        </div>

      </div>
    </section>

    <FooterLanding />
  </div>
</template>

<script>
import MenuLanding from '@/components/MainPage/MenuLanding/MenuLanding.vue'
import Carrito from '@/components/MainPage/Carrito/Carrito.vue'
import FooterLanding from '@/components/Landing/FooterLanding/FooterLanding.vue'
import backendRouter from '@/components/BackendRouter/BackendRouter'
import axios from 'axios'

export default {
  name: 'TiendaPro',
  components: {
    MenuLanding,
    Carrito,
    FooterLanding,
  },
  data() {
    return {
      productos: [],
      loading: false,
      error: '',
      q: '',
      sort: 'featured',
    }
  },
  computed: {
    filteredProductos() {
      const q = (this.q || '').toLowerCase().trim()
      let list = [...this.productos]

      if (q) {
        list = list.filter((p) => String(p.name || '').toLowerCase().includes(q))
      }

      if (this.sort === 'priceAsc') {
        list.sort((a, b) => Number(a.value || 0) - Number(b.value || 0))
      } else if (this.sort === 'priceDesc') {
        list.sort((a, b) => Number(b.value || 0) - Number(a.value || 0))
      } else if (this.sort === 'nameAsc') {
        list.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'es'))
      } else {
        // featured: si quieres, puedes dejar tal cual o limitar
        // list = list.slice(0, 24)
      }

      return list
    },
  },
  created() {
    this.getProductos()
  },
  methods: {
    resetFilters() {
      this.q = ''
      this.sort = 'featured'
    },
    getImageUrl(name) {
      if (!name) return 'https://placehold.co/600x600?text=Imagen'
      try {
        return new URL(`../../../assets/${name}`, import.meta.url).href
      } catch (e) {
        return 'https://placehold.co/600x600?text=Imagen'
      }
    },
    formatoMoneda(valor) {
      const n = Number(valor)
      if (!Number.isFinite(n)) return '$ 0'
      return n.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    },
    async getProductos() {
      this.loading = true
      this.error = ''
      try {
        const path = backendRouter.data + 'tienda'
        const response = await axios.get(path)

        const rows = response?.data?.data || []
        this.productos = rows.map((item) => ({
          id: item.id,
          img: item.img,
          name: item.titulo,
          value: item.precio,
        }))
      } catch (err) {
        console.error('Error getProductos:', err)
        this.error = 'Intenta nuevamente. Si persiste, revisa el endpoint / permisos.'
      } finally {
        this.loading = false
      }
    },
    agregarAlCarrito(producto) {
      this.$refs.carrito?.agregarAlCarritoCarrito?.(producto)
    },
  },
}
</script>

<style scoped>
/* Base */
.page{
  --brand: #E11419;
  --muted: #f7f7f9;
  --text: #0f172a;
  --subtext: #64748b;
  --border: rgba(2, 6, 23, 0.10);
  --shadow: 0 18px 40px rgba(2, 6, 23, 0.12);
  --shadow-soft: 0 12px 26px rgba(2, 6, 23, 0.08);
  --radius: 18px;

  background: #fff;
  color: var(--text);
}

/* HERO */
.hero{
  border-bottom: 1px solid var(--border);
  background:
    radial-gradient(900px 260px at 30% 0%, rgba(225,20,25,0.14), transparent 55%),
    radial-gradient(800px 240px at 90% 40%, rgba(15,23,42,0.05), transparent 55%),
    #ffffff;
  padding: 2.2rem 0 1.4rem 0;
}

.hero-inner{
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.hero-kicker{
  margin: 0 0 10px 0;
  color: var(--subtext);
  font-weight: 900;
  letter-spacing: .08em;
  text-transform: uppercase;
  font-size: 12px;
  display:flex;
  align-items:center;
  gap: 10px;
}
.dot{
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--brand);
  box-shadow: 0 0 0 6px rgba(225,20,25,0.12);
}
.hero-title{
  margin: 0;
  font-weight: 950;
  letter-spacing: -0.03em;
  font-size: clamp(26px, 3vw, 42px);
  line-height: 1.1;
}
.hero-subtitle{
  margin: 10px 0 0 0;
  color: var(--subtext);
  font-weight: 650;
  line-height: 1.7;
  max-width: 720px;
}

.hero-right{
  display:flex;
  gap: 10px;
  flex-wrap: wrap;
}
.stat{
  min-width: 130px;
  background: rgba(255,255,255,0.92);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 10px 12px;
  box-shadow: var(--shadow-soft);
}
.stat-label{
  margin: 0;
  color: var(--subtext);
  font-weight: 800;
  font-size: 12px;
}
.stat-value{
  margin: 2px 0 0 0;
  font-weight: 950;
  font-size: 14px;
}
.text-ok{ color: #15803d; }
.text-warn{ color: #b45309; }

/* Section */
.section{ padding: 1.6rem 0 3.2rem 0; }

/* Toolbar */
.toolbar{
  display:grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 14px;
}
@media (max-width: 992px){
  .toolbar{ grid-template-columns: 1fr; }
}

.label{
  font-size: 12px;
  font-weight: 900;
  color: var(--subtext);
  letter-spacing: .04em;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.input{
  border-radius: 14px;
  border-color: rgba(2,6,23,0.14);
  font-weight: 650;
}
.input:focus{
  border-color: rgba(225,20,25,0.40);
  box-shadow: 0 0 0 0.2rem rgba(225,20,25,0.12);
}

.btn-soft{
  border-radius: 14px;
  font-weight: 800;
}

/* States */
.state{
  border: 1px dashed var(--border);
  border-radius: 18px;
  padding: 18px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 14px;
  background: #fff;
}
.state-left{
  display:flex;
  gap: 12px;
  align-items:flex-start;
}
.state-left i{
  font-size: 18px;
  color: var(--brand);
  margin-top: 2px;
}
.state-title{
  margin: 0;
  font-weight: 950;
}
.state-text{
  margin: 4px 0 0 0;
  color: var(--subtext);
  font-weight: 650;
}
.state-error{
  border-style: solid;
  background: rgba(225,20,25,0.06);
}

/* Grid */
.grid{
  display:grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}
@media (max-width: 1200px){ .grid{ grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 992px){ .grid{ grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 576px){ .grid{ grid-template-columns: 1fr; } }

/* Card */
.card{
  border: 1px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  box-shadow: var(--shadow-soft);
  transition: transform .2s ease, box-shadow .2s ease;
  display:flex;
  flex-direction: column;
}
.card:hover{
  transform: translateY(-6px);
  box-shadow: var(--shadow);
}

.card-media{
  position: relative;
  display:block;
  text-decoration:none;
  color: inherit;
}
.card-img{
  width:100%;
  height: 240px;
  object-fit: cover;
  display:block;
}
.chip{
  position:absolute;
  left: 12px;
  top: 12px;
  background: rgba(255,255,255,0.92);
  border: 1px solid rgba(2,6,23,0.10);
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 12px;
  color: var(--text);
}

.card-body{
  padding: 14px;
  display:flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.card-title{
  margin: 0;
  font-weight: 950;
  line-height: 1.2;
  min-height: 2.4em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-price{
  margin: 0;
  font-weight: 950;
  font-size: 1.12rem;
  color: var(--brand);
}

.card-actions{
  margin-top: auto;
}

.btn-cta{
  border-radius: 14px;
  font-weight: 900;
  padding: 10px 12px;
}

/* Skeleton */
.skeleton{
  height: 360px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 37%, #f1f5f9 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
}
@keyframes shimmer{
  0%{ background-position: 100% 0; }
  100%{ background-position: 0 0; }
}
</style>
