<template>
  <div class="page">
    <MenuLanding />
    <Carrito ref="carrito" />

    <!-- HERO (solo imagen; no ponemos texto encima porque el banner ya trae texto) -->
    <section class="hero">
      <div class="hero-media">
        <BCarousel controls indicators fade :interval="6500" class="hero-carousel">
          <BCarouselSlide :img-src="getImageUrl('slide1.png')" />
          <BCarouselSlide :img-src="getImageUrl('slide2.png')" />
        </BCarousel>

        <!-- sombreado sutil (no tapa el texto de la imagen) -->
        <div class="hero-shade" aria-hidden="true"></div>

        <!-- CTA flotante -->
        <div class="container hero-cta" data-aos="fade-up" data-aos-delay="50">
          <div class="cta-card">
            <div class="cta-copy">
              <p class="cta-kicker">Accesos rápidos</p>
              <h1 class="cta-title">Todo lo que necesitas, sin vueltas</h1>
              <p class="cta-subtitle">Inicia sesión, consulta TAT o compra en segundos.</p>
            </div>

            <div class="cta-actions">
              <a class="btn btn-danger btn-lg cta-btn" href="/login">
                <i class="bi bi-box-arrow-in-right me-2"></i> Iniciar sesión
              </a>

              <a class="btn btn-outline-secondary btn-lg cta-btn" href="/consulta-pdv">
                <i class="bi bi-graph-up me-2"></i> Consultas TAT
              </a>

              <a class="btn btn-danger btn-lg cta-btn" href="/tienda">
                <i class="bi bi-bag me-2"></i> Comprar ahora
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BENEFICIOS -->
    <section class="section section-after-hero">
      <div class="container">
        <div class="section-head" data-aos="fade-up">
          <div>
            <h2 class="section-title">Una experiencia más simple</h2>
            <p class="section-subtitle">Diseñada para que encuentres y compres rápido.</p>
          </div>
        </div>

        <div class="features">
          <article class="feature" data-aos="fade-up" data-aos-delay="0">
            <div class="feature-icon"><i class="bi bi-lightning-charge"></i></div>
            <h3 class="feature-title">Rápido</h3>
            <p class="feature-text">Acciones clave visibles desde el inicio.</p>
          </article>

          <article class="feature" data-aos="fade-up" data-aos-delay="80">
            <div class="feature-icon"><i class="bi bi-shield-check"></i></div>
            <h3 class="feature-title">Confiable</h3>
            <p class="feature-text">Secciones claras: planes, productos, aliados.</p>
          </article>

          <article class="feature" data-aos="fade-up" data-aos-delay="160">
            <div class="feature-icon"><i class="bi bi-bag-check"></i></div>
            <h3 class="feature-title">Listo para comprar</h3>
            <p class="feature-text">Productos destacados con precio y carrito a un clic.</p>
          </article>
        </div>
      </div>
    </section>

    <!-- PLANES -->
    <section id="planes" class="section section-muted">
      <div class="container">
        <div class="section-head" data-aos="fade-up">
          <div>
            <h2 class="section-title">Nuestros planes</h2>
            <p class="section-subtitle">Elige el plan que mejor se ajuste a tu necesidad.</p>
          </div>
          <a class="btn btn-danger btn-lg d-none d-md-inline-flex" href="/tienda">
            Adquiere tu plan pospago
          </a>
        </div>

        <div v-if="loadingPlanes" class="state-box" data-aos="fade-up">
          <div class="spinner-border" role="status" aria-label="Cargando planes"></div>
          <p class="state-text">Cargando planes...</p>
        </div>

        <div v-else-if="errorPlanes" class="state-box state-error" data-aos="fade-up">
          <i class="bi bi-exclamation-triangle me-2"></i>
          <span>{{ errorPlanes }}</span>
          <button class="btn btn-outline-danger btn-sm ms-3" @click="getPlanes">Reintentar</button>
        </div>

        <div v-else-if="planes.length === 0" class="state-box" data-aos="fade-up">
          <i class="bi bi-inbox me-2"></i>
          <span>No hay planes disponibles por el momento.</span>
        </div>

        <VueHorizontal v-else responsive class="horizontal" data-aos="fade-up">
          <div v-for="plan in planes" :key="plan.id" class="plan-card">
            <a href="/tienda" class="card-link">
              <img
                :src="getImageUrl(plan.img)"
                class="plan-image"
                :alt="`Plan ${plan.id}`"
                loading="lazy"
              />
              <div class="plan-glow" aria-hidden="true"></div>
            </a>
          </div>
        </VueHorizontal>

        <div class="text-center mt-4 d-md-none">
          <a class="btn btn-danger btn-lg w-100" href="/tienda">Adquiere tu plan pospago ahora</a>
        </div>
      </div>
    </section>

    <!-- BANNER / CARRUSEL INTERMEDIO -->
    <section class="section">
      <div class="container">
        <div class="promo" data-aos="zoom-in">
          <BCarousel controls indicators :interval="4500" class="promo-carousel">
            <BCarouselSlide :img-src="getImageUrl('slide3.png')" />
            <BCarouselSlide :img-src="getImageUrl('slide4.jpg')" />
            <BCarouselSlide :img-src="getImageUrl('slide5.jpg')" />
          </BCarousel>
        </div>
      </div>
    </section>

    <!-- PRODUCTOS -->
    <section id="productos" class="section section-muted">
      <div class="container">
        <div class="section-head" data-aos="fade-up">
          <div>
            <h2 class="section-title">Productos destacados</h2>
            <p class="section-subtitle">Busca, ordena y agrega al carrito sin fricción.</p>
          </div>
          <a class="btn btn-outline-danger btn-lg d-none d-md-inline-flex" href="/tienda">
            Ver todos
          </a>
        </div>

        <div class="controls" data-aos="fade-up" data-aos-delay="70">
          <div class="control">
            <label class="control-label">Buscar</label>
            <input v-model="q" class="form-control" type="search" placeholder="Ej: Modem, SIM, Plan..." />
          </div>

          <div class="control">
            <label class="control-label">Ordenar</label>
            <select v-model="sort" class="form-select">
              <option value="featured">Destacados</option>
              <option value="priceAsc">Precio: menor a mayor</option>
              <option value="priceDesc">Precio: mayor a menor</option>
              <option value="nameAsc">Nombre: A → Z</option>
            </select>
          </div>
        </div>

        <div v-if="loadingProductos" class="products-grid">
          <div v-for="n in 8" :key="n" class="skeleton-card" aria-hidden="true"></div>
        </div>

        <div v-else-if="errorProductos" class="state-box state-error" data-aos="fade-up">
          <i class="bi bi-exclamation-triangle me-2"></i>
          <span>{{ errorProductos }}</span>
          <button class="btn btn-outline-danger btn-sm ms-3" @click="getProductos">Reintentar</button>
        </div>

        <div v-else-if="filteredProductos.length === 0" class="state-box" data-aos="fade-up">
          <i class="bi bi-search me-2"></i>
          <span>No encontramos productos con ese filtro.</span>
        </div>

        <div v-else class="products-grid">
          <article v-for="producto in filteredProductos" :key="producto.id" class="product-card" data-aos="fade-up">
            <div class="product-media">
              <img :src="getImageUrl(producto.img)" class="product-image" :alt="producto.name" loading="lazy" />
              <span class="product-chip">IVA incluido</span>
            </div>

            <div class="product-body">
              <h3 class="product-name" :title="producto.name">{{ producto.name }}</h3>
              <div class="product-meta">
                <p class="product-price">{{ formatoMoneda(producto.value) }}</p>
              </div>

              <button class="btn btn-danger w-100" @click="agregarAlCarrito(producto)">
                <i class="bi bi-cart-plus me-2"></i> Agregar al carrito
              </button>
            </div>
          </article>
        </div>

        <div class="text-center mt-4 d-md-none">
          <a class="btn btn-outline-danger btn-lg w-100" href="/tienda">Ver todos los productos</a>
        </div>
      </div>
    </section>

    <!-- ALIADOS -->
    <section id="portafolio" class="section">
      <div class="container">
        <div class="section-head" data-aos="fade-up">
          <div>
            <h2 class="section-title">Nuestros aliados estratégicos</h2>
            <p class="section-subtitle">Marcas que respaldan la oferta.</p>
          </div>
        </div>

        <div class="allies-grid" data-aos="fade-up" data-aos-delay="80">
          <div v-for="ally in portafolios" :key="ally.id" class="ally-card">
            <img :src="getImageUrl(ally.img)" class="ally-logo" alt="Logo de aliado" loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER: VA AQUÍ DENTRO DEL TEMPLATE -->
    <FooterLanding />

    <!-- FLOAT BUTTON -->
    <button class="fab" type="button" @click="scrollTop" aria-label="Ir arriba">
      <i class="bi bi-arrow-up"></i>
    </button>
  </div>
