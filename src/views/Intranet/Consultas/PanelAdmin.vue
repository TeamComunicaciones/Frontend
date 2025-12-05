<template>
  <div class="bg-light">
    <div class="container my-5">
      <div class="card border-0 shadow-sm admin-card">
        <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h1 class="h2 mb-0" style="color: white !important;">Panel de Administración</h1>
          <span class="badge bg-danger">Acceso Restringido</span>
        </div>
        <div class="card-body p-0">
          <ul class="nav nav-tabs nav-fill" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#carga-pane" type="button" role="tab">
                Carga de Comisiones
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" data-bs-toggle="tab" data-bs-target="#permisos-pane" type="button" role="tab">
                Gestión de Asesores
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" data-bs-toggle="tab" data-bs-target="#reportes-pane" type="button" role="tab">
                Reportes y Gráficas
              </button>
            </li>
            <!-- Nueva pestaña: Comisiones Pendientes -->
            <li class="nav-item" role="presentation">
              <button class="nav-link" data-bs-toggle="tab" data-bs-target="#pendientes-pane" type="button" role="tab">
                Comisiones Pendientes
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" data-bs-toggle="tab" data-bs-target="#pagos-pane" type="button" role="tab">
                Gestión de Pagos
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" data-bs-toggle="tab" data-bs-target="#config-pane" type="button" role="tab">
                Configuración
              </button>
            </li>
          </ul>

          <div class="tab-content p-4 p-md-5" id="adminTabContent">
            <!-- 1. Pestaña de Carga -->
            <div class="tab-pane fade show active" id="carga-pane" role="tabpanel">
              <h2 class="h3 mb-3">Importar Comisiones desde Excel</h2>
              <p class="mb-4">
                Sube el archivo .xlsx con los registros de comisiones. El sistema lo procesará en segundo plano.
              </p>
              <div
                class="drop-zone"
                @dragover.prevent="onDragOver"
                @dragleave.prevent="onDragLeave"
                @drop.prevent="onDrop"
                :class="{ 'is-dragging': isDragging }"
                @click="fileInput && fileInput.click()"
              >
                <input
                  type="file"
                  @change="handleFileChange"
                  accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  ref="fileInput"
                  class="d-none"
                />
                <div class="text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    fill="currentColor"
                    class="bi bi-cloud-arrow-up mb-3"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"
                    />
                    <path
                      d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"
                    />
                  </svg>
                  <p class="m-0">
                    Arrastra tu archivo .xlsx aquí o <strong>haz clic para seleccionar</strong>.
                  </p>
                </div>
              </div>
              <div v-if="selectedFile" class="mt-3">
                <div class="d-flex justify-content-between align-items-center bg-light p-2 rounded">
                  <div class="d-flex align-items-center text-truncate">
                    <span class="text-truncate">{{ selectedFile.name }}</span>
                  </div>
                  <button @click="clearFile" class="btn btn-sm btn-outline-secondary ms-2" type="button">
                    &times;
                  </button>
                </div>
              </div>
              <div class="d-grid mt-4">
                <button @click="uploadFile" class="btn btn-danger btn-lg" :disabled="!selectedFile || isLoading">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isLoading ? 'Procesando...' : 'Iniciar Carga' }}
                </button>
              </div>
              <div v-if="uploadResult" class="mt-4">
                <div :class="['alert', uploadResult.success ? 'alert-success' : 'alert-danger']" role="alert">
                  <div class="d-flex align-items-center">
                    <div>
                      <h5 class="alert-heading mb-1">
                        {{ uploadResult.success ? 'Carga Completada' : 'Error en la Carga' }}
                      </h5>
                      <p class="mb-0" v-if="uploadResult.message">{{ uploadResult.message }}</p>
                      <div v-if="uploadResult.errors">
                        <ul class="mb-0 ps-4">
                          <li v-for="(error, index) in uploadResult.errors" :key="index">{{ error }}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. Pestaña de Gestión de Asesores -->
            <div class="tab-pane fade" id="permisos-pane" role="tabpanel">
              <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                  <h2 class="h3 mb-1">Gestión de Asesores</h2>
                  <p class="mb-0 text-muted">
                    Gestiona roles y rutas de los usuarios que pueden ver y/o pagar comisiones.
                  </p>
                </div>
                <button class="btn btn-danger d-flex align-items-center" @click="openModal('create')">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-plus-lg me-1"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0V8H2.5a.5.5 0 0 1 0-1H7v-5A.5.5 0 0 1 8 2z"
                    />
                  </svg>
                  Nuevo Asesor
                </button>
              </div>

              <div class="row mb-3">
                <div class="col-md-4">
                  <input
                    type="text"
                    class="form-control"
                    v-model="searchQuery"
                    placeholder="Buscar por documento o email..."
                  />
                </div>
              </div>

              <div v-if="isLoadingPermissions" class="text-center p-5">
                <div class="spinner-border text-danger" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
              </div>

              <div v-else class="card shadow-sm asesor-card">
                <div class="table-responsive">
                  <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                      <tr>
                        <th scope="col">Documento</th>
                        <th scope="col">Email</th>
                        <th scope="col">Rol</th>
                        <th scope="col" style="width: 280px;">Rutas Asignadas</th>
                        <th scope="col" class="text-center">Activo</th>
                        <th scope="col" class="text-end">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="asesor in filteredAsesores" :key="asesor.id">
                        <td>
                          <strong>{{ asesor.username }}</strong>
                        </td>
                        <td>
                          <span class="text-muted small d-block">{{ asesor.email }}</span>
                        </td>

                        <!-- Columna Rol -->
                        <td>
                          <select
                            class="form-select form-select-sm"
                            v-model="asesor.rol"
                            @change="onChangeRol(asesor)"
                          >
                            <option v-for="rolOption in rolesOptions" :key="rolOption.value" :value="rolOption.value">
                              {{ rolOption.label }}
                            </option>
                          </select>
                        </td>

                        <!-- Columna Rutas Asignadas -->
                        <td>
                          <!-- Asesor: solo una ruta -->
                          <select
                            v-if="asesor.rol === 'asesor_comisiones'"
                            class="form-select form-select-sm"
                            v-model="asesor.rutas_asignadas[0]"
                            @change="onChangeRutasAsesor(asesor)"
                          >
                            <option :value="null">-- Sin Asignar --</option>
                            <option
                              v-for="ruta in rutas"
                              :key="ruta"
                              :value="ruta"
                              :disabled="shouldDisableRutaForAsesor(ruta, asesor)"
                            >
                              {{ labelRutaWithCupo(ruta) }}
                            </option>
                          </select>

                          <!-- Supervisor: varias rutas -->
                          <v-select
                            v-else
                            class="v-select-sm rutas-multiples"
                            multiple
                            :options="rutas"
                            v-model="asesor.rutas_asignadas"
                            placeholder="Selecciona una o más rutas"
                            @update:modelValue="() => onChangeRutasAsesor(asesor)"
                          >
                            <template #selected-option="{ option, deselect }">
                              <span class="badge bg-secondary me-1 mb-1 d-inline-flex align-items-center">
                                <span class="me-1 text-truncate" style="max-width: 110px;">{{ option }}</span>
                                <button
                                  type="button"
                                  class="btn-close btn-close-white btn-close-badge"
                                  aria-label="Close"
                                  @click.stop="deselect(option)"
                                ></button>
                              </span>
                            </template>
                          </v-select>
                        </td>

                        <!-- Activo -->
                        <td class="text-center">
                          <div class="form-check form-switch d-flex justify-content-center">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              role="switch"
                              :checked="asesor.is_active"
                              @change="toggleAsesorActivo(asesor)"
                            />
                          </div>
                        </td>

                        <!-- Acciones -->
                        <td class="text-end">
                          <button
                            class="btn btn-sm btn-outline-secondary me-2"
                            @click="openModal('edit', asesor)"
                            title="Editar asesor"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-pencil"
                              viewBox="0 0 16 16"
                            >
                              <path
                                d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 
                                  .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 
                                  1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 
                                  2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 
                                  2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 
                                  1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 
                                  1 .5.5v.207l6.5-6.5zm-7.468 7.468-1.5 
                                  1.5V13h1.5v-1.5z"
                              />
                            </svg>
                          </button>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            @click="eliminarAsesor(asesor)"
                            title="Eliminar asesor"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-trash"
                              viewBox="0 0 16 16"
                            >
                              <path
                                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 
                                  0a.5.5 0 0 1 .5.5v6a.5.5 0 0 
                                  1-1 0V6a.5.5 0 0 1 .5-.5zm3 
                                  .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 
                                  1 0V6z"
                              />
                              <path
                                fill-rule="evenodd"
                                d="M14.5 3a1 1 0 0 1-1 
                                  1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 
                                  1-2-2V4h-.5a1 1 0 0 
                                  1-1-1V2a1 1 0 0 
                                  1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 
                                  1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 
                                  4 4 
                                  4.059V13a1 1 0 0 0 1 
                                  1h6a1 1 0 0 0 1-1V4.059L11.882 
                                  4H4.118zM2.5 3V2h11v1h-11z"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                      <tr v-if="filteredAsesores.length === 0 && !isLoadingPermissions">
                        <td colspan="6" class="text-center p-4">No se encontraron asesores.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- 3. Pestaña de Reportes -->
            <div class="tab-pane fade" id="reportes-pane" role="tabpanel">
              <h2 class="h3 mb-4">Dashboard de Comisiones Generales</h2>
              <div class="card shadow-sm mb-4">
                <div class="card-body">
                  <fieldset :disabled="isLoadingReports">
                    <div class="row g-3 align-items-end">
                      <div class="col-md-4">
                        <label for="filtroFechas" class="form-label fw-bold">Rango de Fechas</label>
                        <DatePicker
                          v-model:value="reportFilters.range"
                          range
                          id="filtroFechas"
                          placeholder="Selecciona un rango"
                        />
                      </div>
                      <div class="col-md-4">
                        <label for="filtroRutas" class="form-label fw-bold">Rutas</label>
                        <v-select
                          multiple
                          id="filtroRutas"
                          placeholder="Todas las rutas"
                          v-model="reportFilters.rutas"
                          :options="filterOptions.rutas"
                        />
                      </div>
                      <div class="col-md-4">
                        <label for="filtroEstados" class="form-label fw-bold">Estado</label>
                        <v-select
                          multiple
                          id="filtroEstados"
                          placeholder="Todos los estados"
                          v-model="reportFilters.estados"
                          :options="filterOptions.estados"
                        />
                      </div>
                      <div class="col-md-6 d-grid">
                        <button class="btn btn-danger" @click="generarReporte">
                          <span v-if="isLoadingReports" class="spinner-border spinner-border-sm me-2"></span>
                          {{ isLoadingReports ? 'Generando...' : 'Generar' }}
                        </button>
                      </div>
                      <div class="col-md-6 d-grid">
                        <button
                          class="btn btn-success"
                          @click="exportarExcel"
                          v-if="reportData"
                          :disabled="isLoadingExport"
                        >
                          <span v-if="isLoadingExport" class="spinner-border spinner-border-sm me-2"></span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-file-earmark-excel-fill me-1"
                            viewBox="0 0 16 16"
                          >
                            <path
                              d="M9.293 0H4a2 2 0 0 0-2 
                                2v12a2 2 0 0 0 2 2h8a2 2 0 0 
                                0 2-2V4.707A1 1 0 0 0 13.707 
                                4L10 .293A1 1 0 0 0 9.293 0M9.5 
                                3.5v-2l3 3h-2a1 1 0 0 
                                1-1-1M5.884 6.68 8 9.219l2.116-2.54a.5.5 0 
                                1 1 .768.641L8.651 10l2.233 2.68a.5.5 0 0 
                                1-.768.64L8 10.781l-2.116 2.54a.5.5 0 0 
                                1-.768-.641L7.349 10 5.116 7.32a.5.5 0 1 
                                1 .768-.64z"
                            />
                          </svg>
                          {{ isLoadingExport ? 'Exportando...' : 'Exportar a Excel' }}
                        </button>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>

              <div v-if="isLoadingReports" class="text-center p-5">
                <div class="spinner-border text-danger" style="width: 3rem; height: 3rem;" role="status"></div>
                <p class="mt-3">Cargando datos del reporte...</p>
              </div>

              <div v-else-if="reportData" class="animate__animated animate__fadeIn">
                <div class="row g-4 mb-4">
                  <div class="col-md-3">
                    <div class="card h-100 text-center shadow-sm kpi-card">
                      <div class="card-body">
                        <h6>Valor Total</h6>
                        <div class="stat-value">{{ formatCurrency(reportData.kpis.total) }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="card h-100 text-center shadow-sm kpi-card">
                      <div class="card-body">
                        <h6>Total Pagado</h6>
                        <div class="stat-value text-success">
                          {{ formatCurrency(reportData.kpis.pagado) }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="card h-100 text-center shadow-sm kpi-card">
                      <div class="card-body">
                        <h6>Total Pendiente</h6>
                        <div class="stat-value text-warning">
                          {{ formatCurrency(reportData.kpis.pendiente) }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="card h-100 text-center shadow-sm kpi-card">
                      <div class="card-body">
                        <h6>Total Vencido</h6>
                        <div class="stat-value text-danger">
                          {{ formatCurrency(reportData.kpis.vencido) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row g-4 mb-4">
                  <div class="col-lg-7">
                    <div class="card shadow-sm h-100">
                      <div class="card-body">
                        <h5 class="card-title mb-3">Evolución Mensual</h5>
                        <div style="position: relative; height: 350px;">
                          <Bar :data="evolucionChartData" :options="chartOptions" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-5">
                    <div class="card shadow-sm h-100">
                      <div class="card-body">
                        <h5 class="card-title mb-3">Distribución por Estado</h5>
                        <div style="position: relative; height: 350px;">
                          <Doughnut :data="estadoChartData" :options="chartOptions" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row g-4 mb-4">
                  <div class="col-lg-7">
                    <div class="card shadow-sm h-100">
                      <div class="card-body">
                        <h5 class="card-title mb-3">Valor Total por Método de Pago</h5>
                        <div style="position: relative; height: 350px;">
                          <Bar :data="metodoValorChartData" :options="chartOptions" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-5">
                    <div class="card shadow-sm h-100">
                      <div class="card-body">
                        <h5 class="card-title mb-3">Distribución de Uso (Cantidad)</h5>
                        <div style="position: relative; height: 350px;">
                          <Doughnut :data="metodoCantidadChartData" :options="chartOptions" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row g-4 mb-4">
                  <div class="col-12">
                    <div class="card shadow-sm h-100">
                      <div class="card-body">
                        <h5 class="card-title mb-3">Picos Mensuales de Comisión (Total)</h5>
                        <div style="position: relative; height: 350px;">
                          <Line :data="picosMensualesChartData" :options="lineChartOptions" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row g-4">
                  <div class="col-12">
                    <div class="card shadow-sm h-100">
                      <div class="card-body">
                        <h5 class="card-title mb-3">Picos Mensuales de Comisión (Pagado)</h5>
                        <div style="position: relative; height: 350px;">
                          <Line :data="picosMensualesPagadoChartData" :options="lineChartOptions" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="text-center p-5 border rounded bg-light mt-4">
                <p class="fs-4 mb-1">Aún no has generado un reporte.</p>
                <p>Usa los filtros de arriba y haz clic en "Generar" para visualizar los datos.</p>
              </div>
            </div>

            <!-- 4. Nueva Pestaña: Comisiones Pendientes -->
            <div class="tab-pane fade" id="pendientes-pane" role="tabpanel">
              <h2 class="h3 mb-1">Comisiones Pendientes</h2>
              <p class="mb-4">
                Consulta, filtra, edita o elimina las comisiones que aún están pendientes o acumuladas, sin necesidad
                de subir un nuevo archivo Excel.
              </p>

              <div class="card shadow-sm mb-4">
                <div class="card-body">
                  <fieldset :disabled="isLoadingPendientes || isLoadingPuntosDeVentaPendientes">
                    <div class="row g-3 align-items-end">
                      <div class="col-md-3">
                        <label for="filtroPendRuta" class="form-label fw-bold">Ruta</label>
                        <v-select
                          id="filtroPendRuta"
                          placeholder="Todas las rutas"
                          v-model="pendientesFilters.ruta"
                          :options="rutas"
                        />
                      </div>

                      <div class="col-md-3">
                        <label for="filtroPendAsesor" class="form-label fw-bold">Asesor</label>
                        <v-select
                          id="filtroPendAsesor"
                          placeholder="Todos los asesores"
                          v-model="pendientesFilters.asesor"
                          :options="asesoresOptions"
                          :reduce="(opt) => opt.value"
                        >
                          <template #option="{ label }">
                            <span>{{ label }}</span>
                          </template>
                        </v-select>
                      </div>

                      <!-- 🔎 Nuevo filtro: ID POS -->
                      <div class="col-md-2">
                        <label for="filtroPendIdpos" class="form-label fw-bold">ID POS</label>
                        <input
                          id="filtroPendIdpos"
                          type="text"
                          class="form-control"
                          v-model="pendientesFilters.idpos"
                          placeholder="Ej: 12345"
                        />
                      </div>

                      <div class="col-md-2">
                        <label for="filtroPendFechas" class="form-label fw-bold">Rango de Fechas</label>
                        <DatePicker
                          v-model:value="pendientesFilters.range"
                          range
                          id="filtroPendFechas"
                          placeholder="Selecciona un rango"
                        />
                      </div>

                      <div class="col-md-2 d-grid">
                        <button class="btn btn-danger" @click="buscarPendientes">
                          <span v-if="isLoadingPendientes" class="spinner-border spinner-border-sm me-2"></span>
                          {{ isLoadingPendientes ? 'Buscando...' : 'Buscar Comisiones' }}
                        </button>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>

              <div v-if="isLoadingPendientes" class="text-center p-5">
                <div class="spinner-border text-danger" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
              </div>

              <div v-else-if="pendientesData.results.length > 0" class="card shadow-sm">
                <div class="table-responsive">
                  <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                      <tr>
                        <th scope="col">ID POS</th>
                        <th scope="col">Asesor</th>
                        <th scope="col">Ruta</th>
                        <th scope="col">Mes Pago</th>
                        <th scope="col">Valor Comisión</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Observación</th>
                        <th scope="col" class="text-end">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="comision in pendientesData.results" :key="comision.id">
                        <td><strong>{{ comision.idpos }}</strong></td>
                        <td><strong>{{ comision.asesor_username }}</strong></td>
                        <td>{{ comision.ruta || 'N/A' }}</td>
                        <td>{{ comision.mes_pago || comision.fecha_referencia || 'N/A' }}</td>
                        <td>{{ formatCurrency(comision.valor_comision) }}</td>
                        <td>
                          <span
                            class="badge"
                            :class="{
                              'bg-warning text-dark': comision.estado === 'Pendiente',
                              'bg-secondary': comision.estado === 'Acumulada',
                              'bg-danger': comision.estado === 'Vencida',
                            }"
                          >
                            {{ comision.estado }}
                          </span>
                        </td>
                        <td class="text-truncate" style="max-width: 220px;">
                          {{ comision.observacion || 'N/A' }}
                        </td>
                        <td class="text-end">
                          <button
                            class="btn btn-sm btn-outline-secondary me-2"
                            @click="openComisionModal('edit', comision)"
                            title="Editar comisión"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-pencil"
                              viewBox="0 0 16 16"
                            >
                              <path
                                d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0
                                  .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0
                                  1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207
                                  2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207
                                  2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0
                                  1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0
                                  1 .5.5v.207l6.5-6.5zm-7.468 7.468-1.5
                                  1.5V13h1.5v-1.5z"
                              />
                            </svg>
                          </button>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            @click="eliminarComision(comision)"
                            title="Eliminar comisión"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-trash"
                              viewBox="0 0 16 16"
                            >
                              <path
                                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5
                                  0a.5.5 0 0 1 .5.5v6a.5.5 0 0
                                  1-1 0V6a.5.5 0 0 1 .5-.5zm3
                                  .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0
                                  1 0V6z"
                              />
                              <path
                                fill-rule="evenodd"
                                d="M14.5 3a1 1 0 0 1-1
                                  1H13v9a2 2 0 0 1-2 2H5a2 2 0 0
                                  1-2-2V4h-.5a1 1 0 0
                                  1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118
                                  4 4
                                  4.059V13a1 1 0 0 0 1
                                  1h6a1 1 0 0 0 1-1V4.059L11.882
                                  4H4.118zM2.5 3V2h11v1h-11z"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="card-footer d-flex justify-content-between align-items-center">
                  <span class="text-muted">
                    Mostrando {{ pendientesData.results.length }} de {{ pendientesData.count }} resultados
                  </span>
                  <nav>
                    <ul class="pagination pagination-sm mb-0">
                      <li class="page-item" :class="{ disabled: pendientesData.current_page === 1 }">
                        <button class="page-link" @click="goToPendientesPage(pendientesData.current_page - 1)">
                          Anterior
                        </button>
                      </li>
                      <li class="page-item disabled">
                        <span class="page-link">
                          Página {{ pendientesData.current_page }} de {{ pendientesData.total_pages }}
                        </span>
                      </li>
                      <li
                        class="page-item"
                        :class="{ disabled: pendientesData.current_page === pendientesData.total_pages }"
                      >
                        <button class="page-link" @click="goToPendientesPage(pendientesData.current_page + 1)">
                          Siguiente
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>

              <div v-else class="text-center p-5 border rounded bg-light mt-4">
                <p class="fs-4 mb-1">No se encontraron comisiones pendientes.</p>
                <p>Usa los filtros de arriba y haz clic en "Buscar Comisiones" para listarlas.</p>
              </div>
            </div>

            <!-- 5. Pestaña Gestión de Pagos -->
            <div class="tab-pane fade" id="pagos-pane" role="tabpanel">
              <h2 class="h3 mb-1">Gestión de Pagos</h2>
              <p class="mb-4">Busca, edita o reversa pagos de comisiones registrados en el sistema.</p>

              <div class="card shadow-sm mb-4">
                <div class="card-body">
                  <fieldset :disabled="isLoadingPagos || isLoadingPuntosDeVenta">
                    <div class="row g-3 align-items-end">
                      <div class="col-md-3">
                        <label for="filtroPagoRuta" class="form-label fw-bold">Ruta</label>
                        <v-select
                          id="filtroPagoRuta"
                          placeholder="Selecciona una ruta"
                          v-model="pagosFilters.ruta"
                          :options="rutas"
                        />
                      </div>

                      <div class="col-md-3">
                        <label for="filtroPagoPunto" class="form-label fw-bold">Punto de Venta</label>
                        <v-select
                          id="filtroPagoPunto"
                          placeholder="Selecciona un punto"
                          v-model="pagosFilters.punto_de_venta"
                          :options="puntosDeVentaOptions"
                          :disabled="!pagosFilters.ruta || isLoadingPuntosDeVenta"
                        />
                      </div>

                      <div class="col-md-3">
                        <label for="filtroPagoFechas" class="form-label fw-bold">Rango de Fechas</label>
                        <DatePicker
                          v-model:value="pagosFilters.range"
                          range
                          id="filtroPagoFechas"
                          placeholder="Selecciona un rango"
                        />
                      </div>

                      <div class="col-md-3 d-grid">
                        <button class="btn btn-danger" @click="buscarPagos">
                          <span v-if="isLoadingPagos" class="spinner-border spinner-border-sm me-2"></span>
                          {{ isLoadingPagos ? 'Buscando...' : 'Buscar Pagos' }}
                        </button>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>

              <div v-if="isLoadingPagos" class="text-center p-5">
                <div class="spinner-border text-danger" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
              </div>

              <div v-else-if="pagosData.results.length > 0" class="card shadow-sm">
                <div class="table-responsive">
                  <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                      <tr>
                        <th scope="col">ID POS</th>
                        <th scope="col">Asesor</th>
                        <th scope="col">Fecha Pago</th>
                        <th scope="col">Monto</th>
                        <th scope="col">Método</th>
                        <th scope="col">Observación</th>
                        <th scope="col" class="text-end">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="pago in pagosData.results" :key="pago.id">
                        <td><strong>{{ pago.idpos }}</strong></td>
                        <td><strong>{{ pago.asesor_username }}</strong></td>
                        <td>{{ pago.fecha_pago }}</td>
                        <td>{{ formatCurrency(pago.monto) }}</td>
                        <td><span class="badge bg-secondary">{{ pago.metodo_pago }}</span></td>
                        <td class="text-truncate" style="max-width: 220px;">
                          {{ pago.observacion || 'N/A' }}
                        </td>
                        <td class="text-end">
                          <button
                            class="btn btn-sm btn-outline-secondary me-2"
                            @click="openPagoModal('edit', pago)"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-pencil"
                              viewBox="0 0 16 16"
                            >
                              <path
                                d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 
                                  .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 
                                  1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 
                                  2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 
                                  2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 
                                  1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 
                                  1 .5.5v.207l6.5-6.5zm-7.468 7.468-1.5 
                                  1.5V13h1.5v-1.5z"
                              />
                            </svg>
                          </button>
                          <button class="btn btn-sm btn-outline-danger" @click="eliminarPago(pago)">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-trash"
                              viewBox="0 0 16 16"
                            >
                              <path
                                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 
                                  0a.5.5 0 0 1 .5.5v6a.5.5 0 0 
                                  1-1 0V6a.5.5 0 0 1 .5-.5zm3 
                                  .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 
                                  1 0V6z"
                              />
                              <path
                                fill-rule="evenodd"
                                d="M14.5 3a1 1 0 0 1-1 
                                  1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 
                                  1-2-2V4h-.5a1 1 0 0 
                                  1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 
                                  4 4 
                                  4.059V13a1 1 0 0 0 1 
                                  1h6a1 1 0 0 0 1-1V4.059L11.882 
                                  4H4.118zM2.5 3V2h11v1h-11z"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                  <span class="text-muted">
                    Mostrando {{ pagosData.results.length }} de {{ pagosData.count }} resultados
                  </span>
                  <nav>
                    <ul class="pagination pagination-sm mb-0">
                      <li class="page-item" :class="{ disabled: pagosData.current_page === 1 }">
                        <button class="page-link" @click="goToPagosPage(pagosData.current_page - 1)">
                          Anterior
                        </button>
                      </li>
                      <li class="page-item disabled">
                        <span class="page-link">
                          Página {{ pagosData.current_page }} de {{ pagosData.total_pages }}
                        </span>
                      </li>
                      <li
                        class="page-item"
                        :class="{ disabled: pagosData.current_page === pagosData.total_pages }"
                      >
                        <button class="page-link" @click="goToPagosPage(pagosData.current_page + 1)">
                          Siguiente
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>

              <div v-else class="text-center p-5 border rounded bg-light mt-4">
                <p class="fs-4 mb-1">No se encontraron pagos.</p>
                <p>Usa los filtros de arriba y haz clic en "Buscar" para encontrar pagos.</p>
              </div>
            </div>

            <!-- 6. Pestaña de Configuración -->
            <div class="tab-pane fade" id="config-pane" role="tabpanel">
              <h2 class="h3 mb-4">Ajustes Generales del Sistema</h2>
              <div class="row">
                <div class="col-md-8 col-lg-6">
                  <div class="card shadow-sm">
                    <div class="card-body">
                      <h5 class="card-title mb-1">Fecha de Corte Mensual</h5>
                      <p class="card-text mb-3">
                        Establece el día del mes en que se procesarán las comisiones. Este valor se repetirá mensualmente.
                      </p>
                      <div class="mb-3">
                        <label for="diaCorte" class="form-label fw-bold">Día de Corte (1-31)</label>
                        <input
                          type="number"
                          class="form-control"
                          id="diaCorte"
                          v-model.number="fechaCorteDia"
                          min="1"
                          max="31"
                          placeholder="Ej: 25"
                        />
                      </div>
                      <div class="d-grid">
                        <button class="btn btn-danger" @click="guardarFechaCorte" :disabled="isSavingCorte">
                          <span v-if="isSavingCorte" class="spinner-border spinner-border-sm me-2"></span>
                          {{ isSavingCorte ? 'Guardando...' : 'Guardar Cambios' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- FIN tabs -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useCookies } from 'vue3-cookies';
import backendRouter from '@/components/BackendRouter/BackendRouter';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import { Bar, Doughnut, Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';
import * as XLSX from 'xlsx';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const { cookies } = useCookies();
const token = cookies.get('jwt');
const authHeaders = { Authorization: `Bearer ${token}` };

/* ------------------- ROLES -------------------- */
const rolesOptions = [
  { value: 'asesor_comisiones', label: 'Asesor' },
  { value: 'supervisor_comisiones', label: 'Supervisor' },
];

/* ------------ CARGA DE ARCHIVOS ------------- */
const selectedFile = ref(null);
const isLoading = ref(false);
const isDragging = ref(false);
const uploadResult = ref(null);
const fileInput = ref(null);

const handleFileChange = async (event) => {
  const files = event.target.files || event.dataTransfer.files;
  if (!files || files.length === 0) return;
  const file = files[0];
  uploadResult.value = null;

  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    if (workbook.SheetNames.length !== 1) {
      Swal.fire({
        icon: 'error',
        title: 'Archivo no válido',
        text: 'El archivo Excel debe contener exactamente una hoja.',
      });
      clearFile();
      return;
    }
    selectedFile.value = file;
  } catch (error) {
    console.error('Error al leer el archivo:', error);
    Swal.fire({
      icon: 'error',
      title: 'Archivo dañado',
      text: 'No se pudo leer el archivo. Verifica que sea un .xlsx válido.',
    });
    clearFile();
  }
};

const clearFile = () => {
  selectedFile.value = null;
  if (fileInput.value) fileInput.value.value = '';
  uploadResult.value = null;
};

const onDragOver = (event) => {
  event.preventDefault();
  isDragging.value = true;
};

const onDragLeave = (event) => {
  event.preventDefault();
  isDragging.value = false;
};

const onDrop = (event) => {
  event.preventDefault();
  isDragging.value = false;
  handleFileChange(event);
};

const uploadFile = async () => {
  if (!selectedFile.value) return;
  isLoading.value = true;
  const formData = new FormData();
  formData.append('file', selectedFile.value);
  const path = backendRouter.data + 'comisiones/upload/';
  const headers = { ...authHeaders, 'Content-Type': 'multipart/form-data' };

  try {
    await axios.post(path, formData, { headers });
    Swal.fire({
      title: 'Carga iniciada',
      text: 'El archivo se está procesando en segundo plano. Se enviará confirmación por correo.',
      icon: 'info',
    });
    clearFile();
  } catch (error) {
    if (error.response && error.response.data) {
      const errorMessage = error.response.data.error || 'Ocurrió un error al iniciar la carga.';
      Swal.fire('Error al iniciar', errorMessage, 'error');
    } else {
      Swal.fire('Error inesperado', 'No se pudo comunicar con el servidor.', 'error');
    }
  } finally {
    isLoading.value = false;
  }
};

/* ------------- GESTIÓN DE ASESORES ------------- */
const searchQuery = ref('');
const asesores = ref([]);
const rutas = ref([]);
const isLoadingPermissions = ref(false);

const asesoresOptions = computed(() =>
  (asesores.value || []).map((a) => ({
    label: `${a.username} (${a.email})`,
    value: a.username,
  }))
);

/* 🔢 LÓGICA DE CUPO POR RUTA (FRONT) */
const MAX_ASESORES_POR_RUTA = 1;

const asesoresPorRuta = computed(() => {
  const conteo = {};
  (asesores.value || []).forEach((a) => {
    if (a.rol === 'asesor_comisiones' && a.is_active !== false) {
      (a.rutas_asignadas || []).forEach((ruta) => {
        if (!ruta) return;
        if (!conteo[ruta]) conteo[ruta] = 0;
        conteo[ruta] += 1;
      });
    }
  });
  return conteo;
});

const labelRutaWithCupo = (ruta) => {
  const count = asesoresPorRuta.value[ruta] || 0;
  const remaining = MAX_ASESORES_POR_RUTA - count;

  if (remaining <= 0) return `${ruta} (sin cupo para asesor)`;
  if (remaining === 1) return `${ruta} (1 cupo asesor libre)`;
  return `${ruta} (${remaining} cupos asesor libres)`;
};

const shouldDisableRutaForAsesor = (ruta, asesor) => {
  if (!asesor) return false;
  // Si el asesor ya tiene esta ruta, no bloqueamos (permite mantenerla)
  if (asesor.rutas_asignadas && asesor.rutas_asignadas.includes(ruta)) {
    return false;
  }
  const count = asesoresPorRuta.value[ruta] || 0;
  return count >= MAX_ASESORES_POR_RUTA;
};

const modalMode = ref('create');
const currentAsesor = reactive({
  id: null,
  username: '',
  email: '',
  password: '',
  rol: 'asesor_comisiones',
  rutas_asignadas: [],
});

const filteredAsesores = computed(() => {
  if (!searchQuery.value) return asesores.value;
  const q = searchQuery.value.toLowerCase();
  return asesores.value.filter(
    (asesor) =>
      asesor.username?.toLowerCase().includes(q) || asesor.email?.toLowerCase().includes(q)
  );
});

const fetchPermissionsData = async () => {
  isLoadingPermissions.value = true;
  try {
    const asesoresPath = backendRouter.data + 'admin/asesores/';
    const rutasPath = backendRouter.data + 'admin/rutas/';
    const [asesoresResponse, rutasResponse] = await Promise.all([
      axios.get(asesoresPath, { headers: authHeaders }),
      axios.get(rutasPath, { headers: authHeaders }),
    ]);

    asesores.value = asesoresResponse.data.map((a) => ({
      ...a,
      rol: a.rol || 'asesor_comisiones',
      rutas_asignadas: Array.isArray(a.rutas_asignadas) ? a.rutas_asignadas : [],
    }));
    rutas.value = rutasResponse.data;
  } catch (error) {
    console.error('Error al cargar datos de asesores:', error);
    Swal.fire('Error', 'No se pudieron cargar los datos de asesores.', 'error');
  } finally {
    isLoadingPermissions.value = false;
  }
};

const updateAsesor = async (asesor) => {
  const path = backendRouter.data + `admin/asesores/${asesor.id}/`;
  const data = {
    username: asesor.username,
    email: asesor.email,
    rol: asesor.rol,
    rutas_asignadas: asesor.rutas_asignadas || [],
  };

  try {
    await axios.put(path, data, { headers: authHeaders });
    Swal.fire({
      icon: 'success',
      title: 'Asesor actualizado',
      timer: 1200,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error('Error al actualizar asesor:', error);
    let errorMsg = `No se pudo actualizar la información de ${asesor.username}.`;
    if (error.response && error.response.data) {
      errorMsg = Object.values(error.response.data).flat().join(' ');
    }
    Swal.fire('Error', errorMsg, 'error');
    fetchPermissionsData();
  }
};

const onChangeRol = async (asesor) => {
  if (asesor.rol === 'asesor_comisiones' && asesor.rutas_asignadas?.length > 1) {
    asesor.rutas_asignadas = [asesor.rutas_asignadas[0]];
  }
  await updateAsesor(asesor);
};

const onChangeRutasAsesor = async (asesor) => {
  if (asesor.rol === 'asesor_comisiones') {
    if (asesor.rutas_asignadas && asesor.rutas_asignadas.length > 1) {
      asesor.rutas_asignadas = [asesor.rutas_asignadas[0]];
      Swal.fire(
        'Aviso',
        'Un asesor solo puede tener una ruta. Se ha mantenido la primera seleccionada.',
        'info'
      );
    } else if (asesor.rutas_asignadas && asesor.rutas_asignadas[0] === null) {
      asesor.rutas_asignadas = [];
    } else if (!asesor.rutas_asignadas || asesor.rutas_asignadas.length === 0) {
      asesor.rutas_asignadas = [];
    } else {
      asesor.rutas_asignadas = [asesor.rutas_asignadas[0]];
    }
  }
  await updateAsesor(asesor);
};

const openModal = (mode, asesor = null) => {
  modalMode.value = mode;
  if (mode === 'create') {
    Object.assign(currentAsesor, {
      id: null,
      username: '',
      email: '',
      password: '',
      rol: 'asesor_comisiones',
      rutas_asignadas: [],
    });
  } else if (mode === 'edit' && asesor) {
    Object.assign(currentAsesor, {
      id: asesor.id,
      username: asesor.username,
      email: asesor.email,
      password: '',
      rol: asesor.rol || 'asesor_comisiones',
      rutas_asignadas: Array.isArray(asesor.rutas_asignadas) ? [...asesor.rutas_asignadas] : [],
    });
  }
  showAsesorModal();
};

const showAsesorModal = () => {
  Swal.fire({
    title: modalMode.value === 'create' ? 'Nuevo Asesor' : 'Editar Asesor',
    html: `
      <input id="swal-username" class="swal2-input" placeholder="Número de documento" value="${
        currentAsesor.username || ''
      }">
      <input id="swal-email" type="email" class="swal2-input" placeholder="Email" value="${
        currentAsesor.email || ''
      }">

      ${
        modalMode.value === 'create'
          ? '<input id="swal-password" type="password" class="swal2-input" placeholder="Contraseña">'
          : ''
      }

      <select id="swal-rol" class="swal2-select">
        ${rolesOptions
          .map(
            (rol) => `
          <option value="${rol.value}" ${
              currentAsesor.rol === rol.value ? 'selected' : ''
            }>${rol.label}</option>
        `
          )
          .join('')}
      </select>

      <select id="swal-rutas" class="swal2-select" multiple>
        <option value="">-- Sin Asignar --</option>
        ${rutas.value
          .map(
            (ruta) => `
          <option value="${ruta}" ${
              currentAsesor.rutas_asignadas.includes(ruta) ? 'selected' : ''
            }>${ruta}</option>
        `
          )
          .join('')}
      </select>
      <small style="display:block;margin-top:4px;">Si el rol es <strong>Asesor</strong>, solo se permite una ruta.</small>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#DF1115',
    preConfirm: () => {
      const username = document.getElementById('swal-username').value;
      const email = document.getElementById('swal-email').value;
      const rol = document.getElementById('swal-rol').value;
      const rutasSelect = document.getElementById('swal-rutas');
      const rutasSeleccionadas = Array.from(rutasSelect.selectedOptions)
        .map((o) => o.value)
        .filter((v) => v);

      const password =
        modalMode.value === 'create'
          ? document.getElementById('swal-password').value
          : null;

      if (!username || !email) {
        Swal.showValidationMessage('El número de documento y el email son obligatorios');
        return false;
      }
      if (modalMode.value === 'create' && !password) {
        Swal.showValidationMessage('La contraseña es obligatoria para crear usuarios');
        return false;
      }
      if (rol === 'asesor_comisiones' && rutasSeleccionadas.length > 1) {
        Swal.showValidationMessage('Un asesor solo puede tener una ruta asignada');
        return false;
      }

      // 🔐 Validación de cupo por ruta (máx 1 asesor por ruta)
      if (rol === 'asesor_comisiones' && rutasSeleccionadas.length === 1) {
        const ruta = rutasSeleccionadas[0];
        let count = asesoresPorRuta.value[ruta] || 0;

        // Si estamos editando y el asesor ya tenía esta ruta, no lo contemos doble
        if (modalMode.value === 'edit') {
          const asesorOriginal = asesores.value.find((a) => a.id === currentAsesor.id);
          if (
            asesorOriginal &&
            asesorOriginal.rol === 'asesor_comisiones' &&
            (asesorOriginal.rutas_asignadas || []).includes(ruta)
          ) {
            count -= 1;
          }
        }

        if (count >= MAX_ASESORES_POR_RUTA) {
          const maxText = MAX_ASESORES_POR_RUTA === 1 ? 'asesor' : 'asesores';
          Swal.showValidationMessage(
            `La ruta "${ruta}" ya tiene el máximo de ${MAX_ASESORES_POR_RUTA} ${maxText} asignado${
              MAX_ASESORES_POR_RUTA > 1 ? 's' : ''
            }.`
          );
          return false;
        }
      }

      return {
        username,
        email,
        password,
        rol,
        rutas_asignadas: rutasSeleccionadas,
      };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      handleSaveAsesor(result.value);
    }
  });
};

const handleSaveAsesor = async (formData) => {
  const data = {
    username: formData.username,
    email: formData.email,
    rol: formData.rol,
    rutas_asignadas: formData.rutas_asignadas,
  };

  try {
    if (modalMode.value === 'create') {
      data.password = formData.password;
      const path = backendRouter.data + 'admin/asesores/';
      await axios.post(path, data, { headers: authHeaders });
      Swal.fire('¡Creado!', 'El asesor ha sido creado con éxito.', 'success');
    } else {
      const path = backendRouter.data + `admin/asesores/${currentAsesor.id}/`;
      await axios.put(path, data, { headers: authHeaders });
      Swal.fire('¡Actualizado!', 'El asesor ha sido actualizado.', 'success');
    }
    fetchPermissionsData();
  } catch (error) {
    console.error('Error al guardar asesor:', error);
    let errorMsg = 'No se pudo guardar el asesor.';
    if (error.response && error.response.data) {
      errorMsg = Object.values(error.response.data).flat().join(' ');
    }
    Swal.fire('Error', errorMsg, 'error');
  }
};

const toggleAsesorActivo = async (asesor) => {
  const nuevoEstado = !asesor.is_active;
  const path = backendRouter.data + `admin/asesores/${asesor.id}/activar/`;
  try {
    await axios.patch(path, { is_active: nuevoEstado }, { headers: authHeaders });
    asesor.is_active = nuevoEstado;
    Swal.fire({
      icon: 'success',
      title: nuevoEstado ? 'Asesor Activado' : 'Asesor Desactivado',
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error('Error al cambiar estado asesor:', error);
    Swal.fire('Error', 'No se pudo cambiar el estado del asesor.', 'error');
    fetchPermissionsData();
  }
};

const eliminarAsesor = async (asesor) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: `Esta acción eliminará permanentemente a ${asesor.username}. ¡No se puede revertir!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const path = backendRouter.data + `admin/asesores/${asesor.id}/`;
        await axios.delete(path, { headers: authHeaders });
        Swal.fire('¡Eliminado!', 'El asesor ha sido eliminado.', 'success');
        fetchPermissionsData();
      } catch (error) {
        console.error('Error al eliminar asesor:', error);
        Swal.fire('Error', 'No se pudo eliminar al asesor.', 'error');
      }
    }
  });
};

/* --------- REPORTES / GRÁFICAS --------- */
const isLoadingReports = ref(false);
const isLoadingExport = ref(false);
const reportFilters = reactive({
  range: [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()],
  rutas: [],
  estados: [],
});
const filterOptions = ref({
  rutas: [],
  estados: ['Pendiente', 'Acumulada', 'Pagada', 'Consolidada', 'Vencida'],
});
const reportData = ref(null);

const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
};

const fetchFilterOptions = async () => {
  filterOptions.value.rutas = rutas.value;
};

const generarReporte = async () => {
  isLoadingReports.value = true;
  reportData.value = null;
  const params = new URLSearchParams();
  if (reportFilters.range && reportFilters.range[0] && reportFilters.range[1]) {
    params.append('fecha_inicio', reportFilters.range[0].toISOString().split('T')[0]);
    params.append('fecha_fin', reportFilters.range[1].toISOString().split('T')[0]);
  }
  reportFilters.rutas.forEach((ruta) => params.append('rutas', ruta));
  reportFilters.estados.forEach((estado) => params.append('estados', estado));

  try {
    const path = `${backendRouter.data}admin/reporte-general/?${params.toString()}`;
    const response = await axios.get(path, { headers: authHeaders });
    reportData.value = response.data;
  } catch (error) {
    console.error('Error al generar reporte:', error);
    Swal.fire('Error', 'No se pudo generar el reporte.', 'error');
  } finally {
    isLoadingReports.value = false;
  }
};

const exportarExcel = async () => {
  isLoadingExport.value = true;
  const params = new URLSearchParams();
  if (reportFilters.range && reportFilters.range[0] && reportFilters.range[1]) {
    params.append('fecha_inicio', reportFilters.range[0].toISOString().split('T')[0]);
    params.append('fecha_fin', reportFilters.range[1].toISOString().split('T')[0]);
  }
  reportFilters.rutas.forEach((ruta) => params.append('rutas', ruta));
  reportFilters.estados.forEach((estado) => params.append('estados', estado));

  try {
    const path = `${backendRouter.data}admin/exportar-reporte/?${params.toString()}`;
    const response = await axios.get(path, {
      headers: authHeaders,
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    const contentDisposition = response.headers['content-disposition'];
    let fileName = 'reporte_comisiones.xlsx';
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
      if (fileNameMatch && fileNameMatch.length === 2) fileName = fileNameMatch[1];
    }
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error al exportar Excel:', error);
    Swal.fire('Error', 'No se pudo generar el archivo Excel.', 'error');
  } finally {
    isLoadingExport.value = false;
  }
};

/* --------- GESTIÓN DE COMISIONES PENDIENTES --------- */
const isLoadingPendientes = ref(false);
const isLoadingPuntosDeVentaPendientes = ref(false); // reserva por si luego agregas PDV

const pendientesFilters = reactive({
  ruta: null,
  asesor: null,
  idpos: '',
  range: [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()],
});

const pendientesData = ref({
  results: [],
  count: 0,
  current_page: 1,
  total_pages: 1,
});

const pendientesCurrentPage = ref(1);

const currentComision = reactive({
  id: null,
  idpos: '',
  ruta: '',
  asesor_username: '',
  mes_pago: '',
  valor_comision: 0,
  estado: 'Pendiente',
  observacion: '',
});

const buscarPendientes = () => {
  pendientesCurrentPage.value = 1;
  fetchPendientes(1);
};

const goToPendientesPage = (page) => {
  if (page < 1 || page > pendientesData.value.total_pages) return;
  fetchPendientes(page);
};

const fetchPendientes = async (page = 1) => {
  isLoadingPendientes.value = true;
  const params = new URLSearchParams();
  params.append('page', page);

  // Traer Pendiente + Acumulada
  params.append('estado', 'Pendiente');
  params.append('estado', 'Acumulada');

  if (pendientesFilters.ruta) params.append('ruta', pendientesFilters.ruta);
  if (pendientesFilters.asesor) params.append('asesor', pendientesFilters.asesor);
  if (pendientesFilters.idpos) params.append('idpos', pendientesFilters.idpos);
  if (pendientesFilters.range && pendientesFilters.range[0] && pendientesFilters.range[1]) {
    params.append('fecha_inicio', pendientesFilters.range[0].toISOString().split('T')[0]);
    params.append('fecha_fin', pendientesFilters.range[1].toISOString().split('T')[0]);
  }

  try {
    const path = `${backendRouter.data}admin/comisiones-pendientes/?${params.toString()}`;
    const response = await axios.get(path, { headers: authHeaders });
    pendientesData.value = response.data;
    pendientesCurrentPage.value = response.data.current_page;
  } catch (error) {
    console.error('Error al cargar comisiones pendientes:', error);
    pendientesData.value = { results: [], count: 0, current_page: 1, total_pages: 1 };
    Swal.fire('Error', 'No se pudieron cargar las comisiones pendientes.', 'error');
  } finally {
    isLoadingPendientes.value = false;
  }
};

const openComisionModal = (mode, comision = null) => {
  if (mode === 'edit' && comision) {
    Object.assign(currentComision, {
      id: comision.id,
      idpos: comision.idpos,
      ruta: comision.ruta,
      asesor_username: comision.asesor_username,
      mes_pago: comision.mes_pago || comision.fecha_referencia || '',
      valor_comision: comision.valor_comision,
      estado: comision.estado,
      observacion: comision.observacion || '',
    });
    showComisionModal();
  }
};

const showComisionModal = () => {
  Swal.fire({
    title: 'Editar Comisión Pendiente',
    html: `
      <div class="text-start">
        <label class="form-label mt-2">ID POS</label>
        <input class="swal2-input" value="${currentComision.idpos}" disabled>

        <label class="form-label mt-2">Ruta</label>
        <input class="swal2-input" value="${currentComision.ruta || ''}" disabled>

        <label class="form-label mt-2">Asesor</label>
        <input class="swal2-input" value="${currentComision.asesor_username || ''}" disabled>

        <label for="swal-mes-pago" class="form-label mt-2">Mes Pago</label>
        <input id="swal-mes-pago" class="swal2-input" placeholder="Ej: Diciembre 2025" value="${
          currentComision.mes_pago || ''
        }">

        <label for="swal-valor" class="form-label mt-2">Valor Comisión</label>
        <input id="swal-valor" type="number" class="swal2-input" placeholder="Valor" value="${
          currentComision.valor_comision
        }">

        <label for="swal-estado" class="form-label mt-2">Estado</label>
        <select id="swal-estado" class="swal2-select">
          <option value="Pendiente" ${
            currentComision.estado === 'Pendiente' ? 'selected' : ''
          }>Pendiente</option>
          <option value="Acumulada" ${
            currentComision.estado === 'Acumulada' ? 'selected' : ''
          }>Acumulada</option>
          <option value="Vencida" ${
            currentComision.estado === 'Vencida' ? 'selected' : ''
          }>Vencida</option>
        </select>

        <label for="swal-obs-comision" class="form-label mt-2">Observación</label>
        <textarea id="swal-obs-comision" class="swal2-textarea" placeholder="Observación (opcional)...">${
          currentComision.observacion || ''
        }</textarea>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Guardar Cambios',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#DF1115',
    preConfirm: () => {
      const mes_pago = document.getElementById('swal-mes-pago').value;
      const valor_comision = document.getElementById('swal-valor').value;
      const estado = document.getElementById('swal-estado').value;
      const observacion = document.getElementById('swal-obs-comision').value;

      if (!mes_pago || !valor_comision) {
        Swal.showValidationMessage('Mes de pago y valor de comisión son obligatorios');
        return false;
      }

      return { mes_pago, valor_comision, estado, observacion };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      handleSaveComision(result.value);
    }
  });
};

const handleSaveComision = async (formData) => {
  const path = backendRouter.data + `admin/comisiones-pendientes/${currentComision.id}/`;
  try {
    await axios.put(path, formData, { headers: authHeaders });
    Swal.fire('¡Actualizada!', 'La comisión ha sido actualizada.', 'success');
    fetchPendientes(pendientesCurrentPage.value);
    generarReporte(); // refresca dashboard general
  } catch (error) {
    console.error('Error al guardar comisión:', error);
    let errorMsg = 'No se pudo guardar la comisión.';
    if (error.response && error.response.data) {
      errorMsg = Object.values(error.response.data).flat().join(' ');
    }
    Swal.fire('Error', errorMsg, 'error');
  }
};

const eliminarComision = async (comision) => {
  Swal.fire({
    title: '¿Eliminar esta comisión pendiente?',
    text: `Esta acción eliminará la comisión de ${formatCurrency(
      comision.valor_comision
    )}. ¡No se puede revertir!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const path = backendRouter.data + `admin/comisiones-pendientes/${comision.id}/`;
        await axios.delete(path, { headers: authHeaders });
        Swal.fire('¡Eliminada!', 'La comisión ha sido eliminada.', 'success');
        fetchPendientes(pendientesCurrentPage.value);
        generarReporte();
      } catch (error) {
        console.error('Error al eliminar comisión:', error);
        Swal.fire('Error', 'No se pudo eliminar la comisión.', 'error');
      }
    }
  });
};

/* --------- GESTIÓN DE PAGOS --------- */
const isLoadingPagos = ref(false);
const isLoadingPuntosDeVenta = ref(false);
const puntosDeVentaOptions = ref([]);
const pagosFilters = reactive({
  ruta: null,
  punto_de_venta: null,
  range: [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()],
});
const pagosData = ref({
  results: [],
  count: 0,
  current_page: 1,
  total_pages: 1,
});
const pagosCurrentPage = ref(1);

const metodosPagoOptions = ref([
  'Recarga',
  'Cartera',
  'Nequi',
  'Daviplata',
  'Ahorro a la Mano',
  'Otro',
]);

const currentPago = reactive({
  id: null,
  monto: 0,
  fecha_pago: '',
  metodo_pago: '',
  observacion: '',
});

watch(
  () => pagosFilters.ruta,
  (newRuta) => {
    pagosFilters.punto_de_venta = null;
    puntosDeVentaOptions.value = [];
    if (newRuta) {
      fetchPuntosDeVenta(newRuta);
    }
  }
);

const fetchPuntosDeVenta = async (ruta) => {
  isLoadingPuntosDeVenta.value = true;
  try {
    const path = `${backendRouter.data}admin/puntos-de-venta/?ruta=${encodeURIComponent(ruta)}`;
    const response = await axios.get(path, { headers: authHeaders });
    puntosDeVentaOptions.value = response.data;
  } catch (error) {
    console.error('Error al cargar puntos de venta:', error);
    Swal.fire('Error', 'No se pudieron cargar los puntos de venta para esa ruta.', 'error');
  } finally {
    isLoadingPuntosDeVenta.value = false;
  }
};

const buscarPagos = () => {
  pagosCurrentPage.value = 1;
  fetchPagos(1);
};

const goToPagosPage = (page) => {
  if (page < 1 || page > pagosData.value.total_pages) return;
  fetchPagos(page);
};

const fetchPagos = async (page = 1) => {
  isLoadingPagos.value = true;
  const params = new URLSearchParams();
  params.append('page', page);

  if (pagosFilters.ruta) params.append('ruta', pagosFilters.ruta);
  if (pagosFilters.punto_de_venta) params.append('punto_de_venta', pagosFilters.punto_de_venta);
  if (pagosFilters.range && pagosFilters.range[0] && pagosFilters.range[1]) {
    params.append('fecha_inicio', pagosFilters.range[0].toISOString().split('T')[0]);
    params.append('fecha_fin', pagosFilters.range[1].toISOString().split('T')[0]);
  }

  try {
    const path = `${backendRouter.data}admin/pagos/?${params.toString()}`;
    const response = await axios.get(path, { headers: authHeaders });
    pagosData.value = response.data;
    pagosCurrentPage.value = response.data.current_page;
  } catch (error) {
    console.error('Error al cargar pagos:', error);
    pagosData.value = { results: [], count: 0, current_page: 1, total_pages: 1 };
    Swal.fire('Error', 'No se pudieron cargar los pagos.', 'error');
  } finally {
    isLoadingPagos.value = false;
  }
};

const openPagoModal = (mode, pago = null) => {
  if (mode === 'edit' && pago) {
    Object.assign(currentPago, {
      id: pago.id,
      monto: pago.monto,
      fecha_pago: pago.fecha_pago,
      metodo_pago: pago.metodo_pago,
      observacion: pago.observacion || '',
    });
    showPagoModal();
  }
};

const showPagoModal = () => {
  Swal.fire({
    title: 'Editar Pago',
    html: `
      <div class="text-start">
        <label for="swal-fecha" class="form-label mt-2">Fecha de Pago</label>
        <input id="swal-fecha" type="date" class="swal2-input" value="${currentPago.fecha_pago}">

        <label for="swal-monto" class="form-label mt-2">Monto</label>
        <input id="swal-monto" type="number" class="swal2-input" placeholder="Monto" value="${currentPago.monto}">

        <label for="swal-metodo" class="form-label mt-2">Método de Pago</label>
        <select id="swal-metodo" class="swal2-select">
          ${metodosPagoOptions.value
            .map(
              (metodo) => `
            <option value="${metodo}" ${
                currentPago.metodo_pago === metodo ? 'selected' : ''
              }>${metodo}</option>
          `
            )
            .join('')}
        </select>

        <label for="swal-obs" class="form-label mt-2">Observación</label>
        <textarea id="swal-obs" class="swal2-textarea" placeholder="Observación (opcional)...">${
          currentPago.observacion || ''
        }</textarea>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Guardar Cambios',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#DF1115',
    preConfirm: () => {
      const fecha_pago = document.getElementById('swal-fecha').value;
      const monto = document.getElementById('swal-monto').value;
      const metodo_pago = document.getElementById('swal-metodo').value;
      const observacion = document.getElementById('swal-obs').value;

      if (!fecha_pago || !monto || !metodo_pago) {
        Swal.showValidationMessage('Fecha, Monto y Método de Pago son obligatorios');
        return false;
      }
      return { fecha_pago, monto, metodo_pago, observacion };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      handleSavePago(result.value);
    }
  });
};

const handleSavePago = async (formData) => {
  const path = backendRouter.data + `admin/pagos/${currentPago.id}/`;
  try {
    await axios.put(path, formData, { headers: authHeaders });
    Swal.fire('¡Actualizado!', 'El pago ha sido actualizado.', 'success');
    fetchPagos(pagosCurrentPage.value);
    generarReporte();
  } catch (error) {
    console.error('Error al guardar pago:', error);
    let errorMsg = 'No se pudo guardar el pago.';
    if (error.response && error.response.data) {
      errorMsg = Object.values(error.response.data).flat().join(' ');
    }
    Swal.fire('Error', errorMsg, 'error');
  }
};

const eliminarPago = async (pago) => {
  Swal.fire({
    title: '¿Reversar este pago?',
    text: `Esta acción eliminará el pago de ${formatCurrency(
      pago.monto
    )} y devolverá las comisiones asociadas a 'Pendiente'. ¡No se puede revertir!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, reversar',
    cancelButtonText: 'Cancelar',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const path = backendRouter.data + `admin/pagos/${pago.id}/`;
        await axios.delete(path, { headers: authHeaders });
        Swal.fire(
          '¡Reversado!',
          'El pago ha sido eliminado y las comisiones han sido liberadas.',
          'success'
        );
        fetchPagos(pagosCurrentPage.value);
        generarReporte();
      } catch (error) {
        console.error('Error al reversar pago:', error);
        Swal.fire('Error', 'No se pudo reversar el pago.', 'error');
      }
    }
  });
};

/* --------- GRÁFICOS --------- */
const chartOptions = { responsive: true, maintainAspectRatio: false };
const lineChartOptions = computed(() => ({
  ...chartOptions,
  tension: 0.3,
  scales: {
    y: { beginAtZero: true },
  },
}));

const evolucionChartData = computed(() => {
  const data = reportData.value?.charts?.evolucion_mensual || [];
  return {
    labels: data.map((item) => item.mes),
    datasets: [
      {
        label: 'Total Pagado',
        data: data.map((item) => item.pagado),
        backgroundColor: '#28a745',
      },
      {
        label: 'Total Pendiente',
        data: data.map((item) => item.pendiente),
        backgroundColor: '#ffc107',
      },
    ],
  };
});

const estadoChartData = computed(() => {
  const data = reportData.value?.charts?.distribucion_estado || [];
  return {
    labels: data.map((item) => item.estado),
    datasets: [
      {
        data: data.map((item) => item.total),
        backgroundColor: ['#17a2b8', '#6c757d', '#28a745', '#ffc107', '#dc3545'],
      },
    ],
  };
});

const picosMensualesChartData = computed(() => {
  const data = reportData.value?.charts?.picos_mensuales || [];
  return {
    labels: data.map((item) => item.mes),
    datasets: [
      {
        label: 'Total Comisiones por Mes',
        data: data.map((item) => (item.pagado || 0) + (item.pendiente || 0)),
        borderColor: '#DF1115',
        backgroundColor: 'rgba(223, 17, 21, 0.1)',
        fill: true,
      },
    ],
  };
});

const picosMensualesPagadoChartData = computed(() => {
  const data = reportData.value?.charts?.picos_mensuales || [];
  return {
    labels: data.map((item) => item.mes),
    datasets: [
      {
        label: 'Total Pagado por Mes',
        data: data.map((item) => item.pagado),
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        fill: true,
      },
    ],
  };
});

const metodoValorChartData = computed(() => {
  const data = reportData.value?.charts?.metodos_pago || [];
  return {
    labels: data.map((item) => item.metodo),
    datasets: [
      {
        label: 'Valor Total Pagado por Método',
        data: data.map((item) => item.total_valor),
        backgroundColor: [
          'rgba(223, 17, 21, 0.7)',
          'rgba(23, 162, 184, 0.7)',
          'rgba(40, 167, 69, 0.7)',
          'rgba(255, 193, 7, 0.7)',
          'rgba(108, 117, 125, 0.7)',
        ],
        borderColor: ['#DF1115', '#17a2b8', '#28a745', '#ffc107', '#6c757d'],
        borderWidth: 1,
      },
    ],
  };
});

const metodoCantidadChartData = computed(() => {
  const data = reportData.value?.charts?.metodos_pago || [];
  return {
    labels: data.map((item) => `${item.metodo} (${item.total_cantidad})`),
    datasets: [
      {
        data: data.map((item) => item.total_cantidad),
        backgroundColor: ['#DF1115', '#17a2b8', '#28a745', '#ffc107', '#6c757d'],
        hoverOffset: 4,
      },
    ],
  };
});

/* --------- CONFIGURACIÓN (fecha de corte) --------- */
const fechaCorteDia = ref(25);
const isSavingCorte = ref(false);

const fetchFechaCorte = async () => {
  try {
    const path = `${backendRouter.data}admin/fecha-corte/`;
    const response = await axios.get(path, { headers: authHeaders });
    fechaCorteDia.value = parseInt(response.data.dia, 10);
  } catch (error) {
    console.error('Error al cargar fecha de corte:', error);
    Swal.fire('Error', 'No se pudo cargar la configuración de fecha de corte.', 'error');
  }
};

const guardarFechaCorte = async () => {
  if (!fechaCorteDia.value || fechaCorteDia.value < 1 || fechaCorteDia.value > 31) {
    Swal.fire('Dato inválido', 'Por favor, introduce un número entre 1 y 31.', 'warning');
    return;
  }
  isSavingCorte.value = true;
  try {
    const path = `${backendRouter.data}admin/fecha-corte/`;
    const data = { dia: fechaCorteDia.value };
    const response = await axios.post(path, data, { headers: authHeaders });
    Swal.fire({
      icon: 'success',
      title: '¡Guardado!',
      text: response.data.mensaje,
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error('Error al guardar fecha corte:', error);
    const errorMessage = error.response?.data?.error || 'Ocurrió un error inesperado al guardar.';
    Swal.fire('Error', errorMessage, 'error');
  } finally {
    isSavingCorte.value = false;
  }
};

/* --------- LIFECYCLE --------- */
onMounted(() => {
  fetchPermissionsData().then(() => {
    fetchFilterOptions();
  });
  fetchFechaCorte();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

body {
  font-family: 'Poppins', sans-serif;
  background-color: #f8f9fa;
}

.bg-light {
  background-color: #f8f9fa !important;
}

.container {
  max-width: 1400px;
}

.admin-card {
  border-radius: 1rem;
  overflow: hidden;
}

h1,
h2,
h3,
h4,
h5,
h6,
.form-label,
.btn,
p,
.nav-link,
.card-title,
.card-text {
  font-family: 'Poppins', sans-serif;
  color: #343a40;
}

h1,
h2,
h3,
h4,
h5 {
  font-weight: 600;
}

.nav-tabs .nav-link {
  color: #495057;
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-weight: 500;
  border: none;
  border-bottom: 3px solid transparent;
}

.nav-tabs .nav-link.active {
  color: #000000;
  border-bottom-color: #df1115;
}

/* Dropzone */
.drop-zone {
  border: 2px dashed #ccc;
  border-radius: 0.75rem;
  padding: 40px;
  cursor: pointer;
  background-color: #ffffff;
  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.drop-zone:hover,
.drop-zone.is-dragging {
  background-color: rgba(223, 17, 21, 0.03);
  border-color: #df1115;
  box-shadow: 0 0.5rem 1rem rgba(223, 17, 21, 0.08);
}

.drop-zone svg {
  color: #6c757d;
}

/* KPI cards */
.kpi-card .stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #df1115;
}

.stat-value.text-success {
  color: #198754 !important;
}

.stat-value.text-warning {
  color: #ffc107 !important;
}

.stat-value.text-danger {
  color: #dc3545 !important;
}

/* Asesores */
.asesor-card .table th {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.asesor-card .table td {
  vertical-align: middle;
}

/* vue-select general */
:deep(.v-select) {
  font-family: 'Poppins', sans-serif;
}

:deep(.v-select .vs__dropdown-toggle) {
  border-radius: 0.375rem;
  min-height: 36px;
}

:deep(.v-select-sm .vs__dropdown-toggle) {
  min-height: 34px;
  padding-top: 0;
  padding-bottom: 0;
}

/* Rutas múltiples supervisor */
:deep(.rutas-multiples .vs__selected-options) {
  display: flex;
  flex-wrap: wrap;
  gap: 0.15rem;
}

.btn-close-badge {
  width: 0.5rem;
  height: 0.5rem;
  font-size: 0.45rem;
}

/* Datepicker */
:deep(.mx-datepicker) {
  width: 100%;
}

/* Botones */
.btn-secondary,
.btn-danger,
.btn-success {
  color: white !important;
}

/* SweetAlert estilos */
:global(.swal2-select) {
  display: block;
  width: 90% !important;
  margin: 1em auto 0;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #545454;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 0.25rem;
}

:global(.swal2-textarea) {
  display: block;
  width: 90% !important;
  margin: 1em auto 0;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #545454;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 0.25rem;
}

:global(.swal2-input[type='date']) {
  width: 90% !important;
  max-width: 90%;
  padding: 0.375rem 0.75rem;
  color: #545454;
}

:global(.swal2-html-container .text-start) {
  text-align: left;
}

:global(.swal2-html-container .form-label) {
  display: block;
  width: 90%;
  margin: 1rem auto 0.25rem;
  font-size: 1rem;
  font-weight: 500;
  color: #343a40;
}

:global(.swal2-html-container .swal2-input[type='date']) {
  margin-top: 0 !important;
}
</style>
