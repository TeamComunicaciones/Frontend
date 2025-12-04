<template>
  <div class="bg-light transparency-wrapper">
    <div class="container py-4 py-md-5">
      <div class="card border-0 shadow-lg transparency-card">
        <!-- HEADER -->
        <div class="card-header header-gradient text-white px-4 px-md-5 py-3 py-md-4">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
            <div class="header-title">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="badge badge-pill-soft bg-opacity bg-opacity-strong">
                  {{ isEs ? 'Canal de Denuncias' : 'Whistleblowing Channel' }}
                </span>
              </div>
              <h1 class="h3 mb-1">
                {{ isEs ? 'Línea de Transparencia' : 'Transparency Line' }}
              </h1>
              <p class="mb-0 small text-white-50">
                <span v-if="isEs">
                  Reporta conductas no transparentes de forma confidencial y, si lo deseas, anónima.
                </span>
                <span v-else>
                  Report non-transparent conduct confidentially and, if you wish, anonymously.
                </span>
              </p>
            </div>

            <div class="d-flex flex-column align-items-md-end align-items-stretch gap-2">
              <!-- Selector de idioma -->
              <div class="btn-group btn-group-sm lang-toggle" role="group" aria-label="Language selector">
                <button
                  type="button"
                  class="btn btn-outline-light"
                  :class="{ active: locale === 'es' }"
                  @click="setLocale('es')"
                >
                  ES
                </button>
                <button
                  type="button"
                  class="btn btn-outline-light"
                  :class="{ active: locale === 'en' }"
                  @click="setLocale('en')"
                >
                  EN
                </button>
              </div>

              <!-- Estado del canal -->
              <div class="d-flex align-items-center gap-2">
                <span class="status-dot bg-success"></span>
                <span class="small text-white-75">
                  {{ isEs ? 'Disponible 24/7' : 'Available 24/7' }}
                </span>
              </div>

              <!-- Progreso (simple indicador de pasos) -->
              <div class="progress progress-xs w-100 mt-1">
                <div
                  class="progress-bar bg-progress"
                  role="progressbar"
                  :style="{ width: progressPercentage + '%' }"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div class="d-flex justify-content-between small text-white-50 w-100">
                <span>{{ isEs ? 'Formulario' : 'Form' }}</span>
                <span>{{ currentStepLabel }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- BODY -->
        <div class="card-body px-3 px-md-5 py-4">
          <div class="row g-4 g-xl-5">
            <!-- Columna info / sidebar -->
            <aside class="col-lg-4 order-2 order-lg-1">
              <!-- Tarjeta de compromiso ético -->
              <div class="info-card mb-3">
                <h2 class="h6 mb-2 d-flex align-items-center gap-2">
                  <span class="icon-circle">
                    <span class="icon-text">✓</span>
                  </span>
                  <span>{{ isEs ? 'Compromiso ético' : 'Ethical commitment' }}</span>
                </h2>
                <p class="small mb-2">
                  <span v-if="isEs">
                    TEAM COMMUNICATIONS S.A. promueve relaciones transparentes, honestas y responsables, previniendo
                    actividades ilícitas en todas sus operaciones.
                  </span>
                  <span v-else>
                    TEAM COMMUNICATIONS S.A. promotes transparent, honest, and responsible relationships, preventing
                    illicit activities in all its operations.
                  </span>
                </p>
                <p class="small mb-0 text-muted">
                  <span v-if="isEs">
                    Este canal se administra por el Oficial de Cumplimiento del PTEE y se debe usar de manera
                    responsable.
                  </span>
                  <span v-else>
                    This channel is managed by the PTEE Compliance Officer and must be used responsibly.
                  </span>
                </p>
              </div>

              <!-- Tarjeta de anonimato -->
              <div class="info-card mb-3 anonymity-card">
                <h2 class="h6 mb-2 d-flex align-items-center gap-2">
                  <span class="icon-circle icon-circle-soft">
                    <span class="icon-text">🕵️</span>
                  </span>
                  <span>{{ isEs ? 'Anonimato y confidencialidad' : 'Anonymity & confidentiality' }}</span>
                </h2>
                <p class="small mb-1">
                  <span v-if="isEs">
                    Puedes enviar tu reporte de forma anónima. Si decides identificarte, tu información se tratará con
                    estricta confidencialidad.
                  </span>
                  <span v-else>
                    You may submit your report anonymously. If you choose to identify yourself, your information will be
                    treated with strict confidentiality.
                  </span>
                </p>
                <p class="small mb-0 text-muted">
                  <strong>
                    {{ isEs ? 'Nunca se revelará tu identidad sin tu consentimiento.' : 'Your identity will never be disclosed without your consent.' }}
                  </strong>
                </p>

                <div class="mt-3 d-flex align-items-center gap-2 small">
                  <span class="badge bg-light text-dark border border-1 border-light-subtle">
                    {{
                      isEs
                        ? form.wantsIdentification === 'yes'
                          ? 'Modo identificado'
                          : 'Modo anónimo'
                        : form.wantsIdentification === 'yes'
                          ? 'Identified mode'
                          : 'Anonymous mode'
                    }}
                  </span>
                  <span class="text-muted">
                    <span v-if="isEs">
                      Puedes cambiarlo en la sección “Identidad del reportante”.
                    </span>
                    <span v-else>
                      You can change this in the “Reporter identity” section.
                    </span>
                  </span>
                </div>
              </div>

              <!-- Características -->
              <div class="info-card mb-3">
                <h2 class="h6 mb-2">
                  {{ isEs ? 'Características de la Línea' : 'Line characteristics' }}
                </h2>
                <ul class="list-unstyled mb-0 small characteristics-list">
                  <li
                    v-for="item in characteristics"
                    :key="item.id"
                    class="d-flex align-items-start gap-2 mb-1"
                  >
                    <span class="char-dot"></span>
                    <span>{{ isEs ? item.es : item.en }}</span>
                  </li>
                </ul>
              </div>

              <!-- Canales externos -->
              <div class="info-card mb-3">
                <h2 class="h6 mb-2">
                  {{ isEs ? 'Canales externos' : 'External channels' }}
                </h2>
                <p class="small text-muted mb-2">
                  <span v-if="isEs">
                    También puedes acudir a los canales de la Superintendencia de Sociedades:
                  </span>
                  <span v-else>
                    You may also report through the Superintendence of Companies channels:
                  </span>
                </p>
                <ul class="list-unstyled small mb-2">
                  <li class="mb-1">
                    <a
                      href="https://www.supersociedades.gov.co/delegatura_aec/Paginas/Canal-deDenuncias-Soborno-Internacional.asp"
                      target="_blank"
                      rel="noopener"
                    >
                      {{ isEs ? 'Canal de denuncias por soborno internacional' : 'International bribery reporting channel' }}
                    </a>
                  </li>
                  <li>
                    <a
                      href="http://www.secretariatransparencia.gov.co/observatorio%20anticorrupcion/portal-anticorrupcion"
                      target="_blank"
                      rel="noopener"
                    >
                      {{ isEs ? 'Portal anticorrupción' : 'Anti-corruption portal' }}
                    </a>
                  </li>
                </ul>
              </div>

              <!-- Políticas -->
              <div class="info-card">
                <h2 class="h6 mb-2">
                  {{ isEs ? 'Políticas de cumplimiento' : 'Compliance policies' }}
                </h2>
                <p class="small text-muted mb-2">
                  <span v-if="isEs">
                    Consulta el detalle de nuestras políticas y procedimientos:
                  </span>
                  <span v-else>
                    Review our detailed compliance policies and procedures:
                  </span>
                </p>
                <div class="d-flex flex-column gap-1 small">
                  <button
                    type="button"
                    class="btn btn-link btn-sm text-start p-0 link-policy"
                    @click="openPolicy('corruptionPolicy')"
                  >
                    •
                    <span v-if="isEs">
                      Políticas Generales Contra la Corrupción y el Soborno Transnacional
                    </span>
                    <span v-else>
                      General Policies Against Corruption and Transnational Bribery
                    </span>
                  </button>
                  <button
                    type="button"
                    class="btn btn-link btn-sm text-start p-0 link-policy"
                    @click="openPolicy('moneyLaunderingPolicy')"
                  >
                    •
                    <span v-if="isEs">
                      Políticas Contra el Lavado de Activos, la Financiación del Terrorismo y la Proliferación de Armas
                      de Destrucción Masiva
                    </span>
                    <span v-else>
                      Policies Against Money Laundering, Terrorism Financing, and WMD Proliferation
                    </span>
                  </button>
                  <button
                    type="button"
                    class="btn btn-link btn-sm text-start p-0 link-policy"
                    @click="openPolicy('protocol')"
                  >
                    •
                    <span v-if="isEs">
                      Protocolo de funcionamiento de la Línea de Transparencia y medidas de protección
                    </span>
                    <span v-else>
                      Transparency Line operating protocol and protection measures
                    </span>
                  </button>
                </div>
              </div>
            </aside>

            <!-- Columna formulario -->
            <section class="col-lg-8 order-1 order-lg-2">
              <div class="form-shell h-100">
                <!-- Alertas globales -->
                <transition name="fade">
                  <div v-if="successMessage" class="alert alert-success small mb-3">
                    <strong>{{ isEs ? 'Reporte enviado.' : 'Report submitted.' }}</strong>
                    <div>{{ successMessage }}</div>
                  </div>
                </transition>
                <transition name="fade">
                  <div v-if="errorMessage" class="alert alert-danger small mb-3">
                    <strong>{{ isEs ? 'Error al enviar el reporte.' : 'Error submitting the report.' }}</strong>
                    <div>{{ errorMessage }}</div>
                  </div>
                </transition>

                <form @submit.prevent="handleSubmit" novalidate>
                  <!-- Paso 1: Detalles del reporte -->
                  <div class="step-section mb-4">
                    <div class="step-header mb-2">
                      <div class="d-flex align-items-center gap-2">
                        <span class="step-badge">1</span>
                        <div>
                          <h2 class="h6 mb-0">
                            {{ isEs ? 'Detalles del reporte' : 'Report details' }}
                          </h2>
                          <p class="small text-muted mb-0">
                            <span v-if="isEs">
                              Indica el tipo de reporte y describe con claridad lo sucedido.
                            </span>
                            <span v-else>
                              Indicate the type of report and clearly describe what happened.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Tipo de reporte -->
                    <div class="mb-3">
                      <label class="form-label">
                        {{ isEs ? 'Tipo de reporte' : 'Type of report' }}
                        <span class="text-danger">*</span>
                      </label>
                      <div class="row g-2">
                        <div class="col-md-6">
                          <select
                            v-model="form.reportType"
                            class="form-select form-select-sm"
                            :class="{ 'is-invalid': errors.reportType }"
                            required
                          >
                            <option value="" disabled>
                              {{ isEs ? 'Selecciona una opción' : 'Select an option' }}
                            </option>
                            <option
                              v-for="option in reportTypeOptions"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ isEs ? option.labelEs : option.labelEn }}
                            </option>
                          </select>
                          <div v-if="errors.reportType" class="invalid-feedback">
                            {{ errors.reportType }}
                          </div>
                        </div>
                        <div class="col-md-6 d-flex align-items-center">
                          <div class="small text-muted">
                            <span v-if="isEs">
                              Usa <strong>“Otros”</strong> si tu caso no encaja claramente en las categorías listadas.
                            </span>
                            <span v-else>
                              Use <strong>“Other”</strong> if your case does not clearly fit in the listed categories.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Descripción -->
                    <div class="mb-3">
                      <label class="form-label">
                        {{ isEs ? 'Descripción de lo sucedido' : 'Description of the incident' }}
                        <span class="text-danger">*</span>
                      </label>
                      <textarea
                        v-model="form.description"
                        rows="4"
                        class="form-control form-control-sm"
                        :class="{ 'is-invalid': errors.description }"
                        required
                      ></textarea>
                      <div class="d-flex justify-content-between small mt-1">
                        <span v-if="errors.description" class="text-danger">
                          {{ errors.description }}
                        </span>
                        <span v-else class="text-muted">
                          {{ isEs ? 'Mínimo 30 caracteres.' : 'Minimum 30 characters.' }}
                        </span>
                        <span
                          :class="[
                            'text-muted',
                            descriptionLength < 30 ? 'text-warning' : 'text-success'
                          ]"
                        >
                          {{ descriptionLength }} / 5000
                        </span>
                      </div>
                    </div>

                    <!-- Fecha -->
                    <div class="mb-3">
                      <label class="form-label">
                        {{ isEs ? 'Fecha en la que ocurrió el suceso' : 'Date of occurrence' }}
                        <span class="text-danger">*</span>
                      </label>
                      <input
                        v-model="form.eventDate"
                        type="date"
                        class="form-control form-control-sm"
                        :class="{ 'is-invalid': errors.eventDate }"
                        required
                      />
                      <div v-if="errors.eventDate" class="invalid-feedback">
                        {{ errors.eventDate }}
                      </div>
                    </div>
                  </div>

                  <!-- Paso 2: Ubicación -->
                  <div class="step-section mb-4">
                    <div class="step-header mb-2">
                      <div class="d-flex align-items-center gap-2">
                        <span class="step-badge">2</span>
                        <div>
                          <h2 class="h6 mb-0">
                            {{ isEs ? 'Ubicación del suceso' : 'Incident location' }}
                          </h2>
                          <p class="small text-muted mb-0">
                            <span v-if="isEs">
                              Indica dónde ocurrieron los hechos para facilitar su análisis.
                            </span>
                            <span v-else>
                              Indicate where the events took place to facilitate their analysis.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="row g-3">
                      <div class="col-md-4">
                        <label class="form-label">
                          {{ isEs ? 'País' : 'Country' }}
                          <span class="text-danger">*</span>
                        </label>
                        <input
                          v-model="form.country"
                          type="text"
                          class="form-control form-control-sm"
                          :class="{ 'is-invalid': errors.country }"
                          required
                        />
                        <div v-if="errors.country" class="invalid-feedback">
                          {{ errors.country }}
                        </div>
                      </div>
                      <div class="col-md-4">
                        <label class="form-label">
                          {{ isEs ? 'Departamento / Estado' : 'State / Department' }}
                          <span class="text-danger">*</span>
                        </label>
                        <input
                          v-model="form.state"
                          type="text"
                          class="form-control form-control-sm"
                          :class="{ 'is-invalid': errors.state }"
                          required
                        />
                        <div v-if="errors.state" class="invalid-feedback">
                          {{ errors.state }}
                        </div>
                      </div>
                      <div class="col-md-4">
                        <label class="form-label">
                          {{ isEs ? 'Ciudad' : 'City' }}
                          <span class="text-danger">*</span>
                        </label>
                        <input
                          v-model="form.city"
                          type="text"
                          class="form-control form-control-sm"
                          :class="{ 'is-invalid': errors.city }"
                          required
                        />
                        <div v-if="errors.city" class="invalid-feedback">
                          {{ errors.city }}
                        </div>
                      </div>
                    </div>

                    <!-- Personas relacionadas -->
                    <div class="mt-3">
                      <label class="form-label">
                        {{ isEs ? 'Personas relacionadas' : 'People involved' }}
                      </label>
                      <textarea
                        v-model="form.peopleInvolved"
                        rows="2"
                        class="form-control form-control-sm"
                        placeholder="Ej: Nombre, cargo, área…"
                      ></textarea>
                      <div class="form-text small">
                        <span v-if="isEs">
                          Si lo conoces, incluye nombre, cargo y área. Puedes escribir varios separados por coma o
                          salto de línea.
                        </span>
                        <span v-else>
                          If known, include name, position and area. You may write several separated by commas or line
                          breaks.
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Paso 3: Soportes -->
                  <div class="step-section mb-4">
                    <div class="step-header mb-2">
                      <div class="d-flex align-items-center gap-2">
                        <span class="step-badge">3</span>
                        <div>
                          <h2 class="h6 mb-0">
                            {{ isEs ? 'Soportes y evidencias' : 'Supporting information & evidence' }}
                          </h2>
                          <p class="small text-muted mb-0">
                            <span v-if="isEs">
                              Describe brevemente los soportes que tienes y adjunta archivos si es posible.
                            </span>
                            <span v-else>
                              Briefly describe the evidence you have and attach files if possible.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">
                        {{ isEs ? 'Descripción de los soportes' : 'Description of supporting information' }}
                      </label>
                      <textarea
                        v-model="form.supportsText"
                        rows="2"
                        class="form-control form-control-sm"
                      ></textarea>
                    </div>

                    <!-- Archivos -->
                    <div class="mb-1">
                      <label class="form-label">
                        {{ isEs ? 'Adjuntar archivos (opcional)' : 'Attach files (optional)' }}
                      </label>
                      <div class="attachment-dropzone" @click="triggerFileInput">
                        <input
                          ref="fileInput"
                          type="file"
                          class="d-none"
                          multiple
                          @change="onFilesChange"
                        />
                        <div class="d-flex align-items-center gap-3">
                          <div class="icon-circle icon-circle-file">
                            <span class="icon-text">⬆</span>
                          </div>
                          <div class="flex-grow-1">
                            <p class="mb-0 small">
                              <strong>
                                <span v-if="isEs">Haz clic para seleccionar archivos</span>
                                <span v-else>Click to select files</span>
                              </strong>
                            </p>
                            <p class="mb-0 small text-muted">
                              <span v-if="isEs">
                                Puedes adjuntar correos, documentos, capturas de pantalla, etc.
                              </span>
                              <span v-else>
                                You may attach emails, documents, screenshots, etc.
                              </span>
                            </p>
                          </div>
                          <div class="small text-muted text-end">
                            <span v-if="selectedFiles.length === 0">
                              {{ isEs ? 'Ningún archivo' : 'No files' }}
                            </span>
                            <span v-else>
                              {{ selectedFiles.length }}
                              {{ isEs ? 'archivo(s)' : 'file(s)' }}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ul
                        v-if="selectedFiles.length > 0"
                        class="list-unstyled small mt-2 mb-0 text-muted"
                      >
                        <li
                          v-for="file in selectedFiles"
                          :key="file.name"
                          class="text-truncate"
                        >
                          • {{ file.name }}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- Paso 4: Identidad del reportante -->
                  <div class="step-section mb-4">
                    <div class="step-header mb-2">
                      <div class="d-flex align-items-center gap-2">
                        <span class="step-badge">4</span>
                        <div>
                          <h2 class="h6 mb-0">
                            {{ isEs ? 'Identidad del reportante' : 'Reporter identity' }}
                          </h2>
                          <p class="small text-muted mb-0">
                            <span v-if="isEs">
                              Elige si deseas permanecer en el anonimato o compartir tus datos de contacto.
                            </span>
                            <span v-else>
                              Choose whether to remain anonymous or share your contact details.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- ¿Desea identificarse? -->
                    <div class="mb-3">
                      <label class="form-label">
                        {{ isEs ? '¿Desea identificarse?' : 'Do you wish to identify yourself?' }}
                        <span class="text-danger">*</span>
                      </label>
                      <div class="row g-2">
                        <div class="col-md-6">
                          <select
                            v-model="form.wantsIdentification"
                            class="form-select form-select-sm"
                            :class="{ 'is-invalid': errors.wantsIdentification }"
                            required
                          >
                            <option value="no">
                              {{ isEs ? 'No, deseo permanecer anónimo' : 'No, I prefer to remain anonymous' }}
                            </option>
                            <option value="yes">
                              {{ isEs ? 'Sí, deseo identificarme' : 'Yes, I want to identify myself' }}
                            </option>
                          </select>
                          <div v-if="errors.wantsIdentification" class="invalid-feedback">
                            {{ errors.wantsIdentification }}
                          </div>
                        </div>
                        <div class="col-md-6 d-flex align-items-center">
                          <p class="small mb-0 text-muted">
                            <span v-if="isEs">
                              Si te identificas, podremos contactarte para ampliar la información si es necesario.
                            </span>
                            <span v-else>
                              If you identify yourself, we may contact you to request further details if needed.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Datos personales condicionales -->
                    <transition name="slide-fade">
                      <div
                        v-if="form.wantsIdentification === 'yes'"
                        class="border rounded-3 p-3 bg-light-subtle"
                      >
                        <p class="small mb-2 fw-semibold">
                          {{ isEs ? 'Datos de contacto' : 'Contact details' }}
                        </p>
                        <p class="small text-muted mb-3">
                          <span v-if="isEs">
                            Estos datos se utilizarán únicamente para dar seguimiento al caso y no se compartirán sin tu
                            autorización.
                          </span>
                          <span v-else>
                            This information will only be used to follow up on the case and will not be shared without
                            your consent.
                          </span>
                        </p>

                        <div class="row g-3">
                          <div class="col-md-6">
                            <label class="form-label">
                              {{ isEs ? 'Nombre completo' : 'Full name' }}
                              <span class="text-danger">*</span>
                            </label>
                            <input
                              v-model="form.fullName"
                              type="text"
                              class="form-control form-control-sm"
                              :class="{ 'is-invalid': errors.fullName }"
                            />
                            <div v-if="errors.fullName" class="invalid-feedback">
                              {{ errors.fullName }}
                            </div>
                          </div>
                          <div class="col-md-6">
                            <label class="form-label">
                              {{ isEs ? 'Número de identificación' : 'Identification number' }}
                              <span class="text-danger">*</span>
                            </label>
                            <input
                              v-model="form.idNumber"
                              type="text"
                              class="form-control form-control-sm"
                              :class="{ 'is-invalid': errors.idNumber }"
                            />
                            <div v-if="errors.idNumber" class="invalid-feedback">
                              {{ errors.idNumber }}
                            </div>
                          </div>
                          <div class="col-md-6">
                            <label class="form-label">
                              {{ isEs ? 'Correo electrónico' : 'Email address' }}
                              <span class="text-danger">*</span>
                            </label>
                            <input
                              v-model="form.email"
                              type="email"
                              class="form-control form-control-sm"
                              :class="{ 'is-invalid': errors.email }"
                            />
                            <div v-if="errors.email" class="invalid-feedback">
                              {{ errors.email }}
                            </div>
                          </div>
                          <div class="col-md-6">
                            <label class="form-label">
                              {{ isEs ? 'Número de teléfono' : 'Phone number' }}
                              <span class="text-danger">*</span>
                            </label>
                            <input
                              v-model="form.phone"
                              type="text"
                              class="form-control form-control-sm"
                              :class="{ 'is-invalid': errors.phone }"
                            />
                            <div v-if="errors.phone" class="invalid-feedback">
                              {{ errors.phone }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </transition>
                  </div>

                  <!-- Footer del formulario -->
                  <div
                    class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mt-3"
                  >
                    <p class="small text-muted mb-0">
                      <span v-if="isEs">
                        Al enviar este formulario, declaras que la información suministrada es verdadera y utilizas este
                        canal de manera responsable.
                      </span>
                      <span v-else>
                        By submitting this form, you declare that the information provided is true and that you use this
                        channel responsibly.
                      </span>
                    </p>

                    <button
                      type="submit"
                      class="btn btn-danger px-4"
                      :disabled="loading"
                    >
                      <span v-if="!loading">
                        {{ isEs ? 'Enviar reporte' : 'Submit report' }}
                      </span>
                      <span v-else class="d-inline-flex align-items-center">
                        <span
                          class="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        {{ isEs ? 'Enviando...' : 'Submitting...' }}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import apiService from '@/services/apiService'

// El apiService ya tiene baseURL = backendRoute.data (ej: /api/v1.0/)
const API_ENDPOINT = '/transparency-report/'

// Idioma
const locale = ref('es')
const isEs = computed(() => locale.value === 'es')

const setLocale = (lang) => {
  if (lang === 'es' || lang === 'en') {
    locale.value = lang
  }
}

// Opciones del tipo de reporte
const reportTypeOptions = [
  { value: 'corruption', labelEs: 'Corrupción', labelEn: 'Corruption' },
  { value: 'transnational_bribery', labelEs: 'Soborno transnacional', labelEn: 'Transnational bribery' },
  { value: 'fraud', labelEs: 'Fraude', labelEn: 'Fraud' },
  { value: 'misuse_resources', labelEs: 'Uso inadecuado de recursos', labelEn: 'Misuse of resources' },
  {
    value: 'regulatory_irregularities',
    labelEs: 'Irregularidades en el cumplimiento de normas',
    labelEn: 'Irregularities in regulatory compliance'
  },
  { value: 'money_laundering', labelEs: 'Lavado de activos', labelEn: 'Money laundering' },
  { value: 'terrorism_financing', labelEs: 'Financiación del terrorismo', labelEn: 'Terrorism financing' },
  {
    value: 'wmd_financing',
    labelEs: 'Financiamiento de la proliferación de armas de destrucción masiva',
    labelEn: 'Financing of the proliferation of weapons of mass destruction'
  },
  { value: 'other', labelEs: 'Otros', labelEn: 'Other' }
]

// Características
const characteristics = [
  {
    id: 1,
    es: 'Administrada por el Oficial de Cumplimiento del PTEE.',
    en: 'Administered by the PTEE Compliance Officer.'
  },
  {
    id: 2,
    es: 'Diferente a la línea de servicio al cliente.',
    en: 'Different from the customer service line.'
  },
  {
    id: 3,
    es: 'Para reportar conductas que van en contra de la transparencia e integridad de la empresa.',
    en: 'For reporting conduct that goes against the company’s transparency and integrity.'
  },
  {
    id: 4,
    es: 'No es para sugerencias ni temas personales o estrictamente laborales.',
    en: 'Not intended for suggestions or strictly personal/labor-related matters.'
  },
  {
    id: 5,
    es: 'Debe ser utilizada con responsabilidad. Los hechos reportados deben ser reales y verificables.',
    en: 'Must be used responsibly. Reported facts must be real and verifiable.'
  },
  {
    id: 6,
    es: 'Permite reportar, de manera confidencial, presuntas irregularidades fundadas.',
    en: 'Allows confidential reporting of well-founded alleged irregularities.'
  },
  {
    id: 7,
    es: 'Facilita el control y seguimiento de los casos reportados.',
    en: 'Facilitates control and follow-up of reported cases.'
  },
  {
    id: 8,
    es: 'Las personas reportantes pueden permanecer en el anonimato; su identidad no será revelada sin su consentimiento.',
    en: 'Whistleblowers may remain anonymous; their identity will not be disclosed without their consent.'
  }
]

// Estado del formulario
const form = reactive({
  reportType: '',
  description: '',
  eventDate: '',
  country: '',
  state: '',
  city: '',
  peopleInvolved: '',
  supportsText: '',
  wantsIdentification: 'no',
  fullName: '',
  idNumber: '',
  email: '',
  phone: ''
})

const selectedFiles = ref([])
const fileInput = ref(null)

// Errores
const errors = reactive({
  reportType: '',
  description: '',
  eventDate: '',
  country: '',
  state: '',
  city: '',
  wantsIdentification: '',
  fullName: '',
  idNumber: '',
  email: '',
  phone: ''
})

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Longitud descripción
const descriptionLength = computed(() => (form.description || '').length)

// Progreso simple
const progressPercentage = computed(() => {
  let stepsCompleted = 0
  if (form.reportType && descriptionLength.value >= 30 && form.eventDate) stepsCompleted += 1
  if (form.country && form.state && form.city) stepsCompleted += 1
  if (form.supportsText || selectedFiles.value.length > 0) stepsCompleted += 1
  if (form.wantsIdentification === 'no') {
    stepsCompleted += 1
  } else if (
    form.wantsIdentification === 'yes' &&
    form.fullName &&
    form.idNumber &&
    form.email &&
    form.phone
  ) {
    stepsCompleted += 1
  }
  return (stepsCompleted / 4) * 100
})

const currentStepLabel = computed(() => {
  if (!form.reportType || descriptionLength.value < 30) {
    return isEs.value ? 'Paso 1 de 4: Detalles' : 'Step 1 of 4: Details'
  }
  if (!form.country || !form.state || !form.city) {
    return isEs.value ? 'Paso 2 de 4: Ubicación' : 'Step 2 of 4: Location'
  }
  if (!form.supportsText && selectedFiles.value.length === 0) {
    return isEs.value ? 'Paso 3 de 4: Soportes' : 'Step 3 of 4: Supports'
  }
  if (form.wantsIdentification === 'yes' && (!form.fullName || !form.idNumber || !form.email || !form.phone)) {
    return isEs.value ? 'Paso 4 de 4: Identidad' : 'Step 4 of 4: Identity'
  }
  return isEs.value ? 'Listo para enviar' : 'Ready to submit'
})

// Manejo archivos
const triggerFileInput = () => {
  if (fileInput.value) fileInput.value.click()
}

const onFilesChange = (event) => {
  const files = Array.from(event.target.files || [])
  selectedFiles.value = files
}

// Limpiar errores
const clearErrors = () => {
  Object.keys(errors).forEach((k) => {
    errors[k] = ''
  })
}

// Validación
const validateForm = () => {
  clearErrors()
  let valid = true
  const requiredText = isEs.value ? 'Este campo es obligatorio.' : 'This field is required.'
  const invalidEmailText = isEs.value ? 'Ingresa un correo electrónico válido.' : 'Please enter a valid email.'
  const minDescText = isEs.value
    ? 'Describe el suceso con al menos 30 caracteres.'
    : 'Please describe the incident with at least 30 characters.'

  if (!form.reportType) {
    errors.reportType = requiredText
    valid = false
  }

  if (!form.description || form.description.trim().length < 30) {
    errors.description = minDescText
    valid = false
  }

  if (!form.eventDate) {
    errors.eventDate = requiredText
    valid = false
  }

  if (!form.country) {
    errors.country = requiredText
    valid = false
  }

  if (!form.state) {
    errors.state = requiredText
    valid = false
  }

  if (!form.city) {
    errors.city = requiredText
    valid = false
  }

  if (!form.wantsIdentification) {
    errors.wantsIdentification = requiredText
    valid = false
  }

  if (form.wantsIdentification === 'yes') {
    if (!form.fullName) {
      errors.fullName = requiredText
      valid = false
    }
    if (!form.idNumber) {
      errors.idNumber = requiredText
      valid = false
    }
    if (!form.email) {
      errors.email = requiredText
      valid = false
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = invalidEmailText
      valid = false
    }
    if (!form.phone) {
      errors.phone = requiredText
      valid = false
    }
  }

  return valid
}

// Reset form
const resetForm = () => {
  form.reportType = ''
  form.description = ''
  form.eventDate = ''
  form.country = ''
  form.state = ''
  form.city = ''
  form.peopleInvolved = ''
  form.supportsText = ''
  form.wantsIdentification = 'no'
  form.fullName = ''
  form.idNumber = ''
  form.email = ''
  form.phone = ''
  selectedFiles.value = []
  clearErrors()
}

// Limpiar datos personales si cambia a "no"
watch(
  () => form.wantsIdentification,
  (val) => {
    if (val === 'no') {
      form.fullName = ''
      form.idNumber = ''
      form.email = ''
      form.phone = ''
      errors.fullName = ''
      errors.idNumber = ''
      errors.email = ''
      errors.phone = ''
    }
  }
)

// 🔴 Abrir documentos de políticas usando TUS nombres EXACTOS en /public/docs
const openPolicy = (policyKey) => {
  const fileNamesEs = {
    corruptionPolicy: 'POLÍTICAS GENERALES DEL PTEE.pdf',
    moneyLaunderingPolicy: 'POLÍTICAS GENERALES DEL SAGRILAFT.pdf',
    protocol: 'PROTOCOLO  LINEA DE TRANSPARENCIA.pdf' // ojo: doble espacio tal como lo pasaste
  }

  const fileNamesEn = {
    corruptionPolicy: 'PTEE GENERAL POLICIES.pdf',
    moneyLaunderingPolicy: 'SAGRILAFT GENERAL POLICIES.pdf',
    protocol: 'TRANSPARENCY LINE PROTOCOL.pdf'
  }

  const fileName = (isEs.value ? fileNamesEs : fileNamesEn)[policyKey]

  if (!fileName) return

  // Construimos la URL respetando espacios/tildes con encodeURIComponent
  const url = '/docs/' + encodeURIComponent(fileName)
  window.open(url, '_blank', 'noopener')
}

// Enviar formulario
const handleSubmit = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  const isValid = validateForm()
  if (!isValid) {
    errorMessage.value = isEs.value
      ? 'Por favor revisa los campos marcados en rojo.'
      : 'Please review the fields marked in red.'
    return
  }

  loading.value = true

  try {
    const formData = new FormData()

    // Campos alineados con el backend (snake_case)
    formData.append('locale', locale.value)
    formData.append('report_type', form.reportType)
    formData.append('description', form.description)
    formData.append('event_date', form.eventDate)
    formData.append('country', form.country)
    formData.append('state', form.state)
    formData.append('city', form.city)
    formData.append('people_involved', form.peopleInvolved)
    formData.append('supports_text', form.supportsText)
    formData.append('wants_identification', form.wantsIdentification === 'yes' ? 'true' : 'false')
    formData.append('full_name', form.fullName)
    formData.append('id_number', form.idNumber)
    formData.append('email', form.email)
    formData.append('phone', form.phone)

    // Archivos: el backend espera "attachments"
    selectedFiles.value.forEach((file) => {
      formData.append('attachments', file)
    })

    await apiService.post(API_ENDPOINT, formData)

    successMessage.value = isEs.value
      ? 'Tu reporte ha sido enviado correctamente. Gracias por contribuir a la transparencia de la organización.'
      : 'Your report has been successfully submitted. Thank you for contributing to the organization’s transparency.'

    resetForm()
  } catch (err) {
    console.error('Error submitting report:', err)
    errorMessage.value = isEs.value
      ? 'Ocurrió un error al enviar el reporte. Inténtalo nuevamente más tarde.'
      : 'An error occurred while submitting the report. Please try again later.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.transparency-wrapper {
  min-height: 100vh;
}

/* Card general */
.transparency-card {
  border-radius: 1.25rem;
  overflow: hidden;
}

/* HEADER */
.header-gradient {
  background: radial-gradient(circle at top left, #ff4b55 0, #df1115 40%, #660000 90%);
}

.header-title h1 {
  letter-spacing: 0.01em;
}

/* Pills soft */
.badge-pill-soft {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.2rem 0.6rem;
  font-weight: 500;
  font-size: 0.75rem;
}

.bg-opacity {
  background-color: rgba(0, 0, 0, 0.1);
}

.bg-opacity-strong {
  background-color: rgba(0, 0, 0, 0.28);
}

/* Language toggle */
.lang-toggle .btn {
  border-radius: 999px !important;
  padding-inline: 0.9rem;
}

.lang-toggle .btn.active {
  background-color: #ffffff !important;
  color: #000 !important;
  border-color: #ffffff !important;
}

/* Status */
.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

/* Progress */
.progress-xs {
  height: 4px;
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.25);
}

.progress-xs .progress-bar {
  border-radius: 999px;
}

.bg-progress {
  background-color: #ffe07a;
}

/* SIDEBAR CARDS */
.info-card {
  background-color: #ffffff;
  border-radius: 0.9rem;
  padding: 0.9rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.03);
  box-shadow: 0 0.35rem 1rem rgba(0, 0, 0, 0.03);
}

