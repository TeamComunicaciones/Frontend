<template>
  <header
    class="site-header"
    :class="{
      'is-scrolled': isScrolled,
      'menu-open': menuOpen
    }"
  >
    <!-- TOP BAR -->
    <div class="topbar">
      <div class="container topbar-inner">
        <div class="topbar-left">
          <a class="topbar-link" href="tel:+576046679" aria-label="Llamar">
            <IBiTelephone class="icon" />
            <span>(4) 6046679</span>
          </a>

          <span class="divider" aria-hidden="true">•</span>

          <a class="topbar-link" href="mailto:info@teamcomunicaciones.com" aria-label="Enviar correo">
            <IBiEnvelope class="icon" />
            <span class="truncate">info@teamcomunicaciones.com</span>
          </a>
        </div>

        <div class="topbar-right" aria-label="Redes sociales">
          <a class="social" target="_blank" rel="noopener"
             href="https://www.facebook.com/profile.php?id=100063664486789" aria-label="Facebook">
            <IBiFacebook />
          </a>
          <a class="social" target="_blank" rel="noopener"
             href="https://www.instagram.com/teamcomunicacionesclaro/?hl=es-la" aria-label="Instagram">
            <IBiInstagram />
          </a>
          <a class="social" target="_blank" rel="noopener"
             href="https://www.youtube.com/channel/UCMSAXcm2b4alOnpw_AzUC1g" aria-label="YouTube">
            <IBiYoutube />
          </a>
        </div>
      </div>
    </div>

    <!-- NAVBAR -->
    <div class="navbar-wrap">
      <div class="container navbar-inner">
        <a class="brand" href="/" aria-label="Inicio">
          <img class="brand-logo" :src="getImageUrl('logo.png')" alt="TEAM Comunicaciones" />
        </a>

        <nav class="navlinks d-none d-md-flex" aria-label="Navegación principal">
          <a class="navlink" href="/">Inicio</a>
          <a class="navlink" href="/asi-somos">Así somos</a>
          <a class="navlink" href="/tienda">Tienda</a>
          <a class="navlink navlink--cta" href="/contactanos">Contáctanos</a>
        </nav>

        <!-- Mobile button -->
        <button
          class="menu-btn d-md-none"
          type="button"
          @click="toggleMenu"
          :aria-expanded="menuOpen ? 'true' : 'false'"
          aria-label="Abrir menú"
        >
          <span class="menu-icon" :class="{ 'menu-icon--open': menuOpen }"></span>
        </button>
      </div>

      <!-- Mobile dropdown with transition -->
      <transition name="drop">
        <div v-if="menuOpen" class="mobile-nav d-md-none" @keydown.esc="closeMenu" tabindex="0">
          <div class="container mobile-inner">
            <a class="mobile-link" href="/" @click="closeMenu">Inicio</a>
            <a class="mobile-link" href="/asi-somos" @click="closeMenu">Así somos</a>
            <a class="mobile-link" href="/tienda" @click="closeMenu">Tienda</a>
            <a class="mobile-link mobile-link--cta" href="/contactanos" @click="closeMenu">Contáctanos</a>
          </div>
        </div>
      </transition>
    </div>

    <!-- Backdrop (cierra menú tocando fuera en móvil) -->
    <transition name="fade">
      <div v-if="menuOpen" class="backdrop" @click="closeMenu" aria-hidden="true"></div>
    </transition>
  </header>
</template>

<script>
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'

export default {
  name: 'LandingMenu',
  data() {
    return {
      menuOpen: false,
      isScrolled: false,
    }
  },
  mounted() {
    this.onScroll()
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('resize', this.onResize, { passive: true })
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    getImageUrl(name) {
      try {
        return new URL(`../../../assets/${name}`, import.meta.url).href
      } catch (e) {
        return 'https://placehold.co/220x80?text=Logo'
      }
    },
    onScroll() {
      this.isScrolled = window.scrollY > 8
      // Si quieres auto-cerrar el menú al scrollear en móvil:
      // if (this.menuOpen && window.scrollY > 40) this.menuOpen = false
    },
    onResize() {
      // al pasar a desktop, cerramos menú móvil
      if (window.innerWidth >= 768 && this.menuOpen) this.menuOpen = false
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen
    },
    closeMenu() {
      this.menuOpen = false
    },
  },
}
</script>

<style scoped>
/* ====== TOKENS ====== */
.site-header{
  --brand: #E11419;
  --text: #0f172a;
  --muted: #64748b;
  --border: rgba(2, 6, 23, 0.08);
  --shadow: 0 16px 34px rgba(2, 6, 23, 0.12);
  --shadow-soft: 0 10px 22px rgba(2, 6, 23, 0.08);
  --radius: 16px;

  position: sticky;
  top: 0;
  z-index: 1100;
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;

  /* entrada suave */
  animation: headerIn .5s ease-out both;
}

