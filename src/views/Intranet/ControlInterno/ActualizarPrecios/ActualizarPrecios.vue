<template>
  <div>
    <form>
      <div>
        <SidebarMenu :titulo="tituloMenu"/>
        <div class="vld-parent">
          <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>
        </div>

        <div v-if="create" class="container mt-5">
          <div class="row mb-3">
            <div class="col">
              <input class="form-control" id="archivoExcel" type="file" @change="subirExcel">
            </div>
          </div>
          <div v-if="items.length > 0" class="row mb-3">
            <div class="col text-center">
              <BButton variant="danger" v-if="items.length > 0" class="mb-2" @click="accion_boton">{{titulo_boton}}</BButton>
            </div>
          </div>
          <div v-if="items.length > 0" class="row mb-3">
            <div class="col">
              <input
                type="text"
                class="form-control"
                placeholder="Buscar productos"
                v-model="searchQuery"
              />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="table-responsive">
                <table class="table table-striped table-bordered">
                  <thead class="table-dark">
                    <tr>
                      <th v-for="j in titulos" :key="j">{{ j }}</th>
                      <th v-if="items.length > 0">Acciones</th> <!-- Nueva columna para acciones -->
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, rowIndex) in filteredItems" :key="rowIndex">
                      <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                        <span v-if="!row.editing">{{ cell }}</span>
                        <input v-else type="text" v-model="row[cellIndex]" />
                      </td>
                      <td v-if="items.length > 0">
                        <BButton variant="danger" @click="editRow(row)">
                          <i class="bi bi-pencil"></i>
                        </BButton>
                        <BButton variant="dark" v-if="row.editing" @click="saveRow(row)">
                          <i class="bi bi-check-lg"></i>
                        </BButton>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!create" class="card p-3 mx-auto" style="width: 60%; margin-top: 100px;">
          <div class="form-group">
            <label for="product">Producto</label>
            <input type="text" class="form-control" id="product" placeholder="Nombre circular" readonly v-model.trim="form.product">
          </div>
          <div class="form-group">
            <label for="translate">Traducción</label>
            <input type="text" class="form-control" id="translate" placeholder="Nombre Stok" v-model.trim="form.stok">
          </div>
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="IVA" v-model="checkIva">
            <label for="IVA" class="form-check-label">IVA</label>
          </div>
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="ACTIVO" v-model="checkActive">
            <label for="ACTIVO" class="form-check-label">ACTIVO</label>
          </div>
          <BButton variant="danger" class="m-2" @click="crearTranslate">CREAR</BButton>
          <BButton variant="danger" class="m-2" @click="omitirTranslate">OMITIR</BButton>
          <BButton variant="dark" class="m-2" @click="addToBlacklist">Añadir a la lista negra</BButton>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import axios from 'axios'
import readXlsFile from 'read-excel-file'
import exportFromJSON from 'export-from-json'
import backendRouter from '@/components/BackendRouter/BackendRouter'
import router from '@/router'
import SidebarMenu from '@/components/Intranet/SidebarMenu/SidebarMenu.vue'
import Loading from 'vue-loading-overlay';
import Swal from 'sweetalert2'
import { BButton } from 'bootstrap-vue-next'
import * as XLSX from 'xlsx';

