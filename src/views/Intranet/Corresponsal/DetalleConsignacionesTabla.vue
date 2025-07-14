<template>
  <div class="table-responsive">
    <table class="table table-bordered table-hover align-middle">
      <thead class="table-light">
        <tr>
          <th v-if="selectable">
            <input type="checkbox" @change="toggleSelectAll" :checked="allSelected" />
          </th>
          <th v-for="header in headers" :key="header.key">{{ header.label }}</th>
          <th v-if="showImageButton">Imagen</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in consignaciones" :key="item.id">
          <td v-if="selectable">
            <input type="checkbox" :value="item" v-model="selectedItems" @change="onSelectionChange" />
          </td>
          <td v-for="header in headers" :key="header.key">
            {{ header.isCurrency ? formatCurrency(item[header.key]) : item[header.key] }}
          </td>
          <td v-if="showImageButton">
              <button v-if="item.url" class="btn btn-sm btn-outline-secondary" @click="$emit('view', item)">
              <IBiEye />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'DetalleConsignacionesTabla',
  props: {
    consignaciones: {
      type: Array,
      required: true,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    showImageButton: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      headers: [
        { key: 'sucursal_nombre', label: 'Sucursal' },
        { key: 'banco', label: 'Categoría' },
        { key: 'valor', label: 'Valor', isCurrency: true },
        { key: 'responsable', label: 'Responsable' },
        { key: 'estado', label: 'Estado' },
        { key: 'detalle', label: 'Detalle' },
        { key: 'detalle_categoria', label: 'Detalle Categoría' },
      ],
      selectedItems: [],
    };
  },
  computed: {
    allSelected() {
      return this.consignaciones.length > 0 && this.selectedItems.length === this.consignaciones.length;
    }
  },
  methods: {
    formatCurrency(value) {
    if (value === null || value === undefined) {
      return '$ 0';
    }
    let numericValue;
    if (typeof value === 'number') {
      numericValue = value;
    } else {
      const cleanedString = String(value).replace(/[^0-9-]/g, '');
      numericValue = parseFloat(cleanedString);
    }
    if (isNaN(numericValue)) {
      return '$ 0';
    }
    return numericValue.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  },
    onSelectionChange() {
      this.$emit('selection-change', this.selectedItems);
    },
    toggleSelectAll() {
      if (this.allSelected) {
        this.selectedItems = [];
      } else {
        this.selectedItems = [...this.consignaciones];
      }
      this.onSelectionChange();
    }
  }
};
</script>