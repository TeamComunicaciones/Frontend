<template>
  <div class="page">
    <MenuLanding />
    <Carrito />

    <!-- HERO -->
    <header class="policy-hero">
      <div class="container policy-container">
        <div class="hero-card">
          <div class="hero-badge">
            <i class="bi bi-shield-lock me-2"></i>
            TEAM COMUNICACIONES
          </div>

          <h1 class="hero-title">Políticas de Privacidad</h1>
          <p class="hero-subtitle">
            Conoce cómo recopilamos, usamos y protegemos tus datos personales, y cómo ejercer tus derechos como titular.
          </p>

          <div class="hero-meta">
            <span class="meta-pill">
              <i class="bi bi-clock me-2"></i>
              Vigente
            </span>
            <span class="meta-pill">
              <i class="bi bi-envelope me-2"></i>
              soporte@teamcomunicaciones.com
            </span>
            <span class="meta-pill">
              <i class="bi bi-telephone me-2"></i>
              (604) 6046679
            </span>
          </div>
        </div>
      </div>
    </header>

    <!-- BODY -->
    <main class="policy-body">
      <div class="container policy-container">
        <div class="row g-4">
          <!-- TOC -->
          <aside class="col-lg-4">
            <div class="toc-card">
              <div class="toc-title">
                <i class="bi bi-list-ul me-2"></i>
                Contenido
              </div>

              <nav class="toc-nav" aria-label="Tabla de contenido">
                <button
                  v-for="s in toc"
                  :key="s.id"
                  type="button"
                  class="toc-link"
                  :class="{ active: activeId === s.id }"
                  @click="scrollToSection(s.id)"
                >
                  <span class="toc-num">{{ s.num }}</span>
                  <span class="toc-text">{{ s.label }}</span>
                </button>
              </nav>

              <div class="toc-foot">
                <p class="toc-note">
                  Si deseas ejercer tus derechos como titular, escríbenos a:
                </p>
                <a class="toc-mail" href="mailto:soporte@teamcomunicaciones.com">
                  soporte@teamcomunicaciones.com
                </a>
              </div>
            </div>
          </aside>

          <!-- CONTENT -->
          <section class="col-lg-8">
            <div class="content-card">
              <article
                v-for="sec in toc"
                :key="sec.id"
                class="section-block"
                :id="sec.id"
                ref="sectionRefs"
              >
                <header class="section-head">
                  <div class="section-badge">{{ sec.num }}</div>
                  <div>
                    <h2 class="section-title">{{ sec.title }}</h2>
                    <p v-if="sec.lead" class="section-lead">{{ sec.lead }}</p>
                  </div>
                </header>

                <!-- 1 -->
                <div v-if="sec.id === 'sec-1'" class="section-body">
                  <p>
                    <strong>Razón social:</strong> TEAM COMUNICACIONES<br />
                    <strong>NIT:</strong> 900.206.408-1<br />
                    <strong>Dirección:</strong> Av. 33 #65c - 47, Medellín, Belén, Medellín.<br />
                    <strong>Correo electrónico:</strong> soporte@teamcomunicaciones.com<br />
                    <strong>Teléfono:</strong> (604) 6046679
                  </p>
                </div>

                <!-- 2 -->
                <div v-else-if="sec.id === 'sec-2'" class="section-body">
                  <p>
                    Recopilamos información personal de manera directa (a través de formularios, contratos o
                    interacciones en nuestros puntos de atención) o indirecta (a través de herramientas digitales y
                    plataformas). Los datos personales que tratamos incluyen, pero no se limitan a:
                  </p>
                  <ul class="nice-list">
                    <li>Nombre completo.</li>
                    <li>Tipo y número de documento de identidad.</li>
                    <li>Información de contacto: dirección, correo electrónico y número de teléfono.</li>
                    <li>Información contractual, como detalles de los servicios adquiridos.</li>
                    <li>Datos de facturación y pago.</li>
                    <li>Información socioeconómica (cuando sea necesaria para brindar ciertos servicios).</li>
                  </ul>
                </div>

                <!-- 3 -->
                <div v-else-if="sec.id === 'sec-3'" class="section-body">
                  <p>Los datos personales serán tratados únicamente para las siguientes finalidades:</p>
                  <ul class="nice-list">
                    <li>Gestionar la relación comercial y contractual con los clientes.</li>
                    <li>Ofrecer, prestar y realizar soporte técnico para los servicios móviles y de hogar de Claro.</li>
                    <li>Procesar pagos, emitir facturas y manejar obligaciones contractuales.</li>
                    <li>
                      Informar sobre promociones, ofertas, campañas y novedades de los productos y servicios ofrecidos
                      por Claro y TEAM COMUNICACIONES.
                    </li>
                    <li>Realizar estudios de mercado y encuestas para mejorar nuestros productos y servicios.</li>
                    <li>Cumplir con obligaciones legales, regulatorias y contractuales.</li>
                  </ul>
                  <p>
                    En caso de realizar un tratamiento diferente al indicado, se solicitará autorización expresa al
                    titular de los datos personales.
                  </p>
                </div>

                <!-- 4 -->
                <div v-else-if="sec.id === 'sec-4'" class="section-body">
                  <p>De acuerdo con la normativa vigente en Colombia, los titulares de los datos personales tienen los siguientes derechos:</p>
                  <ul class="nice-list">
                    <li>Acceder a la información personal que hemos recopilado.</li>
                    <li>Conocer, actualizar y rectificar sus datos.</li>
                    <li>
                      Solicitar la eliminación de sus datos personales cuando no sean necesarios o se haya superado la
                      finalidad para la cual fueron recolectados.
                    </li>
                    <li>Revocar la autorización otorgada para el tratamiento de sus datos personales.</li>
                    <li>
                      Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) en caso de considerar vulnerados sus derechos.
                    </li>
                  </ul>
                  <p>
                    Para ejercer estos derechos, puede comunicarse con nosotros a través del correo electrónico:
                    <a class="link" href="mailto:soporte@teamcomunicaciones.com">soporte@teamcomunicaciones.com</a>.
                  </p>
                </div>

                <!-- 5 -->
                <div v-else-if="sec.id === 'sec-5'" class="section-body">
                  <p>
                    TEAM COMUNICACIONES podrá compartir los datos personales de sus titulares con Claro Colombia, en calidad de distribuidora oficial, para el cumplimiento de las finalidades relacionadas con la prestación de servicios. Asimismo, podrá compartir datos con aliados estratégicos, proveedores y autoridades competentes, siempre garantizando la protección de la información conforme a la legislación vigente.
                  </p>
                  <p>Los datos personales no serán vendidos, alquilados ni utilizados para fines no autorizados.</p>
                </div>

                <!-- 6 -->
                <div v-else-if="sec.id === 'sec-6'" class="section-body">
                  <p>
                    En TEAM COMUNICACIONES implementamos medidas técnicas, organizativas y de seguridad informática para garantizar la protección de los datos personales contra acceso no autorizado, pérdida, uso indebido, alteración o destrucción.
                  </p>
                  <p>
                    No obstante, el titular es responsable de mantener la confidencialidad de sus credenciales de acceso a nuestros sistemas, en caso de que aplique.
                  </p>
                </div>

                <!-- 7 -->
                <div v-else-if="sec.id === 'sec-7'" class="section-body">
                  <p>
                    Los datos personales serán almacenados únicamente durante el tiempo necesario para cumplir con las finalidades del tratamiento o mientras exista una obligación legal o contractual que lo exija.
                  </p>
                </div>

                <!-- 8 -->
                <div v-else-if="sec.id === 'sec-8'" class="section-body">
                  <p>
                    TEAM COMUNICACIONES se reserva el derecho de modificar estas políticas en cualquier momento. Las actualizaciones serán publicadas a través de los canales oficiales de la empresa.
                  </p>
                </div>

                <!-- 9 -->
                <div v-else-if="sec.id === 'sec-9'" class="section-body">
                  <p>Si tiene alguna duda o desea obtener más información sobre nuestras políticas de privacidad, puede contactarnos a través de:</p>
                  <ul class="nice-list">
                    <li>
                      Correo electrónico:
                      <a class="link" href="mailto:soporte@teamcomunicaciones.com">soporte@teamcomunicaciones.com</a>
                    </li>
                    <li>Teléfono: (604) 6046679</li>
                  </ul>
                  <p>En TEAM COMUNICACIONES, su privacidad es nuestra prioridad.</p>
                </div>

                <div class="divider" aria-hidden="true"></div>
              </article>
            </div>
          </section>
        </div>
      </div>
    </main>

    <FooterLanding />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

