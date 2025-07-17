<template>
  <div>

    <div class="vld-parent">
      <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>
    </div>

    <div class="container mt-5">
      <h1 class="text-center mb-4">Lista de traducciones</h1>
      <div class="d-flex justify-content-between mb-3">
        <input
          type="text"
          class="form-control w-50"
          placeholder="Buscar productos"
          v-model="searchQuery"
        />
        <div>
          <button class="btn btn-secondary me-2" @click="download">
            <i class="bi bi-file-earmark-arrow-down"></i>
          </button>
          <button class="btn btn-secondary" @click="goToBlacklist">
            Ir a Lista Negra
          </button>
        </div>
      </div>
      <div class="d-flex justify-content-end mb-3">
        <label for="itemsPerPage" class="me-2">Productos por página:</label>
        <select id="itemsPerPage" v-model="itemsPerPage" class="form-select w-auto">
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <div v-if="create" class="col-md-12" style="margin: 20px;">
        <b-table v-if="paginatedProducts.length > 0" striped hover :items="paginatedProducts" :fields="fields" head-variant="dark">
          <template v-slot:cell(action)="data">
            <b-button size="sm" variant="danger" @click="selectItem(data)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
              </svg>
            </b-button>
          </template>
        </b-table>
      </div>

      <div v-if="!create" class="col-md-6 offset-md-3">
        <form @submit.prevent="editTranslate">
          <div class="mb-3">
            <label for="product" class="form-label">Producto</label>
            <input type="text" class="form-control" id="product" placeholder="Nombre circular" readonly v-model.trim="form.product">
          </div>
          <div class="mb-3">
            <label for="translate" class="form-label">Traducción</label>
            <input type="text" class="form-control" id="translate" placeholder="Nombre Stok" v-model.trim="form.stok">
          </div>
          <div class="form-check mb-3">
            <input type="checkbox" class="form-check-input" id="IVA" v-model="checkIva">
            <label class="form-check-label" for="IVA">IVA</label>
          </div>
          <div class="form-check mb-3">
            <input type="checkbox" class="form-check-input" id="ACTIVO" v-model="checkActive">
            <label class="form-check-label" for="ACTIVO">ACTIVO</label>
          </div>
          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-danger">CREAR</button>
            <button type="button" class="btn btn-secondary" @click="create = true">ATRÁS</button>
          </div>
        </form>
      </div>

      <nav>
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="changePage(currentPage - 1)"><<</button>
          </li>
          <li class="page-item" v-if="currentPage > 3">
            <button class="page-link" @click="changePage(1)">1</button>
          </li>
          <li class="page-item" v-if="currentPage > 3">
            <span class="page-link">...</span>
          </li>
          <li class="page-item" v-for="page in pagesToShow" :key="page" :class="{ active: currentPage === page }">
            <button class="page-link" @click="changePage(page)">{{ page }}</button>
          </li>
          <li class="page-item" v-if="currentPage < totalPages - 2">
            <span class="page-link">...</span>
          </li>
          <li class="page-item" v-if="currentPage < totalPages - 2">
            <button class="page-link" @click="changePage(totalPages)">{{ totalPages }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="changePage(currentPage + 1)">>></button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
  
  
  
  <script>
    import axios from 'axios';
    import router from '@/router';
    import backendRouter from '@/components/BackendRouter/BackendRouter';
    import Loading from 'vue-loading-overlay';
    import Swal from 'sweetalert2';
    import * as XLSX from 'xlsx';

    export default {
    data() {
        return {
        tituloMenu: 'Traducciones',
        categoria: 'translate-products-prepago',
        create: true,
        items: [],
        fields: [
            { key: 'producto', label: 'Nombre' },
            { key: 'stok', label: 'Traducción' },
            { key: 'iva', label: 'IVA' },
            { key: 'active', label: 'Activo' },
            { key: 'action', label: '' },
        ],
        form: {
            product: '',
            stok: '',
            iva: '',
            active: '',
        },
        searchQuery: '',
        itemsPerPage: 10,
        currentPage: 1,
        isLoading: false,
        fullPage: true,
        checkIva: false,
        checkActive: false,
        };
    },
    components: {
        Loading,
    },
    computed: {
      filteredProducts() {
        return this.items.filter(product =>
          product.producto.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      },
      paginatedProducts() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.filteredProducts.slice(start, end);
      },
      totalPages() {
        return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
      },
      pagesToShow() {
        const pages = [];
        if (this.totalPages <= 5) {
          for (let i = 1; i <= this.totalPages; i++) {
            pages.push(i);
          }
        } else {
          if (this.currentPage <= 3) {
            pages.push(1, 2, 3, 4, 5);
          } else if (this.currentPage >= this.totalPages - 2) {
            pages.push(this.totalPages - 4, this.totalPages - 3, this.totalPages - 2, this.totalPages - 1, this.totalPages);
          } else {
            // pages.push(1);
            // pages.push('...');
            pages.push(this.currentPage - 1, this.currentPage, this.currentPage + 1);
            // pages.push('...');
            // pages.push(this.totalPages);
          }
        }
        return pages;
      }
    },
    methods: {
        validate() {
        const path = backendRouter.data + 'user-validate';
        axios.post(path, { jwt: this.$cookies.get('jwt') }).then(response => {
            console.log('check');
        }).catch(error => {
            router.push('/login');
            this.$swal(error.response.data.detail);
        });
        },
        listaPrepago() {
        this.categoria = 'translate-products-prepago';
        this.getTranslates();
        },
        listaPostpago() {
        this.categoria = 'translateProductsPostpago';
        this.getTranslates();
        },
        deleteItem(data) {
        this.deleteItemBack(data.item.id);
        },
        selectItem(data) {
        this.form.product = data.item.producto;
        this.form.stok = data.item.stok;
        this.checkIva = data.item.iva === "1";
        this.checkActive = data.item.active === "1";
        this.create = false;
        },
        editTranslate() {
        this.form.iva = this.checkIva ? "1" : "0";
        this.form.active = this.checkActive ? "1" : "0";
        const data = {
            equipo: this.form.product,
            stok: this.form.stok,
            iva: this.form.iva,
            active: this.form.active,
        };
        const path = backendRouter.data + this.categoria;
        axios.post(path, data).then(response => {
            this.getTranslates();
            Swal.fire({
            icon: 'success',
            title: 'Item editado',
            customClass: {
                confirmButton: 'btn btn-danger'
            },
            buttonsStyling: false
            });
        }).catch(error => {
            Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.detail,
            customClass: {
                confirmButton: 'btn btn-danger'
            },
            buttonsStyling: false
            });
        });
        },
        deleteItemBack(equipo) {
        this.isLoading = true;
        const path = backendRouter.data + this.categoria + '/admin';
        const data = { equipo };
        axios.delete(path, { data }).then(response => {
            this.isLoading = false;
            this.items = response.data;
            this.create = true;
        }).catch(error => {
            Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.detail,
            customClass: {
                confirmButton: 'btn btn-danger'
            },
            buttonsStyling: false
            });
        });
        },
        getTranslates() {
        this.isLoading = true;
        const path = backendRouter.data + this.categoria;
        axios.get(path).then(response => {
            this.isLoading = false;
            this.items = response.data;
            this.create = true;
        }).catch(error => {
            Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.detail,
            customClass: {
                confirmButton: 'btn btn-danger'
            },
            buttonsStyling: false
            });
        });
        },
        changePage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
        },
        goToBlacklist() {
        this.$router.push({ path: '/lista-negra' });
        },
        download(){
          const data = this.items;
          const fileName = 'download.xlsx';
          const workbook = XLSX.utils.book_new();
          const worksheet = XLSX.utils.json_to_sheet(data)
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
          XLSX.writeFile(workbook, fileName)
        },
    },
    created() {
        this.getTranslates();
    },
    };

</script>
  
<style>
  body {
    background-color: #ffffff;
    color: #000000;
  }

  h1 {
    color: #DF1115;
  }

  .btn-danger {
    background-color: #DF1115;
    border-color: #DF1115;
  }

  .table-striped tbody tr:nth-of-type(odd) {
    background-color: #f9f9f9; /* Gris claro */
  }

  .table-striped tbody tr:nth-of-type(even) {
    background-color: #ffffff; /* Blanco */
  }

  .table-dark thead {
    background-color: #000000;
    color: #ffffff;
  }

  .page-link {
    color: #DF1115;
  }

  .page-item.active .page-link {
    background-color: #DF1115;
    border-color: #DF1115;
  }

  .btn-secondary {
    background-color: #000000;
    border-color: #000000;
    color: #ffffff;
  }
</style>