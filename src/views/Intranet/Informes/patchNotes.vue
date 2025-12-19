<template>
  <div class="release-page">
    <MenuLanding />
    <Carrito />

    <!-- HERO -->
    <header class="hero">
      <div class="container hero-inner">
        <div class="hero-left">
          <span class="hero-badge">
            <span class="dot" aria-hidden="true"></span>
            Notas de versión
          </span>

          <h1 class="hero-title">Cambios y mejoras del sistema</h1>
          <p class="hero-subtitle">
            Historial de versiones, mejoras visuales y cambios funcionales. Mantén trazabilidad del producto.
          </p>

          <div class="hero-meta">
            <span class="meta-pill">
              <i class="bi bi-calendar3 me-2"></i>
              Última actualización: <strong>19 de diciembre de 2025</strong>
            </span>
            <span class="meta-pill">
              <i class="bi bi-shield-check me-2"></i>
              Formato profesional y legible
            </span>
          </div>
        </div>

        <div class="hero-right">
          <div class="search-card">
            <label class="search-label">Buscar en notas</label>
            <div class="input-group">
              <span class="input-group-text bg-white border-0 pe-1">
                <i class="bi bi-search"></i>
              </span>
              <input
                v-model="q"
                type="search"
                class="form-control border-0 ps-1"
                placeholder="Ej: carrito, footer, diseño, seguridad..."
              />
            </div>

            <div class="search-hint">
              Mostrando <strong>{{ filteredVersions.length }}</strong> versión(es)
            </div>
          </div>

          <div class="quick-actions">
            <button class="btn btn-outline-light btn-sm" type="button" @click="expandLatest">
              <i class="bi bi-lightning-charge me-2"></i> Abrir última versión
            </button>
            <button class="btn btn-outline-light btn-sm" type="button" @click="expandAll">
              <i class="bi bi-arrows-expand me-2"></i> Expandir todo
            </button>
            <button class="btn btn-outline-light btn-sm" type="button" @click="collapseAll">
              <i class="bi bi-arrows-collapse me-2"></i> Colapsar todo
            </button>
          </div>
        </div>
      </div>

      <div class="hero-glow" aria-hidden="true"></div>
    </header>

    <!-- CONTENT -->
    <main class="container content">
      <!-- Timeline / cards -->
      <section class="versions">
        <article
          v-for="(v, idx) in filteredVersions"
          :key="v.id"
          class="version-card"
        >
          <button class="version-head" type="button" @click="toggle(v.id)">
            <div class="head-left">
              <div class="marker" aria-hidden="true"></div>

              <div class="title-wrap">
                <div class="kicker">
                  <span class="ver">Versión {{ v.version }}</span>
                  <span class="sep" aria-hidden="true">•</span>
                  <span class="date">{{ v.date }}</span>

                  <span v-if="idx === 0" class="chip chip-new">
                    <i class="bi bi-stars me-1"></i> NUEVO
                  </span>
                </div>

                <h2 class="v-title">{{ v.title }}</h2>

                <p class="v-summary">
                  {{ v.summary }}
                </p>
              </div>
            </div>

            <div class="head-right">
              <span class="chip chip-count">
                {{ v.items.length }} cambio(s)
              </span>
              <span class="chev" :class="{ open: isOpen(v.id) }" aria-hidden="true">
                <i class="bi bi-chevron-down"></i>
              </span>
            </div>
          </button>

          <transition name="expand">
            <div v-if="isOpen(v.id)" class="version-body">
              <div class="body-grid">
                <div class="body-main">
                  <h3 class="body-title">
                    <i class="bi bi-list-check me-2"></i> Detalle de cambios
                  </h3>

                  <ul class="changes">
                    <li v-for="(item, i) in v.items" :key="i" class="change">
                      <span class="bullet" aria-hidden="true"></span>
                      <span class="change-text">{{ item }}</span>
                    </li>
                  </ul>
                </div>

                <aside class="body-side">
                  <div class="side-card">
                    <h4 class="side-title">
                      <i class="bi bi-info-circle me-2"></i> Información
                    </h4>
                    <div class="side-row">
                      <span class="label">Tipo</span>
                      <span class="value">{{ v.type }}</span>
                    </div>
                    <div class="side-row">
                      <span class="label">Enfoque</span>
                      <span class="value">{{ v.focus }}</span>
                    </div>
                    <div class="side-row">
                      <span class="label">Compatibilidad</span>
                      <span class="value">Web responsive</span>
                    </div>

                    <button class="btn btn-danger btn-sm w-100 mt-3" type="button" @click="copyVersion(v)">
                      <i class="bi bi-copy me-2"></i> Copiar resumen
                    </button>

                    <p v-if="copiedId === v.id" class="copy-ok">
                      <i class="bi bi-check2-circle me-2"></i> Copiado al portapapeles
                    </p>
                  </div>
                </aside>
              </div>
            </div>
          </transition>
        </article>

        <div v-if="filteredVersions.length === 0" class="empty">
          <div class="empty-card">
            <i class="bi bi-search me-2"></i>
            No encontramos resultados con “<strong>{{ q }}</strong>”.
          </div>
        </div>
      </section>
    </main>

    <FooterLanding />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

