<template>
  <div>
    <SidebarMenu :titulo="tituloMenu" />
    <div class="container py-5">
      <div class="row align-items-end mb-4">
        <div class="col-md-4">
          <label for="precios" class="form-label">Lista de precios</label>
          <select id="precios" class="form-select" v-model="precio" @change="select_price">
            <option v-for="precio in lista_precios" :key="precio.id" :value="precio.id">
              {{ precio.nombre }}
            </option>
          </select>
        </div>
        <div class="col-md-5">
            <BButton variant="secondary" v-if="vistaHistorico" @click="volverAProductos" class="mt-3">
                ← Volver a la lista
            </BButton>
        </div>
        <div class="col-md-3 text-end">
          <BButton variant="danger" v-if="excel && !vistaHistorico" class="mt-3" @click="descargar">Descargar EXCEL</BButton>
        </div>
      </div>

      <div class="row mb-3" v-if="items.length > 0 && !vistaHistorico">
        <div class="col-md-4">
          <input
            type="text"
            class="form-control"
            v-model="filtro"
            placeholder="Filtrar por equipo..."
          />
        </div>
        <div class="col-md-4">
            <select class="form-select" v-model="filtroVariacion">
                <option value="">Filtrar por variación</option>
                <option value="up">Aumentaron</option>
                <option value="down">Bajaron</option>
            </select>
        </div>
      </div>

      <div v-if="items.length > 0" class="table-responsive">
        <table class="table table-striped table-hover align-middle text-center">
          <thead class="table-light">
            <tr>
              <th v-for="field in fields" :key="field.key">{{ field.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in itemsFiltrados" :key="index">
              <td v-for="field in fields" :key="field.key">
               <template v-if="field.key === 'variation'">
                    <div class="d-flex justify-content-center align-items-center gap-2" v-if="item.indicador === 'down'">
                        <span>{{ formatCell(item.diferencial) }}</span>
                        <span class="d-flex align-items-center gap-1">
                            <span>{{ item.porcentaje }}%</span>
                            <IBiArrowDown class="text-success fw-bold fs-5" />
                        </span>
                    </div>
                    <div class="d-flex justify-content-center align-items-center gap-2" v-else-if="item.indicador === 'up'">
                        <span>{{ formatCell(item.diferencial) }}</span>
                        <span class="d-flex align-items-center gap-1">
                            <span>{{ item.porcentaje }}%</span>
                            <IBiArrowUp class="text-danger fw-bold fs-5" />
                        </span>
                    </div>
                    <span v-else-if="item.indicador === 'neutral'" class="text-warning fs-4">–</span>
                </template>
                <template v-else-if="field.key === 'botones'">
                  <button @click="historico(item)" class="btn btn-outline-dark btn-sm">
                    <IBiEye />
                  </button>
                </template>
                <template v-else>
                  {{ formatCell(item[field.key]) }}
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center mt-5 text-muted">
        No hay datos para mostrar.
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import router from '@/router'
import backendRouter from '@/components/BackendRouter/BackendRouter'
import SidebarMenu from '@/components/Intranet/SidebarMenu/SidebarMenu.vue'
import Loading from 'vue-loading-overlay'
import * as XLSX from 'xlsx'

export default {
  data() {
    return {
      tituloMenu: 'Precios',
      excel: false,
      filtro: '',
      filtroVariacion: '',
      data: [],
      items: [],
      precio: '',
      lista_precios: [],
      fields: [],
      isLoading: false,
      fullPage: true,
      vistaHistorico: false,
    }
  },
  methods: {
    descargar() {
      const dataForSheet = this.itemsFiltrados.map(item => {
        const indicadorTexto = item.indicador === 'up' 
            ? 'Subió' 
            : item.indicador === 'down' 
            ? 'Bajó' 
            : 'Neutral';

        return {
          'Equipo': item.equipo,
          'Equipo sin IVA': item['equipo sin IVA'],
          'IVA Equipo': item['IVA equipo'],
          'Total': item.total,
          'Diferencial': item.diferencial, // El valor numérico directo
          'Indicador': indicadorTexto,     // El texto "Subió" o "Bajó"
          'Porcentaje': item.porcentaje
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(dataForSheet);

      const currencyColumns = ['Equipo sin IVA', 'IVA Equipo', 'Total', 'Diferencial'];
      const headers = Object.keys(dataForSheet[0] || {});

      const range = XLSX.utils.decode_range(worksheet['!ref']);
      for (let R = range.s.r + 1; R <= range.e.r; ++R) { // Itera filas, omitiendo cabecera
        for (let C = range.s.c; C <= range.e.c; ++C) { // Itera columnas
          const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
          const cell = worksheet[cell_address];

          if (!cell || cell.t !== 'n') continue;

          if (currencyColumns.includes(headers[C])) {
            cell.z = '$ #,##0.00'; // ...aplica el formato de moneda.
          }
        }
      }

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Precios');
      XLSX.writeFile(workbook, 'Lista_Precios.xlsx');
    },

    
    formatCell(value) {
      if (typeof value === 'number') {
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 2, // Muestra siempre 2 decimales
          maximumFractionDigits: 2
        }).format(value);
      }
      return value;
    },
    historico(item) {
      this.items = []
      const path = backendRouter.data + 'lista-productos-prepago-equipo'
      const data = {
        precio: this.precio,
        equipo: item.equipo,
      }
      axios
        .post(path, data)
        .then((response) => {
          this.items = response.data.data
          this.generateTableFields(false)
          this.vistaHistorico = true
        })
        .catch((error) => {
          this.$swal(error.response.data.detail)
        })
    },
    volverAProductos() {
        this.select_price();
    },
    get_data() {
      const path = backendRouter.data + 'lista-productos-prepago'
      const token = this.$cookies.get('jwt')

      if (!token) {
        router.push('/login')
        this.$swal('Tu sesión ha expirado, por favor ingresa de nuevo.')
        return
      }

      axios.get(path, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then((response) => {
          this.lista_precios = response.data.data
        })
        .catch((error) => {
          const errorMessage = error.response?.data?.detail || 'Ocurrió un error inesperado.'
          this.$swal(errorMessage)
          
          if (error.response?.status === 401) {
            router.push('/login')
          }
        })
    },
    select_price() {
      this.items = []
      const path = backendRouter.data + 'lista-productos-prepago'
      const data = {
        data: this.data,
        precio: this.precio,
      }
      axios
        .post(path, data)
        .then((response) => {
          this.items = response.data.data
          this.generateTableFields(true)
          this.excel = true
          this.vistaHistorico = false
        })
        .catch((error) => {
          this.$swal(error.response.data.detail)
        })
    },
    generateTableFields(boton) {
      if (this.items.length === 0) {
        this.fields = [];
        return;
      }

      const keysToHide = ['indicador', 'diferencial', 'porcentaje'];
      const filteredKeys = Object.keys(this.items[0] || {})
        .filter(key => !keysToHide.includes(key));

      this.fields = filteredKeys.map((key) => {
        const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
        return { key: key, label: label };
      });

      if ('diferencial' in this.items[0]) {
        if (!this.fields.some((f) => f.key === 'variation')) {
            this.fields.push({ key: 'variation', label: 'Variación' });
        }
      }
      if (boton) {
        if (!this.fields.some((f) => f.key === 'botones')) {
          this.fields.push({ key: 'botones', label: 'Acciones' });
        }
      }
    },
  },
  components: {
    SidebarMenu,
    Loading,
  },
  created() {
    this.get_data()
  },
  computed: {
    itemsFiltrados() {
      let itemsFiltrados = this.items;

      if (this.filtro) {
        itemsFiltrados = itemsFiltrados.filter((item) => {
          return item.equipo.toLowerCase().includes(this.filtro.toLowerCase())
        })
      }

      if (this.filtroVariacion) {
        itemsFiltrados = itemsFiltrados.filter((item) => 
            item.variation && item.variation.startsWith(this.filtroVariacion)
        );
      }
      
      return itemsFiltrados;
    },
  },
}
</script>

<style lang="scss" scoped>
// Importa variables globales, mixins y funciones como lo haces en tu archivo principal.
// Es una excelente práctica para mantener la consistencia del tema (colores, fuentes, etc.).
@use '@/assets/scss/global' as *;

// --- Estilos para los Controles de Filtro ---

.form-select,
.form-control {
  // Hereda la fuente 'Open Sans' de tu SCSS global.
  // Podemos añadir ajustes específicos si es necesario, por ejemplo, un alto fijo.
  height: 44px;
}

// Estilo específico para el botón de "Volver" y otros botones secundarios.
// Usamos :deep() porque BButton es un componente hijo y necesitamos aplicar el estilo
// a las clases que este genera.
:deep(.btn-secondary) {
  font-family: 'Comfortaa', cursive;
  font-weight: 700;
}

// Personalización del botón de peligro para que coincida con tu tema.
:deep(.btn-danger) {
  font-family: 'Comfortaa', cursive;
  font-weight: 700;
  background-color: #df1115;
  border-color: #df1115;

  &:hover {
    background-color: #c10d11;
    border-color: #c10d11;
  }
}

// --- Estilos para la Tabla de Datos ---

.table-responsive {
  margin-top: 1.5rem;
  border: 1px solid #dee2e6; // Borde sutil alrededor de la tabla
  border-radius: 8px; // Bordes redondeados consistentes con tus cards
  overflow: hidden; // Asegura que los bordes redondeados se apliquen a la tabla
}

.table {
  // Tu clase .table-light ya se encarga del header.
  // Estos estilos se aplican a toda la tabla dentro de este componente.
  thead th {
    font-family: 'Comfortaa', cursive;
    font-weight: 700;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    vertical-align: middle;
  }

  tbody td {
    vertical-align: middle;

    // Ajustes para la celda de "Indicador" que contiene precio, porcentaje y flecha.
    .d-flex.align-items-center {
      white-space: nowrap; // Evita que el contenido se parta en dos líneas
      font-weight: 600;
    }

    // Asegura que los íconos de flecha estén perfectamente alineados.
    .fs-5 {
      position: relative;
      top: -1px;
    }
  }

  // Estilo para el botón de "ver historial" en la columna de acciones.
  .btn-outline-dark {
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}

// --- Mensaje de "No hay datos" ---
.text-muted {
    font-family: 'Comfortaa', cursive;
    font-size: 1.2rem;
    padding: 3rem 0;
}
</style>