import MenuLanding from '@/components/MainPage/MenuLanding/MenuLanding.vue'
import Carrito from '@/components/MainPage/Carrito/Carrito.vue'
import FooterLanding from '@/components/Landing/FooterLanding/FooterLanding.vue'

const toc = [
  { id: 'sec-1', num: '1', label: 'Responsable del tratamiento', title: '1. Responsable del Tratamiento de Datos Personales' },
  { id: 'sec-2', num: '2', label: 'Información que recopilamos', title: '2. Información que Recopilamos' },
  { id: 'sec-3', num: '3', label: 'Finalidades del tratamiento', title: '3. Finalidades del Tratamiento' },
  { id: 'sec-4', num: '4', label: 'Derechos de los titulares', title: '4. Derechos de los Titulares' },
  { id: 'sec-5', num: '5', label: 'Transferencia y transmisión', title: '5. Transferencia y Transmisión de Datos' },
  { id: 'sec-6', num: '6', label: 'Medidas de seguridad', title: '6. Medidas de Seguridad' },
  { id: 'sec-7', num: '7', label: 'Conservación de los datos', title: '7. Conservación de los Datos' },
  { id: 'sec-8', num: '8', label: 'Modificaciones', title: '8. Modificaciones a las Políticas de Privacidad' },
  { id: 'sec-9', num: '9', label: 'Contacto', title: '9. Contacto' },
]