import MenuLanding from '@/components/MainPage/MenuLanding/MenuLanding.vue'
import Carrito from '@/components/MainPage/Carrito/Carrito.vue'
import FooterLanding from '@/components/Landing/FooterLanding/FooterLanding.vue'

const q = ref('')
const openIds = ref(new Set())
const copiedId = ref(null)

/**
 * ✅ Datos
 * - Incluye la entrada de HOY con lo que trabajamos en estas sesiones.
 * - Mantiene la versión anterior que ya tenías.
 */
const versions = ref([
  {
    id: 'v1_7',
    version: '1.7',
    date: '19 de diciembre de 2025',
    title: 'Mejoras visuales, estructura y consistencia de UI',
    summary:
      'Se modernizaron vistas tipo landing, se consolidó la estructura con footer y se mejoró la experiencia de navegación y consistencia visual.',
    type: 'Mejora UI/UX',
    focus: 'Diseño + consistencia + usabilidad',
    items: [
      'Mejora visual de vistas tipo landing: jerarquía tipográfica, espaciados, tarjetas y apariencia más “premium” manteniendo compatibilidad con Bootstrap.',
      'Integración y estandarización de estructura de página con Header + contenido + Footer usando los imports oficiales del proyecto (MenuLanding + FooterLanding).',
      'Mejoras de consistencia visual: tokens de diseño (color marca #DF1115), bordes suaves, sombras y radios coherentes entre vistas.',
      'Fortalecimiento del helper getImageUrl con manejo de fallos y fallback para evitar pantallas en blanco por assets faltantes o rutas inválidas.',
      'Ajustes de responsive para mantener legibilidad en móvil/tablet (grids, alturas, padding, y lectura de secciones).',
      'Mejoras del flujo de carrito: persistencia con localStorage, actualización de totales, render por producto con cantidad/total y envío por WhatsApp con detalle de ítems.',
      'Mejoras de integración “Tienda → Carrito” usando referencia de componente para agregar productos y formateo de moneda COP (es-CO).',
      'Estandarización del estilo de documentos largos (páginas legales): layout tipo documento, mejor legibilidad y navegación interna.',
      'Mejora de navegación por scroll con lógica de sección activa (para páginas extensas) y mejor orientación del usuario.'
    ],
  },
  {
    id: 'v1_6',
    version: '1.6',
    date: '9 de mayo de 2025',
    title: 'Reestructuración de interfaz y estandarización',
    summary:
      'Se reestructuró interfaz del módulo corresponsal, se estandarizaron tipografías, se mejoró móvil y se homologó SCSS y JWT.',
    type: 'Refactor UI + base técnica',
    focus: 'Interfaz + estructura + mantenimiento',
    items: [
      'Reestructuración completa de la interfaz del módulo de corresponsal (roles informe y cajero). Optimización visual de tablas con criterios de usabilidad (colores, tipografías, jerarquía visual).',
      'Estandarización del uso de fuentes tipográficas en toda la aplicación para coherencia visual y profesionalismo.',
      'Rediseño de la vista general para dispositivos móviles, mejorando navegación y responsividad.',
      'Homologación del uso de SCSS en todos los módulos para facilitar mantenimiento y escalabilidad del diseño.',
      'Consolidación de autenticación JWT centralizando la lógica en un único archivo de servicios (service.js) para mejor organización y seguridad.'
    ],
  },
])