@keyframes headerIn{
  from { transform: translateY(-10px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}

/* ====== TOPBAR ====== */
.topbar{
  background: #fff;
  border-bottom: 1px solid var(--border);
  transition: height .25s ease, opacity .25s ease;
}

.topbar-inner{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
}

.topbar-left{
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  min-width: 0;
}

.topbar-link{
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--muted);
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .01em;
}

.topbar-link:hover{
  color: var(--text);
  text-decoration: underline;
}

.icon{ font-size: 14px; }
.divider{ color: rgba(2,6,23,0.28); font-size: 12px; }

.truncate{
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.topbar-right{
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.social{
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: 1px solid rgba(2,6,23,0.10);
  color: var(--muted);
  text-decoration: none;
  transition: transform .18s ease, box-shadow .18s ease, color .18s ease, border-color .18s ease;
  background: #fff;
}

.social:hover{
  color: var(--brand);
  border-color: rgba(225,20,25,0.35);
  transform: translateY(-1px);
  box-shadow: var(--shadow-soft);
}

/* ====== NAVBAR ====== */
.navbar-wrap{
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  transition: box-shadow .25s ease, padding .25s ease, background .25s ease;
}

.navbar-inner{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 0;
}

.brand{
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.brand-logo{
  height: 56px;
  width: auto;
  object-fit: contain;
  transition: height .25s ease, transform .25s ease;
}

.navlinks{
  display: flex;
  align-items: center;
  gap: 8px;
}

.navlink{
  text-decoration: none;
  color: var(--text);
  font-size: 13px;
  font-weight: 800;
  padding: 10px 12px;
  border-radius: 14px;
  transition: background .18s ease, transform .18s ease, color .18s ease;
}

.navlink:hover{
  background: rgba(2,6,23,0.04);
  transform: translateY(-1px);
}

.navlink--cta{
  background: var(--brand);
  color: #fff;
  box-shadow: 0 12px 22px rgba(225,20,25,0.18);
}

.navlink--cta:hover{
  background: #c71014;
  color: #fff;
}

/* ====== SCROLL STATE (shrink + shadow) ====== */
.site-header.is-scrolled .navbar-wrap{
  box-shadow: var(--shadow-soft);
  background: rgba(255,255,255,0.94);
}

.site-header.is-scrolled .navbar-inner{
  padding: 10px 0;
}

.site-header.is-scrolled .brand-logo{
  height: 48px;
}

/* En móvil, compactamos la topbar al scrollear */
@media (max-width: 576px){
  .site-header.is-scrolled .topbar{
    opacity: 0;
    height: 0;
    overflow: hidden;
    border-bottom: none;
  }
}

/* ====== MOBILE MENU ====== */
.menu-btn{
  border: 1px solid rgba(2,6,23,0.12);
  background: #fff;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  box-shadow: var(--shadow-soft);
  transition: transform .18s ease, box-shadow .18s ease;
}

.menu-btn:active{
  transform: scale(0.98);
}

.menu-icon{
  width: 18px;
  height: 2px;
  background: var(--text);
  position: relative;
  display: block;
  transition: background .18s ease;
}

.menu-icon::before,
.menu-icon::after{
  content: "";
  position: absolute;
  left: 0;
  width: 18px;
  height: 2px;
  background: var(--text);
  transition: transform .18s ease, top .18s ease;
}

.menu-icon::before{ top: -6px; }
.menu-icon::after{ top: 6px; }

.menu-icon--open{
  background: transparent;
}
.menu-icon--open::before{
  top: 0;
  transform: rotate(45deg);
}
.menu-icon--open::after{
  top: 0;
  transform: rotate(-45deg);
}

.mobile-nav{
  position: relative;
  background: #fff;
  border-top: 1px solid var(--border);
  box-shadow: var(--shadow-soft);
}

.mobile-inner{
  padding: 12px 0 16px 0;
  display: grid;
  gap: 10px;
}

.mobile-link{
  text-decoration: none;
  color: var(--text);
  font-weight: 900;
  padding: 12px 12px;
  border-radius: 16px;
  border: 1px solid rgba(2,6,23,0.08);
  background: #fff;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}

.mobile-link:hover{
  transform: translateY(-1px);
  box-shadow: var(--shadow-soft);
  border-color: rgba(2,6,23,0.14);
}

.mobile-link--cta{
  border-color: rgba(225,20,25,0.35);
  background: rgba(225,20,25,0.08);
  color: var(--brand);
}

/* backdrop */
.backdrop{
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.35);
  z-index: -1; /* queda detrás del header, pero encima del contenido */
}

/* transitions */
.drop-enter-active, .drop-leave-active{
  transition: transform .22s ease, opacity .22s ease;
}
.drop-enter-from, .drop-leave-to{
  transform: translateY(-8px);
  opacity: 0;
}

.fade-enter-active, .fade-leave-active{
  transition: opacity .18s ease;
}
.fade-enter-from, .fade-leave-to{
  opacity: 0;
}

/* small */
@media (max-width: 576px){
  .divider{ display:none; }
  .truncate{ max-width: 170px; }
}
</style>
