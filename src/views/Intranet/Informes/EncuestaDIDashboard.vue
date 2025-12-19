<template>
  <div class="dash-page">
    <MenuLanding />

    <main class="container py-4 py-md-5">
      <!-- Header -->
      <section class="top mb-4">
        <div class="top-card">
          <div>
            <p class="kicker">Dashboard • Encuesta anual</p>
            <h1 class="title">Desarrollo e Innovación — Métricas 📊</h1>
            <p class="subtitle">
              Vista interna para consolidar resultados, generar insights y exportar para el reporte anual.
              <span class="muted">Filtro + gráficos + tabla + export.</span>
            </p>
            <div class="chips">
              <span class="chip">📈 Tendencia</span>
              <span class="chip">⭐ NPS</span>
              <span class="chip">⏱️ Tiempos</span>
              <span class="chip">😊 Satisfacción</span>
              <span class="chip">🧾 Segmentación</span>
            </div>
          </div>

          <div class="actions">
            <button class="btn btn-outline-secondary" type="button" @click="refresh">
              ↻ Actualizar
            </button>
            <button class="btn btn-outline-secondary" type="button" @click="exportJSON">
              Exportar JSON
            </button>
            <button class="btn btn-danger" type="button" @click="exportCSV">
              Exportar CSV
            </button>
          </div>
        </div>

        <div v-if="usingDemo" class="alert alert-warning rounded-4 shadow-sm mt-3">
          <strong>Modo demo 👀</strong> No se pudo cargar el endpoint y se muestran datos de ejemplo.
          Cuando montemos el back, esto se alimenta solo.
        </div>
      </section>

      <!-- Filters -->
      <section class="filters mb-4">
        <div class="filters-card">
          <div class="row g-3 align-items-end">
            <div class="col-md-3">
              <label class="form-label">Desde (mes)</label>
              <input v-model="filters.from" type="month" class="form-control" />
            </div>
            <div class="col-md-3">
              <label class="form-label">Hasta (mes)</label>
              <input v-model="filters.to" type="month" class="form-control" />
            </div>
            <div class="col-md-2">
              <label class="form-label">Área solicitante</label>
              <select v-model="filters.area" class="form-select">
                <option value="">Todas</option>
                <option v-for="a in areas" :key="a" :value="a">{{ a }}</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Tipo solicitud</label>
              <select v-model="filters.tipo" class="form-select">
                <option value="">Todos</option>
                <option v-for="t in tipos" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Canal</label>
              <select v-model="filters.canal" class="form-select">
                <option value="">Todos</option>
                <option v-for="c in canales" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>

            <div class="col-md-8">
              <label class="form-label">Búsqueda (texto libre)</label>
              <input
                v-model="filters.q"
                type="text"
                class="form-control"
                placeholder="Busca por descripción o comentarios (mejoras, automatización, productividad...)"
              />
            </div>

            <div class="col-md-4 d-flex gap-2">
              <button class="btn btn-outline-secondary w-50" type="button" @click="resetFilters">
                Limpiar filtros 🧼
              </button>
              <button class="btn btn-danger w-50" type="button" @click="applyQuickThisYear">
                Año actual 🎯
              </button>
            </div>
          </div>

          <div class="filters-meta mt-3">
            <span class="badge-soft">Respuestas filtradas: <strong>{{ filtered.length }}</strong></span>
            <span class="badge-soft">Periodo: <strong>{{ periodLabel }}</strong></span>
            <span class="badge-soft">Última carga: <strong>{{ lastLoadedLabel }}</strong></span>
          </div>
        </div>
      </section>

      <!-- KPIs -->
      <section class="kpis mb-4">
        <div class="kpi-grid">
          <div class="kpi">
            <p class="kpi-label">Respuestas</p>
            <p class="kpi-value">{{ metrics.total }}</p>
            <p class="kpi-sub muted">Total filtrado</p>
          </div>

          <div class="kpi">
            <p class="kpi-label">Promedio general</p>
            <p class="kpi-value">
              {{ metrics.avgOverallText }}
              <span class="kpi-emoji">{{ metrics.avgEmoji }}</span>
            </p>
            <p class="kpi-sub muted">Promedio de ratings respondidos</p>
          </div>

          <div class="kpi">
            <p class="kpi-label">NPS</p>
            <p class="kpi-value">
              {{ metrics.npsScore }}
              <span class="kpi-emoji">{{ metrics.npsEmoji }}</span>
            </p>
            <p class="kpi-sub muted">
              Promoters {{ metrics.promoters }} • Passives {{ metrics.passives }} • Detractors {{ metrics.detractors }}
            </p>
          </div>

          <div class="kpi">
            <p class="kpi-label">“Rápido” (respuesta)</p>
            <p class="kpi-value">{{ metrics.fastResponsePct }}%</p>
            <p class="kpi-sub muted">Menos de 1 hora + mismo día</p>
          </div>

          <div class="kpi">
            <p class="kpi-label">Punto más bajo</p>
            <p class="kpi-value">
              {{ metrics.lowestLabel }}
            </p>
            <p class="kpi-sub muted">Dónde enfocar el plan de mejora</p>
          </div>

          <div class="kpi">
            <p class="kpi-label">Punto más alto</p>
            <p class="kpi-value">
              {{ metrics.highestLabel }}
            </p>
            <p class="kpi-sub muted">Fortaleza del área</p>
          </div>
        </div>
      </section>

      <!-- Charts -->
      <section class="charts mb-4">
        <div class="chart-grid">
          <div class="chart-card">
            <div class="chart-head">
              <h3 class="h6 m-0">Respuestas por mes 📈</h3>
              <p class="small muted m-0">Tendencia de volumen (ideal para reporte anual).</p>
            </div>
            <div class="chart-body">
              <canvas ref="cvTrend"></canvas>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-head">
              <h3 class="h6 m-0">Promedio por área solicitante 🧾</h3>
              <p class="small muted m-0">Identifica áreas con mejor/peor percepción.</p>
            </div>
            <div class="chart-body">
              <canvas ref="cvByArea"></canvas>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-head">
              <h3 class="h6 m-0">Promedio por pregunta 😊</h3>
              <p class="small muted m-0">Detalle por ítem (1 a 5).</p>
            </div>
            <div class="chart-body">
              <canvas ref="cvByQuestion"></canvas>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-head">
              <h3 class="h6 m-0">Radar de dimensiones 🕸️</h3>
              <p class="small muted m-0">Respuesta, soporte, comunicación, productividad, facilidad…</p>
            </div>
            <div class="chart-body">
              <canvas ref="cvRadar"></canvas>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-head">
              <h3 class="h6 m-0">Distribución NPS ⭐</h3>
              <p class="small muted m-0">Promotores / Pasivos / Detractores.</p>
            </div>
            <div class="chart-body">
              <canvas ref="cvNps"></canvas>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-head">
              <h3 class="h6 m-0">Tiempos ⏱️</h3>
              <p class="small muted m-0">Respuesta inicial vs solución total.</p>
            </div>
            <div class="chart-body">
              <canvas ref="cvTimes"></canvas>
            </div>
          </div>
        </div>
      </section>

      <!-- Insights -->
      <section class="insights mb-4">
        <div class="insights-card">
          <div class="ins-head">
            <h3 class="h6 m-0">Insights automáticos ✍️</h3>
            <p class="small muted m-0">Borrador listo para tu reporte anual (ajustable).</p>
          </div>

          <div class="ins-body">
            <ul class="ins-list">
              <li v-for="(it, idx) in insights" :key="idx">
                <span class="ins-dot">•</span>
                <span>{{ it }}</span>
              </li>
            </ul>

            <div class="tags">
              <span class="tag" v-for="(kw, idx) in topKeywords" :key="idx">#{{ kw.word }} ({{ kw.count }})</span>
            </div>
            <p class="small muted mt-2 mb-0">
              Las etiquetas salen de texto libre (mejoras/automatización/productividad/comentarios).
            </p>
          </div>
        </div>
      </section>

      <!-- Table -->
      <section class="tablex mb-4">
        <div class="table-card">
          <div class="table-head">
            <h3 class="h6 m-0">Respuestas (tabla) 🧾</h3>
            <p class="small muted m-0">Haz click en “Ver” para detalle.</p>
          </div>

          <div class="table-body">
            <div class="table-responsive">
              <table class="table align-middle">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Área</th>
                    <th>Tipo</th>
                    <th>Canal</th>
                    <th>Avg</th>
                    <th>NPS</th>
                    <th>Respuesta</th>
                    <th>Solución</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in recent" :key="r.id">
                    <td>{{ formatDate(r.created_at) }}</td>
                    <td>{{ r.area_solicitante || '—' }}</td>
                    <td>{{ r.tipo_solicitud || '—' }}</td>
                    <td>{{ r.canal || '—' }}</td>
                    <td>
                      <span class="pillx">{{ r.meta?.avg_score ?? computeAvg(r.ratings) }}</span>
                    </td>
                    <td>
                      <span class="pillx">{{ r.nps }}</span>
                    </td>
                    <td>{{ r.tiempo_respuesta || '—' }}</td>
                    <td>{{ r.tiempo_solucion || '—' }}</td>
                    <td class="text-end">
                      <button class="btn btn-sm btn-outline-secondary" type="button" @click="openDetail(r)">
                        Ver
                      </button>
                    </td>
                  </tr>
                  <tr v-if="recent.length === 0">
                    <td colspan="9" class="text-center muted py-4">No hay datos con esos filtros.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p class="small muted mb-0">
              Mostrando {{ recent.length }} de {{ filtered.length }} (recientes).
            </p>
          </div>
        </div>
      </section>
    </main>

    <!-- Modal detalle -->
    <div v-if="detailOpen" class="modalx" role="dialog" aria-modal="true">
      <div class="modalx-backdrop" @click="closeDetail"></div>
      <div class="modalx-card">
        <div class="modalx-head">
          <div>
            <p class="modalx-kicker">Detalle de respuesta</p>
            <h3 class="modalx-title">{{ formatDate(detail?.created_at) }} • {{ detail?.area_solicitante || '—' }}</h3>
          </div>
          <button class="btn btn-sm btn-outline-secondary" type="button" @click="closeDetail">✕</button>
        </div>

        <div class="modalx-body">
          <div class="row g-3">
            <div class="col-md-6">
              <div class="box">
                <p class="box-title">Contexto</p>
                <p class="box-line"><strong>Área:</strong> {{ detail?.area_solicitante || '—' }}</p>
                <p class="box-line"><strong>Frecuencia:</strong> {{ detail?.frecuencia || '—' }}</p>
                <p class="box-line"><strong>Tipo:</strong> {{ detail?.tipo_solicitud || '—' }}</p>
                <p class="box-line"><strong>Canal:</strong> {{ detail?.canal || '—' }}</p>
                <p class="box-line"><strong>Periodo:</strong> {{ detail?.periodo || '—' }}</p>
              </div>
            </div>

            <div class="col-md-6">
              <div class="box">
                <p class="box-title">Resultados</p>
                <p class="box-line"><strong>Avg:</strong> {{ detail?.meta?.avg_score ?? computeAvg(detail?.ratings) }}</p>
                <p class="box-line"><strong>NPS:</strong> {{ detail?.nps }} {{ npsEmojiFor(detail?.nps) }}</p>
                <p class="box-line"><strong>Respuesta:</strong> {{ detail?.tiempo_respuesta || '—' }}</p>
                <p class="box-line"><strong>Solución:</strong> {{ detail?.tiempo_solucion || '—' }}</p>
                <p class="box-line"><strong>Seguimiento:</strong> {{ detail?.seguimiento || '—' }}</p>
              </div>
            </div>

            <div class="col-12">
              <div class="box">
                <p class="box-title">Ratings</p>
                <div class="ratings-grid">
                  <div v-for="q in ratingQuestions" :key="q.id" class="rating-item">
                    <span class="r-name">{{ q.short }}</span>
                    <span class="r-val">{{ detail?.ratings?.[q.id] ?? '—' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12">
              <div class="box">
                <p class="box-title">Texto libre</p>
                <p class="box-text"><strong>Descripción:</strong> {{ detail?.descripcion_caso || '—' }}</p>
                <p class="box-text"><strong>Mejor:</strong> {{ detail?.comentarios?.mejor || '—' }}</p>
                <p class="box-text"><strong>Mejorar:</strong> {{ detail?.comentarios?.mejorar || '—' }}</p>
                <p class="box-text"><strong>Automatizar:</strong> {{ detail?.comentarios?.automatizar || '—' }}</p>
                <p class="box-text"><strong>Productividad:</strong> {{ detail?.comentarios?.productividad || '—' }}</p>
                <p class="box-text"><strong>Adicional:</strong> {{ detail?.comentarios?.adicionales || '—' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="modalx-foot">
          <button class="btn btn-outline-secondary" type="button" @click="closeDetail">Cerrar</button>
        </div>
      </div>
    </div>

    <FooterLanding />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import axios from 'axios'
import Chart from 'chart.js/auto'
import backendRouter from '@/components/BackendRouter/BackendRouter'

import MenuLanding from '@/components/MainPage/MenuLanding/MenuLanding.vue'
import FooterLanding from '@/components/Landing/FooterLanding/FooterLanding.vue'

/**
 * ✅ Endpoint sugerido (ajústalo a tu gusto):
 * - GET: lista respuestas
 * Después lo conectamos al views.py con /api/v1.0/...
 */
const ENDPOINT_LIST = backendRouter.data + 'encuesta-di/respuestas'  // <- cámbialo cuando montemos el back

const usingDemo = ref(false)
const loading = ref(false)
const lastLoadedAt = ref(null)

const raw = ref([])

// Catálogos
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

const tipos = [
  'Soporte / Incidente',
  'Desarrollo / Nueva funcionalidad',
  'Mejora / Optimización',
  'Automatización / Integración',
  'Consulta / Acompañamiento',
  'Otro',
]

const canales = ['WhatsApp', 'Correo', 'Llamada', 'Presencial', 'Chat interno', 'Otro']

// Preguntas (para tabla/detail y barras)
const ratingQuestions = [
  { id: 'general', short: 'General' },
  { id: 'respuesta', short: 'Respuesta' },
  { id: 'solucion', short: 'Solución' },
  { id: 'soporte', short: 'Soporte' },
  { id: 'comunicacion', short: 'Comunicación' },
  { id: 'amabilidad', short: 'Amabilidad' },
  { id: 'proactividad', short: 'Proactividad' },
  { id: 'cumplimiento', short: 'Cumplimiento' },
  { id: 'facilidad', short: 'Facilidad' },
  { id: 'seguimientoCalidad', short: 'Seguimiento' },
  { id: 'documentacion', short: 'Documentación' },
  { id: 'productividadImpacto', short: 'Productividad' },
  { id: 'facilidadImpacto', short: 'Facilidad trabajo' },
  { id: 'innovacion', short: 'Innovación' },
  { id: 'confiabilidad', short: 'Confiabilidad' },
]

// Filtros
const filters = reactive({
  from: '',
  to: '',
  area: '',
  tipo: '',
  canal: '',
  q: '',
})

const resetFilters = () => {
  filters.from = ''
  filters.to = ''
  filters.area = ''
  filters.tipo = ''
  filters.canal = ''
  filters.q = ''
}

const applyQuickThisYear = () => {
  const now = new Date()
  const y = now.getFullYear()
  filters.from = `${y}-01`
  filters.to = `${y}-12`
}

// Normalización (para que sea estable al conectar backend)
const normalize = (r, idx) => {
  const created = r.created_at || r.created_at_client || r?.meta?.created_at_client || null
  const created_at = created ? new Date(created).toISOString() : new Date().toISOString()

  return {
    id: r.id ?? `local-${idx}`,
    created_at,

    area_evaluada: r.area_evaluada || 'Desarrollo e Innovación',
    area_solicitante: r.area_solicitante || r.areaSolicitante || '',
    frecuencia: r.frecuencia || '',
    tipo_solicitud: r.tipo_solicitud || r.tipoSolicitud || '',
    canal: r.canal || '',
    nombre: r.nombre || '',
    correo: r.correo || '',
    periodo: r.periodo || '',
    descripcion_caso: r.descripcion_caso || r.descripcionCaso || '',

    ratings: r.ratings || {},
    tiempo_respuesta: r.tiempo_respuesta || r.tiempoRespuesta || '',
    tiempo_solucion: r.tiempo_solucion || r.tiempoSolucion || '',
    seguimiento: r.seguimiento || '',
    nps: Number.isFinite(Number(r.nps)) ? Number(r.nps) : 0,

    comentarios: r.comentarios || {
      mejor: r.mejor || '',
      mejorar: r.mejorar || '',
      automatizar: r.automatizar || '',
      productividad: r.productividad || '',
      adicionales: r.comentarios || '',
    },

    meta: r.meta || {
      avg_score: r?.meta?.avg_score ?? null,
    },
  }
}

// Carga
const load = async () => {
  loading.value = true
  usingDemo.value = false
  try {
    const resp = await axios.get(ENDPOINT_LIST)
    const data = Array.isArray(resp.data) ? resp.data : (resp.data?.data ?? [])
    raw.value = data.map(normalize)
  } catch (e) {
    usingDemo.value = true
    raw.value = demoData().map(normalize)
  } finally {
    lastLoadedAt.value = new Date()
    loading.value = false
  }
}

const refresh = () => load()

// Helpers
const fmtMonth = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

const withinMonthRange = (isoDate, fromYm, toYm) => {
  if (!fromYm && !toYm) return true
  const d = new Date(isoDate)
  const ym = fmtMonth(d)
  if (fromYm && ym < fromYm) return false
  if (toYm && ym > toYm) return false
  return true
}

const textBlob = (r) => {
  const parts = [
    r.descripcion_caso,
    r.comentarios?.mejor,
    r.comentarios?.mejorar,
    r.comentarios?.automatizar,
    r.comentarios?.productividad,
    r.comentarios?.adicionales,
  ]
  return parts.filter(Boolean).join(' ').toLowerCase()
}

const computeAvg = (ratings) => {
  if (!ratings) return null
  const vals = Object.values(ratings).map(Number).filter((n) => Number.isFinite(n))
  if (vals.length === 0) return null
  const sum = vals.reduce((a, b) => a + b, 0)
  return Number((sum / vals.length).toFixed(2))
}

const formatDate = (iso) => {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: '2-digit' })
  } catch {
    return '—'
  }
}

const lastLoadedLabel = computed(() => {
  if (!lastLoadedAt.value) return '—'
  return lastLoadedAt.value.toLocaleString('es-CO')
})

const periodLabel = computed(() => {
  const f = filters.from || '—'
  const t = filters.to || '—'
  return `${f} → ${t}`
})

// Filtrado
const filtered = computed(() => {
  const q = (filters.q || '').trim().toLowerCase()

  return raw.value.filter((r) => {
    if (!withinMonthRange(r.created_at, filters.from, filters.to)) return false
    if (filters.area && r.area_solicitante !== filters.area) return false
    if (filters.tipo && r.tipo_solicitud !== filters.tipo) return false
    if (filters.canal && r.canal !== filters.canal) return false
    if (q && !textBlob(r).includes(q)) return false
    return true
  })
})

// Recent rows
const recent = computed(() => {
  return [...filtered.value]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 30)
})

