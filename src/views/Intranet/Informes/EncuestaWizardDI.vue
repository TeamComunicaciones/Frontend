<template>
  <div class="survey-page">
    <MenuLanding />

    <main class="container py-4 py-md-5">
      <!-- HERO / TOP BAR -->
      <section class="hero mb-4">
        <div class="hero-card">
          <div class="hero-left">
            <p class="hero-kicker">Encuesta anual • Área evaluada</p>
            <h1 class="hero-title">Desarrollo e Innovación 🚀</h1>
            <p class="hero-subtitle">
              Tu opinión nos ayuda a mejorar tiempos, soporte, comunicación e impacto en productividad.
              <span class="muted">Toma ~4–6 minutos.</span>
            </p>

            <div class="chips">
              <span class="chip">😊 Friendly</span>
              <span class="chip">⏱️ Tiempos</span>
              <span class="chip">🧠 Soporte</span>
              <span class="chip">💬 Comunicación</span>
              <span class="chip">📈 Productividad</span>
            </div>
          </div>

          <div class="hero-right">
            <div class="score-box" aria-label="Resumen de progreso y puntaje">
              <div class="score-top">
                <p class="score-kicker">Progreso</p>
                <p class="score-value">{{ progress }}%</p>
              </div>

              <div class="progress progress-sm" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar" :style="{ width: progress + '%' }"></div>
              </div>

              <div class="score-bottom">
                <div class="mini">
                  <p class="mini-label">Promedio</p>
                  <p class="mini-value">
                    {{ avgScoreText }}
                    <span class="mini-emoji">{{ avgEmoji }}</span>
                  </p>
                </div>
                <div class="mini">
                  <p class="mini-label">NPS</p>
                  <p class="mini-value">
                    {{ form.nps }}
                    <span class="mini-emoji">{{ npsEmoji }}</span>
                  </p>
                </div>
              </div>

              <p class="score-hint">
                Tip: responde con sinceridad 🙌. Esta encuesta alimenta el <strong>reporte anual</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Alerts -->
      <div v-if="submitOk" class="alert alert-success rounded-4 shadow-sm mb-4">
        <strong>¡Gracias! ✅</strong> Tu respuesta quedó lista en el front. (Luego la conectamos al back).
      </div>

      <div v-if="submitError" class="alert alert-danger rounded-4 shadow-sm mb-4">
        <strong>Ups 😅</strong> Revisa los campos marcados. Hay algunos obligatorios.
      </div>

      <!-- STEPPER -->
      <section class="stepper mb-3">
        <div class="stepper-track">
          <button
            v-for="(s, idx) in steps"
            :key="s.key"
            type="button"
            class="stepper-step"
            :class="{
              active: idx === stepIndex,
              done: idx < stepIndex,
              blocked: idx > maxReachableStep
            }"
            @click="goToStep(idx)"
            :disabled="idx > maxReachableStep"
          >
            <span class="step-dot">
              <span v-if="idx < stepIndex">✓</span>
              <span v-else>{{ idx + 1 }}</span>
            </span>
            <span class="step-label">
              <span class="step-title">{{ s.title }}</span>
              <span class="step-sub">{{ s.sub }}</span>
            </span>
          </button>
        </div>
      </section>

      <!-- WIZARD CARDS (one-page horizontal) -->
      <form class="survey" @submit.prevent="handleSubmit" novalidate>
        <section class="wizard">
          <div class="wizard-window">
            <div
              class="wizard-track"
              :style="{ transform: `translateX(-${stepIndex * 100}%)` }"
            >
              <!-- STEP 1: Contexto -->
              <div class="wizard-step">
                <div class="cardx">
                  <div class="cardx-head">
                    <div class="head-left">
                      <span class="step">1</span>
                      <div>
                        <h2 class="h6 m-0">Contexto de la solicitud 🧾</h2>
                        <p class="small muted m-0">Segmentación por área y tipo de caso.</p>
                      </div>
                    </div>
                    <span class="pill">Obligatorio</span>
                  </div>

                  <div class="cardx-body">
                    <div class="row g-3">
                      <div class="col-md-6">
                        <label class="form-label">Área solicitante <span class="req">*</span></label>
                        <select
                          v-model="form.areaSolicitante"
                          class="form-select"
                          :class="{ 'is-invalid': errors.areaSolicitante }"
                          required
                        >
                          <option value="" disabled>Selecciona tu área</option>
                          <option v-for="a in areas" :key="a" :value="a">{{ a }}</option>
                        </select>
                        <div v-if="errors.areaSolicitante" class="invalid-feedback">{{ errors.areaSolicitante }}</div>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label">Frecuencia de interacción <span class="req">*</span></label>
                        <select
                          v-model="form.frecuencia"
                          class="form-select"
                          :class="{ 'is-invalid': errors.frecuencia }"
                          required
                        >
                          <option value="" disabled>Selecciona</option>
                          <option value="Primera vez">Primera vez</option>
                          <option value="Ocasional (1-2 al mes)">Ocasional (1-2 al mes)</option>
                          <option value="Frecuente (semanal)">Frecuente (semanal)</option>
                          <option value="Muy frecuente (diario)">Muy frecuente (diario)</option>
                        </select>
                        <div v-if="errors.frecuencia" class="invalid-feedback">{{ errors.frecuencia }}</div>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label">Tipo de solicitud <span class="req">*</span></label>
                        <select
                          v-model="form.tipoSolicitud"
                          class="form-select"
                          :class="{ 'is-invalid': errors.tipoSolicitud }"
                          required
                        >
                          <option value="" disabled>Selecciona</option>
                          <option>Soporte / Incidente</option>
                          <option>Desarrollo / Nueva funcionalidad</option>
                          <option>Mejora / Optimización</option>
                          <option>Automatización / Integración</option>
                          <option>Consulta / Acompañamiento</option>
                          <option>Otro</option>
                        </select>
                        <div v-if="errors.tipoSolicitud" class="invalid-feedback">{{ errors.tipoSolicitud }}</div>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label">Canal de contacto principal</label>
                        <select v-model="form.canal" class="form-select">
                          <option value="" disabled>Selecciona</option>
                          <option>WhatsApp</option>
                          <option>Correo</option>
                          <option>Llamada</option>
                          <option>Presencial</option>
                          <option>Chat interno</option>
                          <option>Otro</option>
                        </select>
                      </div>

                      <div class="col-md-4">
                        <label class="form-label">Nombre (opcional)</label>
                        <input v-model="form.nombre" type="text" class="form-control" placeholder="Tu nombre" />
                      </div>

                      <div class="col-md-4">
                        <label class="form-label">Correo (opcional)</label>
                        <input v-model="form.correo" type="email" class="form-control" placeholder="tu@correo.com" />
                      </div>

                      <div class="col-md-4">
                        <label class="form-label">Mes / periodo evaluado</label>
                        <input v-model="form.periodo" type="month" class="form-control" />
                      </div>

                      <div class="col-12">
                        <label class="form-label">Breve descripción del caso (opcional)</label>
                        <textarea
                          v-model="form.descripcionCaso"
                          class="form-control"
                          rows="2"
                          placeholder="Ej: soporte en módulo TAT, mejora en reporte, ajuste en web, etc."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- STEP 2: Ratings caritas -->
              <div class="wizard-step">
                <div class="cardx">
                  <div class="cardx-head">
                    <div class="head-left">
                      <span class="step">2</span>
                      <div>
                        <h2 class="h6 m-0">Medidores de satisfacción 😊</h2>
                        <p class="small muted m-0">1 = muy mal, 5 = excelente (una carita por ítem).</p>
                      </div>
                    </div>
                    <span class="pill">Obligatorio</span>
                  </div>

                  <div class="cardx-body">
                    <div class="grid-q">
                      <div v-for="q in ratingQuestions" :key="q.id" class="q">
                        <div class="q-head">
                          <p class="q-title">
                            <span class="q-emoji">{{ q.emoji }}</span>
                            {{ q.title }}
                            <span v-if="q.required" class="req">*</span>
                          </p>
                          <p class="q-hint">{{ q.hint }}</p>
                        </div>

                        <div
                          class="faces"
                          role="radiogroup"
                          :aria-label="q.title"
                          :class="{ 'faces-error': errors.ratings[q.id] }"
                        >
                          <label
                            v-for="opt in faceOptions"
                            :key="opt.value"
                            class="face"
                            :class="{ selected: form.ratings[q.id] === opt.value }"
                            :title="opt.label"
                          >
                            <input
                              type="radio"
                              class="visually-hidden"
                              :name="`rate-${q.id}`"
                              :value="opt.value"
                              v-model.number="form.ratings[q.id]"
                              :required="q.required"
                            />
                            <span class="face-emoji" aria-hidden="true">{{ opt.emoji }}</span>
                            <span class="face-label">{{ opt.short }}</span>
                          </label>
                        </div>

                        <p v-if="errors.ratings[q.id]" class="q-error">
                          {{ errors.ratings[q.id] }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- STEP 3: Tiempos -->
              <div class="wizard-step">
                <div class="cardx">
                  <div class="cardx-head">
                    <div class="head-left">
                      <span class="step">3</span>
                      <div>
                        <h2 class="h6 m-0">Tiempos ⏱️</h2>
                        <p class="small muted m-0">Respuesta, solución y seguimiento.</p>
                      </div>
                    </div>
                    <span class="pill">Obligatorio</span>
                  </div>

                  <div class="cardx-body">
                    <div class="row g-3">
                      <div class="col-md-4">
                        <label class="form-label">Tiempo de respuesta inicial <span class="req">*</span></label>
                        <select
                          v-model="form.tiempoRespuesta"
                          class="form-select"
                          :class="{ 'is-invalid': errors.tiempoRespuesta }"
                          required
                        >
                          <option value="" disabled>Selecciona</option>
                          <option>Menos de 1 hora ⚡</option>
                          <option>Mismo día 🗓️</option>
                          <option>1-2 días ⏳</option>
                          <option>3-5 días 🐢</option>
                          <option>Más de 5 días 🧊</option>
                        </select>
                        <div v-if="errors.tiempoRespuesta" class="invalid-feedback">{{ errors.tiempoRespuesta }}</div>
                      </div>

                      <div class="col-md-4">
                        <label class="form-label">Tiempo de solución total <span class="req">*</span></label>
                        <select
                          v-model="form.tiempoSolucion"
                          class="form-select"
                          :class="{ 'is-invalid': errors.tiempoSolucion }"
                          required
                        >
                          <option value="" disabled>Selecciona</option>
                          <option>Se resolvió en el primer contacto ✅</option>
                          <option>Mismo día 🧩</option>
                          <option>1-2 días ⏳</option>
                          <option>3-5 días 🧠</option>
                          <option>Más de 5 días 🧯</option>
                        </select>
                        <div v-if="errors.tiempoSolucion" class="invalid-feedback">{{ errors.tiempoSolucion }}</div>
                      </div>

                      <div class="col-md-4">
                        <label class="form-label">¿Hubo seguimiento posterior? <span class="req">*</span></label>
                        <select
                          v-model="form.seguimiento"
                          class="form-select"
                          :class="{ 'is-invalid': errors.seguimiento }"
                          required
                        >
                          <option value="" disabled>Selecciona</option>
                          <option>Sí, completo 📌</option>
                          <option>Sí, parcial 📝</option>
                          <option>No 🫠</option>
                        </select>
                        <div v-if="errors.seguimiento" class="invalid-feedback">{{ errors.seguimiento }}</div>
                      </div>
                    </div>

                    <div class="tips mt-3">
                      <div class="tip">
                        <span class="tip-emoji">💡</span>
                        <span class="tip-text">Estos datos ayudan a medir SLA y oportunidades de mejora.</span>
                      </div>
                      <div class="tip">
                        <span class="tip-emoji">📌</span>
                        <span class="tip-text">Si fue “primer contacto”, igual selecciona un tiempo realista.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- STEP 4: NPS -->
              <div class="wizard-step">
                <div class="cardx">
                  <div class="cardx-head">
                    <div class="head-left">
                      <span class="step">4</span>
                      <div>
                        <h2 class="h6 m-0">Recomendación (NPS) ⭐</h2>
                        <p class="small muted m-0">0 = nada probable, 10 = totalmente probable.</p>
                      </div>
                    </div>
                    <span class="pill">Obligatorio</span>
                  </div>

                  <div class="cardx-body">
                    <div class="nps">
                      <div class="nps-top">
                        <div>
                          <p class="nps-title">¿Qué tan probable es que recomiendes a Desarrollo e Innovación?</p>
                          <p class="nps-hint">Piensa en calidad, respuesta, trato y valor aportado.</p>
                        </div>
                        <div class="nps-bubble" :class="npsClass">
                          <span class="nps-emoji">{{ npsEmoji }}</span>
                          <span class="nps-num">{{ form.nps }}</span>
                        </div>
                      </div>

                      <input
                        v-model.number="form.nps"
                        type="range"
                        class="form-range"
                        min="0"
                        max="10"
                        step="1"
                        aria-label="NPS"
                      />

                      <div class="nps-scale">
                        <span>0 😒</span>
                        <span>5 😐</span>
                        <span>10 🤩</span>
                      </div>

                      <div v-if="errors.nps" class="text-danger small fw-semibold mt-2">
                        {{ errors.nps }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- STEP 5: Abiertas + Submit -->
              <div class="wizard-step">
                <div class="cardx">
                  <div class="cardx-head">
                    <div class="head-left">
                      <span class="step">5</span>
                      <div>
                        <h2 class="h6 m-0">Comentarios y mejoras 💡</h2>
                        <p class="small muted m-0">Insumos clave para el plan anual.</p>
                      </div>
                    </div>
                    <span class="pill pill-soft">Muy valioso</span>
                  </div>

                  <div class="cardx-body">
                    <div class="row g-3">
                      <div class="col-12">
                        <label class="form-label">¿Qué fue lo mejor del soporte/servicio? ✨</label>
                        <textarea v-model="form.mejor" class="form-control" rows="2" placeholder="Cuéntanos qué te gustó"></textarea>
                      </div>

                      <div class="col-12">
                        <label class="form-label">¿Qué deberíamos mejorar sí o sí? 🧩</label>
                        <textarea v-model="form.mejorar" class="form-control" rows="2" placeholder="Ej: tiempos, claridad, seguimiento..."></textarea>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label">¿Qué proceso te gustaría que automatizáramos? 🤖</label>
                        <textarea v-model="form.automatizar" class="form-control" rows="2" placeholder="Ej: reportes, flujos, aprobaciones..."></textarea>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label">¿Qué herramienta o mejora aumentaría tu productividad? 📈</label>
                        <textarea v-model="form.productividad" class="form-control" rows="2" placeholder="Ej: dashboards, integración, notificaciones..."></textarea>
                      </div>

                      <div class="col-12">
                        <label class="form-label">Comentarios adicionales 🫶</label>
                        <textarea v-model="form.comentarios" class="form-control" rows="2" placeholder="Lo que quieras sumar"></textarea>
                      </div>
                    </div>

                    <div class="submit-card mt-3">
                      <div class="submit-left">
                        <p class="m-0 small muted">
                          Al enviar, confirmas que la información es honesta y con fines de mejora del área.
                        </p>
                      </div>
                      <div class="submit-right">
                        <button type="button" class="btn btn-outline-secondary" @click="resetForm">
                          Limpiar 🧼
                        </button>
                        <button type="submit" class="btn btn-danger px-4">
                          Enviar encuesta 📨
                        </button>
                      </div>
                    </div>

                    <!-- Debug preview (opcional) -->
                    <details class="mt-3 debug">
                      <summary>Ver JSON (solo para pruebas)</summary>
                      <pre class="mb-0">{{ payloadPreview }}</pre>
                    </details>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- FOOT NAV -->
          <div class="wizard-nav mt-3">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="prevStep"
              :disabled="stepIndex === 0"
            >
              ← Atrás
            </button>

            <div class="wizard-center">
              <span class="wizard-hint">
                Paso <strong>{{ stepIndex + 1 }}</strong> de <strong>{{ steps.length }}</strong>
              </span>
            </div>

            <button
              v-if="stepIndex < steps.length - 1"
              type="button"
              class="btn btn-danger"
              @click="nextStep"
            >
              Siguiente →
            </button>

            <button
              v-else
              type="submit"
              class="btn btn-danger"
            >
              Enviar 📨
            </button>
          </div>
        </section>
      </form>
    </main>

    <FooterLanding />
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import MenuLanding from '@/components/MainPage/MenuLanding/MenuLanding.vue'
import FooterLanding from '@/components/Landing/FooterLanding/FooterLanding.vue'

// Steps
const steps = [
  { key: 'contexto', title: 'Contexto', sub: 'Área y caso' },
  { key: 'ratings', title: 'Satisfacción', sub: 'Caritas' },
  { key: 'tiempos', title: 'Tiempos', sub: 'Respuesta/solución' },
  { key: 'nps', title: 'NPS', sub: 'Recomendación' },
  { key: 'abiertas', title: 'Comentarios', sub: 'Mejoras' },
]

const stepIndex = ref(0)

// Áreas
const areas = [
  'Control interno',
  'Comisiones',
  'Corresponsal',
  'Contabilidad',
  'Servicios web',
  'Recursos humanos',
  'TAT',
  'Bodega',
  'Otros',
]

// Caritas
const faceOptions = [
  { value: 1, emoji: '😡', label: 'Muy insatisfecho', short: '1' },
  { value: 2, emoji: '😕', label: 'Insatisfecho', short: '2' },
  { value: 3, emoji: '😐', label: 'Neutral', short: '3' },
  { value: 4, emoji: '🙂', label: 'Satisfecho', short: '4' },
  { value: 5, emoji: '😄', label: 'Muy satisfecho', short: '5' },
]

// Preguntas
const ratingQuestions = [
  { id: 'general', emoji: '🌟', title: 'Satisfacción general con Desarrollo e Innovación', hint: 'Tu percepción global del servicio.', required: true },
  { id: 'respuesta', emoji: '⚡', title: 'Rapidez de respuesta inicial', hint: '¿Qué tan rápido te atendimos al inicio?', required: true },
  { id: 'solucion', emoji: '🧩', title: 'Efectividad de la solución', hint: '¿La solución resolvió el problema real?', required: true },
  { id: 'soporte', emoji: '🧠', title: 'Calidad del soporte brindado', hint: 'Conocimiento, orientación y acompañamiento.', required: true },
  { id: 'comunicacion', emoji: '💬', title: 'Comunicación y claridad', hint: 'Explicaciones claras, estado del caso, lenguaje.', required: true },
  { id: 'amabilidad', emoji: '🫶', title: 'Amabilidad y respeto', hint: 'Trato y actitud durante el proceso.', required: false },
  { id: 'proactividad', emoji: '🔭', title: 'Proactividad (anticiparse / proponer mejoras)', hint: '¿Te ofrecimos alternativas o mejoras?', required: false },
  { id: 'cumplimiento', emoji: '📌', title: 'Cumplimiento de compromisos y plazos', hint: '¿Se cumplió lo que se prometió?', required: false },
  { id: 'facilidad', emoji: '🧼', title: 'Facilidad para solicitar soporte o desarrollo', hint: 'Qué tan simple fue pedir ayuda.', required: true },
  { id: 'seguimientoCalidad', emoji: '🔁', title: 'Seguimiento y cierre', hint: 'Confirmación, pruebas, cierre formal.', required: false },
  { id: 'documentacion', emoji: '📚', title: 'Documentación / explicación de cambios', hint: '¿Quedó claro qué se hizo y cómo usarlo?', required: false },
  { id: 'productividadImpacto', emoji: '📈', title: 'Impacto en productividad', hint: '¿Mejoró tu tiempo/flujo gracias a la solución?', required: true },
  { id: 'facilidadImpacto', emoji: '🧠', title: 'Impacto en facilidad de trabajo', hint: '¿Hizo tu tarea más simple, menos fricción?', required: true },
  { id: 'innovacion', emoji: '🚀', title: 'Aporte de innovación', hint: '¿Sentiste que aportamos ideas/mejoras nuevas?', required: false },
  { id: 'confiabilidad', emoji: '🛡️', title: 'Confiabilidad (estabilidad / pocas fallas)', hint: '¿Lo implementado funciona bien en el tiempo?', required: false },
]

// Form
const form = reactive({
  areaSolicitante: '',
  frecuencia: '',
  tipoSolicitud: '',
  canal: '',
  nombre: '',
  correo: '',
  periodo: '',
  descripcionCaso: '',

  ratings: Object.fromEntries(ratingQuestions.map((q) => [q.id, null])),

  tiempoRespuesta: '',
  tiempoSolucion: '',
  seguimiento: '',

  nps: 8,

  mejor: '',
  mejorar: '',
  automatizar: '',
  productividad: '',
  comentarios: '',
})

// Errors
const errors = reactive({
  areaSolicitante: '',
  frecuencia: '',
  tipoSolicitud: '',
  tiempoRespuesta: '',
  tiempoSolucion: '',
  seguimiento: '',
  nps: '',
  ratings: Object.fromEntries(ratingQuestions.map((q) => [q.id, ''])),
})

const submitOk = ref(false)
const submitError = ref(false)

const clearErrors = () => {
  errors.areaSolicitante = ''
  errors.frecuencia = ''
  errors.tipoSolicitud = ''
  errors.tiempoRespuesta = ''
  errors.tiempoSolucion = ''
  errors.seguimiento = ''
  errors.nps = ''
  for (const q of ratingQuestions) errors.ratings[q.id] = ''
}

// Avg
const avgScore = computed(() => {
  const values = Object.values(form.ratings).filter((v) => Number.isFinite(Number(v)))
  if (values.length === 0) return 0
  const sum = values.reduce((a, b) => a + Number(b), 0)
  return sum / values.length
})

const avgScoreText = computed(() => (avgScore.value ? avgScore.value.toFixed(1) + ' / 5' : '—'))

const avgEmoji = computed(() => {
  const a = avgScore.value
  if (!a) return '🙂'
  if (a < 2) return '😕'
  if (a < 3) return '😐'
  if (a < 4) return '🙂'
  return '😄'
})

// NPS emoji + class
const npsEmoji = computed(() => {
  const n = Number(form.nps)
  if (n <= 6) return '😒'
  if (n <= 8) return '🙂'
  return '🤩'
})
const npsClass = computed(() => {
  const n = Number(form.nps)
  if (n <= 6) return 'bad'
  if (n <= 8) return 'mid'
  return 'good'
})

// Progress based on required fields
const progress = computed(() => {
  let done = 0
  let total = 0

  // required fields
  const reqFields = ['areaSolicitante', 'frecuencia', 'tipoSolicitud', 'tiempoRespuesta', 'tiempoSolucion', 'seguimiento']
  total += reqFields.length
  reqFields.forEach((k) => { if (String(form[k] || '').trim()) done += 1 })

  // required ratings
  const reqRatings = ratingQuestions.filter((q) => q.required)
  total += reqRatings.length
  reqRatings.forEach((q) => { if (Number.isFinite(Number(form.ratings[q.id]))) done += 1 })

  // nps
  total += 1
  if (Number.isFinite(Number(form.nps))) done += 1

  return Math.round((done / total) * 100)
})

// Payload preview
const payloadPreview = computed(() => {
  const payload = {
    area_evaluada: 'Desarrollo e Innovación',
    area_solicitante: form.areaSolicitante,
    frecuencia: form.frecuencia,
    tipo_solicitud: form.tipoSolicitud,
    canal: form.canal,
    nombre: form.nombre,
    correo: form.correo,
    periodo: form.periodo,
    descripcion_caso: form.descripcionCaso,
    ratings: form.ratings,
    tiempo_respuesta: form.tiempoRespuesta,
    tiempo_solucion: form.tiempoSolucion,
    seguimiento: form.seguimiento,
    nps: form.nps,
    comentarios: {
      mejor: form.mejor,
      mejorar: form.mejorar,
      automatizar: form.automatizar,
      productividad: form.productividad,
      adicionales: form.comentarios,
    },
    meta: {
      avg_score: avgScore.value ? Number(avgScore.value.toFixed(2)) : null,
      created_at_client: new Date().toISOString(),
    },
  }
  return JSON.stringify(payload, null, 2)
})

// Validation per step (para wizard)
const validateStep = (idx) => {
  clearErrors()
  let ok = true
  const reqMsg = 'Este campo es obligatorio.'

  if (idx === 0) {
    if (!form.areaSolicitante) { errors.areaSolicitante = reqMsg; ok = false }
    if (!form.frecuencia) { errors.frecuencia = reqMsg; ok = false }
    if (!form.tipoSolicitud) { errors.tipoSolicitud = reqMsg; ok = false }
    return ok
  }

  if (idx === 1) {
    for (const q of ratingQuestions) {
      if (q.required && !Number.isFinite(Number(form.ratings[q.id]))) {
        errors.ratings[q.id] = 'Selecciona una carita 🙂'
        ok = false
      }
    }
    return ok
  }

  if (idx === 2) {
    if (!form.tiempoRespuesta) { errors.tiempoRespuesta = reqMsg; ok = false }
    if (!form.tiempoSolucion) { errors.tiempoSolucion = reqMsg; ok = false }
    if (!form.seguimiento) { errors.seguimiento = reqMsg; ok = false }
    return ok
  }

  if (idx === 3) {
    if (!Number.isFinite(Number(form.nps))) { errors.nps = reqMsg; ok = false }
    return ok
  }

  // idx === 4 (abiertas) -> no obligatorios
  return true
}

// Max reachable step = hasta donde puedo ir sin saltarme validaciones
const maxReachableStep = computed(() => {
  let lastOk = 0
  for (let i = 0; i < steps.length; i++) {
    // Solo bloqueamos en función de pasos anteriores válidos
    // Si un paso anterior falla, no puedes saltar más allá
    if (i === 0) {
      // step 0 siempre alcanzable
      lastOk = 0
      continue
    }
    const prev = i - 1
    const prevOk = validateStep(prev)
    if (prevOk) lastOk = i
    else break
  }
  // OJO: validateStep limpia errores; no queremos que al calcular
  // ensucie UI. Entonces: lo hacemos “sin efectos” abajo con snapshot.
  return Math.min(lastOk, steps.length - 1)
})

// Para que maxReachableStep no ensucie errores, hacemos snapshot seguro:
const maxReachableStepSafe = computed(() => {
  const snapshot = JSON.parse(JSON.stringify(errors))
  // test paso a paso sin “dejar” errores
  let last = 0
  for (let i = 1; i < steps.length; i++) {
    const prev = i - 1
    const ok = validateStep(prev)
    // restaurar snapshot tras cada validate
    Object.assign(errors, snapshot)
    errors.ratings = { ...snapshot.ratings }
    if (ok) last = i
    else break
  }
  return last
})

// Alias final
const maxReachableStepFinal = computed(() => maxReachableStepSafe.value)

// navegación
const goToStep = (idx) => {
  // No permitir saltar si aún no es alcanzable
  if (idx > maxReachableStepFinal.value) return
  stepIndex.value = idx
  submitOk.value = false
  submitError.value = false
}

const nextStep = () => {
  submitOk.value = false
  submitError.value = false

  const ok = validateStep(stepIndex.value)
  if (!ok) {
    submitError.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  if (stepIndex.value < steps.length - 1) stepIndex.value += 1
}

const prevStep = () => {
  submitOk.value = false
  submitError.value = false
  if (stepIndex.value > 0) stepIndex.value -= 1
}

// submit final
const validateAll = () => {
  // Validar 0..3 con reglas
  for (let i = 0; i <= 3; i++) {
    const ok = validateStep(i)
    if (!ok) return false
  }
  return true
}

const handleSubmit = () => {
  submitOk.value = false
  submitError.value = false

  const ok = validateAll()
  if (!ok) {
    submitError.value = true
    // llevar al primer paso que falla
    for (let i = 0; i <= 3; i++) {
      const stepOk = validateStep(i)
      if (!stepOk) { stepIndex.value = i; break }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  console.log('ENCUESTA PAYLOAD:', JSON.parse(payloadPreview.value))
  submitOk.value = true
  submitError.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// reset
const resetForm = () => {
  form.areaSolicitante = ''
  form.frecuencia = ''
  form.tipoSolicitud = ''
  form.canal = ''
  form.nombre = ''
  form.correo = ''
  form.periodo = ''
  form.descripcionCaso = ''

  for (const q of ratingQuestions) form.ratings[q.id] = null

  form.tiempoRespuesta = ''
  form.tiempoSolucion = ''
  form.seguimiento = ''
  form.nps = 8

  form.mejor = ''
  form.mejorar = ''
  form.automatizar = ''
  form.productividad = ''
  form.comentarios = ''

  submitOk.value = false
  submitError.value = false
  clearErrors()
  stepIndex.value = 0
}

// Evitar “errores pegados” al cambiar de paso
watch(stepIndex, () => {
  clearErrors()
  submitError.value = false
})
</script>

<style scoped>
/* Base */
.survey-page{
  --brand: #E11419;
  --text: #0f172a;
  --muted: #64748b;
  --border: rgba(2,6,23,0.10);
  --shadow: 0 18px 40px rgba(2,6,23,0.12);
  --shadow-soft: 0 12px 26px rgba(2,6,23,0.08);
  --radius: 18px;
  background:
    radial-gradient(1000px 420px at 20% -10%, rgba(225,20,25,0.18), transparent 60%),
    radial-gradient(900px 380px at 90% 0%, rgba(2,6,23,0.08), transparent 55%),
    #fff;
  color: var(--text);
}

.muted{ color: var(--muted); }
.req{ color: #b4232c; font-weight: 900; }

/* Hero */
.hero-card{
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 16px;
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: 22px;
  box-shadow: var(--shadow);
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(10px);
}
.hero-kicker{
  margin: 0;
  font-weight: 900;
  font-size: 12px;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--muted);
}
.hero-title{
  margin: 6px 0 0 0;
  font-weight: 950;
  letter-spacing: -0.02em;
}
.hero-subtitle{
  margin: 10px 0 0 0;
  color: var(--muted);
  font-weight: 650;
  line-height: 1.6;
}
.chips{
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip{
  border: 1px solid rgba(2,6,23,0.10);
  background: rgba(2,6,23,0.02);
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 12px;
}

.score-box{
  border: 1px solid rgba(2,6,23,0.10);
  border-radius: 18px;
  padding: 14px;
  background:
    radial-gradient(600px 220px at 30% 0%, rgba(225,20,25,0.12), transparent 55%),
    #fff;
  box-shadow: var(--shadow-soft);
}
.score-top{
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.score-kicker{
  margin: 0;
  color: var(--muted);
  font-weight: 900;
  letter-spacing: .04em;
  text-transform: uppercase;
  font-size: 12px;
}
.score-value{
  margin: 0;
  font-weight: 950;
  font-size: 20px;
}
.progress-sm{ height: 6px; border-radius: 999px; background: rgba(2,6,23,0.08); margin-top: 8px; }
.progress-bar{ background: var(--brand); border-radius: 999px; }

.score-bottom{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 12px;
}
.mini{
  border: 1px solid rgba(2,6,23,0.10);
  border-radius: 16px;
  padding: 10px;
  background: rgba(255,255,255,0.85);
}
.mini-label{
  margin: 0;
  color: var(--muted);
  font-weight: 900;
  font-size: 12px;
}
.mini-value{
  margin: 2px 0 0 0;
  font-weight: 950;
  display: flex;
  align-items: center;
  gap: 8px;
}
.mini-emoji{ font-size: 18px; }

.score-hint{
  margin: 10px 0 0 0;
  color: var(--muted);
  font-weight: 650;
  font-size: 12px;
}

/* Stepper */
.stepper{
  position: sticky;
  top: 0;
  z-index: 3;
  padding-top: 6px;
  padding-bottom: 6px;
  backdrop-filter: blur(12px);
}
.stepper-track{
  display:flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: rgba(255,255,255,0.90);
  box-shadow: var(--shadow-soft);
}
.stepper-step{
  border: 1px solid rgba(2,6,23,0.10);
  border-radius: 16px;
  padding: 10px 12px;
  min-width: 190px;
  display:flex;
  gap: 10px;
  align-items:center;
  background: rgba(2,6,23,0.02);
  cursor:pointer;
  transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
}
.stepper-step:hover{
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(2,6,23,0.10);
}
.stepper-step.active{
  border-color: rgba(225,20,25,0.35);
  background: rgba(225,20,25,0.07);
}
.stepper-step.done{
  border-color: rgba(16,185,129,0.28);
  background: rgba(16,185,129,0.06);
}
.stepper-step.blocked{
  opacity: 0.55;
  cursor: not-allowed;
}
.stepper-step:disabled{
  cursor: not-allowed;
}

.step-dot{
  width: 34px;
  height: 34px;
  border-radius: 14px;
  display:grid;
  place-items:center;
  font-weight: 950;
  background: rgba(255,255,255,0.9);
  border: 1px solid rgba(2,6,23,0.10);
  color: var(--text);
}
.stepper-step.active .step-dot{
  border-color: rgba(225,20,25,0.35);
  color: var(--brand);
}
.stepper-step.done .step-dot{
  border-color: rgba(16,185,129,0.35);
  color: rgb(16,185,129);
}

.step-label{
  display:flex;
  flex-direction:column;
  gap: 2px;
  text-align:left;
}
.step-title{
  font-weight: 950;
  font-size: 13px;
}
.step-sub{
  font-weight: 700;
  font-size: 12px;
  color: var(--muted);
}

/* Wizard horizontal */
.wizard{
  border-radius: 22px;
}
.wizard-window{
  overflow:hidden;
  border-radius: 22px;
}
.wizard-track{
  display:flex;
  width: 100%;
  transition: transform .35s ease;
}
.wizard-step{
  width: 100%;
  flex: 0 0 100%;
}

/* Cards */
.cardx{
  border: 1px solid var(--border);
  border-radius: 22px;
  background: rgba(255,255,255,0.92);
  box-shadow: var(--shadow-soft);
  overflow: hidden;
}
.cardx-head{
  padding: 14px 16px;
  border-bottom: 1px solid rgba(2,6,23,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  background:
    radial-gradient(700px 260px at 10% 0%, rgba(225,20,25,0.10), transparent 55%),
    #fff;
}
.head-left{
  display: flex;
  gap: 12px;
  align-items: center;
}
.step{
  width: 34px;
  height: 34px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(225,20,25,0.10);
  color: var(--brand);
  font-weight: 950;
}
.pill{
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(2,6,23,0.10);
  background: rgba(2,6,23,0.02);
  font-weight: 900;
  font-size: 12px;
}
.pill-soft{
  border-color: rgba(225,20,25,0.18);
  background: rgba(225,20,25,0.06);
  color: var(--brand);
}
.cardx-body{ padding: 16px; }

/* Questions grid */
.grid-q{
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.q{
  border: 1px solid rgba(2,6,23,0.10);
  border-radius: 18px;
  padding: 12px;
  background: rgba(255,255,255,0.85);
}
.q-title{
  margin: 0;
  font-weight: 950;
  color: var(--text);
  line-height: 1.2;
}
.q-emoji{ margin-right: 6px; }
.q-hint{
  margin: 6px 0 0 0;
  color: var(--muted);
  font-weight: 650;
  font-size: 12px;
}
.q-error{
  margin: 8px 0 0 0;
  color: #b4232c;
  font-weight: 800;
  font-size: 12px;
}

/* Faces rating */
.faces{
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}
.face{
  cursor: pointer;
  border: 1px solid rgba(2,6,23,0.10);
  border-radius: 16px;
  padding: 10px 6px;
  display: grid;
  place-items: center;
  background: rgba(2,6,23,0.02);
  transition: transform .15s ease, box-shadow .15s ease, background .15s ease, border-color .15s ease;
}
.face:hover{
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(2,6,23,0.10);
}
.face.selected{
  border-color: rgba(225,20,25,0.35);
  background: rgba(225,20,25,0.07);
}
.face-emoji{ font-size: 18px; }
.face-label{
  margin-top: 6px;
  font-size: 12px;
  font-weight: 900;
  color: var(--muted);
}
.faces-error{
  outline: 2px solid rgba(180,35,44,0.25);
  border-radius: 16px;
  padding: 6px;
}

/* Tips */
.tips{
  display:flex;
  gap: 10px;
  flex-wrap: wrap;
}
.tip{
  border: 1px solid rgba(2,6,23,0.10);
  border-radius: 999px;
  padding: 8px 10px;
  background: rgba(2,6,23,0.02);
  display:flex;
  gap: 8px;
  align-items:center;
  font-weight: 800;
  color: var(--muted);
  font-size: 12px;
}
.tip-emoji{ font-size: 14px; }

/* NPS */
.nps{
  border: 1px solid rgba(2,6,23,0.10);
  border-radius: 18px;
  padding: 14px;
  background: rgba(255,255,255,0.85);
}
.nps-top{
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}
.nps-title{
  margin: 0;
  font-weight: 950;
}
.nps-hint{
  margin: 6px 0 0 0;
  color: var(--muted);
  font-weight: 650;
  font-size: 12px;
}
.nps-bubble{
  flex: 0 0 auto;
  border: 1px solid rgba(2,6,23,0.12);
  border-radius: 16px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 950;
  background: rgba(2,6,23,0.02);
}
.nps-bubble.good{ border-color: rgba(16,185,129,0.35); background: rgba(16,185,129,0.08); }
.nps-bubble.mid{ border-color: rgba(245,158,11,0.35); background: rgba(245,158,11,0.10); }
.nps-bubble.bad{ border-color: rgba(225,20,25,0.35); background: rgba(225,20,25,0.08); }
.nps-emoji{ font-size: 18px; }
.nps-num{ font-size: 18px; }
.nps-scale{
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  color: var(--muted);
  font-weight: 800;
  font-size: 12px;
}

/* Wizard bottom nav */
.wizard-nav{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap: 10px;
}
.wizard-center{
  flex: 1;
  display:flex;
  justify-content:center;
}
.wizard-hint{
  border: 1px solid rgba(2,6,23,0.10);
  border-radius: 999px;
  padding: 8px 12px;
  background: rgba(255,255,255,0.85);
  color: var(--muted);
  font-weight: 800;
  font-size: 12px;
}
.submit-card{
  border: 1px solid rgba(2,6,23,0.10);
  border-radius: 18px;
  padding: 12px;
  background: rgba(2,6,23,0.02);
  display:flex;
  justify-content:space-between;
  gap: 12px;
  align-items:center;
  flex-wrap: wrap;
}
.submit-right{
  display:flex;
  gap: 10px;
}

/* Debug */
.debug summary{
  cursor: pointer;
  font-weight: 900;
  color: var(--muted);
}
.debug pre{
  background: rgba(2,6,23,0.02);
  border: 1px solid rgba(2,6,23,0.10);
  border-radius: 16px;
  padding: 12px;
  overflow: auto;
  max-height: 320px;
}

/* Responsive */
@media (max-width: 992px){
  .hero-card{ grid-template-columns: 1fr; }
  .grid-q{ grid-template-columns: 1fr; }
  .stepper-step{ min-width: 160px; }
}
</style>