</template>

<script>
import VueHorizontal from 'vue-horizontal'
import MenuLanding from '../MenuLanding/MenuLanding.vue'
import Carrito from '@/components/MainPage/Carrito/Carrito.vue'
import FooterLanding from '@/components/Landing/FooterLanding/FooterLanding.vue'
import backendRouter from '@/components/BackendRouter/BackendRouter'
import axios from 'axios'

import AOS from 'aos'
import 'aos/dist/aos.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'

export default {
  name: 'MainPagePro',
  components: { VueHorizontal, MenuLanding, Carrito, FooterLanding },
  data() {
    return {
      portafolios: [
        { id: 1, img: 'portafolio1.jpg' },
        { id: 2, img: 'portafolio2.jpg' },
        { id: 3, img: 'portafolio3.jpg' },
      ],
      planes: [],
      productos: [],
      loadingPlanes: false,
      loadingProductos: false,
      errorPlanes: '',
      errorProductos: '',
      q: '',
      sort: 'featured',
    }
  },
  computed: {
    filteredProductos() {
      const q = (this.q || '').trim().toLowerCase()
      let list = [...this.productos]

      if (q) list = list.filter((p) => (p.name || '').toLowerCase().includes(q))

      if (this.sort === 'priceAsc') list.sort((a, b) => Number(a.value || 0) - Number(b.value || 0))
      else if (this.sort === 'priceDesc') list.sort((a, b) => Number(b.value || 0) - Number(a.value || 0))
      else if (this.sort === 'nameAsc') list.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'es'))

      return list
    },
  },
  mounted() {
    AOS.init({ duration: 650, easing: 'ease-out-cubic', once: true, offset: 90 })
    this.getPlanes()
    this.getProductos()
  },
  methods: {
    getImageUrl(name) {
      if (!name) return 'https://placehold.co/1200x600?text=Imagen+no+disponible'
      try {
        return new URL(`../../../assets/${name}`, import.meta.url).href
      } catch {
        return 'https://placehold.co/1200x600?text=Imagen+no+encontrada'
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
    async getPlanes() {
      this.loadingPlanes = true
      this.errorPlanes = ''
      try {
        const path = backendRouter.data + 'planes'
        const res = await axios.get(path)
        const rows = res?.data?.data || []
        this.planes = rows.map((p) => ({ id: p.id, img: p.img }))
        this.$nextTick(() => AOS.refreshHard())
      } catch {
        this.errorPlanes = 'No se pudieron cargar los planes.'
      } finally {
        this.loadingPlanes = false
      }
    },
    async getProductos() {
      this.loadingProductos = true
      this.errorProductos = ''
      try {
        const path = backendRouter.data + 'productos'
        const res = await axios.get(path)
        const rows = res?.data?.data || []
        this.productos = rows.map((p) => ({
          id: p.id,
          img: p.img,
          name: p.titulo,
          value: p.precio,
        }))
        this.$nextTick(() => AOS.refreshHard())
      } catch {
        this.errorProductos = 'No se pudieron cargar los productos.'
      } finally {
        this.loadingProductos = false
      }
    },
    agregarAlCarrito(producto) {
      this.$refs.carrito?.agregarAlCarritoCarrito?.(producto)
    },
    scrollTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  },
}
</script>

<style scoped>
:global(html),
:global(body) {
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  background: #fff;
}

/* Tokens */
.page{
  --surface: #fff;
  --muted: #f7f7f9;
  --text: #0f172a;
  --subtext: #64748b;
  --border: rgba(2, 6, 23, 0.08);
  --shadow: 0 18px 40px rgba(2, 6, 23, 0.14);
  --shadow-soft: 0 12px 26px rgba(2, 6, 23, 0.10);
  --radius: 18px;
  color: var(--text);
}

/* HERO */
.hero-media{ position: relative; border-bottom: 1px solid var(--border); }
.hero-carousel :deep(.carousel-item),
.hero-carousel :deep(.carousel-item img){ height: 560px; }
.hero-carousel :deep(.carousel-item img){ width: 100%; object-fit: cover; }
.hero-carousel :deep(.carousel-caption){ display: none !important; }
.hero-shade{
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.10));
}

