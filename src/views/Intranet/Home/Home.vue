<template>
  <div class="background-team">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-3">
          <SidebarMenu :titulo="tituloMenu"/>
    <div class="vld-parent">
      <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>
    </div>
        </div>
        <div class="col-md-9">
          <div class="welcome-home">
            <h2>Bienvenid@!</h2>
            <p>Tienes algunas notificaciones.</p>
            <ul class="task-pending">
              <li>
                <i class="bi bi-chat-dots"></i>
                <span>Feedback</span>
              </li>
              <li>
                <i class="bi bi-lightbulb"></i>
                <span>Insights</span>
              </li>
              <li>
                <i class="bi bi-map"></i>
                <span>Roadmaps</span>
              </li>
              <li>
                <i class="bi bi-box-arrow-up-right"></i>
                <span>Releases</span>
              </li>
            </ul>
          </div>
          <div class="task-list">
            <h2>Dashboard</h2>
            <ul class="nav nav-tabs" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="noticias-tab" data-bs-toggle="tab" data-bs-target="#noticias" type="button" role="tab" aria-controls="noticias" aria-selected="true">Noticias</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="notificaciones-tab" data-bs-toggle="tab" data-bs-target="#notificaciones" type="button" role="tab" aria-controls="notificaciones" aria-selected="false">Notificaciones</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="tareas-pendientes-tab" data-bs-toggle="tab" data-bs-target="#tareas-pendientes" type="button" role="tab" aria-controls="tareas-pendientes" aria-selected="false">Tareas Pendientes</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="tareas-caducas-tab" data-bs-toggle="tab" data-bs-target="#tareas-caducas" type="button" role="tab" aria-controls="tareas-caducas" aria-selected="false">Tareas Caducas</button>
              </li>
            </ul>
            <div class="tab-content" id="myTabContent">
              <div class="tab-pane fade show active" id="noticias" role="tabpanel" aria-labelledby="noticias-tab">
                <p>No tienes nada asignado por ahora.1</p>
              </div>
              <div class="tab-pane fade" id="notificaciones" role="tabpanel" aria-labelledby="notificaciones-tab">
                <div v-if="actasAsignadas.length === 0">
                  <p>No tienes actas asignadas.</p>
                </div>
                <div v-else>
                  <ul>
                    <li v-for="acta in actasAsignadas" :key="acta.id">
                      📄 Acta #{{ acta.id }} - {{ acta.nombre }}
                    </li>
                  </ul>
                </div>
              </div>
              <div class="tab-pane fade" id="tareas-pendientes" role="tabpanel" aria-labelledby="tareas-pendientes-tab">
                <p>No tienes nada asignado por ahora.3</p>
              </div>
              <div class="tab-pane fade" id="tareas-caducas" role="tabpanel" aria-labelledby="tareas-caducas-tab">
                <p>No tienes nada asignado por ahora.4</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import router from '@/router'
import SidebarMenu from '@/components/Intranet/SidebarMenu/SidebarMenu.vue'
import backendRouter from '@/components/BackendRouter/BackendRouter'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

export default {
  name: 'Home',
  data() {
    return {
      isLoading: true,
      fullPage: true,
      tituloMenu: 'Home',
      actasAsignadas: []
    }
  },
  components: {
    SidebarMenu,
    Loading
  },
  created() {
    this.validate()
    this.fetchActasAsignadas()
  },
  methods: {
    validate() {
      const path = backendRouter.data + 'user-validate'
      axios.post(path, { 'jwt': this.$cookies.get('jwt') }).then(() => {
        this.isLoading = false
      })
      .catch((error) => {
        router.push('/login')
        this.$swal(error.response.data.detail)
      })
    },
    fetchActasAsignadas() {
      const path = backendRouter.data + 'actas-asignadas/'
      axios.get(path, {
        headers: {
          'Authorization': `Token ${this.$cookies.get('jwt')}`
        }
      })
      .then(response => {
        this.actasAsignadas = response.data
      })
      .catch(error => {
        console.error(error)
      })
    }
  }

}
</script>