const activeId = ref('sec-1')
const sectionRefs = ref([])

const scrollToSection = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

let observer = null

onMounted(() => {
  // Scroll-spy simple para marcar sección activa
  const elements = toc
    .map((s) => document.getElementById(s.id))
    .filter(Boolean)

  observer = new IntersectionObserver(
    (entries) => {
      // Agarramos la que esté más visible
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0]

      if (visible?.target?.id) activeId.value = visible.target.id
    },
    {
      root: null,
      threshold: [0.2, 0.35, 0.5, 0.7],
      rootMargin: '-20% 0px -60% 0px', // mejor feeling con sticky header
    }
  )

  elements.forEach((el) => observer.observe(el))
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.page{
  --brand: #DF1115;
  --text: #0f172a;
  --muted: #64748b;
  --border: rgba(2,6,23,0.10);
  --shadow: 0 18px 40px rgba(2,6,23,0.12);
  --shadow-soft: 0 12px 26px rgba(2,6,23,0.08);
  --radius: 18px;
  background: #fff;
  color: var(--text);
}

/* Container propio (no pisamos .container global) */
.policy-container{
  max-width: 1100px;
}

/* HERO */
.policy-hero{
  padding: 28px 0 18px 0;
  background:
    radial-gradient(900px 240px at 15% 5%, rgba(223,17,21,0.18), transparent 55%),
    radial-gradient(700px 220px at 85% 0%, rgba(223,17,21,0.10), transparent 60%),
    linear-gradient(180deg, rgba(2,6,23,0.02), rgba(2,6,23,0.00));
  border-bottom: 1px solid var(--border);
}

.hero-card{
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) + 6px);
  box-shadow: var(--shadow);
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(10px);
  padding: 18px 18px;
  animation: pop .28s ease both;
}

.hero-badge{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(223,17,21,0.08);
  color: var(--brand);
  font-weight: 900;
  font-size: 12px;
  letter-spacing: .02em;
}

.hero-title{
  margin: 10px 0 0 0;
  font-weight: 950;
  letter-spacing: -0.02em;
  font-size: 30px;
}

.hero-subtitle{
  margin: 8px 0 0 0;
  color: var(--muted);
  font-weight: 700;
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
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(2,6,23,0.08);
  background: rgba(2,6,23,0.02);
  color: var(--text);
  font-weight: 800;
  font-size: 12px;
}

