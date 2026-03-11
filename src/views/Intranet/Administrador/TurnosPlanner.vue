<!-- src/views/TurnosPlanner.vue  (o TurnosDashboard.vue si así lo tienes en tu router)
     ✅ Incluye:
     - Grupos (UI sin mostrar #HEX como texto)
     - Plantillas T1/T2 + modo rápido
     - Excel: descargar plantilla + importar
     - Planificar (MES) separado en tablas por grupo
     - Reportes (matriz/coverage/horas) con matriz separada en tablas por grupo
-->
<template>
  <div class="bg-light">
    <div class="container my-4">
      <div class="row justify-content-center">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4 p-md-4">
              <!-- HEADER -->
              <div class="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-3">
                <div>
                  <h1 class="h3 mb-1">Planificador de Turnos</h1>
                  <p class="mb-0 text-muted">
                    Personas, grupos, plantillas, carga masiva en Excel y reportes — todo en una sola pantalla.
                  </p>
                </div>

                <div class="d-flex gap-2 flex-wrap align-items-end">
                  <div>
                    <label class="form-label fw-bold mb-1">Mes</label>
                    <input type="month" class="form-control" v-model="monthValue" :disabled="isLoading" />
                  </div>

                  <div>
                    <label class="form-label fw-bold mb-1">Grupo</label>
                    <select class="form-select" v-model="filters.groupId" :disabled="isLoading">
                      <option value="all">Todos</option>
                      <option value="none">Sin grupo</option>
                      <option v-for="g in grupos" :key="g.id" :value="String(g.id)">{{ g.nombre }}</option>
                    </select>
                  </div>

                  <div>
                    <label class="form-label fw-bold mb-1">Buscar</label>
                    <input class="form-control" v-model="filters.search" placeholder="Nombre..." :disabled="isLoading" />
                  </div>

                  <button class="btn btn-outline-secondary" @click="openSettings" :disabled="isLoading">
                    Configuración
                  </button>

                  <button class="btn btn-outline-secondary" @click="downloadExcelTemplate" :disabled="isLoading">
                    Descargar Excel
                  </button>

                  <label class="btn btn-outline-secondary mb-0" :class="{ disabled: isLoading }">
                    Cargar Excel
                    <input type="file" class="d-none" accept=".xlsx" @change="onExcelSelected" :disabled="isLoading" />
                  </label>

                  <button class="btn btn-danger" @click="uploadExcel" :disabled="!excelFile || isLoading">
                    Importar
                  </button>

                  <button class="btn btn-danger" @click="reloadAll" :disabled="isLoading">
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    Recargar
                  </button>
                </div>
              </div>

              <!-- TABS -->
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

              <!-- TOP BAR: FOCO + CONFIG + MODO RAPIDO -->
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

                <div class="col-12 col-md-3">
                  <label class="form-label fw-bold mb-1">Modo rápido (plantilla)</label>
                  <div class="d-flex gap-2">
                    <select class="form-select" v-model="quickApply.plantillaId" :disabled="isLoading">
                      <option :value="null">—</option>
                      <option v-for="t in plantillasActivas" :key="t.id" :value="t.id">
                        {{ t.codigo }} - {{ t.nombre }}
                      </option>
                    </select>
                    <button class="btn btn-outline-secondary" @click="toggleQuickApply" :disabled="!quickApply.plantillaId || isLoading">
                      {{ quickApply.enabled ? 'ON' : 'OFF' }}
                    </button>
                  </div>
                  <div class="small text-muted mt-1">
                    Si está ON: click en celda = asigna y guarda sin modal.
                  </div>
                </div>

                <div class="col-12 d-flex gap-2 justify-content-end mt-2">
                  <button class="btn btn-outline-secondary" @click="openDayDetail(focusDateISO)" :disabled="isLoading">
                    Detalle día (foco)
                  </button>
                  <button class="btn btn-outline-secondary" @click="openWeekSummary(focusDateISO)" :disabled="isLoading">
                    Semana (foco)
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
                    Separado por grupos. Click en celda para crear/editar. Si “Modo rápido” está ON, aplica plantilla y guarda.
                  </div>
                  <div class="small text-muted">
                    Turnos cargados (mes): <span class="fw-semibold">{{ monthTurnosCount }}</span>
                  </div>
                </div>

                <div v-for="g in personasPorGrupo" :key="'plan-group-'+g.id" class="group-section mb-4">
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <div class="d-flex align-items-center gap-2">
                      <div class="color-swatch" :style="{ backgroundColor: g.color }" />
                      <div class="fw-bold">{{ g.nombre }}</div>
                      <span class="badge bg-light text-dark border">{{ g.personas.length }} personas</span>
                    </div>
                  </div>

                  <div class="table-responsive planner-scroll">
                    <table class="table table-bordered align-middle planner-table">
                      <thead>
                        <tr>
                          <th class="sticky-col sticky-head name-col">Persona</th>
                          <th v-for="d in monthDays" :key="g.id + '-' + d.iso" class="sticky-head day-head text-center">
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
                          <th v-for="d in monthDays" :key="g.id + '-' + d.iso + '-sub'" class="sticky-head text-center small">
                            Turno
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr v-for="p in g.personas" :key="'plan-row-' + g.id + '-' + p.id">
                          <td class="sticky-col name-col">
                            <div class="fw-semibold">{{ p.nombre }}</div>
                            <div class="small text-muted">ID: {{ p.id }}</div>
                          </td>

                          <td
                            v-for="d in monthDays"
                            :key="'plan-cell-' + g.id + '-' + p.id + '-' + d.iso"
                            class="turno-cell"
                            @click="onCellClick(p, d.iso)"
                          >
                            <template v-if="getTurno(p.id, d.iso)">
                              <div class="fw-semibold">
                                {{ hhmm(getTurno(p.id, d.iso).entrada_1) }} - {{ hhmm(getTurno(p.id, d.iso).salida_1) }}
                              </div>

                              <div class="small mt-1 d-flex gap-2 flex-wrap">
                                <span v-if="guessPlantillaCode(getTurno(p.id, d.iso))" class="badge bg-primary">
                                  {{ guessPlantillaCode(getTurno(p.id, d.iso)) }}
                                </span>
                                <span class="badge bg-light text-dark border">
                                  {{ round2(getTurno(p.id, d.iso).total_horas ?? 0) }}h
                                </span>
                              </div>
                            </template>

                            <template v-else>
                              <div class="text-muted small">—</div>
                              <div v-if="quickApply.enabled && quickApply.plantillaId" class="small text-muted">
                                click = aplicar
                              </div>
                            </template>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- ================= TAB: REPORTES ================= -->
              <div v-else>
                <div class="row g-2 align-items-end bg-white p-3 rounded border mb-3">
                  <div class="col-12 col-md-3">
                    <label class="form-label fw-bold mb-1">Inicio</label>
                    <input type="date" class="form-control" v-model="report.start" :disabled="reportsLoading" />
                  </div>
                  <div class="col-12 col-md-3">
                    <label class="form-label fw-bold mb-1">Fin</label>
                    <input type="date" class="form-control" v-model="report.end" :disabled="reportsLoading" />
                  </div>

                  <div class="col-12 col-md-2 d-grid">
                    <button class="btn btn-outline-secondary" @click="setReportWeekFromFocus" :disabled="reportsLoading">
                      Semana (foco)
                    </button>
                  </div>
                  <div class="col-12 col-md-2 d-grid">
                    <button class="btn btn-outline-secondary" @click="setReportMonthFromFocus" :disabled="reportsLoading">
                      Mes (foco)
                    </button>
                  </div>

                  <div class="col-12 col-md-2 d-grid">
                    <button class="btn btn-danger" @click="loadReports" :disabled="reportsLoading">
                      <span v-if="reportsLoading" class="spinner-border spinner-border-sm me-2"></span>
                      Generar
                    </button>
                  </div>

                  <div class="col-12 col-md-4">
                    <label class="form-label fw-bold mb-1">Vista</label>
                    <select class="form-select" v-model="report.view" :disabled="reportsLoading">
                      <option value="matrix">Matriz (día) tipo Excel</option>
                      <option value="coverage">Cobertura (rango) heatmap</option>
                      <option value="hours">Horas por persona (rango)</option>
                    </select>
                  </div>

                  <div class="col-12 col-md-4" v-if="report.view === 'matrix'">
                    <label class="form-label fw-bold mb-1">Día a visualizar</label>
                    <select class="form-select" v-model="report.selectedDay" :disabled="reportsLoading">
                      <option v-for="d in reportDays" :key="d" :value="d">
                        {{ formatDateLabel(d) }}
                      </option>
                    </select>
                  </div>

                  <div class="col-12 col-md-4 d-flex gap-2 justify-content-md-end">
                    <button class="btn btn-outline-secondary w-100" @click="openDayDetail(report.selectedDay)" :disabled="!report.selectedDay || reportsLoading">
                      Detalle del día
                    </button>
                    <button class="btn btn-outline-secondary w-100" @click="exportTurnosCsv" :disabled="!reportsLoaded || reportsLoading">
                      Export CSV
                    </button>
                  </div>
                </div>

                <div v-if="reportsLoading" class="text-center p-4">
                  <div class="spinner-border text-danger" role="status"></div>
                </div>

                <!-- Report: Matrix (separada por grupo) -->
                <div v-else-if="report.view === 'matrix'">
                  <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                    <div class="small text-muted">
                      Día: <span class="fw-semibold">{{ report.selectedDay }}</span>
                      | {{ gridConfig.dayStart }}–{{ gridConfig.dayEnd }} ({{ gridConfig.step }}m)
                    </div>
                    <div class="small text-muted">
                      Separado por grupos. Verde = trabajando, rosado = libre.
                    </div>
                  </div>

                  <!-- Resumen general (Proyección global) -->
                  <div class="table-responsive mb-3">
                    <table class="table table-bordered align-middle matrix-summary">
                      <thead>
                        <tr>
                          <th class="summary-label">Resumen general</th>
                          <th v-for="s in slots" :key="'sum-h-'+s.label" class="text-center small">
                            {{ s.label }}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="summary-label fw-bold bg-light">Disponibles</td>
                          <td
                            v-for="s in slots"
                            :key="'sum-disp-'+s.label"
                            class="text-center fw-bold bg-light"
                            :class="projectionWarnClass(s.label)"
                          >
                            {{ mxDisponiblesBySlot[s.label] ?? 0 }}
                          </td>
                        </tr>
                        <tr>
                          <td class="summary-label fw-bold bg-light">Proyección</td>
                          <td v-for="s in slots" :key="'sum-proj-'+s.label" class="bg-light">
                            <input
                              class="form-control form-control-sm text-center"
                              type="number"
                              min="0"
                              :value="mxProjection[s.label] ?? ''"
                              @input="onProjectionInput(s.label, $event.target.value)"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div v-for="g in personasPorGrupo" :key="'rep-mx-group-'+g.id" class="mb-4">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                      <div class="d-flex align-items-center gap-2">
                        <div class="color-swatch" :style="{ backgroundColor: g.color }" />
                        <div class="fw-bold">{{ g.nombre }}</div>
                        <span class="badge bg-light text-dark border">{{ g.personas.length }} personas</span>
                      </div>
                      <div class="small text-muted">Horas grupo: <span class="fw-semibold">{{ mxTotalHorasDiaForGroup(g) }}</span></div>
                    </div>

                    <div class="table-responsive planner-scroll">
                      <table class="table table-bordered align-middle matrix-table">
                        <thead>
                          <tr>
                            <th class="sticky-col sticky-head name-col">Persona</th>
                            <th v-for="s in slots" :key="'h-'+g.id+'-'+s.label" class="sticky-head text-center slot-head">
                              <div class="rot">{{ s.label }}</div>
                            </th>
                            <th class="sticky-head text-center total-col">Horas</th>
                          </tr>
                        </thead>

                        <tbody>
                          <tr v-for="p in g.personas" :key="'mx-'+g.id+'-'+p.id">
                            <td class="sticky-col name-col">
                              <div class="fw-semibold">{{ p.nombre }}</div>
                            </td>

                            <td
                              v-for="s in slots"
                              :key="`c-${g.id}-${p.id}-${s.label}`"
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

                          <!-- Totales por grupo (solo informativo) -->
                          <tr>
                            <td class="sticky-col name-col fw-bold bg-light">Disponibles (grupo)</td>
                            <td v-for="s in slots" :key="'grp-disp-'+g.id+'-'+s.label" class="text-center fw-bold bg-light">
                              {{ mxDisponiblesBySlotForGroup(g, s) }}
                            </td>
                            <td class="text-center fw-bold bg-light total-col">{{ mxTotalHorasDiaForGroup(g) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div class="small text-muted mt-2">
                    Bordes rojos en “Resumen general → Disponibles” cuando Disponibles &lt; Proyección (si la proyección está definida).
                  </div>
                </div>

                <!-- Report: Coverage -->
                <div v-else-if="report.view === 'coverage'">
                  <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                    <div class="small text-muted">
                      Rango: <span class="fw-semibold">{{ report.start }}</span> → <span class="fw-semibold">{{ report.end }}</span>
                    </div>
                    <div class="small text-muted">Click en celda: cambia a Matriz del día.</div>
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

                <!-- Report: Hours -->
                <div v-else>
                  <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                    <div class="small text-muted">
                      Total rango: <span class="fw-semibold">{{ reportTotalHorasRango }}</span> horas
                    </div>
                  </div>

                  <div v-for="g in personasPorGrupo" :key="'hrs-group-'+g.id" class="mb-4">
                    <div class="d-flex align-items-center gap-2 mb-2">
                      <div class="color-swatch" :style="{ backgroundColor: g.color }" />
                      <div class="fw-bold">{{ g.nombre }}</div>
                      <span class="badge bg-light text-dark border">{{ g.personas.length }} personas</span>
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
                          <tr v-for="p in g.personas" :key="'hrs-'+g.id+'-'+p.id">
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
              <!-- Plantilla -->
              <div class="row g-2 mb-3">
                <div class="col-12 d-flex align-items-end gap-2">
                  <div class="flex-grow-1">
                    <label class="form-label mb-1 fw-bold">Aplicar plantilla</label>
                    <select class="form-select" v-model="selectedPlantillaId">
                      <option :value="null">—</option>
                      <option v-for="t in plantillasActivas" :key="t.id" :value="t.id">
                        {{ t.codigo }} - {{ t.nombre }}
                      </option>
                    </select>
                  </div>
                  <button class="btn btn-outline-secondary" @click="applyPlantillaToForm" :disabled="!selectedPlantillaId">
                    Aplicar
                  </button>
                </div>
                <div class="small text-muted">Tip: usa plantillas para asignar T1/T2 en 1 click.</div>
              </div>

              <!-- Tramo 1 -->
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

              <!-- Tramo 2 -->
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

              <!-- Almuerzo -->
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
                <button v-if="editModal.turnoId" class="btn btn-outline-danger" @click="deleteTurno">Eliminar</button>
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

    <!-- ================= MODAL: SETTINGS ================= -->
    <div v-if="settingsModal.open" class="modal-backdrop-custom">
      <div class="modal-dialog-custom modal-lg">
        <div class="card border-0 shadow">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h5 class="mb-1">Configuración</h5>
                <div class="text-muted small">Administra Personas, Grupos y Plantillas.</div>
              </div>
              <button class="btn btn-sm btn-outline-secondary" @click="closeSettings">Cerrar</button>
            </div>

            <ul class="nav nav-pills mb-3">
              <li class="nav-item">
                <button class="nav-link" :class="{ active: settingsModal.tab === 'personas' }" @click="settingsModal.tab = 'personas'">
                  Personas
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link" :class="{ active: settingsModal.tab === 'grupos' }" @click="settingsModal.tab = 'grupos'">
                  Grupos
                </button>
              </li>
              <li class="nav-item">
                <button class="nav-link" :class="{ active: settingsModal.tab === 'plantillas' }" @click="settingsModal.tab = 'plantillas'">
                  Plantillas
                </button>
              </li>
            </ul>

            <!-- PERSONAS -->
            <div v-if="settingsModal.tab === 'personas'">
              <div class="row g-2 mb-3">
                <div class="col-12 col-md-5">
                  <label class="form-label mb-1">Nombre</label>
                  <input class="form-control" v-model="personForm.nombre" placeholder="Ej: Laura, Andrés..." />
                </div>
                <div class="col-6 col-md-2">
                  <label class="form-label mb-1">Orden</label>
                  <input type="number" class="form-control" v-model.number="personForm.orden" />
                </div>
                <div class="col-6 col-md-3">
                  <label class="form-label mb-1">Grupo</label>
                  <select class="form-select" v-model="personForm.grupo">
                    <option :value="null">Sin grupo</option>
                    <option v-for="g in grupos" :key="g.id" :value="g.id">{{ g.nombre }}</option>
                  </select>
                </div>
                <div class="col-12 col-md-2 d-flex align-items-end">
                  <button class="btn btn-danger w-100" @click="savePersona" :disabled="settingsModal.saving">
                    <span v-if="settingsModal.saving" class="spinner-border spinner-border-sm me-2"></span>
                    {{ personForm.id ? 'Actualizar' : 'Agregar' }}
                  </button>
                </div>
              </div>

              <div class="table-responsive">
                <table class="table table-sm table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Grupo</th>
                      <th>Orden</th>
                      <th class="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="p in personas" :key="'sp-'+p.id">
                      <td>{{ p.nombre }}</td>
                      <td>
                        <span v-if="p.grupo_nombre" class="badge text-white" :style="{ background: p.grupo_color || '#6c757d' }">
                          {{ p.grupo_nombre }}
                        </span>
                        <span v-else class="text-muted">—</span>
                      </td>
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
                Nota: eliminar una persona elimina sus turnos (cascade).
              </div>
            </div>

            <!-- GRUPOS -->
            <div v-else-if="settingsModal.tab === 'grupos'">
              <div class="row g-2 mb-3">
                <div class="col-12 col-md-5">
                  <label class="form-label mb-1">Nombre</label>
                  <input class="form-control" v-model="groupForm.nombre" placeholder="Ej: Back Office, Financiación..." />
                </div>
                <div class="col-6 col-md-2">
                  <label class="form-label mb-1">Orden</label>
                  <input type="number" class="form-control" v-model.number="groupForm.orden" />
                </div>
                <div class="col-6 col-md-3">
                  <label class="form-label mb-1">Color</label>
                  <input type="color" class="form-control form-control-color w-100" v-model="groupForm.color" />
                </div>
                <div class="col-12 col-md-2 d-flex align-items-end">
                  <button class="btn btn-danger w-100" @click="saveGrupo" :disabled="settingsModal.saving">
                    <span v-if="settingsModal.saving" class="spinner-border spinner-border-sm me-2"></span>
                    {{ groupForm.id ? 'Actualizar' : 'Agregar' }}
                  </button>
                </div>
              </div>

              <div class="table-responsive">
                <table class="table table-sm table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Color</th>
                      <th>Orden</th>
                      <th class="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="g in grupos" :key="'sg-'+g.id">
                      <td>{{ g.nombre }}</td>
                      <!-- ✅ SIN TEXTO #HEX -->
                      <td><div class="color-swatch" :style="{ backgroundColor: g.color || '#6c757d' }" /></td>
                      <td>{{ g.orden }}</td>
                      <td class="text-end">
                        <button class="btn btn-sm btn-outline-secondary me-2" @click="editGrupo(g)">Editar</button>
                        <button class="btn btn-sm btn-outline-danger" @click="deleteGrupo(g)">Eliminar</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="small text-muted mt-2">
                Tip: Los grupos sirven para filtrar y separar Back Office vs Financiación.
              </div>
            </div>

            <!-- PLANTILLAS -->
            <div v-else>
              <div class="row g-2 mb-3">
                <div class="col-12 col-md-2">
                  <label class="form-label mb-1">Código</label>
                  <input class="form-control" v-model="tplForm.codigo" placeholder="T1" />
                </div>
                <div class="col-12 col-md-4">
                  <label class="form-label mb-1">Nombre</label>
                  <input class="form-control" v-model="tplForm.nombre" placeholder="Turno mañana" />
                </div>
                <div class="col-6 col-md-3">
                  <label class="form-label mb-1">Color</label>
                  <input type="color" class="form-control form-control-color w-100" v-model="tplForm.color" />
                </div>
                <div class="col-6 col-md-3 d-flex align-items-end">
                  <button class="btn btn-danger w-100" @click="savePlantilla" :disabled="settingsModal.saving">
                    <span v-if="settingsModal.saving" class="spinner-border spinner-border-sm me-2"></span>
                    {{ tplForm.id ? 'Actualizar' : 'Agregar' }}
                  </button>
                </div>

                <div class="col-6 col-md-3">
                  <label class="form-label mb-1">Entrada 1</label>
                  <input type="time" class="form-control" v-model="tplForm.entrada_1" />
                </div>
                <div class="col-6 col-md-3">
                  <label class="form-label mb-1">Salida 1</label>
                  <input type="time" class="form-control" v-model="tplForm.salida_1" />
                </div>
                <div class="col-6 col-md-3">
                  <label class="form-label mb-1">Entrada 2</label>
                  <input type="time" class="form-control" v-model="tplForm.entrada_2" />
                </div>
                <div class="col-6 col-md-3">
                  <label class="form-label mb-1">Salida 2</label>
                  <input type="time" class="form-control" v-model="tplForm.salida_2" />
                </div>

                <div class="col-6 col-md-3">
                  <label class="form-label mb-1">Almuerzo ini</label>
                  <input type="time" class="form-control" v-model="tplForm.almuerzo_inicio" />
                </div>
                <div class="col-6 col-md-3">
                  <label class="form-label mb-1">Almuerzo fin</label>
                  <input type="time" class="form-control" v-model="tplForm.almuerzo_fin" />
                </div>
              </div>

              <div class="table-responsive">
                <table class="table table-sm table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Nombre</th>
                      <th>Horario</th>
                      <th class="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="t in plantillas" :key="'st-'+t.id">
                      <td><span class="badge bg-primary">{{ t.codigo }}</span></td>
                      <td>{{ t.nombre }}</td>
                      <td class="small">
                        {{ t.entrada_1?.slice(0,5) }}-{{ t.salida_1?.slice(0,5) }}
                        <span v-if="t.entrada_2 && t.salida_2"> | {{ t.entrada_2.slice(0,5) }}-{{ t.salida_2.slice(0,5) }}</span>
                        <span v-if="t.almuerzo_inicio && t.almuerzo_fin"> | Alm {{ t.almuerzo_inicio.slice(0,5) }}-{{ t.almuerzo_fin.slice(0,5) }}</span>
                      </td>
                      <td class="text-end">
                        <button class="btn btn-sm btn-outline-secondary me-2" @click="editPlantilla(t)">Editar</button>
                        <button class="btn btn-sm btn-outline-danger" @click="deletePlantilla(t)">Eliminar</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="small text-muted mt-2">
                Tip: Las plantillas son las que usas como T1/T2 en Excel y en modo rápido.
              </div>
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

// Endpoints (relativos a tu baseURL en BackendRouter)
const PERSONAS_ENDPOINT = 'turnos/personas/';
const GRUPOS_ENDPOINT = 'turnos/grupos/';
const PLANTILLAS_ENDPOINT = 'turnos/plantillas/';
const TURNOS_ENDPOINT = 'turnos/';
const TURNOS_RESUMEN_ENDPOINT = 'turnos/resumen/';
const TURNOS_COBERTURA_ENDPOINT = 'turnos/cobertura/';
const EXCEL_TEMPLATE_ENDPOINT = 'turnos/excel/template/';
const EXCEL_IMPORT_ENDPOINT = 'turnos/excel/import/';

// UI state
const activeTab = ref('plan');
const isLoading = ref(false);
const reportsLoading = ref(false);
const reportsLoaded = ref(false);

// Main data
const personas = ref([]);
const grupos = ref([]);
const plantillas = ref([]);

// Month/focus
const monthValue = ref(new Date().toISOString().slice(0, 7));
const focusDateISO = ref(new Date().toISOString().slice(0, 10));

// Filters
const filters = reactive({
  groupId: 'all', // 'all' | 'none' | '<id>'
  search: ''
});

// Config for slots + coverage endpoint
const gridConfig = reactive({
  dayStart: '08:00',
  dayEnd: '20:00',
  step: 60
});

// Quick apply mode
const quickApply = reactive({
  plantillaId: null,
  enabled: false
});
function toggleQuickApply(){
  quickApply.enabled = !quickApply.enabled;
}

// Excel
const excelFile = ref(null);
function onExcelSelected(e){
  excelFile.value = e.target.files?.[0] || null;
}

// Turnos cache map (personaId-fecha -> turno)
const turnosCache = reactive(new Map());

// Helpers
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
    const weekdayShort = d.toLocaleDateString('es-CO', { weekday:'short', timeZone:'UTC' }).replace('.', '');
    res.push({ iso, day: d.getUTCDate(), weekdayShort, monthShort });
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return res;
});

function keyTurno(personaId, fechaISO){ return `${personaId}-${fechaISO}`; }
function getTurno(personaId, fechaISO){ return turnosCache.get(keyTurno(personaId, fechaISO)) || null; }

const plantillasActivas = computed(() => (plantillas.value || []).filter(t => t.activo !== false));

const filteredPersonas = computed(() => {
  let arr = [...(personas.value || [])];

  if (filters.groupId === 'none') {
    arr = arr.filter(p => !p.grupo);
  } else if (filters.groupId !== 'all') {
    arr = arr.filter(p => String(p.grupo) === String(filters.groupId));
  }

  const q = (filters.search || '').trim().toLowerCase();
  if (q) {
    arr = arr.filter(p => (p.nombre || '').toLowerCase().includes(q));
  }

  arr.sort((a,b) => (a.orden ?? 0) - (b.orden ?? 0) || (a.nombre || '').localeCompare(b.nombre || ''));
  return arr;
});

// ✅ Personas agrupadas (para tablas separadas por grupo)
const personasPorGrupo = computed(() => {
  const map = new Map();

  // grupos existentes
  for (const g of (grupos.value || [])) {
    map.set(String(g.id), {
      id: String(g.id),
      nombre: g.nombre,
      color: g.color || '#6c757d',
      personas: []
    });
  }

  // grupo "sin grupo"
  map.set('none', { id: 'none', nombre: 'Sin grupo', color: '#6c757d', personas: [] });

  // asigna personas
  for (const p of (filteredPersonas.value || [])) {
    const gid = p.grupo ? String(p.grupo) : 'none';
    if (!map.has(gid)) {
      map.set(gid, { id: gid, nombre: 'Grupo', color: '#6c757d', personas: [] });
    }
    map.get(gid).personas.push(p);
  }

  // solo grupos con personas
  const result = Array.from(map.values()).filter(g => g.personas.length > 0);

  // orden: según orden del grupo, y "Sin grupo" al final
  result.sort((a, b) => {
    if (a.id === 'none') return 1;
    if (b.id === 'none') return -1;
    const ga = (grupos.value || []).find(x => String(x.id) === a.id);
    const gb = (grupos.value || []).find(x => String(x.id) === b.id);
    return (ga?.orden ?? 9999) - (gb?.orden ?? 9999);
  });

  // orden interno personas
  for (const g of result) {
    g.personas.sort((x,y) => (x.orden ?? 0) - (y.orden ?? 0) || (x.nombre||'').localeCompare(y.nombre||''));
  }

  return result;
});

// Month count (approx)
const monthTurnosCount = computed(() => {
  let c = 0;
  for (const d of monthDays.value){
    for (const p of personas.value){
      if (getTurno(p.id, d.iso)) c += 1;
    }
  }
  return c;
});

// ---------------- API ----------------
async function fetchPersonas(){
  const res = await api.get(PERSONAS_ENDPOINT);
  personas.value = Array.isArray(res.data) ? res.data : (res.data.results || []);
}

async function fetchGrupos(){
  const res = await api.get(GRUPOS_ENDPOINT);
  grupos.value = Array.isArray(res.data) ? res.data : (res.data.results || []);
}

async function fetchPlantillas(){
  const res = await api.get(PLANTILLAS_ENDPOINT);
  plantillas.value = Array.isArray(res.data) ? res.data : (res.data.results || []);
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

async function reloadAll(){
  try{
    isLoading.value = true;

    await Promise.all([fetchGrupos(), fetchPlantillas(), fetchPersonas()]);

    const { startISO, endISO } = monthStartEnd(monthValue.value);
    await fetchTurnosRange(startISO, endISO);

    if (!focusDateISO.value || focusDateISO.value.slice(0,7) !== monthValue.value){
      focusDateISO.value = startISO;
    }

  }catch(err){
    console.error(err);
    Swal.fire('Error','No se pudo cargar la información.','error');
  }finally{
    isLoading.value = false;
  }
}

watch(monthValue, async () => {
  const { startISO } = monthStartEnd(monthValue.value);
  focusDateISO.value = startISO;
  await reloadAll();
}, { immediate: true });

// ---------------- Excel ----------------
async function downloadExcelTemplate(){
  try{
    const month = monthValue.value;
    const res = await api.getBlob(`${EXCEL_TEMPLATE_ENDPOINT}?month=${month}`);
    const contentType = res.headers?.['content-type'] || 'application/octet-stream';

    // si el backend responde error en HTML/JSON, esto ayuda a detectarlo
    if (!contentType.includes('spreadsheetml') && !contentType.includes('application/vnd')) {
      const text = await res.data.text();
      throw new Error(`Respuesta inesperada (${contentType}): ${text.slice(0, 300)}`);
    }

    const blob = new Blob([res.data], { type: contentType });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `turnos_template_${month}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }catch(err){
    console.error(err);
    Swal.fire('Error', `No se pudo descargar la plantilla. ${err?.message || ''}`.trim(), 'error');
  }
}

async function uploadExcel(){
  if (!excelFile.value) return;

  const confirm = await Swal.fire({
    title: 'Importar Excel',
    text: 'Esto creará/actualizará turnos masivamente según la matriz (T1, T2...). ¿Continuar?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, importar',
    cancelButtonText: 'Cancelar'
  });
  if (!confirm.isConfirmed) return;

  try{
    isLoading.value = true;

    const fd = new FormData();
    fd.append('file', excelFile.value);

    const res = await api.postForm(EXCEL_IMPORT_ENDPOINT, fd);
    const { created, updated, errors } = res.data || {};

    await reloadAll();

    Swal.fire({
      icon: (errors?.length ? 'warning' : 'success'),
      title: 'Importación completa',
      html: `
        <div style="text-align:left">
          <div><b>Creados:</b> ${created ?? 0}</div>
          <div><b>Actualizados:</b> ${updated ?? 0}</div>
          <div><b>Errores:</b> ${errors?.length ?? 0}</div>
          ${errors?.length ? `<div class="mt-2 small text-muted">Primeros errores:<br>${errors.slice(0, 10).join('<br>')}</div>` : ''}
        </div>
      `
    });

    excelFile.value = null;
  }catch(err){
    console.error(err);
    const msg = err?.response?.data?.detail || err?.message || 'No se pudo importar.';
    Swal.fire('Error', msg, 'error');
  }finally{
    isLoading.value = false;
  }
}

// ---------------- Quick apply & cell click ----------------
async function onCellClick(personaObj, fechaISO){
  focusDateISO.value = fechaISO;

  if (quickApply.enabled && quickApply.plantillaId){
    await quickApplyPlantilla(personaObj, fechaISO, quickApply.plantillaId);
    return;
  }

  openEdit(personaObj, fechaISO);
}

function getPlantillaById(id){
  return plantillas.value.find(p => p.id === id) || null;
}

async function quickApplyPlantilla(personaObj, fechaISO, plantillaId){
  const tpl = getPlantillaById(plantillaId);
  if (!tpl) return;

  try{
    isLoading.value = true;

    const payload = {
      persona: personaObj.id,
      fecha: fechaISO,
      entrada_1: (tpl.entrada_1 || '').slice(0,5),
      salida_1: (tpl.salida_1 || '').slice(0,5),
      entrada_2: tpl.entrada_2 ? tpl.entrada_2.slice(0,5) : null,
      salida_2: tpl.salida_2 ? tpl.salida_2.slice(0,5) : null,
      almuerzo_inicio: tpl.almuerzo_inicio ? tpl.almuerzo_inicio.slice(0,5) : null,
      almuerzo_fin: tpl.almuerzo_fin ? tpl.almuerzo_fin.slice(0,5) : null,
      nota: `Plantilla rápida: ${tpl.codigo}`
    };

    const res = await api.post(TURNOS_ENDPOINT, payload);
    const t = res.data;
    turnosCache.set(keyTurno(t.persona, t.fecha), t);

    // si estás en reportes y ya generaste, refresca rápido
    if (activeTab.value === 'reports' && reportsLoaded.value && report.selectedDay) {
      await fetchTurnosRange(report.selectedDay, report.selectedDay);
    }

  }catch(err){
    console.error(err);
    const msg = err?.response?.data?.detail || err?.message || 'No se pudo aplicar la plantilla.';
    Swal.fire('Error', msg, 'error');
  }finally{
    isLoading.value = false;
  }
}

// ---------------- Guess plantilla label (UX) ----------------
function guessPlantillaCode(turno){
  if (!turno) return null;
  for (const tpl of plantillasActivas.value){
    const same =
      hhmm(turno.entrada_1) === (tpl.entrada_1 || '').slice(0,5) &&
      hhmm(turno.salida_1) === (tpl.salida_1 || '').slice(0,5) &&
      hhmm(turno.entrada_2) === (tpl.entrada_2 || '').slice(0,5) &&
      hhmm(turno.salida_2) === (tpl.salida_2 || '').slice(0,5) &&
      hhmm(turno.almuerzo_inicio) === (tpl.almuerzo_inicio || '').slice(0,5) &&
      hhmm(turno.almuerzo_fin) === (tpl.almuerzo_fin || '').slice(0,5);
    if (same) return tpl.codigo;
  }
  return null;
}

// ---------------- Edit turnos modal ----------------
const editModal = reactive({
  open:false,
  saving:false,
  persona:null,
  fecha:null,
  turnoId:null
});

const editForm = reactive({
  persona:null,
  fecha:null,
  entrada_1:'',
  salida_1:'',
  entrada_2:'',
  salida_2:'',
  almuerzo_inicio:'',
  almuerzo_fin:'',
  nota:''
});

const selectedPlantillaId = ref(null);

const tramo2Enabled = computed(() => !!(editForm.entrada_2 || editForm.salida_2));
const almuerzoEnabled = computed(() => !!(editForm.almuerzo_inicio || editForm.almuerzo_fin));

function openEdit(personaObj, fechaISO){
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

  selectedPlantillaId.value = null;
}

function closeEdit(){
  editModal.open=false;
  editModal.saving=false;
  editModal.persona=null;
  editModal.fecha=null;
  editModal.turnoId=null;
  selectedPlantillaId.value = null;
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

function applyPlantillaToForm(){
  const tpl = getPlantillaById(selectedPlantillaId.value);
  if (!tpl) return;

  editForm.entrada_1 = (tpl.entrada_1 || '').slice(0,5);
  editForm.salida_1 = (tpl.salida_1 || '').slice(0,5);
  editForm.entrada_2 = tpl.entrada_2 ? tpl.entrada_2.slice(0,5) : '';
  editForm.salida_2 = tpl.salida_2 ? tpl.salida_2.slice(0,5) : '';
  editForm.almuerzo_inicio = tpl.almuerzo_inicio ? tpl.almuerzo_inicio.slice(0,5) : '';
  editForm.almuerzo_fin = tpl.almuerzo_fin ? tpl.almuerzo_fin.slice(0,5) : '';
  editForm.nota = editForm.nota || `Plantilla: ${tpl.codigo}`;
}

function buildPayload(){
  const toNull = (v) => (v && String(v).trim() ? v : null);
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
      Swal.fire('Faltan datos','Debes diligenciar Entrada 1 y Salida 1.','warning');
      return;
    }

    const res = await api.post(TURNOS_ENDPOINT, buildPayload());
    const t = res.data;
    turnosCache.set(keyTurno(t.persona, t.fecha), t);

    Swal.fire({ icon:'success', title:'Guardado', timer:850, showConfirmButton:false });
    closeEdit();

    if (activeTab.value === 'reports' && report.selectedDay) {
      await fetchTurnosRange(report.selectedDay, report.selectedDay);
    }

  }catch(err){
    console.error(err);
    const msg = err?.response?.data?.detail || err?.message || 'No se pudo guardar.';
    Swal.fire('Error', msg, 'error');
  }finally{
    editModal.saving = false;
  }
}

async function deleteTurno(){
  if (!editModal.turnoId) return;

  const confirm = await Swal.fire({
    title:'¿Eliminar turno?',
    text:'Esto no se puede deshacer.',
    icon:'warning',
    showCancelButton:true,
    confirmButtonText:'Sí, eliminar',
    cancelButtonText:'Cancelar'
  });
  if (!confirm.isConfirmed) return;

  try{
    editModal.saving = true;
    await api.delete(`${TURNOS_ENDPOINT}${editModal.turnoId}/`);
    turnosCache.delete(keyTurno(editForm.persona, editForm.fecha));

    Swal.fire({ icon:'success', title:'Eliminado', timer:850, showConfirmButton:false });
    closeEdit();

    if (activeTab.value === 'reports' && report.selectedDay) {
      await fetchTurnosRange(report.selectedDay, report.selectedDay);
    }

  }catch(err){
    console.error(err);
    const msg = err?.response?.data?.detail || err?.message || 'No se pudo eliminar.';
    Swal.fire('Error', msg, 'error');
  }finally{
    editModal.saving = false;
  }
}

// ---------------- Settings modal (Personas/Grupos/Plantillas) ----------------
const settingsModal = reactive({
  open:false,
  tab:'personas',
  saving:false
});

function openSettings(){
  settingsModal.open = true;
  settingsModal.tab = 'personas';
  resetPersonForm();
  resetGroupForm();
  resetTplForm();
}

function closeSettings(){
  settingsModal.open = false;
  settingsModal.saving = false;
}

const personForm = reactive({ id:null, nombre:'', orden:0, grupo:null });

function resetPersonForm(){
  personForm.id = null;
  personForm.nombre = '';
  personForm.orden = 0;
  personForm.grupo = null;
}

function editPersona(p){
  personForm.id = p.id;
  personForm.nombre = p.nombre;
  personForm.orden = p.orden ?? 0;
  personForm.grupo = p.grupo ?? null;
}

async function savePersona(){
  if (!personForm.nombre.trim()){
    Swal.fire('Campo requerido','Escribe el nombre.','warning');
    return;
  }
  try{
    settingsModal.saving = true;

    const payload = {
      nombre: personForm.nombre,
      orden: personForm.orden,
      grupo: personForm.grupo,
      activo: true
    };

    if (personForm.id){
      await api.put(`${PERSONAS_ENDPOINT}${personForm.id}/`, payload);
    } else {
      await api.post(PERSONAS_ENDPOINT, payload);
    }

    await fetchPersonas();
    resetPersonForm();
    Swal.fire({ icon:'success', title:'OK', timer:650, showConfirmButton:false });

  }catch(err){
    console.error(err);
    const msg = err?.response?.data?.detail || err?.message || 'No se pudo guardar.';
    Swal.fire('Error', msg, 'error');
  }finally{
    settingsModal.saving = false;
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

    for (const d of monthDays.value){
      turnosCache.delete(keyTurno(p.id, d.iso));
    }

    Swal.fire({ icon:'success', title:'Eliminado', timer:650, showConfirmButton:false });
  }catch(err){
    console.error(err);
    const msg = err?.response?.data?.detail || err?.message || 'No se pudo eliminar.';
    Swal.fire('Error', msg, 'error');
  }
}

const groupForm = reactive({ id:null, nombre:'', orden:0, color:'#198754' });

function resetGroupForm(){
  groupForm.id = null;
  groupForm.nombre = '';
  groupForm.orden = 0;
  groupForm.color = '#198754';
}

function editGrupo(g){
  groupForm.id = g.id;
  groupForm.nombre = g.nombre;
  groupForm.orden = g.orden ?? 0;
  groupForm.color = g.color || '#198754';
}

async function saveGrupo(){
  if (!groupForm.nombre.trim()){
    Swal.fire('Campo requerido','Escribe el nombre del grupo.','warning');
    return;
  }
  try{
    settingsModal.saving = true;

    const payload = {
      nombre: groupForm.nombre,
      orden: groupForm.orden,
      color: groupForm.color,
      activo: true
    };

    if (groupForm.id){
      await api.put(`${GRUPOS_ENDPOINT}${groupForm.id}/`, payload);
    } else {
      await api.post(GRUPOS_ENDPOINT, payload);
    }

    await fetchGrupos();
    await fetchPersonas();
    resetGroupForm();

    Swal.fire({ icon:'success', title:'OK', timer:650, showConfirmButton:false });
  }catch(err){
    console.error(err);
    const msg = err?.response?.data?.detail || err?.message || 'No se pudo guardar.';
    Swal.fire('Error', msg, 'error');
  }finally{
    settingsModal.saving = false;
  }
}

async function deleteGrupo(g){
  const confirm = await Swal.fire({
    title:'¿Eliminar grupo?',
    text:'Las personas quedarán sin grupo.',
    icon:'warning',
    showCancelButton:true,
    confirmButtonText:'Sí, eliminar',
    cancelButtonText:'Cancelar'
  });
  if (!confirm.isConfirmed) return;

  try{
    await api.delete(`${GRUPOS_ENDPOINT}${g.id}/`);
    await fetchGrupos();
    await fetchPersonas();
    Swal.fire({ icon:'success', title:'Eliminado', timer:650, showConfirmButton:false });
  }catch(err){
    console.error(err);
    const msg = err?.response?.data?.detail || err?.message || 'No se pudo eliminar.';
    Swal.fire('Error', msg, 'error');
  }
}

const tplForm = reactive({
  id:null,
  codigo:'T1',
  nombre:'',
  entrada_1:'08:00',
  salida_1:'17:00',
  entrada_2:'',
  salida_2:'',
  almuerzo_inicio:'',
  almuerzo_fin:'',
  color:'#0d6efd'
});

function resetTplForm(){
  tplForm.id = null;
  tplForm.codigo = 'T1';
  tplForm.nombre = '';
  tplForm.entrada_1 = '08:00';
  tplForm.salida_1 = '17:00';
  tplForm.entrada_2 = '';
  tplForm.salida_2 = '';
  tplForm.almuerzo_inicio = '';
  tplForm.almuerzo_fin = '';
  tplForm.color = '#0d6efd';
}

function editPlantilla(t){
  tplForm.id = t.id;
  tplForm.codigo = t.codigo;
  tplForm.nombre = t.nombre;
  tplForm.entrada_1 = t.entrada_1?.slice(0,5) || '08:00';
  tplForm.salida_1 = t.salida_1?.slice(0,5) || '17:00';
  tplForm.entrada_2 = t.entrada_2?.slice(0,5) || '';
  tplForm.salida_2 = t.salida_2?.slice(0,5) || '';
  tplForm.almuerzo_inicio = t.almuerzo_inicio?.slice(0,5) || '';
  tplForm.almuerzo_fin = t.almuerzo_fin?.slice(0,5) || '';
  tplForm.color = t.color || '#0d6efd';
}

async function savePlantilla(){
  if (!tplForm.codigo.trim() || !tplForm.nombre.trim()){
    Swal.fire('Campos requeridos', 'Código y nombre son obligatorios.', 'warning');
    return;
  }
  if (!tplForm.entrada_1 || !tplForm.salida_1){
    Swal.fire('Campos requeridos', 'Entrada 1 y Salida 1 son obligatorios.', 'warning');
    return;
  }

  try{
    settingsModal.saving = true;

    const toNull = (v) => (v && String(v).trim() ? v : null);

    const payload = {
      codigo: tplForm.codigo.trim().toUpperCase(),
      nombre: tplForm.nombre.trim(),
      entrada_1: tplForm.entrada_1,
      salida_1: tplForm.salida_1,
      entrada_2: toNull(tplForm.entrada_2),
      salida_2: toNull(tplForm.salida_2),
      almuerzo_inicio: toNull(tplForm.almuerzo_inicio),
      almuerzo_fin: toNull(tplForm.almuerzo_fin),
      color: tplForm.color,
      activo: true
    };

    if (tplForm.id){
      await api.put(`${PLANTILLAS_ENDPOINT}${tplForm.id}/`, payload);
    } else {
      await api.post(PLANTILLAS_ENDPOINT, payload);
    }

    await fetchPlantillas();
    resetTplForm();
    Swal.fire({ icon:'success', title:'OK', timer:650, showConfirmButton:false });
  }catch(err){
    console.error(err);
    const msg = err?.response?.data?.detail || err?.message || 'No se pudo guardar.';
    Swal.fire('Error', msg, 'error');
  }finally{
    settingsModal.saving = false;
  }
}

async function deletePlantilla(t){
  const confirm = await Swal.fire({
    title:'¿Eliminar plantilla?',
    text:'Ya no podrás usarla en Excel ni modo rápido.',
    icon:'warning',
    showCancelButton:true,
    confirmButtonText:'Sí, eliminar',
    cancelButtonText:'Cancelar'
  });
  if (!confirm.isConfirmed) return;

  try{
    await api.delete(`${PLANTILLAS_ENDPOINT}${t.id}/`);
    await fetchPlantillas();
    Swal.fire({ icon:'success', title:'Eliminado', timer:650, showConfirmButton:false });
  }catch(err){
    console.error(err);
    const msg = err?.response?.data?.detail || err?.message || 'No se pudo eliminar.';
    Swal.fire('Error', msg, 'error');
  }
}

// ---------------- Day/Week quick info ----------------
async function openDayDetail(fechaISO){
  if (!fechaISO) return;
  try{
    const arr = await fetchTurnosRange(fechaISO, fechaISO);
    const dayTurnos = (arr || []).filter(t => t.fecha === fechaISO);

    if (!dayTurnos.length){
      Swal.fire('Detalle día', `No hay turnos para ${fechaISO}.`, 'info');
      return;
    }

    const lines = dayTurnos
      .sort((a,b) => String(a.persona_nombre||'').localeCompare(String(b.persona_nombre||'')))
      .map(t => `• ${t.persona_nombre || 'Persona'}: ${hhmm(t.entrada_1)}-${hhmm(t.salida_1)}${t.entrada_2 ? ` | ${hhmm(t.entrada_2)}-${hhmm(t.salida_2)}` : ''}`)
      .slice(0, 40);

    Swal.fire({
      title: `Detalle ${fechaISO}`,
      icon: 'info',
      html: `<div style="text-align:left;white-space:pre-line;">${lines.join('\n')}</div>`
    });
  }catch(err){
    console.error(err);
    Swal.fire('Error', err?.message || 'No se pudo cargar el detalle.', 'error');
  }
}

function getWeekRangeFromISO(iso){
  const [y,m,d] = iso.split('-').map(Number);
  const dateObj = new Date(Date.UTC(y, m-1, d));
  const day = dateObj.getUTCDay();
  const diffToMonday = (day === 0 ? -6 : 1 - day);
  const monday = new Date(dateObj); monday.setUTCDate(monday.getUTCDate() + diffToMonday);
  const sunday = new Date(monday); sunday.setUTCDate(sunday.getUTCDate() + 6);
  const start = `${monday.getUTCFullYear()}-${pad2(monday.getUTCMonth()+1)}-${pad2(monday.getUTCDate())}`;
  const end = `${sunday.getUTCFullYear()}-${pad2(sunday.getUTCMonth()+1)}-${pad2(sunday.getUTCDate())}`;
  return { start, end };
}

async function openWeekSummary(focusISO){
  const { start, end } = getWeekRangeFromISO(focusISO);
  try{
    const res = await api.get(`${TURNOS_RESUMEN_ENDPOINT}?start=${start}&end=${end}`);
    const items = res.data?.items || [];
    const top = items.slice(0, 40).map(i => `• ${i.nombre}: ${i.horas}h`);

    Swal.fire({
      title: `Resumen semana (${start} → ${end})`,
      icon: 'info',
      html: `<div style="text-align:left;white-space:pre-line;">${top.join('\n') || 'Sin datos.'}</div>`
    });
  }catch(err){
    console.error(err);
    Swal.fire('Error', err?.message || 'No se pudo cargar resumen.', 'error');
  }
}

// ===================== REPORTES =====================
const report = reactive({
  start:'',
  end:'',
  view:'matrix',
  selectedDay:''
});

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
  while (cur <= report.end){ res.push(cur); cur = addDaysISO(cur, 1); }
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

const reportCoverageMap = ref({});
const reportHoursByPersona = ref({});

const reportTotalHorasRango = computed(() => {
  let s = 0;
  for (const p of filteredPersonas.value){
    s += Number(reportHoursByPersona.value[p.id] || 0);
  }
  return round2(s);
});

function goReports(){
  activeTab.value = 'reports';
  if (!report.start || !report.end) setReportWeekFromFocus();
  if (!report.selectedDay) report.selectedDay = focusDateISO.value;
  loadReports();
}

// Build slots
function hhmmToMin(hhmmStr){
  const [h,m] = hhmmStr.split(':').map(Number);
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

// Work intervals
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
  return mxIsActive(personaId, slot) ? 'mx-on' : 'mx-off';
}

const mxDisponiblesBySlot = computed(() => {
  const obj = {};
  for (const s of slots.value){
    let c = 0;
    for (const p of filteredPersonas.value){
      if (mxIsActive(p.id, s)) c += 1;
    }
    obj[s.label] = c;
  }
  return obj;
});

function mxDisponiblesBySlotForGroup(grupo, slot){
  let c = 0;
  for (const p of grupo.personas){
    if (mxIsActive(p.id, slot)) c += 1;
  }
  return c;
}

const mxHoursByPersona = computed(() => {
  const obj = {};
  for (const p of filteredPersonas.value){
    const t = mxTurno(p.id);
    obj[p.id] = round2(Number(t?.total_horas || 0));
  }
  return obj;
});

function mxTotalHorasDiaForGroup(grupo){
  let sum = 0;
  for (const p of grupo.personas){
    const t = mxTurno(p.id);
    sum += Number(t?.total_horas || 0);
  }
  return round2(sum);
}

// Projection (localStorage)
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
function projectionWarnClass(slotLabel){
  const proj = mxProjection.value?.[slotLabel];
  if (proj == null || proj === '') return '';
  const disp = mxDisponiblesBySlot.value?.[slotLabel] ?? 0;
  return (disp < Number(proj)) ? 'proj-warn' : 'proj-ok';
}

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

watch(() => report.selectedDay, async (d) => {
  if (!d) return;
  loadProjection(d);
  await fetchTurnosRange(d, d);
});

async function loadReports(){
  if (!report.start || !report.end) setReportWeekFromFocus();
  if (!report.selectedDay) report.selectedDay = focusDateISO.value;

  try{
    reportsLoading.value = true;

    // Ensure turnos in cache
    await fetchTurnosRange(report.start, report.end);

    // Hours summary by persona
    const resumen = await api.get(`${TURNOS_RESUMEN_ENDPOINT}?start=${report.start}&end=${report.end}`);
    const items = resumen.data?.items || [];
    const map = {};
    for (const p of personas.value) map[p.id] = 0;
    for (const it of items){
      map[it.persona_id] = round2(it.horas);
    }
    reportHoursByPersona.value = map;

    // Coverage from backend
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

    // Ensure selected day in cache + projection
    await fetchTurnosRange(report.selectedDay, report.selectedDay);
    loadProjection(report.selectedDay);

    reportsLoaded.value = true;

  }catch(err){
    console.error(err);
    const msg = err?.response?.data?.detail || err?.message || 'No se pudo generar el reporte.';
    Swal.fire('Error', msg, 'error');
  }finally{
    reportsLoading.value = false;
  }
}

// ---------------- CSV export ----------------
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
    Swal.fire('Error', err?.message || 'No se pudo exportar.', 'error');
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.bg-light { background-color: #f8f9fa; }
h1,h2,h3,h4,h5,h6,.form-label,.btn,p,td,th { font-family: 'Poppins', sans-serif; }

.planner-scroll { overflow: auto; max-height: 70vh; }

/* Color swatch (✅ sin texto hex) */
.color-swatch{
  width: 28px;
  height: 18px;
  border-radius: 6px;
  border: 1px solid rgba(0,0,0,.15);
  display: inline-block;
}

.group-section{
  padding-top: 8px;
}

/* Planner month */
.planner-table { border-collapse: separate; border-spacing: 0; min-width: 1200px; }
.name-col { min-width: 280px; background: #fff; }
.day-head { min-width: 150px; }

.sticky-col { position: sticky; left: 0; z-index: 3; background: #fff; }
.sticky-head { position: sticky; top: 0; z-index: 4; background: #f8f9fa; }

.turno-cell { cursor: pointer; background: #fff; transition: background .12s ease-in-out; padding: 0.6rem; }
.turno-cell:hover { background: #fbf3f3; }

/* Modals */
.modal-backdrop-custom{
  position: fixed; inset: 0;
  background: rgba(0,0,0,.35);
  display:flex; align-items:center; justify-content:center;
  padding: 14px; z-index:1050;
}
.modal-dialog-custom{ width: min(820px, 100%); }
.modal-lg{ width: min(1050px, 100%); }

/* Matrix summary */
.matrix-summary{
  min-width: 1100px;
}
.matrix-summary .summary-label{
  min-width: 160px;
  background: #fff;
}

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

.mx-cell{ cursor:pointer; padding: 0.25rem; }
.mx-on{ background: #d9f2d9; }  /* verde */
.mx-off{ background: #f7d6d6; } /* rosado */

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

/* Projection warn */
.proj-warn{
  outline: 2px solid #dc3545;
  outline-offset: -2px;
}
.proj-ok{
  outline: 2px solid #198754;
  outline-offset: -2px;
}
</style>