// NPS helpers
const npsEmojiFor = (n) => {
  const x = Number(n)
  if (x <= 6) return '😒'
  if (x <= 8) return '🙂'
  return '🤩'
}

const npsGroup = (n) => {
  const x = Number(n)
  if (x >= 9) return 'Promotores'
  if (x >= 7) return 'Pasivos'
  return 'Detractores'
}

// “Rápido”
const isFastResponse = (s) => {
  const t = (s || '').toLowerCase()
  return t.includes('menos de 1') || t.includes('mismo día') || t.includes('mismo dia')
}

// Métricas
const metrics = computed(() => {
  const arr = filtered.value
  const total = arr.length

  const avgs = arr
    .map((r) => r.meta?.avg_score ?? computeAvg(r.ratings))
    .map(Number)
    .filter((n) => Number.isFinite(n))

  const avgOverall = avgs.length ? avgs.reduce((a, b) => a + b, 0) / avgs.length : 0

  const avgEmoji = avgOverall >= 4 ? '😄' : avgOverall >= 3 ? '🙂' : avgOverall >= 2 ? '😐' : '😕'
  const avgOverallText = avgOverall ? `${avgOverall.toFixed(2)} / 5` : '—'

  const promoters = arr.filter((r) => npsGroup(r.nps) === 'Promotores').length
  const passives = arr.filter((r) => npsGroup(r.nps) === 'Pasivos').length
  const detractors = arr.filter((r) => npsGroup(r.nps) === 'Detractores').length

  const npsScore = total ? Math.round(((promoters - detractors) / total) * 100) : 0
  const npsEmoji = npsScore >= 50 ? '🤩' : npsScore >= 0 ? '🙂' : '😒'

  const fastCount = arr.filter((r) => isFastResponse(r.tiempo_respuesta)).length
  const fastResponsePct = total ? Math.round((fastCount / total) * 100) : 0

  // Lowest/highest question average
  const byQ = ratingQuestions.map((q) => {
    const vals = arr.map((r) => Number(r.ratings?.[q.id])).filter((n) => Number.isFinite(n))
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
    return { id: q.id, short: q.short, avg }
  }).filter((x) => x.avg !== null)

  let lowestLabel = '—'
  let highestLabel = '—'
  if (byQ.length) {
    const low = [...byQ].sort((a, b) => a.avg - b.avg)[0]
    const high = [...byQ].sort((a, b) => b.avg - a.avg)[0]
    lowestLabel = `${low.short} (${low.avg.toFixed(2)})`
    highestLabel = `${high.short} (${high.avg.toFixed(2)})`
  }

  return {
    total,
    avgOverall,
    avgOverallText,
    avgEmoji,
    promoters,
    passives,
    detractors,
    npsScore,
    npsEmoji,
    fastResponsePct,
    lowestLabel,
    highestLabel,
  }
})