/* BODY */
.policy-body{
  padding: 22px 0 38px 0;
}

/* TOC */
.toc-card{
  position: sticky;
  top: 92px; /* header sticky */
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) + 6px);
  box-shadow: var(--shadow-soft);
  background: #fff;
  overflow: hidden;
  animation: floatIn .32s ease both;
}

.toc-title{
  padding: 14px 14px;
  border-bottom: 1px solid rgba(2,6,23,0.08);
  background:
    radial-gradient(500px 160px at 20% 0%, rgba(223,17,21,0.10), transparent 60%),
    #fff;
  font-weight: 950;
}

.toc-nav{
  display: grid;
  padding: 10px;
  gap: 8px;
}

.toc-link{
  border: 1px solid rgba(2,6,23,0.08);
  background: #fff;
  border-radius: 14px;
  padding: 10px 10px;
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 10px;
  text-align: left;
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}
.toc-link:hover{
  transform: translateY(-1px);
  box-shadow: 0 10px 18px rgba(2,6,23,0.08);
  border-color: rgba(223,17,21,0.25);
}
.toc-link.active{
  border-color: rgba(223,17,21,0.35);
  background: rgba(223,17,21,0.06);
}

.toc-num{
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-weight: 950;
  color: var(--brand);
  background: rgba(223,17,21,0.10);
}
.toc-text{
  font-weight: 900;
  color: var(--text);
  font-size: 13px;
  line-height: 1.2;
}

.toc-foot{
  padding: 12px 14px 14px 14px;
  border-top: 1px solid rgba(2,6,23,0.08);
}
.toc-note{
  margin: 0;
  color: var(--muted);
  font-weight: 700;
  font-size: 12px;
}
.toc-mail{
  display: inline-block;
  margin-top: 6px;
  color: var(--brand);
  font-weight: 950;
  text-decoration: none;
}
.toc-mail:hover{
  text-decoration: underline;
}

/* CONTENT */
.content-card{
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) + 6px);
  box-shadow: var(--shadow-soft);
  background: #fff;
  overflow: hidden;
  animation: floatIn .32s ease both;
}

.section-block{
  padding: 16px 16px;
  scroll-margin-top: 110px; /* para sticky header */
}

.section-head{
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 12px;
  align-items: start;
  margin-bottom: 10px;
}

.section-badge{
  width: 44px;
  height: 44px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  font-weight: 950;
  color: #fff;
  background: var(--brand);
  box-shadow: 0 14px 26px rgba(223,17,21,0.20);
}

.section-title{
  margin: 0;
  font-weight: 950;
  letter-spacing: -0.01em;
  font-size: 18px;
}

.section-lead{
  margin: 6px 0 0 0;
  color: var(--muted);
  font-weight: 700;
}

.section-body{
  color: var(--muted);
  font-weight: 650;
  line-height: 1.7;
}
.section-body strong{
  color: var(--text);
  font-weight: 900;
}

.divider{
  height: 1px;
  background: rgba(2,6,23,0.08);
  margin-top: 14px;
}

/* List */
.nice-list{
  margin: 10px 0 0 0;
  padding-left: 18px;
}
.nice-list li{
  margin: 8px 0;
}

/* Link */
.link{
  color: var(--brand);
  font-weight: 900;
  text-decoration: none;
}
.link:hover{ text-decoration: underline; }

/* Animations */
@keyframes pop{
  from{ transform: translateY(4px); opacity: 0; }
  to{ transform: translateY(0); opacity: 1; }
}
@keyframes floatIn{
  from{ transform: translateY(6px); opacity: 0; }
  to{ transform: translateY(0); opacity: 1; }
}
@media (prefers-reduced-motion: reduce){
  .hero-card, .toc-card, .content-card{ animation: none !important; }
}

/* Responsive */
@media (max-width: 992px){
  .toc-card{ position: relative; top: 0; }
}
@media (max-width: 576px){
  .hero-title{ font-size: 24px; }
  .section-block{ padding: 14px 14px; }
}
</style>
