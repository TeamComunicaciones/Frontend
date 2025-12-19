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

          <h1 class="hero-title">Tratamiento de Datos Personales</h1>
          <p class="hero-subtitle">
            Información sobre cómo recolectamos, usamos, almacenamos y protegemos los datos personales, y cómo atender
            solicitudes de titulares.
          </p>

          <div class="hero-meta">
            <span class="meta-pill">
              <i class="bi bi-envelope me-2"></i>
              soporte@teamcomunicaciones.com
            </span>
            <span class="meta-pill">
              <i class="bi bi-telephone me-2"></i>
              (604) 6046679
            </span>
            <span class="meta-pill">
              <i class="bi bi-geo-alt me-2"></i>
              Medellín, Belén
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
                <p class="toc-note">Canales de atención:</p>
                <a class="toc-mail" href="mailto:soporte@teamcomunicaciones.com">soporte@teamcomunicaciones.com</a>
                <div class="toc-mini">
                  <i class="bi bi-telephone me-2"></i>
                  (604) 6046679
                </div>
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
                    En TEAM COMUNICACIONES, recopilamos datos personales de manera transparente, previa autorización del
                    titular, y únicamente para las finalidades autorizadas. La recolección puede realizarse a través de:
                  </p>
                  <ul class="nice-list">
                    <li>Formularios físicos o digitales.</li>
                    <li>Interacciones en puntos de atención al cliente.</li>
                    <li>Contratos, llamadas telefónicas, correos y medios electrónicos.</li>
                    <li>Navegación en nuestras plataformas digitales, cumpliendo con la política de cookies (si aplica).</li>
                  </ul>
                </div>

                <!-- 2 -->
                <div v-else-if="sec.id === 'sec-2'" class="section-body">
                  <p>
                    El uso de los datos personales recolectados estará limitado a las siguientes finalidades, las cuales
                    han sido informadas previamente a los titulares:
                  </p>
                  <ul class="nice-list">
                    <li>
                      Prestar los servicios contratados por nuestros clientes, en especial, los servicios móviles y de
                      hogar de Claro.
                    </li>
                    <li>Gestionar la relación contractual, incluyendo la facturación, soporte técnico y atención al cliente.</li>
                    <li>
                      Realizar actividades de marketing, como promociones y campañas publicitarias, siempre con autorización
                      previa del titular.
                    </li>
                    <li>Cumplir con normativas legales y regulatorias aplicables al sector de telecomunicaciones.</li>
                    <li>
                      Los datos también podrán ser usados para finalidades estadísticas y de mejora continua, asegurando su
                      anonimización en estos casos.
                    </li>
                  </ul>
                </div>

                <!-- 3 -->
                <div v-else-if="sec.id === 'sec-3'" class="section-body">
                  <p>
                    Los datos personales serán almacenados en nuestras bases de datos seguras, utilizando herramientas
                    tecnológicas que garantizan la protección contra acceso no autorizado, alteraciones, pérdida o
                    destrucción.
                  </p>
                  <p>
                    <strong>Tiempo de conservación:</strong> Los datos serán conservados mientras exista una relación contractual
                    con el titular, o mientras sea necesario para cumplir obligaciones legales. Una vez cumplida la finalidad,
                    los datos serán eliminados o anonimizados, salvo que exista una obligación legal que requiera su conservación.
                  </p>
                </div>

                <!-- 4 -->
                <div v-else-if="sec.id === 'sec-4'" class="section-body">
                  <p>
                    TEAM COMUNICACIONES podrá compartir datos personales con las siguientes entidades, siempre bajo estrictas
                    medidas de seguridad y confidencialidad:
                  </p>
                  <ul class="nice-list">
                    <li>Claro Colombia: Para garantizar la prestación y soporte de los servicios móviles y de hogar.</li>
                    <li>
                      Aliados estratégicos y proveedores: Para apoyar la operación comercial, únicamente en los casos necesarios
                      para cumplir las finalidades descritas.
                    </li>
                    <li>Autoridades competentes: En cumplimiento de órdenes judiciales, administrativas o legales.</li>
                  </ul>
                  <p>En ningún caso los datos personales serán vendidos, alquilados o compartidos para fines distintos a los autorizados por el titular.</p>
                </div>

                <!-- 5 -->
                <div v-else-if="sec.id === 'sec-5'" class="section-body">
                  <p>
                    En caso de que sea necesario transferir datos personales a terceros ubicados fuera de Colombia (por ejemplo,
                    para proveedores de tecnología en la nube), nos aseguraremos de que estos cumplan con estándares adecuados
                    de protección de datos, tal como lo exige la normativa colombiana.
                  </p>
                </div>

                <!-- 6 -->
                <div v-else-if="sec.id === 'sec-6'" class="section-body">
                  <p>Los titulares de los datos personales tienen derecho a:</p>
                  <ul class="nice-list">
                    <li><strong>Conocer:</strong> Solicitar información sobre el uso de sus datos personales.</li>
                    <li><strong>Actualizar y rectificar:</strong> Corregir datos inexactos o desactualizados.</li>
                    <li>
                      <strong>Revocar la autorización:</strong> Solicitar la eliminación de sus datos personales, siempre que no
                      exista una obligación legal o contractual que impida su eliminación.
                    </li>
                    <li><strong>Presentar consultas y reclamos:</strong> Realizar consultas sobre el tratamiento de datos o presentar reclamos relacionados.</li>
                  </ul>
                  <p>Para ejercer estos derechos, el titular podrá enviar una solicitud por escrito a través de los siguientes canales:</p>
                  <ul class="nice-list">
                    <li>
                      Correo electrónico:
                      <a class="link" href="mailto:soporte@teamcomunicaciones.com">soporte@teamcomunicaciones.com</a>
                    </li>
                    <li>Teléfono de atención al cliente: (604) 6046679</li>
                    <li>Dirección física: Av. 33 #65c - 47, Medellín, Belén, Medellín.</li>
                  </ul>
                  <p>
                    Las consultas serán respondidas en un plazo máximo de 10 días hábiles, y los reclamos en un plazo máximo de
                    15 días hábiles, según lo establece la normativa.
                  </p>
                </div>

                <!-- 7 -->
                <div v-else-if="sec.id === 'sec-7'" class="section-body">
                  <p>
                    Antes de recolectar cualquier dato personal, TEAM COMUNICACIONES obtendrá la autorización expresa del titular,
                    salvo en los casos en los que la ley permita su tratamiento sin autorización previa (por ejemplo, datos públicos).
                    Esta autorización podrá ser otorgada por medios físicos, electrónicos o digitales.
                  </p>
                </div>

                <!-- 8 -->
                <div v-else-if="sec.id === 'sec-8'" class="section-body">
                  <p>
                    Los titulares podrán revocar su autorización para el tratamiento de datos en cualquier momento, siempre que no
                    exista una obligación legal o contractual que requiera el uso continuo de los datos. La revocación puede realizarse
                    a través de los mismos canales de atención mencionados anteriormente.
                  </p>
                </div>

                <!-- 9 -->
                <div v-else-if="sec.id === 'sec-9'" class="section-body">
                  <p>Implementamos las siguientes medidas para garantizar la seguridad de los datos personales:</p>
                  <ul class="nice-list">
                    <li>Control de acceso restringido a las bases de datos.</li>
                    <li>Uso de herramientas de encriptación y protección contra amenazas cibernéticas.</li>
                    <li>Capacitación continua a nuestro personal sobre protección de datos.</li>
                  </ul>
                </div>

                <!-- 10 -->
                <div v-else-if="sec.id === 'sec-10'" class="section-body">
                  <p>
                    TEAM COMUNICACIONES es responsable del cumplimiento de estas políticas y está comprometida con la protección de
                    los datos personales de todos los titulares. Si tienes alguna inquietud, puedes comunicarte con nuestro Oficial
                    de Protección de Datos a través de:
                  </p>
                  <ul class="nice-list">
                    <li>
                      Correo electrónico:
                      <a class="link" href="mailto:soporte@teamcomunicaciones.com">soporte@teamcomunicaciones.com</a>
                    </li>
                    <li>Teléfono: (604) 6046679</li>
                    <li>Dirección física: Av. 33 #65c - 47, Medellín, Belén, Medellín.</li>
                  </ul>
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
  { id: 'sec-1', num: '1', label: 'Recolección', title: '1. Recolección de Datos Personales' },
  { id: 'sec-2', num: '2', label: 'Uso', title: '2. Uso de los Datos Personales' },
  { id: 'sec-3', num: '3', label: 'Almacenamiento', title: '3. Almacenamiento y Conservación' },
  { id: 'sec-4', num: '4', label: 'Compartición', title: '4. Compartición de Datos Personales' },
  { id: 'sec-5', num: '5', label: 'Transferencia', title: '5. Transferencia Internacional de Datos' },
  { id: 'sec-6', num: '6', label: 'Derechos', title: '6. Derechos del Titular y Atención de Solicitudes' },
  { id: 'sec-7', num: '7', label: 'Autorización', title: '7. Autorización para el Tratamiento de Datos' },
  { id: 'sec-8', num: '8', label: 'Revocación', title: '8. Revocación de la Autorización' },
  { id: 'sec-9', num: '9', label: 'Seguridad', title: '9. Medidas de Seguridad' },
  { id: 'sec-10', num: '10', label: 'Responsabilidad', title: '10. Responsabilidad y Contacto' },
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
  const elements = toc.map((s) => document.getElementById(s.id)).filter(Boolean)

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0]

      if (visible?.target?.id) activeId.value = visible.target.id
    },
    {
      threshold: [0.2, 0.35, 0.5, 0.7],
      rootMargin: '-20% 0px -60% 0px',
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
  padding: 18px;
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
  top: 92px;
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) + 6px);
  box-shadow: var(--shadow-soft);
  background: #fff;
  overflow: hidden;
}

.toc-title{
  padding: 14px;
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
  padding: 10px;
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
  font-weight: 800;
  font-size: 12px;
}
.toc-mail{
  display: inline-block;
  margin-top: 6px;
  color: var(--brand);
  font-weight: 950;
  text-decoration: none;
}
.toc-mail:hover{ text-decoration: underline; }
.toc-mini{
  margin-top: 8px;
  color: var(--muted);
  font-weight: 800;
  font-size: 12px;
}

/* CONTENT */
.content-card{
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) + 6px);
  box-shadow: var(--shadow-soft);
  background: #fff;
  overflow: hidden;
}

.section-block{
  padding: 16px;
  scroll-margin-top: 110px;
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

/* Responsive */
@media (max-width: 992px){
  .toc-card{ position: relative; top: 0; }
}
@media (max-width: 576px){
  .hero-title{ font-size: 24px; }
  .section-block{ padding: 14px; }
}
</style>