// Keywords (texto libre)
const STOP = new Set([
  'para','pero','porque','como','desde','hasta','cuando','donde','este','esta','estos','estas',
  'sobre','entre','todos','todas','mucho','muchos','muchas','pues','tener','tiene','tienen',
  'area','área','equipo','proceso','solicitud','soporte','desarrollo','innovacion','innovación',
  'mejorar','mejora','mejoras','hacer','hacerlo','si','sí','no','con','por','del','las','los',
  'una','uno','unas','unos','que','qué','muy','mas','más','fue','ser','se','su','sus','al','a',
  'de','y','en','el','la','un','mi','me','te','tu','tú','es','son','hay','ya'
])

const topKeywords = computed(() => {
  const freq = new Map()
  for (const r of filtered.value) {
    const txt = textBlob(r)
    const words = txt
      .replace(/[^a-záéíóúñü0-9\s]/gi, ' ')
      .split(/\s+/)
      .map((w) => w.trim())
      .filter((w) => w.length >= 4)
      .filter((w) => !STOP.has(w))

    for (const w of words) freq.set(w, (freq.get(w) || 0) + 1)
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 14)
    .map(([word, count]) => ({ word, count }))
})

// Insights list
const insights = computed(() => {
  const arr = filtered.value
  const t = metrics.value.total
  if (!t) return ['No hay datos con los filtros actuales. Ajusta el periodo o quita filtros.']

  // top area avg
  const byArea = new Map()
  for (const r of arr) {
    const a = r.area_solicitante || '—'
    const avg = r.meta?.avg_score ?? computeAvg(r.ratings)
    if (!Number.isFinite(Number(avg))) continue
    if (!byArea.has(a)) byArea.set(a, [])
    byArea.get(a).push(Number(avg))
  }
  const areaAvgs = [...byArea.entries()].map(([a, vals]) => {
    const avg = vals.reduce((x, y) => x + y, 0) / vals.length
    return { a, avg, n: vals.length }
  }).sort((x, y) => y.avg - x.avg)

  const bestArea = areaAvgs[0]
  const worstArea = areaAvgs[areaAvgs.length - 1]

  const base = []
  base.push(`Se analizaron ${t} respuestas en el periodo ${periodLabel.value}.`)
  base.push(`Promedio general: ${metrics.value.avgOverallText} ${metrics.value.avgEmoji}.`)
  base.push(`NPS: ${metrics.value.npsScore} (${metrics.value.promoters} promotores, ${metrics.value.passives} pasivos, ${metrics.value.detractors} detractores) ${metrics.value.npsEmoji}.`)
  base.push(`Respuesta “rápida” (≤ mismo día): ${metrics.value.fastResponsePct}%.`)
  base.push(`Punto más fuerte: ${metrics.value.highestLabel}.`)
  base.push(`Oportunidad principal: ${metrics.value.lowestLabel}.`)

  if (bestArea && worstArea && areaAvgs.length > 1) {
    base.push(`Mejor percepción por área solicitante: ${bestArea.a} (${bestArea.avg.toFixed(2)} / 5, n=${bestArea.n}).`)
    base.push(`Percepción más baja por área solicitante: ${worstArea.a} (${worstArea.avg.toFixed(2)} / 5, n=${worstArea.n}).`)
  }

  const kws = topKeywords.value.slice(0, 5).map((x) => x.word)
  if (kws.length) base.push(`Temas recurrentes en texto libre: ${kws.join(', ')}.`)

  return base
})

