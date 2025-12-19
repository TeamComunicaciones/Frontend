<template>
  <footer class="footer">
    <!-- CTA final (opcional pero bonito) -->
    <section class="footer-cta">
      <div class="container cta-inner">
        <div class="cta-copy">
          <h3 class="cta-title">¿Listo para empezar?</h3>
          <p class="cta-subtitle">Compra tu plan o consulta TAT en segundos.</p>
        </div>

        <div class="cta-actions">
          <a class="btn btn-danger btn-lg cta-btn" href="/tienda">
            <i class="bi bi-bag me-2"></i> Ir a la tienda
          </a>
          <a class="btn btn-outline-light btn-lg cta-btn" href="/consulta-pdv">
            <i class="bi bi-graph-up me-2"></i> Consultas TAT
          </a>
        </div>
      </div>
    </section>

    <!-- Contenido -->
    <section class="footer-main">
      <div class="container grid">
        <!-- Brand -->
        <div class="col brand">
          <a class="brand-link" href="/" aria-label="Inicio">
            <img class="brand-logo" :src="getImageUrl('logo.png')" alt="TEAM Comunicaciones" />
          </a>
          <p class="brand-text">
            Plataforma de planes, productos y consultas. Diseñada para una experiencia rápida y clara.
          </p>

          <div class="socials" aria-label="Redes sociales">
            <a
              class="social"
              target="_blank"
              rel="noopener"
              href="https://www.facebook.com/profile.php?id=100063664486789"
              aria-label="Facebook"
            >
              <IBiFacebook />
            </a>
            <a
              class="social"
              target="_blank"
              rel="noopener"
              href="https://www.instagram.com/teamcomunicacionesclaro/?hl=es-la"
              aria-label="Instagram"
            >
              <IBiInstagram />
            </a>
            <a
              class="social"
              target="_blank"
              rel="noopener"
              href="https://www.youtube.com/channel/UCMSAXcm2b4alOnpw_AzUC1g"
              aria-label="YouTube"
            >
              <IBiYoutube />
            </a>
          </div>
        </div>

        <!-- Links -->
        <div class="col">
          <h4 class="col-title">Navegación</h4>
          <nav class="links" aria-label="Links">
            <a class="link" href="/">Inicio</a>
            <a class="link" href="/asi-somos">Así somos</a>
            <a class="link" href="/tienda">Tienda</a>
            <a class="link" href="/contactanos">Contáctanos</a>
          </nav>
        </div>

        <!-- Ayuda -->
        <div class="col">
          <h4 class="col-title">Ayuda</h4>
          <nav class="links" aria-label="Ayuda">
            <a class="link" href="/login">Iniciar sesión</a>
            <a class="link" href="/consulta-pdv">Consultas TAT</a>
            <a class="link" href="/tienda">Comprar planes</a>
            <a class="link" href="/Formulario-Denuncias">Línea de Transparencia</a>
            <a class="link" href="/politicas-privacidad">Políticas de Privacidad</a>
            <a class="link" href="/tratamiento-datos">Tratamiento de Datos Personales</a>
          </nav>
        </div>

        <!-- Contacto -->
        <div class="col">
          <h4 class="col-title">Contacto</h4>

          <div class="contact">
            <a class="contact-item" href="tel:+576046679" aria-label="Teléfono">
              <IBiTelephone class="icon" />
              <span>(4) 6046679</span>
            </a>

            <a class="contact-item" href="mailto:info@teamcomunicaciones.com" aria-label="Email">
              <IBiEnvelope class="icon" />
              <span class="truncate">info@teamcomunicaciones.com</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom bar -->
    <div class="footer-bottom">
      <div class="container bottom-inner">
        <span>© {{ year }} TEAM Comunicaciones</span>
        <span class="dot" aria-hidden="true">•</span>
        <span class="muted">Todos los derechos reservados</span>
        <span class="muted"><a class="link" href="/patch-notes">Notas de versión</a></span>
      </div>
    </div>
  </footer>
</template>

<script>
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'

