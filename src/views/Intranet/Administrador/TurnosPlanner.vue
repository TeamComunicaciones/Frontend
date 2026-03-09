<template>
  <div class="bg-light">
    <div class="container my-4">
      <div class="row justify-content-center">
        <div class="col-12">

          <div class="card border-0 shadow-sm">
            <div class="card-body p-4 p-md-4">

              <!-- Header -->
              <div class="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-3">
                <div>
                  <h1 class="h3 mb-1">Turnos</h1>
                  <p class="mb-0 text-muted">
                    Planifica (mes) y genera reportes (rango) sin salir de la misma pantalla.
                  </p>
                </div>

                <div class="d-flex gap-2 flex-wrap align-items-end">
                  <div>
                    <label class="form-label fw-bold mb-1">Mes</label>
                    <input type="month" class="form-control" v-model="monthValue" :disabled="isLoading" />
                  </div>

                  <button class="btn btn-outline-secondary" @click="openPersonas" :disabled="isLoading">
                    Personas
                  </button>

                  <button class="btn btn-danger" @click="reloadAll" :disabled="isLoading">
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    Recargar
                  </button>
                </div>
              </div>

              <!-- Tabs -->
              <ul class="nav nav-pills mb-3">
                <li class="nav-item">
                  <button class="nav-link" :class="{ active: activeTab === 'plan' }" @click="activeTab = 'plan'">
                    Planificar
                  </button>
                </li>
                <li class="nav-item">
                  <button class="nav-link" :class="{ active: activeTab === 'reports' }" @click="goReports()">
                    Reportes
                  </button>
                </li>
              </ul>

              <!-- Common bar: foco + config -->
              <div class="row g-2 align-items-end bg-white p-3 rounded border mb-3">
                <div class="col-12 col-md-3">
                  <label class="form-label fw-bold mb-1">Fecha foco</label>
                  <input type="date" class="form-control" v-model="focusDateISO" />
                </div>

                <div class="col-6 col-md-2">
                  <label class="form-label fw-bold mb-1">Inicio día</label>
                  <input type="time" class="form-control" v-model="gridConfig.dayStart" />
                </div>
                <div class="col-6 col-md-2">
                  <label class="form-label fw-bold mb-1">Fin día</label>
                  <input type="time" class="form-control" v-model="gridConfig.dayEnd" />
                </div>
                <div class="col-6 col-md-2">
                  <label class="form-label fw-bold mb-1">Bloque</label>
                  <select class="form-select" v-model.number="gridConfig.step">
                    <option :value="60">60 min</option>
                    <option :value="30">30 min</option>
                    <option :value="15">15 min</option>
                  </select>
                </div>

                <div class="col-6 col-md-3 d-flex gap-2">
                  <button class="btn btn-outline-secondary w-100" @click="openDayDetail(focusDateISO)" :disabled="isLoading">
                    Detalle día
                  </button>
                  <button class="btn btn-outline-secondary w-100" @click="openWeekSummary(focusDateISO)" :disabled="isLoading">
                    Semana foco
                  </button>
                </div>
              </div>

              <!-- Loading -->
              <div v-if="isLoading" class="text-center p-4">
                <div class="spinner-border text-danger" role="status"></div>
              </div>

              <!-- ================= TAB: PLANIFICAR (MES) ================= -->
              <div v-else-if="activeTab === 'plan'">
                <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                  <div class="small text-muted">
                    Click en una celda para crear/editar el turno del día.
                  </div>
                  <div class="small text-muted">
                    Tip: el botón “Detalle día” usa la Fecha foco.
                  </div>
                </div>

                <div class="table-responsive planner-scroll">
                  <table class="table table-bordered align-middle planner-table">
                    <thead>
                      <tr>
                        <th class="sticky-col sticky-head name-col">Persona</th>
                        <th v-for="d in monthDays" :key="d.iso" class="sticky-head day-head text-center">
                          <div class="d-flex flex-column align-items-center">
                            <div class="fw-bold">{{ d.weekdayShort }} {{ d.day }}</div>
                            <div class="small text-muted">{{ d.monthShort }}</div>
                            <button class="btn btn-sm btn-outline-secondary mt-2" @click="openDayDetail(d.iso)">
                              Detalle
                            </button>
                          </div>
                        </th>
                      </tr>
                      <tr>
                        <th class="sticky-col sticky-head name-col small text-muted">—</th>
                        <th v-for="d in monthDays" :key="d.iso + '-sub'" class="sticky-head text-center small">
                          Entrada / Salida
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr v-if="personas.length === 0">
                        <td class="sticky-col name-col">
                          <div class="fw-semibold">Sin personas</div>
                          <div class="small text-muted">Dale en “Personas” para agregarlas.</div>
                        </td>
                        <td v-for="d in monthDays" :key="'empty-'+d.iso" class="turno-cell text-muted small text-center">—</td>
                      </tr>

                      <tr v-for="p in personas" :key="p.id">
                        <td class="sticky-col name-col">
                          <div class="fw-semibold">{{ p.nombre }}</div>
                          <div class="small text-muted">ID: {{ p.id }}</div>
                        </td>

                        <td
                          v-for="d in monthDays"
                          :key="p.id + '-' + d.iso"
                          class="turno-cell"
                          @click="openEdit(p, d.iso)"
                        >
                          <template v-if="getTurno(p.id, d.iso)">
                            <div class="fw-semibold">
                              {{ hhmm(getTurno(p.id, d.iso).entrada_1) }} - {{ hhmm(getTurno(p.id, d.iso).salida_1) }}
                            </div>

                            <div v-if="getTurno(p.id, d.iso).entrada_2 && getTurno(p.id, d.iso).salida_2" class="small">
                              {{ hhmm(getTurno(p.id, d.iso).entrada_2) }} - {{ hhmm(getTurno(p.id, d.iso).salida_2) }}
                            </div>

                            <div v-if="getTurno(p.id, d.iso).almuerzo_inicio && getTurno(p.id, d.iso).almuerzo_fin" class="small text-muted">
                              Alm: {{ hhmm(getTurno(p.id, d.iso).almuerzo_inicio) }} - {{ hhmm(getTurno(p.id, d.iso).almuerzo_fin) }}
                            </div>

                            <div class="small mt-1">
                              <span class="badge bg-light text-dark border">
                                {{ round2(getTurno(p.id, d.iso).total_horas ?? 0) }}h
                              </span>
                            </div>
                          </template>

                          <template v-else>
                            <div class="text-muted small">—</div>
                          </template>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- ================= TAB: REPORTES ================= -->
              <div v-else>
                <!-- Report filters -->
                <div class="row g-2 align-items-end bg-white p-3 rounded border mb-3">
                  <div class="col-12 col-md-3">
                    <label class="form-label fw-bold mb-1">Inicio</label>
                    <input type="date" class="form-control" v-model="report.start" />
                  </div>
                  <div class="col-12 col-md-3">
                    <label class="form-label fw-bold mb-1">Fin</label>
                    <input type="date" class="form-control" v-model="report.end" />
                  </div>

                  <div class="col-12 col-md-2 d-grid">
                    <button class="btn btn-outline-secondary" @click="setReportWeekFromFocus">
                      Semana (foco)
                    </button>
                  </div>
                  <div class="col-12 col-md-2 d-grid">
                    <button class="btn btn-outline-secondary" @click="setReportMonthFromFocus">
                      Mes (foco)
                    </button>
                  </div>
                  <div class="col-12 col-md-2 d-grid">
                    <button class="btn btn-danger" @click="loadReports">
                      <span v-if="reportsLoading" class="spinner-border spinner-border-sm me-2"></span>
                      Generar
                    </button>
                  </div>

                  <div class="col-12 col-md-4">
                    <label class="form-label fw-bold mb-1">Vista</label>
                    <select class="form-select" v-model="report.view">
                      <option value="matrix">Matriz (día) tipo Excel</option>
                      <option value="coverage">Cobertura (rango) heatmap</option>
                      <option value="hours">Horas por persona (rango)</option>
                    </select>
                  </div>

                  <div class="col-12 col-md-4" v-if="report.view === 'matrix'">
                    <label class="form-label fw-bold mb-1">Día a visualizar</label>
                    <select class="form-select" v-model="report.selectedDay">
                      <option v-for="d in reportDays" :key="d" :value="d">
                        {{ formatDateLabel(d) }}
                      </option>
                    </select>
                  </div>

                  <div class="col-12 col-md-4 d-flex gap-2 justify-content-md-end">
                    <button class="btn btn-outline-secondary w-100" @click="openDayDetail(report.selectedDay)" :disabled="!report.selectedDay">
                      Detalle del día
                    </button>
                    <button class="btn btn-outline-secondary w-100" @click="exportTurnosCsv" :disabled="!reportsLoaded">
                      Export CSV
                    </button>
                  </div>
                </div>

                <!-- Reports loading -->
                <div v-if="reportsLoading" class="text-center p-4">
                  <div class="spinner-border text-danger" role="status"></div>
                </div>

                <!-- ============ Report: Matrix ============ -->
                <div v-else-if="report.view === 'matrix'">
                  <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                    <div class="small text-muted">
                      Día: <span class="fw-semibold">{{ report.selectedDay }}</span>
                      | {{ gridConfig.dayStart }}–{{ gridConfig.dayEnd }} ({{ gridConfig.step }}m)
                    </div>
                    <div class="small text-muted">
                      Click en celda: info + botón “Editar”.
                    </div>
                  </div>

                  <div class="table-responsive planner-scroll">
                    <table class="table table-bordered align-middle matrix-table">
                      <thead>
                        <tr>
                          <th class="sticky-col sticky-head name-col">Persona</th>
                          <th v-for="s in slots" :key="'h-'+s.label" class="sticky-head text-center slot-head">
                            <div class="rot">{{ s.label }}</div>
                          </th>
                          <th class="sticky-head text-center total-col">Horas</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr v-for="p in personas" :key="'mx-'+p.id">
                          <td class="sticky-col name-col">
                            <div class="fw-semibold">{{ p.nombre }}</div>
                            <div class="small text-muted">ID: {{ p.id }}</div>
                          </td>

                          <td
                            v-for="s in slots"
                            :key="`c-${p.id}-${s.label}`"
                            class="mx-cell text-center"
                            :class="mxCellClass(p.id, s)"
                            @click="mxCellClick(p, s)"
                          >
                            <span v-if="mxIsActive(p.id, s)" class="dot"></span>
                          </td>

                          <td class="text-center fw-semibold total-col">
                            {{ mxHoursByPersona[p.id] ?? 0 }}
                          </td>
                        </tr>

                        <tr>
                          <td class="sticky-col name-col fw-bold bg-light">Disponibles</td>
                          <td v-for="s in slots" :key="'disp-'+s.label" class="text-center fw-bold bg-light">
                            {{ mxDisponiblesBySlot[s.label] ?? 0 }}
                          </td>
                          <td class="text-center fw-bold bg-light total-col">{{ mxTotalHorasDia }}</td>
                        </tr>

                        <tr>
                          <td class="sticky-col name-col fw-bold bg-light">Proyección</td>
                          <td v-for="s in slots" :key="'proj-'+s.label" class="bg-light">
                            <input
                              class="form-control form-control-sm text-center"
                              type="number"
                              min="0"
                              :value="mxProjection[s.label] ?? ''"
                              @input="onProjectionInput(s.label, $event.target.value)"
                            />
                          </td>
                          <td class="bg-light total-col"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="small text-muted mt-2">
                    Colores: verde = trabajando, rosado = libre. Bordes rojos si “Disponibles” &lt; “Proyección”.
                  </div>
                </div>

                <!-- ============ Report: Coverage heatmap (backend) ============ -->
                <div v-else-if="report.view === 'coverage'">
                  <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                    <div class="small text-muted">
                      Rango: <span class="fw-semibold">{{ report.start }}</span> → <span class="fw-semibold">{{ report.end }}</span>
                    </div>
                    <div class="small text-muted">
                      Click en una celda para abrir matriz del día.
                    </div>
                  </div>

                  <div class="table-responsive planner-scroll">
                    <table class="table table-bordered align-middle coverage-table">
                      <thead>
                        <tr>
                          <th class="sticky-col sticky-head slot-col">Hora</th>
                          <th v-for="d in reportDays" :key="'cov-h-'+d" class="sticky-head text-center day-col">
                            {{ shortDay(d) }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="s in slots" :key="'cov-row-'+s.label">
                          <td class="sticky-col slot-col fw-semibold">{{ s.label }}</td>
                          <td
                            v-for="d in reportDays"
                            :key="`cov-${d}-${s.label}`"
                            class="text-center cov-cell"
                            :class="heatClass(reportCoverageMap[d]?.[s.label] ?? 0)"
                            @click="openMatrixFromCoverage(d)"
                          >
                            {{ reportCoverageMap[d]?.[s.label] ?? 0 }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- ============ Report: Hours per person ============ -->
                <div v-else>
                  <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                    <div class="small text-muted">
                      Rango: <span class="fw-semibold">{{ report.start }}</span> → <span class="fw-semibold">{{ report.end }}</span>
                    </div>
                    <div class="small text-muted">
                      Total: <span class="fw-semibold">{{ reportTotalHorasRango }}</span> horas
                    </div>
                  </div>

                  <div class="table-responsive">
                    <table class="table table-hover align-middle">
                      <thead>
                        <tr>
                          <th>Persona</th>
                          <th class="text-end">Horas</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="p in personas" :key="'hrs-'+p.id">
                          <td>{{ p.nombre }}</td>
                          <td class="text-end fw-semibold">{{ reportHoursByPersona[p.id] ?? 0 }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- ================= MODAL: EDIT TURNO ================= -->
    <div v-if="editModal.open" class="modal-backdrop-custom">
      <div class="modal-dialog-custom">
        <div class="card border-0 shadow">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h5 class="mb-1">Editar turno</h5>
                <div class="text-muted small">
                  <span class="fw-semibold">{{ editModal.persona?.nombre }}</span> — {{ editModal.fecha }}
                </div>
              </div>
              <button class="btn btn-sm btn-outline-secondary" @click="closeEdit">Cerrar</button>
            </div>

            <fieldset :disabled="editModal.saving">
              <div class="row g-2 mb-2">
                <div class="col-12"><div class="fw-bold">Tramo 1</div></div>
                <div class="col-6">
                  <label class="form-label mb-1">Entrada</label>
                  <input type="time" class="form-control" v-model="editForm.entrada_1" />
                </div>
                <div class="col-6">
                  <label class="form-label mb-1">Salida</label>
                  <input type="time" class="form-control" v-model="editForm.salida_1" />
                </div>
              </div>

              <div class="row g-2 mb-2">
                <div class="col-12 d-flex align-items-center justify-content-between">
                  <div class="fw-bold">Tramo 2 (opcional)</div>
                  <button class="btn btn-sm btn-outline-secondary" @click="toggleTramo2">
                    {{ editForm.entrada_2 || editForm.salida_2 ? 'Quitar tramo 2' : 'Agregar tramo 2' }}
                  </button>
                </div>
                <div class="col-6">
                  <label class="form-label mb-1">Entrada 2</label>
                  <input type="time" class="form-control" v-model="editForm.entrada_2" :disabled="!tramo2Enabled"/>
                </div>
                <div class="col-6">
                  <label class="form-label mb-1">Salida 2</label>
                  <input type="time" class="form-control" v-model="editForm.salida_2" :disabled="!tramo2Enabled"/>
                </div>
              </div>

              <div class="row g-2 mb-2">
                <div class="col-12 d-flex align-items-center justify-content-between">
                  <div class="fw-bold">Almuerzo (opcional)</div>
                  <button class="btn btn-sm btn-outline-secondary" @click="toggleAlmuerzo">
                    {{ editForm.almuerzo_inicio || editForm.almuerzo_fin ? 'Quitar almuerzo' : 'Agregar almuerzo' }}
                  </button>
                </div>
                <div class="col-6">
                  <label class="form-label mb-1">Inicio</label>
                  <input type="time" class="form-control" v-model="editForm.almuerzo_inicio" :disabled="!almuerzoEnabled"/>
                </div>
                <div class="col-6">
                  <label class="form-label mb-1">Fin</label>
                  <input type="time" class="form-control" v-model="editForm.almuerzo_fin" :disabled="!almuerzoEnabled"/>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label mb-1">Nota (opcional)</label>
                <input type="text" class="form-control" v-model="editForm.nota" placeholder="Ej: apoyo, capacitación..." />
              </div>

              <div class="d-flex gap-2 justify-content-end">
                <button v-if="editModal.turnoId" class="btn btn-outline-danger" @click="deleteTurno">
                  Eliminar
                </button>

                <button class="btn btn-danger" @click="saveTurno">
                  <span v-if="editModal.saving" class="spinner-border spinner-border-sm me-2"></span>
                  Guardar
                </button>
              </div>
            </fieldset>

          </div>
        </div>
      </div>
    </div>

    <!-- ================= MODAL: PERSONAS CRUD ================= -->
    <div v-if="personasModal.open" class="modal-backdrop-custom">
      <div class="modal-dialog-custom">
        <div class="card border-0 shadow">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h5 class="mb-1">Personas</h5>
                <div class="text-muted small">Agrega/edita las personas del planificador.</div>
              </div>
              <button class="btn btn-sm btn-outline-secondary" @click="closePersonas">Cerrar</button>
            </div>

            <div class="row g-2 mb-3">
              <div class="col-12 col-md-6">
                <label class="form-label mb-1">Nombre</label>
                <input class="form-control" v-model="personForm.nombre" placeholder="Ej: Laura, Andrés..." />
              </div>
              <div class="col-6 col-md-3">
                <label class="form-label mb-1">Orden</label>
                <input type="number" class="form-control" v-model.number="personForm.orden" />
              </div>
              <div class="col-6 col-md-3 d-flex align-items-end">
                <button class="btn btn-danger w-100" @click="savePersona" :disabled="personasModal.saving">
                  <span v-if="personasModal.saving" class="spinner-border spinner-border-sm me-2"></span>
                  {{ personForm.id ? 'Actualizar' : 'Agregar' }}
                </button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-sm table-hover align-middle">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Orden</th>
                    <th class="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in personas" :key="'p-'+p.id">
                    <td>{{ p.nombre }}</td>
                    <td>{{ p.orden }}</td>
                    <td class="text-end">
                      <button class="btn btn-sm btn-outline-secondary me-2" @click="editPersona(p)">Editar</button>
                      <button class="btn btn-sm btn-outline-danger" @click="deletePersona(p)">Eliminar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="small text-muted mt-2">
              Nota: eliminar una persona elimina también sus turnos (cascade).
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import Swal from 'sweetalert2';
import api from '@/services/apiService';

const PERSONAS_ENDPOINT = 'turnos/personas/';
const TURNOS_ENDPOINT = 'turnos/';
const TURNOS_RESUMEN_ENDPOINT = 'turnos/resumen/';
const TURNOS_COBERTURA_ENDPOINT = 'turnos/cobertura/';

const activeTab = ref('plan');
const isLoading = ref(false);

const personas = ref([]);
const monthValue = ref(new Date().toISOString().slice(0, 7));
const focusDateISO = ref(new Date().toISOString().slice(0, 10));

// Config para matriz/coverage
const gridConfig = reactive({
  dayStart: '08:00',
  dayEnd: '20:00',
  step: 60,
});

// Cache unificado de turnos: key = `${personaId}-${fechaISO}`
const turnosCache = reactive(new Map());

// -------- Helpers fecha/hora --------
function pad2(n){ return String(n).padStart(2,'0'); }
function hhmm(t){ return t ? String(t).slice(0,5) : ''; }
function round2(n){ return Math.round((Number(n)+Number.EPSILON)*100)/100; }

function monthStartEnd(yyyyMM){
  const [y, m] = yyyyMM.split('-').map(Number);
  const end = new Date(Date.UTC(y, m, 0));
  const startISO = `${y}-${pad2(m)}-01`;
  const endISO = `${y}-${pad2(m)}-${pad2(end.getUTCDate())}`;
  return { startISO, endISO, y, m };
}

const monthDays = computed(() => {
  const { y, m } = monthStartEnd(monthValue.value);
  const d = new Date(Date.UTC(y, m - 1, 1));
  const res = [];
  const monthShort = d.toLocaleDateString('es-CO', { month: 'short', timeZone: 'UTC' });

  while (d.getUTCMonth() === (m - 1)) {
    const iso = `${d.getUTCFullYear()}-${pad2(d.getUTCMonth()+1)}-${pad2(d.getUTCDate())}`;
    const weekdayShort = d.toLocaleDateString('es-CO', { weekday: 'short', timeZone: 'UTC' }).replace('.', '');
    res.push({ iso, day: d.getUTCDate(), weekdayShort, monthShort });
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return res;
});

function keyTurno(personaId, fechaISO){ return `${personaId}-${fechaISO}`; }
function getTurno(personaId, fechaISO){ return turnosCache.get(keyTurno(personaId, fechaISO)) || null; }

// Slots (para matriz Excel)
function hhmmToMin(hhmmStr){
  const [h, m] = hhmmStr.split(':').map(Number);
  return h*60 + m;
}
function minToHHMM(min){
  const h = Math.floor(min/60);
  const m = min%60;
  return `${pad2(h)}:${pad2(m)}`;
}
const slots = computed(() => {
  const start = hhmmToMin(gridConfig.dayStart);
  const end = hhmmToMin(gridConfig.dayEnd);
  const step = Number(gridConfig.step);
  const res = [];
  for (let t = start; t < end; t += step){
    res.push({ startMin: t, endMin: t + step, label: minToHHMM(t) });
  }
  return res;
});

// -------- API loaders --------
async function fetchPersonas(){
  const res = await api.get(PERSONAS_ENDPOINT);
  personas.value = Array.isArray(res.data) ? res.data : (res.data.results || []);
}

async function fetchTurnosRange(startISO, endISO){
  const qs = new URLSearchParams({ start: startISO, end: endISO }).toString();
  const res = await api.get(`${TURNOS_ENDPOINT}?${qs}`);
  const arr = res.data || [];
  for (const t of arr){
    turnosCache.set(keyTurno(t.persona, t.fecha), t);
  }
  return arr;
}

async function loadPlannerMonth(){
  const { startISO, endISO } = monthStartEnd(monthValue.value);
  await fetchTurnosRange(startISO, endISO);
}

// Reload all
async function reloadAll(){
  try{
    isLoading.value = true;
    await fetchPersonas();
    await loadPlannerMonth();
    // Ajuste fecha foco al 1er día del mes si no cae en el mes actual
    const { startISO } = monthStartEnd(monthValue.value);
    if (!focusDateISO.value || focusDateISO.value.slice(0,7) !== monthValue.value){
      focusDateISO.value = startISO;
    }
  }catch(err){
    console.error(err);
    Swal.fire('Error', 'No se pudo cargar la información.', 'error');
  }finally{
    isLoading.value = false;
  }
}

// Al cambiar mes: recarga turnos del mes y ajusta foco al 1er día
watch(monthValue, async () => {
  const { startISO } = monthStartEnd(monthValue.value);
  focusDateISO.value = startISO;
  await reloadAll();
}, { immediate: true });

// -------- Edit Turno modal --------
const editModal = reactive({
  open: false,
  saving: false,
  persona: null,
  fecha: null,
  turnoId: null,
});

const editForm = reactive({
  persona: null,
  fecha: null,
  entrada_1: '',
  salida_1: '',
  entrada_2: '',
  salida_2: '',
  almuerzo_inicio: '',
  almuerzo_fin: '',
  nota: '',
});

const tramo2Enabled = computed(() => !!(editForm.entrada_2 || editForm.salida_2));
const almuerzoEnabled = computed(() => !!(editForm.almuerzo_inicio || editForm.almuerzo_fin));

function openEdit(personaObj, fechaISO){
  focusDateISO.value = fechaISO;

  const existing = getTurno(personaObj.id, fechaISO);

  editModal.open = true;
  editModal.persona = personaObj;
  editModal.fecha = fechaISO;
  editModal.turnoId = existing?.id ?? null;

  editForm.persona = personaObj.id;
  editForm.fecha = fechaISO;

  editForm.entrada_1 = hhmm(existing?.entrada_1) || '08:00';
  editForm.salida_1 = hhmm(existing?.salida_1) || '17:00';
  editForm.entrada_2 = hhmm(existing?.entrada_2) || '';
  editForm.salida_2 = hhmm(existing?.salida_2) || '';
  editForm.almuerzo_inicio = hhmm(existing?.almuerzo_inicio) || '';
  editForm.almuerzo_fin = hhmm(existing?.almuerzo_fin) || '';
  editForm.nota = existing?.nota || '';
}

function closeEdit(){
  editModal.open = false;
  editModal.saving = false;
  editModal.persona = null;
  editModal.fecha = null;
  editModal.turnoId = null;
}

function toggleTramo2(){
  if (editForm.entrada_2 || editForm.salida_2){
    editForm.entrada_2 = '';
    editForm.salida_2 = '';
  } else {
    editForm.entrada_2 = '12:00';
    editForm.salida_2 = '20:00';
  }
}

function toggleAlmuerzo(){
  if (editForm.almuerzo_inicio || editForm.almuerzo_fin){
    editForm.almuerzo_inicio = '';
    editForm.almuerzo_fin = '';
  } else {
    editForm.almuerzo_inicio = '13:00';
    editForm.almuerzo_fin = '14:00';
  }
}

function buildPayload(){
  const toNull = (v) => (v && v.trim() ? v : null);
  return {
    persona: editForm.persona,
    fecha: editForm.fecha,
    entrada_1: editForm.entrada_1,
    salida_1: editForm.salida_1,
    entrada_2: toNull(editForm.entrada_2),
    salida_2: toNull(editForm.salida_2),
    almuerzo_inicio: toNull(editForm.almuerzo_inicio),
    almuerzo_fin: toNull(editForm.almuerzo_fin),
    nota: toNull(editForm.nota),
  };
}

async function saveTurno(){
  try{
    editModal.saving = true;

    if (!editForm.entrada_1 || !editForm.salida_1){
      Swal.fire('Faltan datos', 'Debes diligenciar Entrada 1 y Salida 1.', 'warning');
      return;
    }

    const res = await api.post(TURNOS_ENDPOINT, buildPayload());
    const t = res.data;
    turnosCache.set(keyTurno(t.persona, t.fecha), t);

    Swal.fire({ icon:'success', title:'Guardado', timer:850, showConfirmButton:false });
    closeEdit();

    // si estamos en reportes y el día coincide, refresca reporte del día
    if (activeTab.value === 'reports' && report.selectedDay === t.fecha){
      await loadReportsDayOnly();
    }

  }catch(err){
    console.error(err);
    const msg = err?.response?.data?.detail || JSON.stringify(err?.response?.data || {}) || 'No se pudo guardar.';
    Swal.fire('Error', msg, 'error');
  }finally{
    editModal.saving = false;
  }
}

async function deleteTurno(){
  if (!editModal.turnoId) return;

  const confirm = await Swal.fire({
    title: '¿Eliminar turno?',
    text: 'Esto no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });
  if (!confirm.isConfirmed) return;

  try{
    editModal.saving = true;
    await api.delete(`${TURNOS_ENDPOINT}${editModal.turnoId}/`);
    turnosCache.delete(keyTurno(editForm.persona, editForm.fecha));

    Swal.fire({ icon:'success', title:'Eliminado', timer:850, showConfirmButton:false });
    closeEdit();

    if (activeTab.value === 'reports'){
      await loadReports(); // para recalcular coverage/resumen
    }
  }catch(err){
    console.error(err);
    Swal.fire('Error', 'No se pudo eliminar.', 'error');
  }finally{
    editModal.saving = false;
  }
}

// -------- Personas modal CRUD --------
const personasModal = reactive({ open:false, saving:false });
const personForm = reactive({ id:null, nombre:'', orden:0 });

function openPersonas(){
  personasModal.open = true;
  personForm.id = null;
  personForm.nombre = '';
  personForm.orden = 0;
}

function closePersonas(){
  personasModal.open = false;
}

function editPersona(p){
  personForm.id = p.id;
  personForm.nombre = p.nombre;
  personForm.orden = p.orden ?? 0;
}

async function savePersona(){
  if (!personForm.nombre.trim()){
    Swal.fire('Campo requerido', 'Escribe el nombre.', 'warning');
    return;
  }
  try{
    personasModal.saving = true;

    if (personForm.id){
      await api.put(`${PERSONAS_ENDPOINT}${personForm.id}/`, {
        nombre: personForm.nombre,
        orden: personForm.orden,
        activo: true
      });
    } else {
      await api.post(PERSONAS_ENDPOINT, {
        nombre: personForm.nombre,
        orden: personForm.orden,
        activo: true
      });
    }

    await fetchPersonas();
    personForm.id = null; personForm.nombre=''; personForm.orden=0;
    Swal.fire({ icon:'success', title:'OK', timer:650, showConfirmButton:false });
  }catch(err){
    console.error(err);
    const msg = err?.response?.data?.detail || JSON.stringify(err?.response?.data || {}) || 'No se pudo guardar.';
    Swal.fire('Error', msg, 'error');
  }finally{
    personasModal.saving = false;
  }
}

async function deletePersona(p){
  const confirm = await Swal.fire({
    title:'¿Eliminar persona?',
    text:'Esto elimina también sus turnos.',
    icon:'warning',
    showCancelButton:true,
    confirmButtonText:'Sí, eliminar',
    cancelButtonText:'Cancelar'
  });
  if (!confirm.isConfirmed) return;

  try{
    await api.delete(`${PERSONAS_ENDPOINT}${p.id}/`);
    await fetchPersonas();

    // limpia cache de ese mes para esa persona
    for (const d of monthDays.value){
      turnosCache.delete(keyTurno(p.id, d.iso));
    }

    Swal.fire({ icon:'success', title:'Eliminado', timer:650, showConfirmButton:false });
  }catch(err){
    console.error(err);
    Swal.fire('Error','No se pudo eliminar.','error');
  }
}

// -------- Detalle día / Semana foco (mantengo simple: usa endpoints existentes en tu proyecto) --------
async function openDayDetail(fechaISO){
  // UX: en vez de un drawer grande, damos un resumen rápido con Swal
  try{
    const arr = await fetchTurnosRange(fechaISO, fechaISO);
    const dayTurnos = arr.filter(t => t.fecha === fechaISO);

    if (!dayTurnos.length){
      Swal.fire('Detalle día', `No hay turnos para ${fechaISO}.`, 'info');
      return;
    }

    const lines = dayTurnos
      .sort((a,b) => String(a.persona_nombre||'').localeCompare(String(b.persona_nombre||'')))
      .map(t => `• ${t.persona_nombre || 'Persona'}: ${hhmm(t.entrada_1)}-${hhmm(t.salida_1)}${t.entrada_2 ? ` | ${hhmm(t.entrada_2)}-${hhmm(t.salida_2)}` : ''}`)
      .slice(0, 25);

    Swal.fire({
      title: `Detalle ${fechaISO}`,
      icon: 'info',
      html: `<div style="text-align:left;white-space:pre-line;">${lines.join('\n')}</div>`
    });
  }catch(err){
    console.error(err);
    Swal.fire('Error','No se pudo cargar el detalle.','error');
  }
}

function getWeekRangeFromISO(iso){
  const [y,m,d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m-1, d));
  const day = date.getUTCDay(); // 0 domingo
  const diffToMonday = (day === 0 ? -6 : 1 - day);

  const monday = new Date(date);
  monday.setUTCDate(monday.getUTCDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setUTCDate(sunday.getUTCDate() + 6);

  const start = `${monday.getUTCFullYear()}-${pad2(monday.getUTCMonth()+1)}-${pad2(monday.getUTCDate())}`;
  const end = `${sunday.getUTCFullYear()}-${pad2(sunday.getUTCMonth()+1)}-${pad2(sunday.getUTCDate())}`;
  return { start, end };
}

async function openWeekSummary(focusISO){
  const { start, end } = getWeekRangeFromISO(focusISO);
  try{
    const res = await api.get(`${TURNOS_RESUMEN_ENDPOINT}?start=${start}&end=${end}`);
    const items = res.data?.items || [];
    const top = items.slice(0, 20).map(i => `• ${i.nombre}: ${i.horas}h`);

    Swal.fire({
      title: `Resumen semana (${start} → ${end})`,
      icon: 'info',
      html: `<div style="text-align:left;white-space:pre-line;">${top.join('\n') || 'Sin datos.'}</div>`
    });
  }catch(err){
    console.error(err);
    Swal.fire('Error','No se pudo cargar resumen.','error');
  }
}

// ===================== REPORTES =====================
const reportsLoading = ref(false);
const reportsLoaded = ref(false);

const report = reactive({
  start: '',
  end: '',
  view: 'matrix',
  selectedDay: '',
});

// days in report range
function addDaysISO(iso, delta){
  const [y,m,d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m-1, d));
  dt.setUTCDate(dt.getUTCDate() + delta);
  return `${dt.getUTCFullYear()}-${pad2(dt.getUTCMonth()+1)}-${pad2(dt.getUTCDate())}`;
}
const reportDays = computed(() => {
  if (!report.start || !report.end) return [];
  const res = [];
  let cur = report.start;
  while (cur <= report.end) { res.push(cur); cur = addDaysISO(cur, 1); }
  return res;
});

function formatDateLabel(iso){
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('es-CO', { weekday:'long', year:'numeric', month:'2-digit', day:'2-digit', timeZone:'UTC' });
}
function shortDay(iso){
  const d = new Date(iso + 'T00:00:00Z');
  const wd = d.toLocaleDateString('es-CO', { weekday:'short', timeZone:'UTC' }).replace('.', '');
  return `${wd} ${pad2(d.getUTCDate())}`;
}

function setReportWeekFromFocus(){
  const { start, end } = getWeekRangeFromISO(focusDateISO.value);
  report.start = start;
  report.end = end;
  report.selectedDay = focusDateISO.value;
}
function setReportMonthFromFocus(){
  const y = Number(focusDateISO.value.slice(0,4));
  const m = Number(focusDateISO.value.slice(5,7));
  const start = `${y}-${pad2(m)}-01`;
  const endDate = new Date(Date.UTC(y, m, 0));
  const end = `${y}-${pad2(m)}-${pad2(endDate.getUTCDate())}`;
  report.start = start;
  report.end = end;
  report.selectedDay = focusDateISO.value;
}

// coverage map from backend: day -> slotLabel -> count
const reportCoverageMap = ref({});

// hours range: personaId -> horas
const reportHoursByPersona = ref({});
const reportTotalHorasRango = computed(() => {
  let s = 0;
  for (const p of personas.value){
    s += Number(reportHoursByPersona.value[p.id] || 0);
  }
  return round2(s);
});

// ----- Matrix computations (día) -----
function tToMin(t){
  if (!t) return null;
  const hh = String(t).slice(0,5);
  return hhmmToMin(hh);
}
function subtractInterval(baseStart, baseEnd, subStart, subEnd){
  if (subEnd <= baseStart || subStart >= baseEnd) return [[baseStart, baseEnd]];
  if (subStart <= baseStart && subEnd >= baseEnd) return [];
  if (subStart <= baseStart && subEnd < baseEnd) return [[subEnd, baseEnd]];
  if (subStart > baseStart && subEnd >= baseEnd) return [[baseStart, subStart]];
  if (subStart > baseStart && subEnd < baseEnd) return [[baseStart, subStart],[subEnd, baseEnd]];
  return [[baseStart, baseEnd]];
}
function workIntervals(turno){
  const intervals = [];
  const s1 = tToMin(turno.entrada_1), e1 = tToMin(turno.salida_1);
  if (s1 != null && e1 != null) intervals.push([s1,e1]);

  const s2 = tToMin(turno.entrada_2), e2 = tToMin(turno.salida_2);
  if (s2 != null && e2 != null) intervals.push([s2,e2]);

  const ls = tToMin(turno.almuerzo_inicio), le = tToMin(turno.almuerzo_fin);
  if (ls != null && le != null){
    const out = [];
    for (const [bs,be] of intervals){
      for (const seg of subtractInterval(bs,be,ls,le)) out.push(seg);
    }
    return out;
  }
  return intervals;
}
function overlaps(aStart,aEnd,bStart,bEnd){
  return Math.max(aStart,bStart) < Math.min(aEnd,bEnd);
}

function mxTurno(personaId){
  return getTurno(personaId, report.selectedDay) || null;
}
function mxIsActive(personaId, slot){
  const t = mxTurno(personaId);
  if (!t) return false;
  for (const [ws,we] of workIntervals(t)){
    if (overlaps(ws,we,slot.startMin,slot.endMin)) return true;
  }
  return false;
}
function mxCellClass(personaId, slot){
  const active = mxIsActive(personaId, slot);
  // Warning if projection > available -> border on header row via separate logic
  return active ? 'mx-on' : 'mx-off';
}

const mxDisponiblesBySlot = computed(() => {
  const obj = {};
  for (const s of slots.value){
    let c = 0;
    for (const p of personas.value){
      if (mxIsActive(p.id, s)) c += 1;
    }
    obj[s.label] = c;
  }
  return obj;
});

const mxHoursByPersona = computed(() => {
  const obj = {};
  for (const p of personas.value){
    const t = mxTurno(p.id);
    obj[p.id] = round2(Number(t?.total_horas || 0));
  }
  return obj;
});

const mxTotalHorasDia = computed(() => {
  let sum = 0;
  for (const p of personas.value){
    sum += Number(mxHoursByPersona.value[p.id] || 0);
  }
  return round2(sum);
});

// Projection (localStorage por día/config)
const mxProjection = ref({});
function projectionKey(dayISO){
  return `turnos_projection_${dayISO}_${gridConfig.dayStart}_${gridConfig.dayEnd}_${gridConfig.step}`;
}
function loadProjection(dayISO){
  try{
    const raw = localStorage.getItem(projectionKey(dayISO));
    mxProjection.value = raw ? JSON.parse(raw) : {};
  }catch{
    mxProjection.value = {};
  }
}
function onProjectionInput(slotLabel, value){
  const v = value === '' ? null : Number(value);
  const next = { ...(mxProjection.value || {}) };
  if (v === null || Number.isNaN(v)) delete next[slotLabel];
  else next[slotLabel] = v;
  mxProjection.value = next;
  localStorage.setItem(projectionKey(report.selectedDay), JSON.stringify(next));
}

// click cell => info + quick edit
async function mxCellClick(personaObj, slot){
  const t = mxTurno(personaObj.id);
  if (!t){
    const c = await Swal.fire({
      title: 'Sin turno',
      text: `${personaObj.nombre} no tiene turno ese día. ¿Crear uno?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar'
    });
    if (c.isConfirmed) openEdit(personaObj, report.selectedDay);
    return;
  }

  const active = mxIsActive(personaObj.id, slot);
  const html = `
<div style="text-align:left">
  <div><b>${personaObj.nombre}</b></div>
  <div class="mt-2"><b>Fecha:</b> ${report.selectedDay}</div>
  <div><b>Tramo 1:</b> ${hhmm(t.entrada_1)} - ${hhmm(t.salida_1)}</div>
  <div><b>Tramo 2:</b> ${t.entrada_2 ? hhmm(t.entrada_2) : '—'} - ${t.salida_2 ? hhmm(t.salida_2) : '—'}</div>
  <div><b>Almuerzo:</b> ${t.almuerzo_inicio ? hhmm(t.almuerzo_inicio) : '—'} - ${t.almuerzo_fin ? hhmm(t.almuerzo_fin) : '—'}</div>
  <div><b>Horas:</b> ${t.total_horas ?? '—'}</div>
  <div class="mt-2"><b>Slot:</b> ${slot.label} (${gridConfig.step} min)</div>
  <div><b>Estado:</b> ${active ? 'TRABAJANDO' : 'LIBRE'}</div>
</div>`;

  const r = await Swal.fire({
    title: active ? 'Trabajando' : 'Libre',
    icon: active ? 'success' : 'info',
    html,
    showCancelButton: true,
    confirmButtonText: 'Editar turno',
    cancelButtonText: 'Cerrar'
  });

  if (r.isConfirmed){
    openEdit(personaObj, report.selectedDay);
  }
}

// Coverage heat classes
function heatClass(count){
  if (count >= 10) return 'heat-strong';
  if (count >= 7) return 'heat-mid';
  if (count >= 4) return 'heat-low';
  return 'heat-zero';
}

function openMatrixFromCoverage(dayISO){
  report.view = 'matrix';
  report.selectedDay = dayISO;
  loadProjection(dayISO);
}

function goReports(){
  activeTab.value = 'reports';
  if (!report.start || !report.end){
    setReportWeekFromFocus();
  }
  if (!report.selectedDay) report.selectedDay = focusDateISO.value;
  loadReports(); // auto
}

async function loadReportsDayOnly(){
  // Asegura turnos del día en cache
  await fetchTurnosRange(report.selectedDay, report.selectedDay);
  loadProjection(report.selectedDay);
}

async function loadReports(){
  if (!report.start || !report.end){
    setReportWeekFromFocus();
  }
  if (!report.selectedDay) report.selectedDay = focusDateISO.value;

  try{
    reportsLoading.value = true;

    // 1) traer turnos del rango y llenar cache
    const arr = await fetchTurnosRange(report.start, report.end);

    // 2) resumen horas por persona (backend)
    const resumen = await api.get(`${TURNOS_RESUMEN_ENDPOINT}?start=${report.start}&end=${report.end}`);
    const items = resumen.data?.items || [];
    const map = {};
    for (const p of personas.value) map[p.id] = 0;
    for (const it of items){
      // backend: persona_id
      map[it.persona_id] = round2(it.horas);
    }
    reportHoursByPersona.value = map;

    // 3) cobertura (backend) — se dibuja más rápido que calcular todo en front
    const qs = new URLSearchParams({
      start: report.start,
      end: report.end,
      step: String(gridConfig.step),
      day_start: gridConfig.dayStart,
      day_end: gridConfig.dayEnd
    }).toString();

    const cov = await api.get(`${TURNOS_COBERTURA_ENDPOINT}?${qs}`);
    const days = cov.data?.days || [];
    const covMap = {};
    for (const d of days){
      covMap[d.date] = {};
      for (const s of (d.slots || [])){
        covMap[d.date][s.time] = s.count;
      }
    }
    reportCoverageMap.value = covMap;

    // 4) Asegura día seleccionado en cache + projection local
    await loadReportsDayOnly();

    reportsLoaded.value = true;

  }catch(err){
    console.error(err);
    const msg = err?.response?.data?.detail || JSON.stringify(err?.response?.data || {}) || 'No se pudo generar el reporte.';
    Swal.fire('Error', msg, 'error');
  }finally{
    reportsLoading.value = false;
  }
}

// cuando cambie selectedDay en reportes, carga projection y asegura cache del día
watch(() => report.selectedDay, async (d) => {
  if (!d) return;
  loadProjection(d);
  if (activeTab.value === 'reports'){
    await fetchTurnosRange(d, d);
  }
});

// export CSV del rango de reportes (desde cache: reconstruimos con GET para asegurar)
async function exportTurnosCsv(){
  if (!report.start || !report.end){
    Swal.fire('Rango requerido', 'Selecciona inicio y fin.', 'warning');
    return;
  }
  try{
    const arr = await fetchTurnosRange(report.start, report.end);
    if (!arr.length){
      Swal.fire('Sin datos', 'No hay turnos en el rango.', 'info');
      return;
    }

    const headers = ['persona','persona_nombre','fecha','entrada_1','salida_1','entrada_2','salida_2','almuerzo_inicio','almuerzo_fin','total_horas','nota'];
    const rows = arr.map(t => ([
      t.persona,
      (t.persona_nombre || ''),
      t.fecha,
      t.entrada_1 || '',
      t.salida_1 || '',
      t.entrada_2 || '',
      t.salida_2 || '',
      t.almuerzo_inicio || '',
      t.almuerzo_fin || '',
      t.total_horas ?? '',
      t.nota || ''
    ]));

    const csv = [headers, ...rows]
      .map(r => r.map(x => `"${String(x).replaceAll('"','""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `turnos_${report.start}_a_${report.end}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

  }catch(err){
    console.error(err);
    Swal.fire('Error','No se pudo exportar.','error');
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.bg-light { background-color: #f8f9fa; }
h1,h2,h3,h4,h5,h6,.form-label,.btn,p,td,th { font-family: 'Poppins', sans-serif; }

.planner-scroll { overflow: auto; max-height: 70vh; }

/* Planner month table */
.planner-table { border-collapse: separate; border-spacing: 0; min-width: 1100px; }
.name-col { min-width: 260px; background: #fff; }
.day-head { min-width: 140px; }

.sticky-col { position: sticky; left: 0; z-index: 3; background: #fff; }
.sticky-head { position: sticky; top: 0; z-index: 4; background: #f8f9fa; }

.turno-cell { cursor: pointer; background: #fff; transition: background .12s ease-in-out; }
.turno-cell:hover { background: #fbf3f3; }

/* Modal */
.modal-backdrop-custom{
  position: fixed; inset: 0;
  background: rgba(0,0,0,.35);
  display:flex; align-items:center; justify-content:center;
  padding: 14px; z-index:1050;
}
.modal-dialog-custom{ width: min(760px, 100%); }

/* Matrix (Excel-like) */
.matrix-table { min-width: 1200px; border-collapse: separate; border-spacing: 0; }
.slot-head { min-width: 52px; padding: 0; }
.total-col { min-width: 90px; }

.rot{
  height: 72px;
  display:flex;
  align-items:center;
  justify-content:center;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 0.75rem;
  letter-spacing: 0.3px;
}

.mx-cell{
  cursor:pointer;
  padding: 0.25rem;
}
.mx-on{ background: #d9f2d9; }   /* verde */
.mx-off{ background: #f7d6d6; }  /* rosado */

.dot{
  display:inline-block;
  width:10px; height:10px;
  border-radius:999px;
  background:#198754;
}

/* Coverage */
.coverage-table { min-width: 1100px; border-collapse: separate; border-spacing: 0; }
.slot-col { min-width: 90px; background: #fff; }
.day-col { min-width: 80px; }
.cov-cell { cursor:pointer; }

/* Heat */
.heat-strong { background: #d9f2d9; font-weight: 700; }
.heat-mid { background: #e8f7e8; font-weight: 600; }
.heat-low { background: #fff3cd; font-weight: 600; }
.heat-zero { background: #f7d6d6; font-weight: 600; }
</style>