// Dataset builders for charts
const monthSeries = computed(() => {
  const m = new Map()
  for (const r of filtered.value) {
    const key = r.periodo || fmtMonth(new Date(r.created_at))
    m.set(key, (m.get(key) || 0) + 1)
  }
  const labels = [...m.keys()].sort()
  const data = labels.map((k) => m.get(k))
  return { labels, data }
})

const avgByArea = computed(() => {
  const buckets = new Map()
  for (const r of filtered.value) {
    const a = r.area_solicitante || '—'
    const avg = r.meta?.avg_score ?? computeAvg(r.ratings)
    if (!Number.isFinite(Number(avg))) continue
    if (!buckets.has(a)) buckets.set(a, [])
    buckets.get(a).push(Number(avg))
  }
  const labels = [...buckets.keys()].sort()
  const data = labels.map((a) => {
    const vals = buckets.get(a)
    const avg = vals.reduce((x, y) => x + y, 0) / vals.length
    return Number(avg.toFixed(2))
  })
  return { labels, data }
})

const avgByQuestion = computed(() => {
  const labels = ratingQuestions.map((q) => q.short)
  const data = ratingQuestions.map((q) => {
    const vals = filtered.value.map((r) => Number(r.ratings?.[q.id])).filter((n) => Number.isFinite(n))
    if (!vals.length) return 0
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length
    return Number(avg.toFixed(2))
  })
  return { labels, data }
})

