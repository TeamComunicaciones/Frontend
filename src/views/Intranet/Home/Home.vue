<template>
  <div class="dashboard-background">
    <div class="vld-parent">
      <loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
    </div>
    <main class="main-content">
      <div class="container-fluid py-4">
        <div class="header mb-4">
          <h1 class="text-white">¡Bienvenid@ de nuevo!</h1>
          <p class="text-white-50">{{ fechaActualFormateada }}</p>
        </div>
        <b-row class="stats-row">
          <b-col v-for="stat in stats" :key="stat.title" md="6" lg="3" class="mb-4">
            <b-card class="stat-card h-100 shadow-sm border-0" :style="{'--card-color': stat.color}">
              <div class="d-flex align-items-center">
                <div class="stat-icon me-3">
                  <i :class="stat.icon"></i>
                </div>
                <div>
                  <h2 class="stat-value mb-0">{{ stat.value }}</h2>
                  <p class="stat-title text-muted mb-0">{{ stat.title }}</p>
                </div>
              </div>
            </b-card>
          </b-col>
        </b-row>
        <b-card class="mt-3 shadow-sm border-0">
          <b-tabs content-class="mt-3" lazy>
            <b-tab title="Noticias" active>
              <div class="p-3 text-center text-muted">
                <i class="bi bi-newspaper display-4"></i>
                <p class="mt-2">No hay noticias recientes.</p>
              </div>
            </b-tab>
            <b-tab title="Notificaciones">
               <div v-if="actasAsignadas.length === 0" class="p-3 text-center text-muted">
                 <i class="bi bi-bell-slash display-4"></i>
                 <p class="mt-2">No tienes notificaciones nuevas.</p>
              </div>
              <ul v-else class="list-group list-group-flush">
                <li v-for="acta in actasAsignadas" :key="acta.id" class="list-group-item d-flex justify-content-between align-items-center">
                  <span>📄 Acta #{{ acta.id }} - {{ acta.nombre }}</span>
                  <b-button size="sm" variant="outline-danger">Ver</b-button>
                </li>
              </ul>
            </b-tab>
            <b-tab title="Tareas Pendientes">
              <div class="p-3 text-center text-muted">
                 <i class="bi bi-card-checklist display-4"></i>
                 <p class="mt-2">¡Todo al día! No tienes tareas pendientes.</p>
              </div>
            </b-tab>
          </b-tabs>
        </b-card>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import router from '@/router'
import backendRouter from '@/components/BackendRouter/BackendRouter'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

export default {
  name: 'Home',
  components: {
    Loading
  },
  data() {
    return {
      isLoading: true,
      fullPage: true,
      user: {
        name: '' // Modificación: Inicializado como vacío
      },
      stats: [
        { title: 'Notificaciones', value: 0, icon: 'bi bi-bell-fill', color: '#dc3545' },
        { title: 'Tareas Pendientes', value: 0, icon: 'bi bi-list-task', color: '#ffc107' },
        { title: 'Mensajes Nuevos', value: 0, icon: 'bi bi-envelope-fill', color: '#0d6efd' },
        { title: 'Reportes Generados', value: 0, icon: 'bi bi-file-earmark-bar-graph-fill', color: '#198754' },
      ],
      actasAsignadas: [],
    }
  },
  computed: {
    fechaActualFormateada() {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      // Usando la hora local actual de Colombia para la fecha.
      const fecha = new Date().toLocaleDateString('es-CO', { ...options, timeZone: 'America/Bogota' });
      return fecha.charAt(0).toUpperCase() + fecha.slice(1);
    }
  },
  created() {
    // Estas dos llamadas se pueden ejecutar en paralelo
    this.validateSession();
    this.fetchDashboardData();
  },
  methods: {
    validateSession() {
      const path = backendRouter.data + 'user-validate'
      axios.post(path, { 'jwt': this.$cookies.get('jwt') })
        .then(response => {
          // --- INICIO DE LA MODIFICACIÓN ---
          // Asignamos el nombre del usuario desde la respuesta del backend
          this.user.name = response.data.name; 
          // --- FIN DE LA MODIFICACIÓN ---
        })
        .catch(() => {
          router.push('/login')
        })
    },
    fetchDashboardData() {
      this.isLoading = true;
      const path = backendRouter.data + 'resumen-corresponsal'; 
      const token = this.$cookies.get('jwt');
      const data = {
        fecha: new Date().toISOString().slice(0, 7),
        sucursal: '0'
      }; 
      axios.post(path, data, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(response => {
        const consignaciones = response.data.consignaciones || [];
        this.actasAsignadas = consignaciones;
        this.stats[0].value = consignaciones.length;
      })
      .catch(error => {
        console.error("Error al cargar datos del dashboard:", error);
      })
      .finally(() => {
        this.isLoading = false;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-background {
  background-color: #f4f7fa;
}
.main-content {
  width: 100%;
}
.header {
  background: linear-gradient(90deg, #333 0%, #555 100%);
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.stat-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border-left: 5px solid var(--card-color, #ccc);
}
.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}
.stat-icon {
  font-size: 2.5rem;
  color: var(--card-color, #333);
}
.stat-value {
  font-size: 2.25rem;
  font-weight: 700;
}
.stat-title {
  font-size: 1rem;
  font-weight: 500;
}
</style>