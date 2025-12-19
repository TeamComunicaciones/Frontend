<template>
  <div class="page">
    <MenuLanding />
    <Carrito />

    <main class="main">
      <!-- HERO / Carrusel (sin textos encima) -->
      <section class="hero" aria-label="Carrusel principal">
        <BCarousel
          controls
          indicators
          fade
          :interval="6500"
          class="hero-carousel"
        >
          <BCarouselSlide :img-src="getImageUrl('slide1-2.jpeg')" />
          <BCarouselSlide :img-src="getImageUrl('slide2-2.jpeg')" />
          <BCarouselSlide :img-src="getImageUrl('slide3-2.jpeg')" />
        </BCarousel>

        <!-- Sombreado sutil (no tapa el texto del banner) -->
        <div class="hero-shade" aria-hidden="true"></div>

        <!-- Indicador scroll -->
        <div class="hero-scroll-hint" aria-hidden="true">
          <span class="scroll-pill">
            Desliza
            <span class="scroll-dot"></span>
          </span>
        </div>
      </section>

      <!-- INTRO -->
      <section class="section intro" aria-label="Introducción">
        <div class="container">
          <div class="intro-wrap" data-aos="fade-up">
            <div class="intro-card">
              <div class="intro-badge">
                <i class="bi bi-broadcast-pin me-2"></i>
                TEAM Comunicaciones
              </div>

              <h1 class="intro-title">{{ titulo1 }}</h1>

              <p class="intro-subtitle">
                <strong>{{ titulo2 }}</strong>
              </p>

              <div class="intro-text">
                <p>{{ queHacemos1 }}</p>
                <p class="mb-0">{{ queHacemos2 }}</p>
              </div>

              <div class="intro-actions">
                <a href="/tienda" class="btn btn-danger btn-lg">
                  <i class="bi bi-bag me-2"></i> Ir a la tienda
                </a>
                <a href="/contactanos" class="btn btn-outline-secondary btn-lg">
                  <i class="bi bi-chat-dots me-2"></i> Contáctanos
                </a>
              </div>
            </div>

            <div class="intro-metrics">
              <div class="metric" data-aos="fade-up" data-aos-delay="80">
                <div class="metric-icon">
                  <i class="bi bi-people"></i>
                </div>
                <div>
                  <div class="metric-title">Cercanía</div>
                  <div class="metric-text">Atención y asesoría</div>
                </div>
              </div>

              <div class="metric" data-aos="fade-up" data-aos-delay="140">
                <div class="metric-icon">
                  <i class="bi bi-lightning-charge"></i>
                </div>
                <div>
                  <div class="metric-title">Velocidad</div>
                  <div class="metric-text">Soluciones claras</div>
                </div>
              </div>

              <div class="metric" data-aos="fade-up" data-aos-delay="200">
                <div class="metric-icon">
                  <i class="bi bi-shield-check"></i>
                </div>
                <div>
                  <div class="metric-title">Confianza</div>
                  <div class="metric-text">Servicio responsable</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- PROPÓSITO -->
      <section class="section" aria-label="Propósito">
        <div class="container">
          <div class="section-head" data-aos="fade-up">
            <div>
              <p class="eyebrow">
                <span class="eyedot"></span> Conócenos
              </p>
              <h2 class="section-title">{{ tituloProposito }}</h2>
              <p class="section-subtitle">
                Tecnología con sentido: conectar para avanzar.
              </p>
            </div>
          </div>

          <div class="content-card" data-aos="fade-up">
            <div class="content-grid">
              <div class="media">
                <img
                  class="media-img"
                  :src="getImageUrl(imgProposito)"
                  alt="Nuestro propósito"
                  loading="lazy"
                />
              </div>

              <div class="content">
                <p class="p-text">{{ textoProposito }}</p>

                <div class="mini-features">
                  <div class="mini" data-aos="fade-up" data-aos-delay="80">
                    <i class="bi bi-lightning-charge"></i>
                    <div>
                      <p class="mini-title">Soluciones</p>
                      <p class="mini-text mb-0">
                        Tecnología que te permite avanzar.
                      </p>
                    </div>
                  </div>

                  <div class="mini" data-aos="fade-up" data-aos-delay="140">
                    <i class="bi bi-people"></i>
                    <div>
                      <p class="mini-title">Conexión</p>
                      <p class="mini-text mb-0">
                        Acortamos distancias con telecomunicaciones.
                      </p>
                    </div>
                  </div>

                  <div class="mini" data-aos="fade-up" data-aos-delay="200">
                    <i class="bi bi-geo-alt"></i>
                    <div>
                      <p class="mini-title">Presencia</p>
                      <p class="mini-text mb-0">
                        Llegamos a regiones donde nos necesitas.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="soft-cta">
                  <div class="soft-cta-left">
                    <div class="soft-cta-title">¿Quieres asesoría?</div>
                    <div class="soft-cta-text">Escríbenos y te ayudamos a elegir.</div>
                  </div>
                  <a class="btn btn-danger" href="/contactanos">
                    <i class="bi bi-send me-2"></i> Hablar con un asesor
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- VALORES -->
      <section class="section section-muted" aria-label="Valores">
        <div class="container">
          <div class="section-head" data-aos="fade-up">
            <div>
              <p class="eyebrow">
                <span class="eyedot"></span> Lo que nos guía
              </p>
              <h2 class="section-title">{{ tituloValores }}</h2>
              <p class="section-subtitle">
                Principios claros que se ven en el servicio.
              </p>
            </div>
          </div>

          <div class="content-card" data-aos="fade-up">
            <div class="content-grid reverse">
              <div class="media">
                <img
                  class="media-img"
                  :src="getImageUrl(imgValores)"
                  alt="Nuestros valores"
                  loading="lazy"
                />
              </div>

              <div class="content">
                <div class="values-grid">
                  <div
                    v-for="(item, idx) in textoValores"
                    :key="idx"
                    class="value-card"
                    data-aos="fade-up"
                    :data-aos-delay="idx * 40"
                  >
                    <div class="value-icon">
                      <i class="bi bi-check2"></i>
                    </div>
                    <div class="value-text">{{ item }}</div>
                  </div>
                </div>

                <div class="hint">
                  <i class="bi bi-shield-check me-2"></i>
                  Valores prácticos: servicio, honestidad y mejora continua.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- HISTORIA -->
      <section class="section" aria-label="Historia">
        <div class="container">
          <div class="section-head" data-aos="fade-up">
            <div>
              <p class="eyebrow">
                <span class="eyedot"></span> Trayectoria
              </p>
              <h2 class="section-title">{{ tituloHistoria }}</h2>
              <p class="section-subtitle">
                Crecimiento con cobertura, inversión y cercanía.
              </p>
            </div>
          </div>

          <div class="history-card" data-aos="fade-up">
            <div class="history-grid">
              <div class="media">
                <img
                  class="media-img"
                  :src="getImageUrl(imgHistoria)"
                  alt="Nuestra historia"
                  loading="lazy"
                />
              </div>

              <div class="history-body">
                <div class="timeline">
                  <article
                    v-for="(item, idx) in textoHistoria"
                    :key="idx"
                    class="t-item"
                    data-aos="fade-up"
                    :data-aos-delay="idx * 60"
                  >
                    <div class="t-mark" aria-hidden="true"></div>
                    <p class="p-text mb-0">{{ item }}</p>
                  </article>
                </div>

                <div class="callout">
                  <div class="callout-icon">
                    <i class="bi bi-geo-alt"></i>
                  </div>
                  <div>
                    <p class="callout-title mb-1">Presencia regional</p>
                    <p class="callout-text mb-0">
                      Antioquia, Boyacá, Chocó y Eje Cafetero.
                    </p>
                  </div>
                </div>

                <div class="history-actions">
                  <a href="/tienda" class="btn btn-outline-danger btn-lg w-100">
                    <i class="bi bi-bag me-2"></i> Explorar productos y planes
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- IMAGEN COMPLEMENTARIA -->
      <section class="section section-muted" aria-label="Imagen complementaria">
        <div class="container">
          <div class="wide-card" data-aos="zoom-in">
            <img
              class="wide-img"
              :src="getImageUrl(imgComplementaria)"
              alt="Imagen complementaria"
              loading="lazy"
            />
            <div class="wide-overlay" aria-hidden="true"></div>
          </div>
        </div>
      </section>
    </main>

    <!-- FOOTER -->
    <FooterLanding />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import MenuLanding from '@/components/MainPage/MenuLanding/MenuLanding.vue'