const radarDims = computed(() => {
  const dims = [
    { label: 'Respuesta', ids: ['respuesta'] },
    { label: 'Solución', ids: ['solucion'] },
    { label: 'Soporte', ids: ['soporte'] },
    { label: 'Comunicación', ids: ['comunicacion'] },
    { label: 'Facilidad', ids: ['facilidad'] },
    { label: 'Productividad', ids: ['productividadImpacto'] },
    { label: 'Facilidad trabajo', ids: ['facilidadImpacto'] },
  ]

  const labels = dims.map((d) => d.label)
  const data = dims.map((d) => {
    const vals = []
    for (const r of filtered.value) {
      for (const id of d.ids) {
        const v = Number(r.ratings?.[id])
        if (Number.isFinite(v)) vals.push(v)
      }
    }
    if (!vals.length) return 0
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length
    return Number(avg.toFixed(2))
  })
  return { labels, data }
})

const npsDist = computed(() => {
  const p = metrics.value.promoters
  const pa = metrics.value.passives
  const d = metrics.value.detractors
  return { labels: ['Promotores', 'Pasivos', 'Detractores'], data: [p, pa, d] }
})

const timesDist = computed(() => {
  const respBuckets = new Map()
  const solBuckets = new Map()

  const add = (map, key) => map.set(key, (map.get(key) || 0) + 1)

  for (const r of filtered.value) {
    add(respBuckets, r.tiempo_respuesta || '—')
    add(solBuckets, r.tiempo_solucion || '—')
  }

  const labels = Array.from(new Set([...respBuckets.keys(), ...solBuckets.keys()]))
  // orden semiamigable (más rápido primero)
  const order = (s) => {
    const t = (s || '').toLowerCase()
    if (t.includes('menos de 1')) return 1
    if (t.includes('primer contacto')) return 2
    if (t.includes('mismo')) return 3
    if (t.includes('1-2')) return 4
    if (t.includes('3-5')) return 5
    if (t.includes('más de 5') || t.includes('mas de 5')) return 6
    if (t.includes('—')) return 99
    return 50
  }
  labels.sort((a, b) => order(a) - order(b))

  const resp = labels.map((k) => respBuckets.get(k) || 0)
  const sol = labels.map((k) => solBuckets.get(k) || 0)

  return { labels, resp, sol }
})

// Chart instances + canvases
const cvTrend = ref(null)
const cvByArea = ref(null)
const cvByQuestion = ref(null)
const cvRadar = ref(null)
const cvNps = ref(null)
const cvTimes = ref(null)

