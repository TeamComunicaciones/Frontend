<template>
  <SidebarMenu :titulo="tituloMenu"/>
  <div class="vld-parent">
    <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>
  </div>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Lista negra de productos</h1>
    <div class="d-flex justify-content-between mb-3">
      <input
        type="text"
        class="form-control w-50"
        placeholder="Buscar productos"
        v-model="searchQuery"
      />
      <button class="btn btn-secondary" @click="goToTranslations">
        Ir a Traducciones
      </button>
    </div>
    <div class="d-flex justify-content-end mb-3">
      <label for="itemsPerPage" class="me-2">Productos por página:</label>
      <select id="itemsPerPage" v-model="itemsPerPage" class="form-select w-auto">
        <option value="10">10</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>
    <table class="table table-striped table-bordered">
      <thead class="table-dark">
        <tr>
          <th scope="col">Nombre</th>
          <th scope="col" class="text-end">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginatedProducts" :key="item.id">
          <td>{{ item.product }}</td>
          <td class="text-end">
            <button class="btn btn-danger" @click="deleteProduct(item.id)">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <nav>
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="changePage(currentPage - 1)"><<</button>
        </li>
        <li class="page-item" v-if="currentPage > 3">
          <button class="page-link" @click="changePage(1)">1</button>
        </li>
        <li class="page-item" v-if="currentPage > 4">
          <span class="page-link">...</span>
        </li>
        <li class="page-item" v-for="page in pagesToShow" :key="page" :class="{ active: currentPage === page }">
          <button class="page-link" @click="changePage(page)">{{ page }}</button>
        </li>
        <li class="page-item" v-if="currentPage < totalPages - 3">
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
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import backendRouter from '@/components/BackendRouter/BackendRouter';

export default {
  data() {
    return {
      products: [],
      searchQuery: '',
      itemsPerPage: 10,
      currentPage: 1
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product =>
        product.product.toLowerCase().includes(this.searchQuery.toLowerCase())
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
          pages.push(1);
          pages.push('...');
          pages.push(this.currentPage - 1, this.currentPage, this.currentPage + 1);
          pages.push('...');
          pages.push(this.totalPages);
        }
      }
      return pages;
    }
  },
  methods: {
    async fetchProducts() {
      try {
        const url = backendRouter.data+'black-list'
        const response = await axios.get(url);
        this.products = response.data.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    async deleteProduct(id) {
      try {
        const url = backendRouter.data+`black-list/${id}`
        const response = await axios.delete(url);
        Swal.fire({
          icon: 'success',
          title: 'Producto eliminado',
          text: 'El producto ha sido eliminado de la lista negra exitosamente.',
          customClass: {
            confirmButton: 'btn btn-danger'
          },
          buttonsStyling: false
        });
        this.fetchProducts(); // Actualizar la lista de productos
      } catch (error) {
        console.error('Error eliminando producto:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al eliminar el producto.',
          customClass: {
            confirmButton: 'btn btn-danger'
          },
          buttonsStyling: false
        });
      }
    },
    goToTranslations() {
      this.$router.push({ name: 'Administrar traducciones' });
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
  },
  mounted() {
    this.fetchProducts();
  }
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
  color: #ffffff; /* Asegúrate de que el texto sea visible */
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(223, 17, 21, 0.1);
}

.table-dark {
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