import Carrito from '@/components/MainPage/Carrito/Carrito.vue'
import FooterLanding from '@/components/Landing/FooterLanding/FooterLanding.vue'

import AOS from 'aos'
import 'aos/dist/aos.css'

import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'

onMounted(() => {
  AOS.init({
    duration: 650,
    easing: 'ease-out-cubic',
    once: true,
    offset: 90,
  })
})

const getImageUrl = (name) => {
  if (!name) return 'https://placehold.co/1200x700?text=Imagen+no+disponible'
  try {
    return new URL(`../../../assets/${name}`, import.meta.url).href
  } catch (e) {
    return 'https://placehold.co/1200x700?text=Imagen+no+encontrada'
  }
}

/* Contenido (igual al tuyo) */
const titulo1 = 'Conectamos a las personas por medio de las telecomunicaciones'
const titulo2 = '¿Qué hacemos?'
const queHacemos1 =
  'Brindamos la mejor asesoría y atención para la compra de equipos, tecnología, servicios hogar o de empresas; contamos con un personal altamente calificado y dispuesto a ayudarte en todo lo que necesites, en nuestros Centros de Ventas y Servicios tendrás la mejor experiencia de compra con el servicio de alta calidad.'
const queHacemos2 =
  'Hacemos presencia en Antioquía, Boyacá, Chocó y Eje Cafetero; con la intención de acortar distancias, llevando la mejor señal para personas, familias y empresas.'