const filteredVersions = computed(() => {
  const s = (q.value || '').trim().toLowerCase()
  if (!s) return versions.value

  return versions.value.filter((v) => {
    const blob = [
      v.version,
      v.date,
      v.title,
      v.summary,
      v.type,
      v.focus,
      ...v.items
    ].join(' ').toLowerCase()
    return blob.includes(s)
  })
})

const isOpen = (id) => openIds.value.has(id)

const toggle = (id) => {
  const next = new Set(openIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  openIds.value = next
}

const expandLatest = () => {
  const first = filteredVersions.value?.[0]?.id
  if (!first) return
  openIds.value = new Set([first])
}

const expandAll = () => {
  openIds.value = new Set(filteredVersions.value.map((v) => v.id))
}

const collapseAll = () => {
  openIds.value = new Set()
}

const copyVersion = async (v) => {
  const text =
    `Versión ${v.version} - ${v.date}\n` +
    `${v.title}\n` +
    `${v.summary}\n\n` +
    `Cambios:\n- ` +
    v.items.join('\n- ')

  try {
    await navigator.clipboard.writeText(text)
    copiedId.value = v.id
    setTimeout(() => {
      if (copiedId.value === v.id) copiedId.value = null
    }, 1600)
  } catch (e) {
    // fallback ultra simple
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    copiedId.value = v.id
    setTimeout(() => {
      if (copiedId.value === v.id) copiedId.value = null
    }, 1600)
  }
}
</script>

<style scoped>
/* Página */
.release-page{
  --brand: #DF1115;
  --text: #0f172a;
  --subtext: #64748b;
  --muted: #f7f7f9;
  --border: rgba(2,6,23,.10);
  --shadow: 0 18px 40px rgba(2,6,23,.12);
  --shadow-soft: 0 12px 26px rgba(2,6,23,.08);
  --radius: 18px;
  background: #fff;
  color: var(--text);
}

/* HERO */
.hero{
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at 10% 10%, rgba(223,17,21,.20), transparent 40%),
              radial-gradient(circle at 90% 20%, rgba(223,17,21,.10), transparent 45%),
              linear-gradient(180deg, #111827, #0b1220);
  color: #fff;
  border-bottom: 1px solid rgba(255,255,255,.10);
}
.hero-inner{
  padding: 34px 0 28px 0;
  display: grid;
  grid-template-columns: 1.2fr .8fr;
  gap: 18px;
  align-items: start;
}
.hero-badge{
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,.10);
  border: 1px solid rgba(255,255,255,.16);
  font-weight: 800;
  font-size: 12px;
  letter-spacing: .06em;
  text-transform: uppercase;
}
.dot{
  width: 8px; height: 8px;
  border-radius: 999px;
  background: var(--brand);
  box-shadow: 0 0 0 4px rgba(223,17,21,.18);
}
.hero-title{
  margin: 12px 0 0 0;
  font-weight: 900;
  letter-spacing: -0.03em;
  font-size: 34px;
  line-height: 1.08;
}
.hero-subtitle{
  margin: 10px 0 0 0;
  color: rgba(255,255,255,.78);
  font-weight: 600;
  line-height: 1.6;
}
.hero-meta{
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.meta-pill{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.14);
  color: rgba(255,255,255,.86);
  font-weight: 600;
  font-size: 13px;
}

/* Search panel */
.search-card{
  background: rgba(255,255,255,.10);
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 18px;
  padding: 14px;
  backdrop-filter: blur(10px);
  box-shadow: 0 18px 40px rgba(0,0,0,.18);
}
.search-label{
  display:block;
  font-weight: 800;
  font-size: 12px;
  color: rgba(255,255,255,.75);
  margin-bottom: 6px;
  letter-spacing: .06em;
  text-transform: uppercase;
}
.input-group{
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
}
.form-control:focus{
  box-shadow: none;
}
.search-hint{
  margin-top: 8px;
  color: rgba(255,255,255,.75);
  font-weight: 600;
  font-size: 13px;
}

/* Quick actions */
.quick-actions{
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}
.btn-outline-light{
  border-color: rgba(255,255,255,.22) !important;
}

/* subtle glow */
.hero-glow{
  position: absolute;
  inset: -30% -20%;
  background: radial-gradient(circle at 50% 40%, rgba(223,17,21,.18), transparent 50%);
  pointer-events: none;
}

/* CONTENT */
.content{
  padding: 26px 0 40px 0;
}
.versions{
  display: grid;
  gap: 14px;
}

