<template>
  <div class="page">
    <Carrito />
    <MenuLanding />

    <!-- HERO -->
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-content">
          <p class="hero-kicker">
            <span class="dot" aria-hidden="true"></span>
            Contáctanos
          </p>

          <h1 class="hero-title">¿En qué podemos ayudarte?</h1>

          <p class="hero-subtitle">
            Registra tus solicitudes, felicitaciones, sugerencias y quejas. Con gusto las atenderemos.
          </p>
        </div>
      </div>
    </section>

    <!-- CONTENT -->
    <section class="section">
      <div class="container">
        <div class="row g-4 align-items-stretch">
          <!-- FORM -->
          <div class="col-12 col-lg-7">
            <div class="panel">
              <div class="panel-head">
                <div>
                  <h2 class="panel-title">Envíanos un mensaje</h2>
                  <p class="panel-subtitle">
                    Completa el formulario y te responderemos lo antes posible.
                  </p>
                </div>

                <span class="badge-soft">
                  <i class="bi bi-shield-check me-2"></i> Confidencial
                </span>
              </div>

              <form @submit.prevent="enviarFormulario" novalidate class="mt-3">
                <div class="mb-3">
                  <label for="nombre" class="form-label label">
                    Nombre <span class="req">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    v-model.trim="nombre"
                    required
                    class="form-control input"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div class="mb-3">
                  <label for="correo" class="form-label label">
                    Correo <span class="req">*</span>
                  </label>
                  <input
                    type="email"
                    id="correo"
                    v-model.trim="correo"
                    required
                    class="form-control input"
                    placeholder="tu@correo.com"
                  />
                </div>

                <div class="mb-3">
                  <label for="asunto" class="form-label label">Asunto</label>
                  <input
                    type="text"
                    id="asunto"
                    v-model.trim="asunto"
                    class="form-control input"
                    placeholder="Ej: Información de planes"
                  />
                </div>

                <div class="mb-3">
                  <label for="mensaje" class="form-label label">
                    Mensaje <span class="req">*</span>
                  </label>
                  <textarea
                    id="mensaje"
                    v-model.trim="mensaje"
                    rows="5"
                    class="form-control input"
                    placeholder="Cuéntanos tu solicitud con detalles..."
                  ></textarea>

                  <div class="helper">
                    <span :class="mensaje.length < 10 ? 'warn' : 'ok'">
                      {{ mensaje.length }} caracteres
                    </span>
                    <span class="muted">Recomendado: mínimo 10 caracteres.</span>
                  </div>
                </div>

                <div class="d-flex align-items-center gap-3 flex-wrap">
                  <b-button
                    type="submit"
                    variant="danger"
                    class="btn-send"
                    :disabled="loading"
                  >
                    <span v-if="!loading">
                      <i class="bi bi-send me-2"></i> Enviar
                    </span>
                    <span v-else class="d-inline-flex align-items-center">
                      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Enviando...
                    </span>
                  </b-button>

                  <p class="disclaimer mb-0">
                    Usaremos tus datos solo para responder tu solicitud.
                  </p>
                </div>
              </form>
            </div>
          </div>

          <!-- RIGHT PANEL -->
          <div class="col-12 col-lg-5">
            <div class="panel panel-right">
              <div class="media">
                <img
                  class="media-img"
                  :src="getImageUrl(imgContactanos)"
                  alt="Contáctanos"
                  loading="lazy"
                />
                <div class="media-badge">
                  <i class="bi bi-headset me-2"></i> Atención y soporte
                </div>
              </div>

              <div class="info">
                <h3 class="info-title">Canales de contacto</h3>

                <a class="info-row info-link" href="tel:+576046679">
                  <span class="info-icon"><i class="bi bi-telephone"></i></span>
                  <span class="info-text">
                    <span class="info-label">Teléfono</span>
                    <span class="info-value">(4) 6046679</span>
                  </span>
                </a>

                <a class="info-row info-link" href="mailto:info@teamcomunicaciones.com">
                  <span class="info-icon"><i class="bi bi-envelope"></i></span>
                  <span class="info-text">
                    <span class="info-label">Correo</span>
                    <span class="info-value">info@teamcomunicaciones.com</span>
                  </span>
                </a>

                <div class="info-row">
                  <span class="info-icon"><i class="bi bi-clock"></i></span>
                  <span class="info-text">
                    <span class="info-label">Disponibilidad</span>
                    <span class="info-value">Canales digitales 24/7</span>
                  </span>
                </div>

                <div class="socials">
                  <a
                    class="social"
                    target="_blank"
                    rel="noopener"
                    href="https://www.facebook.com/profile.php?id=100063664486789"
                    aria-label="Facebook"
                    title="Facebook"
                  >
                    <i class="bi bi-facebook"></i>
                  </a>
                  <a
                    class="social"
                    target="_blank"
                    rel="noopener"
                    href="https://www.instagram.com/teamcomunicacionesclaro/?hl=es-la"
                    aria-label="Instagram"
                    title="Instagram"
                  >
                    <i class="bi bi-instagram"></i>
                  </a>
                  <a
                    class="social"
                    target="_blank"
                    rel="noopener"
                    href="https://www.youtube.com/channel/UCMSAXcm2b4alOnpw_AzUC1g"
                    aria-label="YouTube"
                    title="YouTube"
                  >
                    <i class="bi bi-youtube"></i>
                  </a>
                </div>

                <div class="tips">
                  <h4 class="tips-title">Para responderte más rápido</h4>
                  <ul class="tips-list">
                    <li><span class="tip-dot"></span> Especifica producto/servicio.</li>
                    <li><span class="tip-dot"></span> Incluye ciudad/municipio si aplica.</li>
                    <li><span class="tip-dot"></span> Describe el caso con detalles.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <!-- /RIGHT -->
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
  name: 'ContactanosPro',
  components: {
    MenuLanding,
    Carrito,
    FooterLanding,
  },
  data() {
    return {
      nombre: '',
      correo: '',
      asunto: '',
      mensaje: '',
      imgContactanos: 'img1.jpg',
      loading: false,
    }
  },
  methods: {
    getImageUrl(name) {
      if (!name) return 'https://placehold.co/1200x800?text=Imagen'
      try {
        return new URL(`../../../assets/${name}`, import.meta.url).href
      } catch (e) {
        return 'https://placehold.co/1200x800?text=Imagen'
      }
    },
    isValidEmail(email) {
      return /^\S+@\S+\.\S+$/.test(String(email || '').trim())
    },
    async enviarFormulario() {
      // Manteniendo campos originales
      if (!this.nombre || !this.correo || !this.mensaje) {
        this.$swal({
          title: 'Campos incompletos',
          text: 'Por favor completa Nombre, Correo y Mensaje.',
          icon: 'warning',
        })
        return
      }

      if (!this.isValidEmail(this.correo)) {
        this.$swal({
          title: 'Correo inválido',
          text: 'Por favor ingresa un correo válido.',
          icon: 'warning',
        })
        return
      }

      this.loading = true
      try {
        const data = {
          nombre: this.nombre,
          correo: this.correo,
          asunto: this.asunto,
          mensaje: this.mensaje,
        }

        const path = backendRouter.data + 'contactanos'
        await axios.post(path, data)

        this.nombre = ''
        this.correo = ''
        this.asunto = ''
        this.mensaje = ''

        this.$swal({
          title: 'Mensaje enviado con éxito',
          text: 'Gracias por contactarnos. Te responderemos pronto.',
          icon: 'success',
        })
      } catch (err) {
        console.error('Error contactanos:', err)
        this.$swal({
          title: 'No se pudo enviar',
          text: 'Inténtalo nuevamente más tarde.',
          icon: 'error',
        })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
/* Si solo ves gradiente: esto fuerza contenido visible por encima */
.page{
  --brand: #E11419;
  --muted: #f7f7f9;
  --text: #0f172a;
  --subtext: #64748b;
  --border: rgba(2, 6, 23, 0.10);
  --shadow-soft: 0 12px 26px rgba(2, 6, 23, 0.08);
  --radius: 18px;

  background: #fff;
  color: var(--text);
}

/* HERO */
.hero{
  position: relative;
  z-index: 0;
  min-height: 180px;
  padding: 2.2rem 0 1.2rem 0;
  background:
    radial-gradient(900px 260px at 30% 0%, rgba(225,20,25,0.14), transparent 55%),
    radial-gradient(800px 240px at 90% 40%, rgba(15,23,42,0.05), transparent 55%),
    #ffffff;
  border-bottom: 1px solid var(--border);
}

.hero-inner{
  position: relative;
  z-index: 2;
}

.hero-content{
  max-width: 860px;
}

.hero-kicker{
  margin: 0 0 8px 0;
  color: var(--subtext);
  font-weight: 900;
  letter-spacing: .08em;
  text-transform: uppercase;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
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
  font-size: clamp(24px, 2.6vw, 38px);
  line-height: 1.1;
}

.hero-subtitle{
  margin: 12px 0 0 0;
  color: var(--subtext);
  font-weight: 650;
  line-height: 1.7;
}

/* SECTION */
.section{
  padding: 2rem 0 3.2rem 0;
}

/* PANELS */
.panel{
  background: #fff;
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) + 6px);
  box-shadow: var(--shadow-soft);
  overflow: hidden;
  height: 100%;
}

.panel-head{
  padding: 18px 18px 14px 18px;
  border-bottom: 1px dashed rgba(2,6,23,0.10);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.panel-title{
  margin: 0;
  font-weight: 950;
  letter-spacing: -0.02em;
}

.panel-subtitle{
  margin: 6px 0 0 0;
  color: var(--subtext);
  font-weight: 650;
}

.badge-soft{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(225,20,25,0.08);
  color: var(--brand);
  border: 1px solid rgba(225,20,25,0.18);
  font-weight: 900;
  font-size: 12px;
}

form{
  padding: 0 18px 18px 18px;
}

.label{
  font-size: 12px;
  font-weight: 900;
  color: var(--subtext);
  letter-spacing: .04em;
  text-transform: uppercase;
}

.req{ color: var(--brand); }

.input{
  border-radius: 14px;
  border-color: rgba(2,6,23,0.14);
  font-weight: 650;
}

.input:focus{
  border-color: rgba(225,20,25,0.40);
  box-shadow: 0 0 0 0.2rem rgba(225,20,25,0.12);
}

.helper{
  display:flex;
  justify-content:space-between;
  gap: 10px;
  margin-top: 8px;
  font-size: 12px;
}
.muted{ color: var(--subtext); font-weight: 650; }
.warn{ color: #b45309; font-weight: 900; }
.ok{ color: #15803d; font-weight: 900; }

.btn-send{
  border-radius: 14px;
  font-weight: 900;
  padding: 10px 14px;
}

.disclaimer{
  color: var(--subtext);
  font-weight: 650;
  font-size: 12px;
}

/* RIGHT */
.panel-right .media{
  position: relative;
  height: 220px;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
}

.media-img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  display:block;
}

.media-badge{
  position:absolute;
  left: 12px;
  bottom: 12px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.90);
  border: 1px solid rgba(2,6,23,0.10);
  font-weight: 900;
  font-size: 12px;
  color: var(--text);
}

.info{
  padding: 14px 14px 16px 14px;
}

.info-title{
  margin: 0 0 10px 0;
  font-weight: 950;
  letter-spacing: -0.01em;
}

.info-row{
  display:flex;
  gap: 10px;
  align-items:center;
  padding: 10px 10px;
  border-radius: 16px;
  border: 1px solid rgba(2,6,23,0.08);
  background: rgba(2,6,23,0.02);
  margin-bottom: 10px;
}

.info-link{
  text-decoration: none;
  color: var(--text);
}
.info-link:hover{
  border-color: rgba(225,20,25,0.25);
  background: rgba(225,20,25,0.05);
}

.info-icon{
  width: 36px;
  height: 36px;
  border-radius: 14px;
  display:grid;
  place-items:center;
  background: rgba(225,20,25,0.10);
  color: var(--brand);
  flex: 0 0 auto;
  font-size: 16px;
}

.info-text{ display:block; }
.info-label{
  display:block;
  color: var(--subtext);
  font-weight: 800;
  font-size: 12px;
}
.info-value{
  display:block;
  font-weight: 950;
  font-size: 13px;
}

.socials{
  display:flex;
  gap: 10px;
  margin: 10px 0 8px 0;
}

.social{
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display:grid;
  place-items:center;
  border: 1px solid rgba(2,6,23,0.10);
  background: rgba(255,255,255,0.92);
  color: var(--subtext);
  text-decoration:none;
  transition: transform .2s ease, color .2s ease;
}
.social:hover{
  transform: translateY(-2px);
  color: var(--brand);
}

.tips{
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px dashed rgba(2,6,23,0.10);
}
.tips-title{
  margin: 0 0 10px 0;
  font-weight: 950;
  font-size: 14px;
}
.tips-list{
  list-style:none;
  padding: 0;
  margin: 0;
  display:grid;
  gap: 10px;
  color: var(--subtext);
  font-weight: 700;
  font-size: 13px;
}
.tip-dot{
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--brand);
  display:inline-block;
  margin-right: 10px;
  box-shadow: 0 0 0 6px rgba(225,20,25,0.10);
}

/* Responsive */
@media (max-width: 992px){
  .panel-right .media{ height: 260px; }
}
</style>