const imgProposito = 'proposito.jpeg'
const tituloProposito = 'Nuestro propósito'
const textoProposito =
  'Estamos seguros de que la tecnología genera calidad de vida y nos conecta; nuestro compromiso es entregarte soluciones tecnológicas que te permiten avanzar.'

const imgValores = 'valores.jpeg'
const tituloValores = 'Nuestros Valores'
const textoValores = [
  'Comprometidos con el servicio',
  'Siempre decimos la verdad',
  'Ponemos atención a las necesidades de las personas',
  'Siempre buscamos ser mejores',
  'Somos agradecidos con todas las personas',
  'Nunca nos damos por vencidos',
]

const imgHistoria = 'historia.jpeg'
const tituloHistoria = 'Nuestra Historia'
const textoHistoria = [
  'Somos un agente comercial de Claro quien dispone de la red de mayor cobertura en Colombia. Sus constantes inversiones en tecnología e innovación, nos llevan a donde están nuestros clientes para que puedan conectarse con los que más quieren. Llegamos al 99% de los municipios del país con la red móvil del operador para que nuestros clientes puedan compartir sus mejores historias, incluso desde una montaña. Conectar 31 millones de clientes móviles demuestra que casi la mitad de las líneas en Colombia son de usuarios Claro que disfrutan nuestro respaldo y cobertura.',
  'Claro tiene 8.842 antenas propias en todo el país para que una llamada o una foto pueda llegar a más lugares en todo Colombia. En los últimos 20 años ha invertido US$15.000 millones por esto, en más del 60% de las cabeceras municipales, solo hay cobertura 4G de Claro.',
  'Llegamos a las 32 capitales del país, 1.119 municipios y 2.300 poblaciones para que se conecten con sus seres especiales desde ese lugar que tanto disfrutan.',
]

const imgComplementaria = 'complementaria.jpeg'
</script>

<style scoped>
/* Tipografía global en esta vista */
:global(html),
:global(body) {
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}

/* Tokens */
.page{
  --brand: #E11419;
  --surface: #ffffff;
  --muted: #f7f7f9;
  --text: #0f172a;
  --subtext: #64748b;
  --border: rgba(2, 6, 23, 0.10);
  --shadow: 0 18px 40px rgba(2, 6, 23, 0.12);
  --shadow-soft: 0 12px 26px rgba(2, 6, 23, 0.08);
  --radius: 18px;

  color: var(--text);
  background: var(--surface);
}

.main{
  position: relative;
}

/* HERO */
.hero{
  position: relative;
  border-bottom: 1px solid var(--border);
  background: #000;
}

.hero-carousel :deep(.carousel-item),
.hero-carousel :deep(.carousel-item img){
  height: clamp(360px, 58vh, 620px);
}

.hero-carousel :deep(.carousel-item img){
  width: 100%;
  object-fit: cover;
}

/* evita captions */
.hero-carousel :deep(.carousel-caption){
  display: none !important;
}

/* indicators un poco más finos */
.hero-carousel :deep(.carousel-indicators [data-bs-target]){
  width: 22px;
  height: 6px;
  border-radius: 999px;
  opacity: .55;
}
.hero-carousel :deep(.carousel-indicators .active){
  opacity: 1;
}

/* sombreado sutil */
.hero-shade{
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.18));
}