/* Version card */
.version-card{
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) + 4px);
  background: #fff;
  box-shadow: var(--shadow-soft);
  overflow: hidden;
}
.version-head{
  width: 100%;
  text-align: left;
  background: #fff;
  border: none;
  padding: 16px 16px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.version-head:hover{
  background: rgba(2,6,23,.02);
}
.head-left{
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.marker{
  width: 14px;
  height: 14px;
  border-radius: 999px;
  margin-top: 6px;
  background: var(--brand);
  box-shadow: 0 0 0 6px rgba(223,17,21,.10);
}
.kicker{
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  color: var(--subtext);
  font-weight: 800;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .06em;
}
.sep{ opacity: .6; }
.v-title{
  margin: 6px 0 0 0;
  font-weight: 900;
  letter-spacing: -0.02em;
  font-size: 18px;
  color: var(--text);
}
.v-summary{
  margin: 8px 0 0 0;
  color: var(--subtext);
  font-weight: 600;
  line-height: 1.55;
  max-width: 78ch;
}

.head-right{
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
}
.chip{
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 12px;
  border: 1px solid var(--border);
  background: rgba(2,6,23,.02);
  color: var(--text);
}
.chip-new{
  background: rgba(223,17,21,.10);
  border-color: rgba(223,17,21,.20);
  color: var(--brand);
}
.chip-count{
  background: rgba(2,6,23,.02);
}
.chev{
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: #fff;
  transition: transform .18s ease;
}
.chev.open{
  transform: rotate(180deg);
}

/* Body */
.version-body{
  border-top: 1px solid rgba(2,6,23,.06);
  padding: 14px 16px 16px 16px;
}
.body-grid{
  display: grid;
  grid-template-columns: 1.2fr .8fr;
  gap: 12px;
  align-items: start;
}
.body-title{
  margin: 0 0 10px 0;
  font-weight: 900;
  color: var(--text);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: .06em;
}
.changes{
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}
.change{
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 10px 12px;
  border-radius: 16px;
  border: 1px solid rgba(2,6,23,.08);
  background: rgba(2,6,23,.02);
}
.bullet{
  width: 10px;
  height: 10px;
  border-radius: 999px;
  margin-top: 6px;
  background: var(--brand);
  box-shadow: 0 0 0 4px rgba(223,17,21,.12);
  flex: 0 0 auto;
}
.change-text{
  color: var(--text);
  font-weight: 600;
  line-height: 1.55;
  font-size: 14px;
}

/* Side */
.side-card{
  border: 1px solid rgba(2,6,23,.08);
  background: #fff;
  border-radius: 18px;
  box-shadow: var(--shadow-soft);
  padding: 12px;
}
.side-title{
  margin: 0 0 10px 0;
  font-weight: 900;
  font-size: 14px;
  color: var(--text);
  text-transform: uppercase;
  letter-spacing: .06em;
}
.side-row{
  display:flex;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px dashed rgba(2,6,23,.10);
}
.side-row:last-of-type{
  border-bottom: none;
}
.label{
  color: var(--subtext);
  font-weight: 700;
  font-size: 13px;
}
.value{
  color: var(--text);
  font-weight: 800;
  font-size: 13px;
  text-align: right;
}
.copy-ok{
  margin: 10px 0 0 0;
  color: #0a7a38;
  font-weight: 800;
  font-size: 13px;
}

/* Empty */
.empty{
  padding: 8px 0;
}
.empty-card{
  border: 1px dashed rgba(2,6,23,.18);
  border-radius: 18px;
  padding: 14px;
  background: rgba(2,6,23,.02);
  color: var(--subtext);
  font-weight: 700;
}

/* Transition */
.expand-enter-active, .expand-leave-active{
  transition: max-height .22s ease, opacity .22s ease, transform .22s ease;
}
.expand-enter-from, .expand-leave-to{
  max-height: 0;
  opacity: 0;
  transform: translateY(-6px);
}
.expand-enter-to, .expand-leave-from{
  max-height: 1000px;
  opacity: 1;
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 992px){
  .hero-inner{ grid-template-columns: 1fr; }
  .body-grid{ grid-template-columns: 1fr; }
}
@media (max-width: 576px){
  .hero-title{ font-size: 26px; }
  .version-head{ padding: 14px; }
  .version-body{ padding: 12px 14px 14px 14px; }
}
</style>