let chTrend = null
let chByArea = null
let chByQuestion = null
let chRadar = null
let chNps = null
let chTimes = null

const destroyCharts = () => {
  for (const ch of [chTrend, chByArea, chByQuestion, chRadar, chNps, chTimes]) {
    if (ch) ch.destroy()
  }
  chTrend = chByArea = chByQuestion = chRadar = chNps = chTimes = null
}

const buildCharts = () => {
  destroyCharts()

  // Trend
  chTrend = new Chart(cvTrend.value, {
    type: 'line',
    data: {
      labels: monthSeries.value.labels,
      datasets: [{
        label: 'Respuestas',
        data: monthSeries.value.data,
        tension: 0.3,
        fill: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
    },
  })

  // Avg by area
  chByArea = new Chart(cvByArea.value, {
    type: 'bar',
    data: {
      labels: avgByArea.value.labels,
      datasets: [{
        label: 'Promedio (1-5)',
        data: avgByArea.value.data,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: true, max: 5 } },
    },
  })

  // Avg by question
  chByQuestion = new Chart(cvByQuestion.value, {
    type: 'bar',
    data: {
      labels: avgByQuestion.value.labels,
      datasets: [{
        label: 'Promedio (1-5)',
        data: avgByQuestion.value.data,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: true, max: 5 } },
    },
  })

  // Radar
  chRadar = new Chart(cvRadar.value, {
    type: 'radar',
    data: {
      labels: radarDims.value.labels,
      datasets: [{
        label: 'Promedio',
        data: radarDims.value.data,
        fill: true,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true } },
      scales: {
        r: {
          beginAtZero: true,
          min: 0,
          max: 5,
          ticks: { stepSize: 1 },
        },
      },
    },
  })

  // NPS doughnut
  chNps = new Chart(cvNps.value, {
    type: 'doughnut',
    data: {
      labels: npsDist.value.labels,
      datasets: [{
        label: 'NPS',
        data: npsDist.value.data,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
    },
  })

  // Times
  chTimes = new Chart(cvTimes.value, {
    type: 'bar',
    data: {
      labels: timesDist.value.labels,
      datasets: [
        { label: 'Respuesta inicial', data: timesDist.value.resp },
        { label: 'Solución total', data: timesDist.value.sol },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
    },
  })
}

const updateCharts = () => {
  if (!chTrend) return

  chTrend.data.labels = monthSeries.value.labels
  chTrend.data.datasets[0].data = monthSeries.value.data
  chTrend.update()

  chByArea.data.labels = avgByArea.value.labels
  chByArea.data.datasets[0].data = avgByArea.value.data
  chByArea.update()

  chByQuestion.data.labels = avgByQuestion.value.labels
  chByQuestion.data.datasets[0].data = avgByQuestion.value.data
  chByQuestion.update()

  chRadar.data.labels = radarDims.value.labels
  chRadar.data.datasets[0].data = radarDims.value.data
  chRadar.update()

  chNps.data.labels = npsDist.value.labels
  chNps.data.datasets[0].data = npsDist.value.data
  chNps.update()

  chTimes.data.labels = timesDist.value.labels
  chTimes.data.datasets[0].data = timesDist.value.resp
  chTimes.data.datasets[1].data = timesDist.value.sol
  chTimes.update()
}

// Rebuild on first mount; update on filters/data changes
onMounted(async () => {
  await load()
  buildCharts()
})

onBeforeUnmount(() => destroyCharts())

watch(
  () => [filtered.value.length, filters.from, filters.to, filters.area, filters.tipo, filters.canal, filters.q],
  () => updateCharts()
)

// Export helpers
const exportJSON = () => {
  const blob = new Blob([JSON.stringify(filtered.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `encuesta_DI_${new Date().toISOString().slice(0,10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const exportCSV = () => {
  const rows = filtered.value.map((r) => {
    const base = {
      id: r.id,
      created_at: r.created_at,
      area_solicitante: r.area_solicitante,
      frecuencia: r.frecuencia,
      tipo_solicitud: r.tipo_solicitud,
      canal: r.canal,
      periodo: r.periodo,
      avg_score: r.meta?.avg_score ?? computeAvg(r.ratings),
      nps: r.nps,
      tiempo_respuesta: r.tiempo_respuesta,
      tiempo_solucion: r.tiempo_solucion,
      seguimiento: r.seguimiento,
      descripcion_caso: r.descripcion_caso,
      mejor: r.comentarios?.mejor,
      mejorar: r.comentarios?.mejorar,
      automatizar: r.comentarios?.automatizar,
      productividad: r.comentarios?.productividad,
      adicionales: r.comentarios?.adicionales,
    }
    // flatten ratings
    for (const q of ratingQuestions) base[`rating_${q.id}`] = r.ratings?.[q.id] ?? ''
    return base
  })

  const headers = Object.keys(rows[0] || { id: '' })
  const escape = (v) => {
    const s = (v ?? '').toString().replaceAll('"', '""')
    return `"${s}"`
    }
  const csv = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(',')),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `encuesta_DI_${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// Modal detalle
const detailOpen = ref(false)
const detail = ref(null)

const openDetail = (r) => {
  detail.value = r
  detailOpen.value = true
}
const closeDetail = () => {
  detailOpen.value = false
  detail.value = null
}

// Demo data (por si endpoint aún no está)
function demoData () {
  const now = new Date()
  const mk = (monthsAgo, area, tipo, canal, nps, tr, ts, ratings, txt = {}) => {
    const d = new Date(now)
    d.setMonth(d.getMonth() - monthsAgo)
    d.setDate(10 + (monthsAgo % 12))
    return {
      id: `demo-${monthsAgo}-${area}-${tipo}`,
      created_at: d.toISOString(),
      area_evaluada: 'Desarrollo e Innovación',
      area_solicitante: area,
      frecuencia: monthsAgo % 2 ? 'Frecuente (semanal)' : 'Ocasional (1-2 al mes)',
      tipo_solicitud: tipo,
      canal,
      periodo: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`,
      descripcion_caso: txt.desc || 'Caso demo para visualizar métricas.',
      ratings,
      tiempo_respuesta: tr,
      tiempo_solucion: ts,
      seguimiento: monthsAgo % 3 ? 'Sí, completo 📌' : 'Sí, parcial 📝',
      nps,
      comentarios: {
        mejor: txt.mejor || 'Buena disposición.',
        mejorar: txt.mejorar || 'Más claridad en tiempos.',
        automatizar: txt.auto || 'Reportes automáticos.',
        productividad: txt.prod || 'Dashboard central.',
        adicionales: txt.add || '',
      },
      meta: { avg_score: computeAvg(ratings), created_at_client: d.toISOString() },
    }
  }

  return [
    mk(0, 'Contabilidad', 'Soporte / Incidente', 'WhatsApp', 9, 'Mismo día 🗓️', '1-2 días ⏳', {
      general: 4, respuesta: 4, solucion: 4, soporte: 5, comunicacion: 4, facilidad: 4, productividadImpacto: 4, facilidadImpacto: 4
    }, { mejorar: 'Mayor visibilidad del estado del caso', auto: 'Conciliaciones', prod: 'Alertas' }),

    mk(1, 'TAT', 'Mejora / Optimización', 'Chat interno', 8, '1-2 días ⏳', '3-5 días 🧠', {
      general: 4, respuesta: 3, solucion: 4, soporte: 4, comunicacion: 4, facilidad: 4, productividadImpacto: 4, facilidadImpacto: 4
    }, { mejorar: 'Priorización', auto: 'Flujos', prod: 'Tablero' }),

    mk(2, 'Bodega', 'Automatización / Integración', 'Correo', 10, 'Menos de 1 hora ⚡', 'Mismo día 🧩', {
      general: 5, respuesta: 5, solucion: 5, soporte: 5, comunicacion: 4, facilidad: 4, productividadImpacto: 5, facilidadImpacto: 5
    }, { mejor: 'Muy ágiles', mejorar: 'Doc más corta', auto: 'Entradas/salidas' }),

    mk(3, 'Recursos humanos', 'Consulta / Acompañamiento', 'Llamada', 7, 'Mismo día 🗓️', '1-2 días ⏳', {
      general: 4, respuesta: 4, solucion: 3, soporte: 4, comunicacion: 4, facilidad: 4, productividadImpacto: 3, facilidadImpacto: 3
    }, { mejorar: 'Seguimiento', auto: 'Solicitudes', prod: 'Tickets' }),

    mk(4, 'Servicios web', 'Desarrollo / Nueva funcionalidad', 'Chat interno', 6, '3-5 días 🐢', 'Más de 5 días 🧯', {
      general: 3, respuesta: 2, solucion: 3, soporte: 4, comunicacion: 3, facilidad: 3, productividadImpacto: 3, facilidadImpacto: 3
    }, { mejorar: 'Tiempos de respuesta', auto: 'Deploys', prod: 'Ambientes' }),

    mk(6, 'Comisiones', 'Soporte / Incidente', 'WhatsApp', 9, 'Menos de 1 hora ⚡', 'Se resolvió en el primer contacto ✅', {
      general: 5, respuesta: 5, solucion: 5, soporte: 5, comunicacion: 5, facilidad: 5, productividadImpacto: 4, facilidadImpacto: 5
    }, { mejor: 'Solución inmediata', mejorar: 'Nada', auto: 'Validaciones' }),

    mk(8, 'Control interno', 'Mejora / Optimización', 'Correo', 8, '1-2 días ⏳', '1-2 días ⏳', {
      general: 4, respuesta: 4, solucion: 4, soporte: 4, comunicacion: 4, facilidad: 4, productividadImpacto: 4, facilidadImpacto: 4
    }, { mejorar: 'Formalizar cierre', auto: 'Auditorías', prod: 'Dashboard' }),

    mk(10, 'Otros', 'Otro', 'Presencial', 7, 'Mismo día 🗓️', '3-5 días 🧠', {
      general: 4, respuesta: 4, solucion: 3, soporte: 4, comunicacion: 3, facilidad: 3, productividadImpacto: 3, facilidadImpacto: 3
    }, { mejorar: 'Comunicación más constante', auto: 'Formularios', prod: 'Plantillas' }),
  ]
}
</script>

<style scoped>
/* Base */
.dash-page{
  --brand: #E11419;
  --text: #0f172a;
  --muted: #64748b;
  --border: rgba(2,6,23,0.10);
  --shadow: 0 18px 40px rgba(2,6,23,0.12);
  --shadow-soft: 0 12px 26px rgba(2,6,23,0.08);
  --radius: 18px;
  background:
    radial-gradient(1100px 520px at 20% -10%, rgba(225,20,25,0.16), transparent 60%),
    radial-gradient(900px 420px at 90% 0%, rgba(2,6,23,0.08), transparent 55%),
    #fff;
  color: var(--text);
}
.muted{ color: var(--muted); }

/* Top */
.top-card{
  border: 1px solid var(--border);
  border-radius: 22px;
  box-shadow: var(--shadow);
  background: rgba(255,255,255,0.92);
  padding: 18px;
  display:flex;
  justify-content:space-between;
  gap: 14px;
  flex-wrap: wrap;
}
.kicker{
  margin: 0;
  font-weight: 900;
  font-size: 12px;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--muted);
}
.title{
  margin: 6px 0 0 0;
  font-weight: 950;
  letter-spacing: -0.02em;
}
.subtitle{
  margin: 10px 0 0 0;
  color: var(--muted);
  font-weight: 650;
  line-height: 1.6;
}
.chips{
  margin-top: 12px;
  display:flex;
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
.actions{
  display:flex;
  gap: 10px;
  align-items:flex-start;
}

/* Filters */
.filters-card{
  border: 1px solid var(--border);
  border-radius: 22px;
  box-shadow: var(--shadow-soft);
  background: rgba(255,255,255,0.92);
  padding: 16px;
}
.filters-meta{
  display:flex;
  gap: 10px;
  flex-wrap: wrap;
}
.badge-soft{
  border: 1px solid rgba(2,6,23,0.10);
  border-radius: 999px;
  padding: 8px 10px;
  background: rgba(2,6,23,0.02);
  font-weight: 800;
  color: var(--muted);
  font-size: 12px;
}

/* KPIs */
.kpi-grid{
  display:grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.kpi{
  border: 1px solid rgba(2,6,23,0.10);
  border-radius: 22px;
  background: rgba(255,255,255,0.92);
  box-shadow: var(--shadow-soft);
  padding: 14px;
}
.kpi-label{
  margin: 0;
  font-weight: 900;
  color: var(--muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .06em;
}
.kpi-value{
  margin: 6px 0 0 0;
  font-weight: 950;
  font-size: 22px;
  display:flex;
  align-items:center;
  gap: 10px;
}
.kpi-emoji{ font-size: 18px; }
.kpi-sub{
  margin: 6px 0 0 0;
  font-weight: 650;
  font-size: 12px;
}

/* Charts */
.chart-grid{
  display:grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.chart-card{
  border: 1px solid rgba(2,6,23,0.10);
  border-radius: 22px;
  background: rgba(255,255,255,0.92);
  box-shadow: var(--shadow-soft);
  overflow:hidden;
}
.chart-head{
  padding: 14px 16px;
  border-bottom: 1px solid rgba(2,6,23,0.08);
  background:
    radial-gradient(700px 260px at 10% 0%, rgba(225,20,25,0.10), transparent 55%),
    #fff;
}
.chart-body{
  padding: 12px 14px;
  height: 320px;
}

/* Insights */
.insights-card{
  border: 1px solid rgba(2,6,23,0.10);
  border-radius: 22px;
  background: rgba(255,255,255,0.92);
  box-shadow: var(--shadow-soft);
  overflow:hidden;
}
.ins-head{
  padding: 14px 16px;
  border-bottom: 1px solid rgba(2,6,23,0.08);
  background:
    radial-gradient(700px 260px at 10% 0%, rgba(225,20,25,0.10), transparent 55%),
    #fff;
}
.ins-body{ padding: 14px 16px; }
.ins-list{
  list-style:none;
  padding:0;
  margin:0;
  display:grid;
  gap: 8px;
}
.ins-dot{
  color: var(--brand);
  font-weight: 950;
  margin-right: 8px;
}
.tags{
  margin-top: 12px;
  display:flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tag{
  border: 1px solid rgba(225,20,25,0.18);
  background: rgba(225,20,25,0.06);
  color: var(--brand);
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 12px;
}

/* Table */
.table-card{
  border: 1px solid rgba(2,6,23,0.10);
  border-radius: 22px;
  background: rgba(255,255,255,0.92);
  box-shadow: var(--shadow-soft);
  overflow:hidden;
}
.table-head{
  padding: 14px 16px;
  border-bottom: 1px solid rgba(2,6,23,0.08);
  background:
    radial-gradient(700px 260px at 10% 0%, rgba(225,20,25,0.10), transparent 55%),
    #fff;
}
.table-body{ padding: 14px 16px; }
.pillx{
  border: 1px solid rgba(2,6,23,0.10);
  background: rgba(2,6,23,0.02);
  border-radius: 999px;
  padding: 4px 10px;
  font-weight: 900;
  color: var(--muted);
}

/* Modal */
.modalx{
  position: fixed;
  inset: 0;
  z-index: 9999;
  display:grid;
  place-items:center;
  padding: 16px;
}
.modalx-backdrop{
  position:absolute;
  inset:0;
  background: rgba(2,6,23,0.35);
}
.modalx-card{
  position:relative;
  width: min(980px, 100%);
  max-height: 90vh;
  overflow:auto;
  border-radius: 22px;
  border: 1px solid rgba(2,6,23,0.10);
  background: rgba(255,255,255,0.96);
  box-shadow: var(--shadow);
}
.modalx-head{
  padding: 14px 16px;
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap: 10px;
  border-bottom: 1px solid rgba(2,6,23,0.08);
  background:
    radial-gradient(700px 260px at 10% 0%, rgba(225,20,25,0.10), transparent 55%),
    #fff;
}
.modalx-kicker{
  margin:0;
  font-weight: 900;
  font-size: 12px;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--muted);
}
.modalx-title{
  margin: 6px 0 0 0;
  font-weight: 950;
}
.modalx-body{ padding: 14px 16px; }
.modalx-foot{
  padding: 14px 16px;
  border-top: 1px solid rgba(2,6,23,0.08);
  display:flex;
  justify-content:flex-end;
}

.box{
  border: 1px solid rgba(2,6,23,0.10);
  border-radius: 18px;
  background: rgba(2,6,23,0.02);
  padding: 12px;
}
.box-title{
  margin:0;
  font-weight: 950;
  color: var(--text);
}
.box-line{
  margin: 6px 0 0 0;
  color: var(--muted);
  font-weight: 700;
}
.box-text{
  margin: 8px 0 0 0;
  color: var(--muted);
  font-weight: 650;
}

.ratings-grid{
  margin-top: 10px;
  display:grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.rating-item{
  border: 1px solid rgba(2,6,23,0.10);
  border-radius: 16px;
  background: rgba(255,255,255,0.85);
  padding: 10px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.r-name{
  font-weight: 900;
  color: var(--muted);
  font-size: 12px;
}
.r-val{
  font-weight: 950;
}

/* Responsive */
@media (max-width: 992px){
  .kpi-grid{ grid-template-columns: 1fr; }
  .chart-grid{ grid-template-columns: 1fr; }
  .ratings-grid{ grid-template-columns: 1fr 1fr; }
}
@media (max-width: 576px){
  .ratings-grid{ grid-template-columns: 1fr; }
}
</style>