.anonymity-card {
  border-left: 4px solid #df1115;
}

/* Icon circle */
.icon-circle {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.15);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-circle-soft {
  background-color: rgba(255, 255, 255, 0.06);
}

.icon-circle-file {
  background-color: rgba(223, 17, 21, 0.08);
}

.icon-text {
  font-size: 0.85rem;
}

/* Characteristics list */
.characteristics-list .char-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background-color: #df1115;
  margin-top: 0.35rem;
}

/* Policies */
.link-policy {
  color: #0d6efd;
}

.link-policy:hover {
  text-decoration: underline;
}

/* FORM SHELL */
.form-shell {
  background-color: #ffffff;
  border-radius: 1rem;
  padding: 1.25rem 1.25rem 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.03);
  box-shadow: 0 0.35rem 1rem rgba(0, 0, 0, 0.03);
}

/* Steps */
.step-section {
  border-radius: 0.8rem;
  border: 1px solid rgba(0, 0, 0, 0.03);
  padding: 0.9rem 0.9rem 1rem;
  background-color: #fcfcfc;
}

.step-header {
  border-bottom: 1px dashed rgba(0, 0, 0, 0.05);
  padding-bottom: 0.4rem;
  margin-bottom: 0.6rem;
}

.step-badge {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background-color: rgba(223, 17, 21, 0.08);
  color: #df1115;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.85rem;
}

/* Dropzone adjuntos */
.attachment-dropzone {
  border-radius: 0.75rem;
  border: 1px dashed rgba(0, 0, 0, 0.1);
  padding: 0.75rem 0.9rem;
  background-color: #ffffff;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.attachment-dropzone:hover {
  background-color: rgba(223, 17, 21, 0.02);
  border-color: rgba(223, 17, 21, 0.4);
  box-shadow: 0 0.35rem 0.9rem rgba(223, 17, 21, 0.06);
}

/* Small helper backgrounds */
.bg-light-subtle {
  background-color: #f8f9fa;
}

/* Alerts */
.alert {
  border-radius: 0.75rem;
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Input tweaks */
.form-label {
  font-size: 0.9rem;
  font-weight: 500;
}

.form-control,
.form-select {
  font-size: 0.85rem;
}

/* Responsivo */
@media (max-width: 767.98px) {
  .transparency-card {
    border-radius: 0.75rem;
  }

  .form-shell {
    padding: 1rem;
  }

  .info-card {
    padding: 0.8rem 0.85rem;
  }
}
</style>
