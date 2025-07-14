<template>
  <div class="">
    <form>
      <div>
        <SidebarMenu :titulo="tituloMenu"/>
        <div class="vld-parent">
          <loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
        </div>

        <div class="table-wrapper m-3 p-3">
          <div style="margin-top: 30px;">
            <input id="archivoExcel" type="file" @change="subirExcel()" class="form-control" style="max-width: 500px;"> 
          </div>
          <div style="height: 20px;"></div>
          <div>
            <BButton variant="danger" v-if="items.length > 0" @click="guardar">Guardar Registros</BButton>
          </div>
          <table class="table table-bordered table-hover mt-3">
            <thead>
              <tr>
                <th v-for="(titulo, index) in titulos" :key="index">{{ titulo }}</th>
              </tr>
              <tr>
                <th v-for="(titulo, index) in titulos" :key="'filter-' + index">
                  <input type="text" class="form-control form-control-sm" v-model="filtros[titulo]" placeholder="Filtrar..." />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in itemsFiltrados" :key="rowIndex">
                <td v-for="(cell, colIndex) in row" :key="colIndex">{{ cell }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </form>
  </div>
</template>

Ese error ocurre porque this.$set es una función de Vue 2 que fue eliminada en Vue 3.

En Vue 3, el sistema de reactividad es más avanzado y ya no necesitas usar $set para que los cambios en un objeto sean detectados. Puedes asignar propiedades directamente.

La Solución
Simplemente debes reemplazar this.$set(this.filtros, titulo, '') por una asignación directa.

En tu método subirExcel, cambia esto:

JavaScript

// ANTES (Código de Vue 2)
this.titulos.forEach(titulo => {
  this.$set(this.filtros, titulo, ''); 
});
Por esto:

JavaScript

// DESPUÉS (Código de Vue 3)
this.titulos.forEach(titulo => {
  this.filtros[titulo] = '';
});
Script Completo Corregido
Aquí tienes el script completo con esa línea corregida para que lo copies y pegues.

Fragmento de código

<script>
import Loading from 'vue-loading-overlay';
import SidebarMenu from '@/components/Intranet/SidebarMenu/SidebarMenu.vue';
import readXlsFile from 'read-excel-file';
import backendRouter from '@/components/BackendRouter/BackendRouter';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BButton } from 'bootstrap-vue-next';

export default {
  data() {
    return {
      tituloMenu: 'Cargar Datos Corresponsal',
      isLoading: false,
      fullPage: true,
      items: [],
      registrosDivididos: [],
      titulos: [],
      filtros: {},
    };
  },
  methods: {
    subirExcel() {
      const input = document.getElementById("archivoExcel");
      if (!input.files[0]) return;

      readXlsFile(input.files[0]).then((rows) => {
        this.titulos = rows[0];
        const datos = rows.slice(1);

        this.filtros = {};
        // --- AQUÍ ESTÁ LA CORRECCIÓN ---
        this.titulos.forEach(titulo => {
          this.filtros[titulo] = '';
        });

        this.analizarDuplicados(this.titulos, datos);
      });
    },

    async analizarDuplicados(cabecera, items) {
      this.isLoading = true;
      const path = backendRouter.data + 'guardar-datos-corresponsal';
      const data = { action: 'analyze', cabecera, items };

      try {
        const response = await axios.post(path, data);
        const { duplicados, items_filtrados, cabecera: nuevaCabecera } = response.data;

        if (duplicados.length > 0) {
          const lineas = duplicados.map(d => `• Línea ${d.linea}: ${d.razon}`).join('<br>');
          Swal.fire({
            icon: 'warning',
            title: 'Registros duplicados detectados',
            html: `
              Se encontraron ${duplicados.length} registros que no se procesarán.<br><br>
              <strong>Detalles:</strong><br><div style="text-align:left; max-height: 200px; overflow-y: auto;">${lineas}</div>
            `,
            confirmButtonColor: '#DF1115',
          });
        }

        this.items = items_filtrados;
        this.titulos = nuevaCabecera;
        this.dividirRegistros();

      } catch (error) {
        console.error("Error al analizar duplicados:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error al procesar el archivo',
          text: 'Verifica que el archivo esté en el formato correcto.',
        });
      } finally {
        this.isLoading = false;
      }
    },

    dividirRegistros() {
      const maxRegistros = 2999;
      this.registrosDivididos = [];

      for (let i = 0; i < this.items.length; i += maxRegistros) {
        this.registrosDivididos.push(this.items.slice(i, i + maxRegistros));
      }
    },

    async guardar() {
      this.isLoading = true;
      const path = backendRouter.data + 'guardar-datos-corresponsal';
      console.log('Enviando datos para guardar...');
      console.log('Bloques de datos: ', this.registrosDivididos.length);

      const promesas = this.registrosDivididos.map((bloque, index) => {
        const data = {
          action: 'save',
          cabecera: this.titulos,
          items: bloque,
        };

        return axios.post(path, data)
          .then(response => {
            console.log(`Bloque ${index + 1} procesado con status`, response.status);
            return response.status === 200;
          })
          .catch(error => {
            console.error(`Error en el bloque ${index + 1}:`, error);
            return false;
          });
      });

      const resultados = await Promise.all(promesas);
      const exitosos = resultados.filter(r => r).length;
      const errores = resultados.length - exitosos;

      this.isLoading = false;

      if (errores === 0) {
        Swal.fire({
          icon: 'success',
          title: 'Registros guardados correctamente',
          text: 'Todos los registros fueron procesados exitosamente.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: `${errores} bloques fallaron al guardar. Revisa la consola para más detalles.`,
        });
      }
    },
  },
  computed: {
    itemsFiltrados() {
      if (!this.items.length || Object.keys(this.filtros).length === 0) return this.items;

      return this.items.filter(row => {
        return this.titulos.every((titulo, i) => {
          const filtro = this.filtros[titulo] || '';
          const valorCelda = row[i] != null ? String(row[i]).toLowerCase() : '';
          return valorCelda.includes(filtro.toLowerCase());
        });
      });
    }
  },
  components: {
    SidebarMenu,
    Loading,
    BButton
  }
};
</script>

<style scoped>
.table-wrapper {
  width: 95%;
  overflow-x: auto;
  margin: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  position: sticky;
  top: 0;
  background-color: #f2f2f2;
  z-index: 1;
}

.btn-danger {
  background-color: #E11419;
  border-color: #E11419;
}
</style>