export default {
  data() {
    return {
      tituloMenu: "Precios",
      create: true,
      excel: [],
      cont: 0,
      titulo: "Precios Equipos Nuevos Prepago",
      items: [],
      missing: [],
      titulos: [],
      cabecera: [],
      crediminuto: [],
      titulo_boton: 'TRADUCIR',
      accion_boton: this.traducir,
      iva: true,
      form: {
        product: '',
        stok: '',
        iva: '',
        active: '',
      },
      isLoading: false,
      fullPage: true,
      checkIva: false,
      checkActive: false,
      searchQuery: '' // Añadido para el filtro
    }
  },
  computed: {
    filteredItems() {
      if (!this.searchQuery) {
        return this.items;
      }
      const query = this.searchQuery.toLowerCase();
      return this.items.filter(row => 
        row.some(cell => cell && cell.toString().toLowerCase().includes(query))
      );
    }
  },
  methods: {
    validate() {
      const path = backendRouter.data + 'user-validate'
      axios.post(path, { 'jwt': this.$cookies.get('jwt') }).then((response) => {
        console.log('check')
      })
        .catch((error) => {
          router.push('/login')
          this.$swal(error.response.data.detail)
        })
    },
    subirExcel() {
      this.cabecera = [
        { text: 'Equipo', value: '0' },
        { text: 'Valor', value: '1' },
        { text: 'Descuento', value: '2' },
        { text: 'Costo', value: '3' },
        { text: 'Precio con IVA', value: '4' },
      ]
      this.titulo_boton = 'TRADUCIR'
      this.accion_boton = this.traducir
      const input = document.getElementById("archivoExcel");
      readXlsFile(input.files[0]).then((rows) => {
        this.titulos = rows[0]
        this.items = rows.slice(1)
      })
    },
    traducir() {
      this.titulo_boton = 'GUARDAR'
      this.accion_boton = this.guardarPrecios
      const tempData = this.items
      this.isLoading = true
      const path = backendRouter.data + 'translate-prepago'
      axios.post(path, tempData).then((responser) => {
        this.cont = 0
        this.create = responser.data.validate
        this.isLoading = false
        if (this.create == false) {
          this.missing = responser.data.data
          this.form.product = this.missing[this.cont]
        } else {
          this.items = responser.data.data
          this.searchQuery = '' // Reiniciar el filtro después de la traducción
        }
        this.titulos = responser.data.cabecera.map(item => item.text)
        console.log('los titulos son', this.titulos)
      }).catch((error) => {
        this.isLoading = false;
        console.error(error);
      });
    },
    excelPrecios() {
      this.isLoading = true
      this.cabecera = this.titulos.map((text, index) => {
        return { text: text, value: String(index) };
      });
      const data = {
        cabecera: this.cabecera,
        items: this.items
      }
      const path = backendRouter.data + 'excel-precios'
      axios.post(path, data).then((response) => {
        this.titulo_boton = 'DESCARGAR'
        this.accion_boton = this.descargarExcel
        this.isLoading = false
        this.excel = response.data.excel
      })
    },
    guardarPrecios() {
      this.cabecera = this.titulos.map((elemento, indice) => ({
        'text': elemento,
        'value': indice
      }))
      this.isLoading = true
      const data = {
        cabecera: this.cabecera,
        items: this.items
      }
      console.log(data)
      console.log(this.titulos)
      const path = backendRouter.data + 'guardar-precios'
      axios.post(path, data).then((response) => {
        this.titulo_boton = 'EXCEL'
        this.accion_boton = this.excelPrecios
        this.isLoading = false
        this.$swal('Guardado con exito')
      })
    },
    crearTranslate() {
      var checkboxIva = document.getElementById("IVA")
      var checkboxActive = document.getElementById("ACTIVO")
      this.form.iva = checkboxIva.checked
      this.form.active = checkboxActive.checked
      this.form.product = this.missing[this.cont]
      this.isLoading = true
      const data = {
        'equipo': this.form.product,
        'stok': this.form.stok,
        'iva': this.form.iva,
        'active': this.form.active
      }

      const path = backendRouter.data + 'translate-products-prepago'
      axios.post(path, data).then((responser) => {
        this.cont++
        this.form.product = this.missing[this.cont]
        this.form.stok = ''
        checkboxIva.checked = false
        checkboxActive.checked = false
        console.log(this.cont, this.missing.length)
        if (this.cont == this.missing.length) {
          this.create = true
          this.cont = 0
          this.titulo_boton = 'TRADUCIR'
          this.accion_boton = this.traducir
        } else {
          this.form.product = this.missing[this.cont]
          this.form.stok = ''
        }
        this.isLoading = false
      })
        .catch((error) => {
          this.$swal(error.response.data.detail)
          this.isLoading = false
        })
    },
    omitirTranslate() {
      this.items = this.items.filter(item => item[0] !== this.missing[this.cont])
      this.cont++

      if (this.cont == this.missing.length) {
        this.create = true
        this.cont = 0
        this.titulo_boton = 'TRADUCIR'
        this.accion_boton = this.traducir
      } else {
        this.form.product = this.missing[this.cont]
        this.form.stok = ''
      }
    },
    async addToBlacklist() {
      try {
        const jwt = this.getCookie('jwt');
        if (!jwt) {
          throw new Error('JWT not found in cookies');
        }

        // Verificar si el producto ya existe en la lista negra
        const existingProductsResponse = await axios.get('https://api.teamcomunicaciones.com.co/api/v1.0/black-list');
        const existingProducts = existingProductsResponse.data.data;

        const productExists = existingProducts.some(product => product.product === this.form.product);
        if (productExists) {
          Swal.fire({
            icon: 'warning',
            title: 'Producto ya existe',
            text: 'El producto ya está en la lista negra.',
            confirmButton: 'btn btn-danger'
          });
          return;
        }

        // Si el producto no existe, añadirlo a la lista negra
        const response = await axios.post('https://api.teamcomunicaciones.com.co/api/v1.0/black-list', {
          product: this.form.product,
          jwt: jwt
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        this.items = this.items.filter(item => item[0] !== this.missing[this.cont])
        this.cont++

        if (this.cont == this.missing.length) {
          this.create = true
          this.cont = 0
          this.titulo_boton = 'TRADUCIR'
          this.accion_boton = this.traducir
        } else {
          this.form.product = this.missing[this.cont]
          this.form.stok = ''
        }

        Swal.fire({
          icon: 'success',
          title: 'Producto añadido',
          text: 'El producto ha sido añadido a la lista negra exitosamente.',
          customClass: {
            confirmButton: 'btn btn-danger'
          },
          buttonsStyling: false
        });

        console.log('Producto añadido a la lista negra:', response.data);
      } catch (error) {
        if (error.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          console.error('Error en la respuesta del servidor:', error.response.data);
        } else if (error.request) {
          // La solicitud se hizo pero no se recibió respuesta
          console.error('No se recibió respuesta del servidor:', error.request);
        } else {
          // Algo sucedió al configurar la solicitud que desencadenó un error
          console.error('Error al configurar la solicitud:', error.message);
        }
      }
    },
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2)
      return parts.pop().split(';').shift();
    },
    descargarExcel() {
      const data = this.excel;
      const fileName = 'download.xlsx';
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data)
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
      XLSX.writeFile(workbook, fileName)
    },
    descargarExcelCrediminuto() {
      const data = this.crediminuto;
      const fileName = 'download';
      const exportType = exportFromJSON.types.xls
      exportFromJSON({ data, fileName, exportType })
    },
    editRow(row) {
      row.editing = true;
    },
    saveRow(row) {
      row.editing = false;
      // Aquí puedes añadir lógica para guardar los cambios, por ejemplo, enviarlos al servidor
    }
  },
  created() {
    // this.validate()
  }, 
  components: {
    SidebarMenu,
    Loading,
    BButton
  },
}
</script>
<style scoped>
  .table-wrapper {
    width: 100%;
    margin: 0 auto;
    overflow-x: auto;
    height: 500px;
  }

  .table-responsive {
    margin-top: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 12px;
    text-align: left; /* Alineación a la izquierda */
    border-bottom: 1px solid #ddd;
  }

  th {
    position: sticky;
    top: 0;
    background-color: #000000; /* Encabezado negro */
    color: #ffffff; /* Texto blanco */
    z-index: 1;
  }

  .table-striped tbody tr:nth-of-type(odd) {
    background-color: #f9f9f9; /* Gris claro */
  }

  .table-striped tbody tr:nth-of-type(even) {
    background-color: #ffffff; /* Blanco */
  }

  .btn-danger {
    background-color: #DF1115;
    border-color: #DF1115;
  }

  .btn-dark {
    background-color: #000000;
    border-color: #000000;
    color: #ffffff;
  }

  .page-link {
    color: #DF1115;
  }

  .page-item.active .page-link {
    background-color: #DF1115;
    border-color: #DF1115;
  }

  .table th, .table td {
    white-space: nowrap; /* Evita que el texto se rompa en varias líneas */
  }

  .table-responsive {
    overflow-x: auto;
  }
</style>