.hero-scroll-hint{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 14px;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.scroll-pill{
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.86);
  border: 1px solid rgba(2,6,23,0.10);
  font-weight: 800;
  font-size: 12px;
  color: var(--text);
}
.scroll-dot{
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--brand);
  box-shadow: 0 0 0 6px rgba(225,20,25,0.15);
  animation: pulse 1.2s ease-in-out infinite;
}
@keyframes pulse{
  0%,100%{ transform: translateY(0); opacity: 1; }
  50%{ transform: translateY(-2px); opacity: .85; }
}

/* Sections */
.section{ padding: 3.2rem 0; }

.section-muted{
  background: var(--muted);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

/* Section head */
.section-head{
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.eyebrow{
  margin: 0 0 6px 0;
  color: var(--subtext);
  font-weight: 900;
  letter-spacing: .08em;
  text-transform: uppercase;
  font-size: 12px;
  display:flex;
  align-items:center;
  gap: 10px;
}
.eyedot{
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--brand);
  box-shadow: 0 0 0 6px rgba(225,20,25,0.12);
}

.section-title{
  margin: 0;
  font-weight: 900;
  letter-spacing: -0.02em;
  font-size: clamp(22px, 2.2vw, 34px);
}

.section-subtitle{
  margin: 8px 0 0 0;
  color: var(--subtext);
  font-weight: 650;
  line-height: 1.6;
}

/* INTRO */
.intro{
  position: relative;
}
.intro::before{
  content:"";
  position:absolute;
  inset: 0;
  pointer-events:none;
  background:
    radial-gradient(800px 220px at 50% 0%, rgba(225,20,25,0.12), transparent 60%);
}

.intro-wrap{
  display:grid;
  grid-template-columns: 1.35fr 0.65fr;
  gap: 16px;
  align-items: start;
}

.intro-card{
  background: rgba(255,255,255,0.92);
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) + 6px);
  box-shadow: var(--shadow);
  padding: 22px;
  backdrop-filter: blur(10px);
}

.intro-badge{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(225, 20, 25, 0.08);
  color: var(--brand);
  font-weight: 900;
  font-size: 12px;
  margin-bottom: 12px;
}

.intro-title{
  margin: 0;
  font-weight: 950;
  letter-spacing: -0.03em;
  font-size: clamp(24px, 2.4vw, 40px);
  line-height: 1.1;
}

.intro-subtitle{
  margin: 10px 0 0 0;
  color: var(--subtext);
  font-weight: 800;
}

.intro-text{
  margin-top: 14px;
  color: var(--subtext);
  font-weight: 650;
  line-height: 1.75;
}

.intro-actions{
  margin-top: 16px;
  display:flex;
  gap: 10px;
  flex-wrap: wrap;
}

.intro-actions .btn{
  border-radius: 14px;
  font-weight: 800;
  box-shadow: 0 10px 18px rgba(2,6,23,0.08);
  transition: transform .2s ease, box-shadow .2s ease;
}
.intro-actions .btn:hover{
  transform: translateY(-2px);
  box-shadow: 0 16px 26px rgba(2,6,23,0.12);
}

/* metrics */
.intro-metrics{
  display:grid;
  gap: 12px;
}
.metric{
  background: #fff;
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) + 2px);
  box-shadow: var(--shadow-soft);
  padding: 14px;
  display:flex;
  gap: 12px;
  align-items:center;
}
.metric-icon{
  width: 44px;
  height: 44px;
  border-radius: 16px;
  display:grid;
  place-items:center;
  background: rgba(225,20,25,0.10);
  color: var(--brand);
  font-size: 18px;
}
.metric-title{ font-weight: 950; margin:0; }
.metric-text{ color: var(--subtext); font-weight: 700; font-size: 13px; }

/* Content cards */
.content-card{
  background: #fff;
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) + 6px);
  box-shadow: var(--shadow-soft);
  overflow: hidden;
}

.content-grid{
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 0;
}

.content-grid.reverse{
  grid-template-columns: 0.95fr 1.05fr;
}

.content-grid.reverse .media{ order: 2; }
.content-grid.reverse .content{ order: 1; }

.media{
  position: relative;
  min-height: 360px;
}

.media::after{
  content:"";
  position:absolute;
  inset:0;
  pointer-events:none;
  background:
    radial-gradient(circle at 20% 20%, rgba(225,20,25,0.18), transparent 45%);
  opacity: .85;
}

.media-img{
  width: 100%;
  height: 100%;
  min-height: 360px;
  object-fit: cover;
  display: block;
}