/* CTA flotante */
.hero-cta{ position: absolute; left: 0; right: 0; bottom: -34px; z-index: 10; }
.cta-card{
  background: rgba(255,255,255,0.92);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
  padding: 18px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.cta-kicker{ margin: 0; color: var(--subtext); font-weight: 700; letter-spacing: .02em; text-transform: uppercase; font-size: 12px; }
.cta-title{ margin: 4px 0 0 0; font-weight: 900; letter-spacing: -0.02em; font-size: 22px; }
.cta-subtitle{ margin: 6px 0 0 0; color: var(--subtext); font-weight: 600; }
.cta-actions{ display: flex; gap: 10px; flex-wrap: wrap; }
.cta-btn{
  border-radius: 14px;
  box-shadow: 0 10px 18px rgba(2,6,23,0.08);
  transition: transform .2s ease, box-shadow .2s ease;
}
.cta-btn:hover{ transform: translateY(-2px); box-shadow: 0 16px 26px rgba(2,6,23,0.12); }

/* Sections */
.section{ padding: 3.2rem 0; }
.section-after-hero{ padding-top: 4.8rem; }
.section-muted{
  background: var(--muted);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.section-head{
  display:flex; align-items:flex-end; justify-content:space-between;
  gap: 16px; flex-wrap: wrap; margin-bottom: 18px;
}
.section-title{ margin:0; font-weight: 900; letter-spacing: -0.02em; }
.section-subtitle{ margin: 6px 0 0 0; color: var(--subtext); font-weight: 600; }

/* Features */
.features{ display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
@media (max-width: 992px){ .features{ grid-template-columns: 1fr; } }
.feature{
  background: #fff; border: 1px solid var(--border); border-radius: var(--radius);
  box-shadow: var(--shadow-soft); padding: 16px;
  transition: transform .22s ease, box-shadow .22s ease;
}
.feature:hover{ transform: translateY(-4px); box-shadow: var(--shadow); }
.feature-icon{
  width: 44px; height: 44px; border-radius: 14px; display:grid; place-items:center;
  background: rgba(225,20,25,0.10); color: #E11419; font-size: 20px; margin-bottom: 10px;
}
.feature-title{ margin:0; font-weight: 900; }
.feature-text{ margin: 6px 0 0 0; color: var(--subtext); font-weight: 600; }

/* States */
.state-box{
  border: 1px dashed var(--border); border-radius: var(--radius);
  padding: 18px; display:flex; align-items:center; justify-content:center; gap: 10px; background: #fff;
}
.state-text{ margin:0; color: var(--subtext); font-weight: 600; }
.state-error{ border-style: solid; background: rgba(225,20,25,0.06); color: #b4232c; }

/* Plans */
.plan-card{
  width: 270px; border-radius: var(--radius); overflow:hidden;
  border: 1px solid var(--border); box-shadow: var(--shadow-soft);
  position: relative; transition: transform .22s ease, box-shadow .22s ease;
}
.plan-card:hover{ transform: translateY(-6px); box-shadow: var(--shadow); }
.card-link{ display:block; position:relative; }
.plan-image{ width: 270px; height: 270px; object-fit: cover; display:block; }
.plan-glow{
  position:absolute; inset: 0; pointer-events:none;
  background: radial-gradient(circle at 20% 20%, rgba(225,20,25,0.22), transparent 45%);
  opacity: 0; transition: opacity .22s ease;
}
.plan-card:hover .plan-glow{ opacity: 1; }

/* Promo carousel */
.promo{ border-radius: 22px; overflow:hidden; border: 1px solid var(--border); box-shadow: var(--shadow); }
.promo-carousel :deep(.carousel-item),
.promo-carousel :deep(.carousel-item img){ height: 360px; }
.promo-carousel :deep(.carousel-item img){ width: 100%; object-fit: cover; }
.promo-carousel :deep(.carousel-caption){ display:none !important; }

/* Controls */
.controls{ display:grid; grid-template-columns: 2fr 1fr; gap: 12px; margin-bottom: 14px; }
@media (max-width: 768px){ .controls{ grid-template-columns: 1fr; } }
.control-label{ display:block; font-weight: 800; font-size: 12px; color: var(--subtext); margin-bottom: 6px; }

/* Products */
.products-grid{ display:grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
@media (max-width: 1200px){ .products-grid{ grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 992px){ .products-grid{ grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 576px){ .products-grid{ grid-template-columns: 1fr; } }

.product-card{
  background:#fff; border: 1px solid var(--border); border-radius: var(--radius);
  overflow:hidden; box-shadow: var(--shadow-soft);
  transition: transform .22s ease, box-shadow .22s ease;
  display:flex; flex-direction:column;
}
.product-card:hover{ transform: translateY(-6px); box-shadow: var(--shadow); }
.product-media{ position: relative; }
.product-image{ width:100%; height: 240px; object-fit: cover; display:block; }
.product-chip{
  position:absolute; left: 12px; top: 12px;
  background: rgba(255,255,255,0.92); border: 1px solid rgba(2,6,23,0.10);
  padding: 6px 10px; border-radius: 999px; font-weight: 800; font-size: 12px; color: #0f172a;
}
.product-body{ padding: 14px; display:flex; flex-direction:column; gap: 10px; flex:1; }
.product-name{
  margin:0; font-weight: 900; line-height: 1.2; min-height: 2.4em;
  display:-webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow:hidden;
}
.product-meta{ margin-top:auto; }
.product-price{ margin:0; font-weight: 900; font-size: 1.15rem; color:#E11419; }

/* Skeleton */
.skeleton-card{
  height: 360px; border-radius: var(--radius); border: 1px solid var(--border);
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 37%, #f1f5f9 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
}
@keyframes shimmer{ 0%{ background-position: 100% 0; } 100%{ background-position: 0 0; } }

/* Allies */
.allies-grid{ display:grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 12px; }
@media (max-width: 1200px){ .allies-grid{ grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 768px){ .allies-grid{ grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 480px){ .allies-grid{ grid-template-columns: repeat(2, 1fr); } }

.ally-card{
  background:#fff; border: 1px solid var(--border); border-radius: var(--radius);
  padding: 14px; display:grid; place-items:center; box-shadow: var(--shadow-soft);
  transition: transform .22s ease, box-shadow .22s ease;
}
.ally-card:hover{ transform: translateY(-4px); box-shadow: var(--shadow); }
.ally-logo{
  width: 120px; height: 48px; object-fit: contain; filter: grayscale(100%); opacity: .78;
  transition: all .22s ease;
}
.ally-card:hover .ally-logo{ filter: grayscale(0%); opacity: 1; transform: scale(1.06); }

/* Floating button */
.fab{
  position: fixed;
  right: 20px;
  bottom: 80px;
  width: 50px;
  height: 50px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: #fff;
  box-shadow: var(--shadow-soft);
  display:grid;
  place-items:center;
  z-index: 999;
  transition: transform .2s ease, box-shadow .2s ease;
}
.fab:hover{ transform: translateY(-2px); box-shadow: var(--shadow); }

/* Responsive hero */
@media (max-width: 576px){
  .hero-carousel :deep(.carousel-item),
  .hero-carousel :deep(.carousel-item img){ height: 420px; }
  .hero-cta{ bottom: -26px; }
  .cta-title{ font-size: 18px; }
  .promo-carousel :deep(.carousel-item),
  .promo-carousel :deep(.carousel-item img){ height: 240px; }
}
</style>