export default {
  name: 'FooterLanding',
  computed: {
    year() {
      return new Date().getFullYear()
    },
  },
  methods: {
    getImageUrl(name) {
      try {
        return new URL(`../../../assets/${name}`, import.meta.url).href
      } catch (e) {
        return 'https://placehold.co/220x80?text=Logo'
      }
    },
    scrollTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  },
}
</script>

<style scoped>
.footer{
  --brand: #E11419;
  --text: #0f172a;
  --muted: #94a3b8;
  --border: rgba(255,255,255,0.12);
  --shadow: 0 18px 40px rgba(2, 6, 23, 0.20);

  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  color: #fff;
  background: #0b1220;
  overflow: hidden;
}

/* CTA */
.footer-cta{
  background: radial-gradient(circle at 20% 20%, rgba(225,20,25,0.35), transparent 45%),
              radial-gradient(circle at 85% 10%, rgba(255,255,255,0.10), transparent 40%),
              linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0));
  border-bottom: 1px solid var(--border);
}

.cta-inner{
  padding: 28px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.cta-title{
  margin: 0;
  font-weight: 900;
  letter-spacing: -0.02em;
}
.cta-subtitle{
  margin: 6px 0 0 0;
  color: rgba(255,255,255,0.78);
  font-weight: 600;
}

.cta-actions{
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.cta-btn{
  border-radius: 14px;
  box-shadow: var(--shadow);
  transition: transform .18s ease, box-shadow .18s ease;
}
.cta-btn:hover{
  transform: translateY(-2px);
  box-shadow: 0 22px 50px rgba(2,6,23,0.28);
}

/* Main grid */
.footer-main{
  padding: 32px 0;
}

.grid{
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
  gap: 18px;
  align-items: start;
}

@media (max-width: 992px){
  .grid{ grid-template-columns: 1fr 1fr; }
}
@media (max-width: 576px){
  .grid{ grid-template-columns: 1fr; }
}

.brand-logo{
  height: 54px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1); /* si tu logo es oscuro */
  opacity: 0.95;
}
.brand-text{
  margin: 12px 0 0 0;
  color: rgba(255,255,255,0.78);
  font-weight: 600;
  line-height: 1.5;
  max-width: 44ch;
}

.col-title{
  margin: 0 0 10px 0;
  font-weight: 900;
  letter-spacing: -0.01em;
}

.links{
  display: grid;
  gap: 8px;
}
.link{
  color: rgba(255,255,255,0.78);
  text-decoration: none;
  font-weight: 700;
  transition: color .18s ease, transform .18s ease;
}
.link:hover{
  color: #fff;
  transform: translateX(2px);
}

/* socials */
.socials{
  margin-top: 14px;
  display: flex;
  gap: 10px;
}
.social{
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 1px solid var(--border);
  color: rgba(255,255,255,0.82);
  text-decoration: none;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}
.social:hover{
  transform: translateY(-2px);
  border-color: rgba(225,20,25,0.45);
  box-shadow: 0 18px 40px rgba(0,0,0,0.32);
  color: #fff;
}

/* contact */
.contact{
  display: grid;
  gap: 10px;
}
.contact-item{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(255,255,255,0.82);
  text-decoration: none;
  font-weight: 700;
}
.contact-item:hover{
  color: #fff;
  text-decoration: underline;
}
.icon{ font-size: 16px; }
.truncate{
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* back to top */
.top-btn{
  margin-top: 14px;
  width: 100%;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.06);
  color: #fff;
  font-weight: 900;
  padding: 10px 12px;
  transition: transform .18s ease, background .18s ease, border-color .18s ease;
}
.top-btn:hover{
  transform: translateY(-1px);
  background: rgba(255,255,255,0.10);
  border-color: rgba(255,255,255,0.18);
}

/* bottom */
.footer-bottom{
  border-top: 1px solid var(--border);
  background: rgba(255,255,255,0.02);
}
.bottom-inner{
  padding: 14px 0;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  color: rgba(255,255,255,0.70);
  font-weight: 700;
  font-size: 12px;
}
.dot{ opacity: 0.65; }
.muted{ opacity: 0.75; }
</style>