.content{
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.p-text{
  color: var(--subtext);
  font-weight: 650;
  line-height: 1.75;
  margin: 0;
  font-size: 16px;
}

/* mini features */
.mini-features{
  margin-top: 6px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.mini{
  border: 1px solid rgba(2,6,23,0.08);
  border-radius: 18px;
  padding: 12px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  background: rgba(2,6,23,0.02);
  transition: transform .2s ease, box-shadow .2s ease;
}
.mini:hover{
  transform: translateY(-2px);
  box-shadow: var(--shadow-soft);
}
.mini i{
  font-size: 18px;
  color: var(--brand);
  margin-top: 2px;
}
.mini-title{
  margin: 0;
  font-weight: 950;
}
.mini-text{
  margin: 2px 0 0 0;
  color: var(--subtext);
  font-weight: 650;
  font-size: 13px;
}

/* soft CTA */
.soft-cta{
  margin-top: 6px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
  flex-wrap: wrap;
  border: 1px solid rgba(225,20,25,0.18);
  background: rgba(225,20,25,0.06);
  border-radius: 18px;
  padding: 12px;
}
.soft-cta-title{ font-weight: 950; }
.soft-cta-text{ color: var(--subtext); font-weight: 700; font-size: 13px; }
.soft-cta .btn{ border-radius: 14px; font-weight: 850; }

/* Values grid */
.values-grid{
  display:grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.value-card{
  border: 1px solid rgba(2,6,23,0.08);
  border-radius: 18px;
  padding: 12px;
  background: rgba(255,255,255,0.9);
  display:flex;
  gap: 10px;
  align-items:flex-start;
  transition: transform .2s ease, box-shadow .2s ease;
}
.value-card:hover{
  transform: translateY(-2px);
  box-shadow: var(--shadow-soft);
}
.value-icon{
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: rgba(225,20,25,0.10);
  display:grid;
  place-items:center;
  color: var(--brand);
  flex: 0 0 auto;
}
.value-text{
  font-weight: 800;
  color: var(--text);
  line-height: 1.35;
}

.hint{
  margin-top: 10px;
  color: var(--subtext);
  font-weight: 750;
  font-size: 13px;
}

/* History */
.history-card{
  background:#fff;
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) + 6px);
  box-shadow: var(--shadow-soft);
  overflow:hidden;
}
.history-grid{
  display:grid;
  grid-template-columns: 1.05fr 0.95fr;
}
.history-body{
  padding: 22px;
  display:flex;
  flex-direction:column;
  gap: 12px;
}
.timeline{
  display:grid;
  gap: 12px;
}
.t-item{
  position: relative;
  padding-left: 18px;
}
.t-mark{
  position: absolute;
  left: 0;
  top: 6px;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--brand);
  box-shadow: 0 0 0 6px rgba(225,20,25,0.12);
}

/* callout */
.callout{
  border: 1px solid rgba(225,20,25,0.18);
  background: rgba(225,20,25,0.06);
  border-radius: 18px;
  padding: 12px;
  display:flex;
  gap: 10px;
  align-items: center;
}
.callout-icon{
  width: 44px;
  height: 44px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(225,20,25,0.14);
  color: var(--brand);
  font-size: 18px;
}
.callout-title{
  font-weight: 950;
}
.callout-text{
  color: var(--subtext);
  font-weight: 750;
}

.history-actions{
  margin-top: 6px;
}
.history-actions .btn{
  border-radius: 14px;
  font-weight: 900;
}

/* Complementaria */
.wide-card{
  border: 1px solid var(--border);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: var(--shadow);
  background: #fff;
  position: relative;
}
.wide-img{
  width: 100%;
  height: clamp(260px, 42vh, 460px);
  object-fit: cover;
  display: block;
}
.wide-overlay{
  position:absolute;
  inset:0;
  pointer-events:none;
  background: linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.10));
}

/* Responsive */
@media (max-width: 992px){
  .intro-wrap{
    grid-template-columns: 1fr;
  }

  .content-grid,
  .content-grid.reverse,
  .history-grid{
    grid-template-columns: 1fr;
  }

  .content-grid.reverse .media{ order: 1; }
  .content-grid.reverse .content{ order: 2; }

  .media-img{ min-height: 300px; }

  .values-grid{
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px){
  .intro-card{ padding: 16px; }
  .content{ padding: 16px; }
  .history-body{ padding: 16px; }
}
</style>
