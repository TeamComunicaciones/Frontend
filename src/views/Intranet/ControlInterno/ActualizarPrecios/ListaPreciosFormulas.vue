<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-3">
        <div class="menu-precios">
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li v-for="(price, index) in prices" :key="index" class="nav-item" role="presentation">
              <a class="nav-link" :class="{ active: activeTab === index }" @click="setActiveTab(index)" :id="`${price.name}-tab`" data-bs-toggle="tab" :href="`#${price.name}`" role="tab" :aria-controls="price.name" :aria-selected="activeTab === index">{{ price.name }}</a>
            </li>
            <li class="nav-item" role="presentation">
              <a class="nav-link" :class="{ active: activeTab === 'new' }" @click="setActiveTab('new')" role="tab">
                <i class="bi bi-plus-circle"></i> Agregar nuevo precio
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-md-9">
        <div class="contenido-calc">
          <div class="row">
            <div class="col-md-6">
              <div class="tab-content" id="myTabContent">
                <div v-for="(price, index) in prices" :key="index" class="tab-pane fade" :class="{ 'show active': activeTab === index }" :id="price.name" role="tabpanel" :aria-labelledby="`${price.name}-tab`">
                  <div v-if="formulasWithVariableNames[price.name]">
                    <h5>Última fórmula guardada: </h5>
                    <pre>{{ formulasWithVariableNames[price.name].formula }}</pre>
                  </div>
                  <div v-if="activeTab === index">
                    <h5>Fórmula nueva:</h5>
                    <pre>{{ currentFormula }}</pre>
                  </div>
                  <div class="botonera">
                    <button @click="deletePrice(price.id)" class="btn btn-danger mt-2">
                      <i class="bi bi-trash"></i> Eliminar precio
                    </button>
                    <button v-if="!formulas[price.name]" @click="saveFormula(price.id, price.name)" class="btn btn-success mt-2" :disabled="!isResultValid">
                      <i class="bi bi-save"></i> Guardar fórmula
                    </button>
                    <button v-else @click="updateFormula(price.id, price.name)" class="btn btn-success mt-2" :disabled="!isResultValid">
                      <i class="bi bi-save"></i> Actualizar fórmula
                    </button>
                  </div>

                </div>
                <div v-if="activeTab === 'new'" class="tab-pane fade show active">
                  <input type="text" v-model="newPriceName" placeholder="Nombre del nuevo precio" class="form-control my-2" />
                  <button @click="addNewPrice" class="btn btn-primary">
                    <i class="bi bi-save"></i> Guardar
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="calculadora-precio">
                <h5>Operadores lógicos</h5>
                <div class="valor-manual">
                  <input type="text" v-model="manualValue" @input="validateManualValue" class="form-control mb-2" placeholder="Ingrese un valor" @keydown="handleKeydown" />
                  <button @click="appendManualValue" class="btn btn-secondary mb-2">Añadir valor</button>
                </div>

                <div class="btn-group grupo1 " role="group">
                  <button @click="appendValue('+')" class="btn btn-secondary"><i class="bi bi-plus"></i></button>
                  <button @click="appendValue('-')" class="btn btn-secondary"><i class="bi bi-dash"></i></button>
                  <button @click="appendValue('*')" class="btn btn-secondary"><i class="bi bi-x"></i></button>
                  <button @click="appendValue('/')" class="btn btn-secondary"><i class="bi bi-slash"></i></button>
                  <button @click="appendValue('(')" class="btn btn-secondary">(</button>
                  <button @click="appendValue(')')" class="btn btn-secondary">)</button>
                  <button @click="deleteLastValue" class="btn btn-primary"><i class="bi bi-backspace"></i></button>
                  <button @click="calculateResult" class="btn btn-primary mt-2">=</button>
                </div>
                <div v-if="result !== null" class="mt-2">
                  Resultado: {{ result }}
                </div>
                <div class="variables-section mt-4">
                  <h5>Variables</h5>
                  <div class="btn-group-vertical" role="group">
                    <div class="d-flex align-items-center mb-2">
                      <button v-if="activeTab != 5" @click="appendVariableToFormula({'name': 'PrecioPublico'})" class="btn btn-secondary flex-grow-1 me-1">Precio publico</button>
                      <button @click="appendVariableToFormula({'name': 'Valor'})" class="btn btn-secondary flex-grow-1 me-1">Valor</button>
                      <button @click="appendVariableToFormula({'name': 'Descuento'})" class="btn btn-secondary flex-grow-1 me-1">Descuento</button>
                      <button @click="appendVariableToFormula({'name': 'Costo'})" class="btn btn-secondary flex-grow-1 me-1">Costo</button>
                      <button @click="showEditFixedVariablesModal" class="btn btn-primary ms-2"><i class="bi bi-pencil"></i></button>
                    </div>
                    <div v-for="variable in filteredVariables" :key="variable.id" class="d-flex align-items-center mb-2">
                      <button @click="appendVariableToFormula(variable)" class="btn btn-secondary flex-grow-1">{{ variable.name }}</button>
                      <button @click="editVariable(variable)" class="btn btn-primary ms-2"><i class="bi bi-pencil"></i></button>
                    </div>
                    <button @click="showAddVariableModal" class="btn btn-primary mt-2">
                      <i class="bi bi-plus-circle"></i> Agregar variable
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="addVariableModal" tabindex="-1" aria-labelledby="addVariableModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addVariableModalLabel">Agregar/Editar Variable</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <input type="text" v-model="newVariableName" placeholder="Nombre de la variable" class="form-control mb-2" />
          <select v-model="newVariableType" @change="onVariableTypeChange" class="form-control mb-2">
            <option value="" disabled>Seleccione el tipo</option>
            <option value="Variable">Variable</option>
            <option value="Condición">Condición</option>
          </select>
          <div id="variable" v-if="newVariableType=='Variable'">
            <div class="alinear-modal">
              <input type="text" v-model="newVariableManualValue" @input="validateManualValue" placeholder="Valor manual" class="form-control mb-2" />
              <button @click="appendVariableManualValue" class="btn btn-secondary mb-2">Añadir valor</button>
            </div>
            <div class="btn-group" role="group">
              <button @click="appendVariableValue('+')" class="btn btn-secondary" :disabled="!isNewVariableFormulaValid"><i class="bi bi-plus"></i></button>
              <button @click="appendVariableValue('-')" class="btn btn-secondary" :disabled="!isNewVariableFormulaValid"><i class="bi bi-dash"></i></button>
              <button @click="appendVariableValue('*')" class="btn btn-secondary" :disabled="!isNewVariableFormulaValid"><i class="bi bi-x"></i></button>
              <button @click="appendVariableValue('/')" class="btn btn-secondary" :disabled="!isNewVariableFormulaValid"><i class="bi bi-slash"></i></button>
              <button @click="appendVariableValue('(')" class="btn btn-secondary">(</button>
              <button @click="appendVariableValue(')')" class="btn btn-secondary">)</button>
              <button @click="deleteLastVariableFormulaValue" class="btn btn-primary"><i class="bi bi-backspace"></i></button>
            </div>
          </div>
          <div id="condición" v-if="newVariableType=='Condición'">
            <div v-for="(condition, index) in conditions" :key="index" class="row align-items-center mb-2">
              <div class="col-auto">
                <input type="checkbox" v-model="condition.isComboBoxFirstValue" />
              </div>
              <div class="col">
                <div v-if="condition.isComboBoxFirstValue">
                  <select v-model="condition.firstValue" class="form-control">
                    <option v-for="variable in variables" :key="variable.id" :value="variable.name">{{ variable.name }}</option>
                  </select>
                </div>
                <div v-else>
                  <input type="text" v-model="condition.firstValue" placeholder="Valor" class="form-control" @input="generateConditionValue()" />
                </div>
              </div>
              <div class="col">
                <select v-model="condition.operator" class="form-control" @change="generateConditionValue">
                  <option value="<">&lt;</option>
                  <option value="<=">&lt;=</option>
                  <option value=">">&gt;</option>
                  <option value=">=">&gt;=</option>
                  <option value="==">=</option>
                  <option value="!=">≠</option>
                </select>
              </div>
              <div class="col-auto">
                <input type="checkbox" v-model="condition.isComboBoxSecondValue" />
              </div>
              <div class="col">
                <div v-if="condition.isComboBoxSecondValue">
                  <select v-model="condition.secondValue" class="form-control">
                    <option v-for="variable in variables" :key="variable.id" :value="variable.name">{{ variable.name }}</option>
                  </select>
                </div>
                <div v-else>
                  <input type="text" v-model="condition.secondValue" placeholder="Valor" class="form-control" @input="generateConditionValue()" />
                </div>
              </div>
              <div class="col-auto">
                <input type="checkbox" v-model="condition.isComboBox" />
              </div>
              <div class="col">
                <div v-if="condition.isComboBox">
                  <select v-model="condition.result" class="form-control">
                    <option v-for="variable in variables" :key="variable.id" :value="variable.name">{{ variable.name }}</option>
                  </select>
                </div>
                <div v-else>
                  <input type="text" v-model="condition.result" placeholder="Valor" class="form-control" @input="generateConditionValue()" />
                </div>
              </div>
              <div class="col-auto">
                <button @click="removeCondition(index)" class="btn btn-danger">
                  <i class="bi bi-dash-circle"></i>
                </button>
              </div>
            </div>
            <button @click="addCondition" class="btn btn-primary">
              <i class="bi bi-plus-circle"></i> Agregar fila
            </button>
          </div>
          <div class="mt-2">
            Fórmula: {{ newVariableFormula }}
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button @click="deleteVariable" class="btn btn-danger mt-2">
            <i class="bi bi-x"></i> Eliminar
          </button>
          <button @click="saveVariable" class="btn btn-primary">Guardar</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="editFixedVariablesModal" tabindex="-1" aria-labelledby="editFixedVariablesModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editFixedVariablesModalLabel">Editar Variables Fijas</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-for="(value, key) in fixedVariables" :key="key" class="mb-3">
            <label :for="key" class="form-label">
              <strong>{{ formatVariableName(key) }}</strong> <span>{{ variableFormulas[key] }}</span>
            </label>
            <input type="number" v-model="fixedVariables[key]" :id="key" class="form-control" />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-primary" @click="applyFixedVariables">Aplicar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import VueCookies from 'vue-cookies';
import Swal from 'sweetalert2';
import SidebarMenu from '@/components/Intranet/SidebarMenu/SidebarMenu.vue';
import Loading from 'vue-loading-overlay';
import backendRouter from '@/components/BackendRouter/BackendRouter';

export default {
  components: {
    Loading
  },
  data() {
    return {
      fixedVariables: {
        Valor: 0,
        Descuento: 0,
        Costo: 0
      },
      variableFormulas: {},
      isCondition: {
        Valor: false,
        Descuento: false,
        Costo: false
      },
      prices: [],
      formulas: {},
      variables: [],
      isLoading: false,
      fullPage: true,
      tituloMenu: 'Menú de Precios',
      activeTab: 0,
      showForm: false,
      newPriceName: '',
      inputValue: '',
      manualValue: '',
      result: null,
      currentFormula: '',
      newVariableName: '',
      newVariableType: '',
      newVariableFormula: '',
      newVariableManualValue: '',
      selectedVariable: {},
      conditions: [{
        firstValue: '',
        operator: '',
        secondValue: '',
        result: '',
        isComboBox: false
      }]
    };
  },
  async created() {
    this.isLoading = true;
    await this.fetchPrices();
    await this.fetchFormulas();
    await this.fetchVariables();
    await this.fetchVariableFormulas();
    this.isLoading = false;
  },
  computed: {
    isResultValid() {
      return this.result !== null && !isNaN(this.result);
    },
    isNewVariableFormulaValid() {
      return this.newVariableFormula.trim() !== '';
    },
    formulasWithContent() {
      const formulasWithContent = {};
      for (const [name, formulaObj] of Object.entries(this.formulas)) {
        let formulaContent = formulaObj.formula;
        this.variables.forEach(variable => {
          const variableRegex = new RegExp(`\\b${variable.name}\\b`, 'g');
          formulaContent = formulaContent.replace(variableRegex, `(${variable.formula})`);
        });
        formulasWithContent[name] = { ...formulaObj,
          formula: formulaContent
        };
      }
      return formulasWithContent;
    },
    formulasWithVariableNames() {
      return this.formulas;
    },
    filteredVariables() {
      if (this.activeTab === 'new') {
        return [];
      }
      const activePrice = this.prices[this.activeTab];
      const activePriceName = activePrice && activePrice.name;
      return this.variables.filter(variable => variable.price === activePriceName);
    }
  },
  watch: {
    inputValue(newVal) {
      this.currentFormula = newVal;
    },
    newVariableManualValue(newVal) {
      this.newVariableManualValue = this.newVariableManualValue;
    }
  },
  methods: {
    async fetchVariableFormulas() {
      try {
        const token = VueCookies.get('jwt');
        const response = await axios.get('https://api.teamcomunicaciones.com.co/api/v1.0/variables', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (Array.isArray(response.data.data)) {
          response.data.data.forEach(variable => {
            this.variableFormulas[variable.name] = variable.formula;
          });
        } else {
          console.error('La respuesta no contiene un array en la propiedad data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching variable formulas:', error);
      }
    },
    showEditFixedVariablesModal() {
      const modal = new bootstrap.Modal(document.getElementById('editFixedVariablesModal'));
      modal.show();
    },
    applyFixedVariables() {
      const modal = bootstrap.Modal.getInstance(document.getElementById('editFixedVariablesModal'));
      modal.hide();
    },
    formatVariableName(name) {
      const formattedNames = {
        Valor: 'Valor',
        Descuento: 'Descuento',
        Costo: 'Costo'
      };
      return formattedNames[name] || name;
    },
    generateConditionValue() {
      var formula = ''
      for (let i = 0; i < this.conditions.length; i++) {
        formula = `${formula} ( ${this.conditions[i].result} if ${this.conditions[i].firstValue} ${this.conditions[i].operator} ${this.conditions[i].secondValue} else`
      }
      formula = `${formula} 0 ${') '.repeat(this.conditions.length)}`
      this.newVariableFormula = formula
    },
    parseConditions(formula) {
      const conditionRegex = /\(\s*if\s+([^<>=!]+)\s*([<>=!]+)\s*([^<>=!]+)\s*else\s*([^()]+)\s*\)/g;
      let match;
      const conditions = [];

      while ((match = conditionRegex.exec(formula)) !== null) {
        const [_, firstValue, operator, secondValue, result] = match;
        conditions.push({
          firstValue: firstValue.trim(),
          operator: operator.trim(),
          secondValue: secondValue.trim(),
          result: result.trim()
        });
      }

      this.conditions = conditions;
    },
    onVariableTypeChange() {
      if (this.newVariableType === 'Condición') {
        this.conditions = [{
          firstValue: '',
          operator: '',
          secondValue: '',
          result: '',
          isComboBox: false
        }]
      } else if (this.newVariableType === 'Variable') {
        this.newVariableManualValue = '';
        this.newVariableFormula = '';
      }
    },
    removeCondition(index) {
      this.conditions.splice(index, 1);
    },
    addCondition() {
      this.conditions.push({
        firstValue: '',
        operator: '',
        secondValue: '',
        result: '',
        isComboBox: false
      });
    },
    appendVariableToFormula(variable) {
      this.inputValue += ' ' + variable.name;
    },
    async fetchPrices() {
      try {
        const token = VueCookies.get('jwt');
        const response = await axios.get('https://api.teamcomunicaciones.com.co/api/v1.0/prices', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (Array.isArray(response.data.data)) {
          this.prices = response.data.data.filter(price => price.state === true);
        } else {
          console.error('La respuesta no contiene un array en la propiedad data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    },
    async fetchFormulas() {
      try {
        const token = VueCookies.get('jwt');
        const path = backendRouter.data + 'formulas'
        const response = await axios.get(path, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (Array.isArray(response.data.data)) {
          this.formulas = {};
          response.data.data.forEach(formula => {
            this.formulas[formula.name] = {
              id: formula.id,
              formula: formula.formula
            };
          });
        } else {
          console.error('La respuesta no contiene un array en la propiedad data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching formulas:', error);
      }
    },
    async fetchVariables() {
      try {
        const token = VueCookies.get('jwt');
        const response = await axios.get('https://api.teamcomunicaciones.com.co/api/v1.0/variables', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (Array.isArray(response.data.data)) {
          this.variables = response.data.data;
        } else {
          console.error('La respuesta no contiene un array en la propiedad data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching variables:', error);
      }
    },
    setActiveTab(index) {
      this.activeTab = index;
      this.currentFormula = '';
      this.inputValue = '';
      this.result = null;
      this.selectedVariable = {};
    },
    showAddPriceForm() {
      this.setActiveTab('new');
    },
    async addNewPrice() {
      if (this.newPriceName.trim() === '') {
        Swal.fire('Error', 'El nombre del nuevo precio no puede estar vacío.', 'error');
        return;
      }
      this.isLoading = true;
      try {
        const token = VueCookies.get('jwt');
        const newPrice = {
          name: this.newPriceName,
          state: true
        };
        await axios.post('https://api.teamcomunicaciones.com.co/api/v1.0/prices', newPrice, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        await this.fetchPrices();
        this.newPriceName = '';
        this.setActiveTab(0);
      } catch (error) {
        console.error('Error adding new price:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async deletePrice(id) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esto',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        customClass: {
          confirmButton: 'btn-confirm',
          cancelButton: 'btn-cancel'
        },
        buttonsStyling: false
      });

      if (result.isConfirmed) {
        this.isLoading = true;
        try {
          const token = VueCookies.get('jwt');
          await axios.delete(`https://api.teamcomunicaciones.com.co/api/v1.0/prices/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          await this.fetchPrices();
          Swal.fire('Eliminado', 'El precio ha sido eliminado.', 'success');
        } catch (error) {
          console.error('Error deleting price:', error);
          Swal.fire('Error', 'Hubo un problema al eliminar el precio.', 'error');
        } finally {
          this.isLoading = false;
        }
      }
    },
    appendValue(value) {
      const operators = [];
      const lastChar = this.inputValue.trim().slice(-1);

      if (operators.includes(value)) {
        if (this.canAddOperator()) {
          this.inputValue += ' ' + value;
        } else {
          Swal.fire('Error', 'No se puede agregar un operador después de otro operador.', 'error');
        }
      } else {
        this.inputValue += ' ' + value;
      }
    },
    appendManualValue() {
      this.inputValue += ' ' + this.manualValue;
      this.manualValue = '';
    },
    validateManualValue() {
      this.manualValue = this.manualValue.replace(/[^0-9.]/g, '');
    },
    deleteLastValue() {
      let formula = this.inputValue.trim();
      if (formula === '') return;
      let tokens = formula.split(' ');
      tokens.pop();
      this.inputValue = tokens.join(' ');
    },
    async calculateResult() {
      try {
        const data = {
          'price': this.prices[this.activeTab],
          'funtion': this.inputValue,
          'dic': {
            'Valor': this.fixedVariables.Valor,
            'Descuento': this.fixedVariables.Descuento,
            'Costo': this.fixedVariables.Costo
          }
        };
        const path = backendRouter.data + 'prueba-formula';
        const result = await axios.post(path, data);
        if (!isNaN(Number(result.data.data))) {
          this.result = result.data.data;
        } else {
          this.result = null;
        }
      } catch (error) {
        console.error('Error evaluating formula:', error);
        Swal.fire('Error', 'Expresión inválida.', 'error');
        this.result = null;
      }
    },
    async saveFormula(priceId, priceName) {
      if (this.result === null || isNaN(this.result)) {
        Swal.fire('Error', 'El resultado no es válido.', 'error');
        return;
      }
      try {
        const token = VueCookies.get('jwt');
        const newFormula = {
          name: priceName,
          price: priceId,
          formula: this.currentFormula
        };

        const response = await axios.post('https://api.teamcomunicaciones.com.co/api/v1.0/formulas', newFormula, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const formulaId = response.data.data.id;
        this.formulas[priceName] = {
          id: formulaId,
          formula: this.currentFormula
        };

        Swal.fire('Guardado', 'La fórmula ha sido guardada exitosamente.', 'success');
        await this.fetchFormulas();
        this.currentFormula = '';
      } catch (error) {
        console.error('Error saving formula:', error);
        Swal.fire('Error', 'Hubo un problema al guardar la fórmula.', 'error');
      }
    },
    async updateFormula(priceId, priceName) {
      if (this.result === null || isNaN(this.result)) {
        Swal.fire('Error', 'El resultado no es válido.', 'error');
        return;
      }
      try {
        const token = VueCookies.get('jwt');
        const formulaId = this.formulas[priceName].id;
        const updatedFormula = {
          name: priceName,
          price: priceId,
          formula: this.currentFormula
        };
        const path = backendRouter.data + `formulas/${formulaId}`;
        await axios.put(path, updatedFormula, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        Swal.fire('Actualizado', 'La fórmula ha sido actualizada exitosamente.', 'success');
        await this.fetchFormulas();
        this.currentFormula = '';
      } catch (error) {
        console.error('Error updating formula:', error);
        Swal.fire('Error', 'Hubo un problema al actualizar la fórmula.', 'error');
      }
    },
    showAddVariableModal() {
      this.newVariableName = '';
      this.newVariableFormula = '';
      this.newVariableManualValue = '';
      this.newVariableType = '';
      const modal = new bootstrap.Modal(document.getElementById('addVariableModal'));
      modal.show();
    },
    editVariable(variable) {
      this.newVariableName = variable.name;
      this.newVariableFormula = variable.formula;
      this.newVariableType = variable.formula.includes('if') ? 'Condición' : 'Variable';
      if (this.newVariableType === 'Condición') {
        const data = this.newVariableFormula.split('(');
        this.conditions = [];
        for (let i = 1; i < data.length; i++) {
          var row = data[i].split(' ');
          this.conditions.push({
            firstValue: row[3],
            operator: row[4],
            secondValue: row[5],
            result: row[1],
            isComboBox: false
          });
        }
      }
      const modal = new bootstrap.Modal(document.getElementById('addVariableModal'));
      modal.show();
    },
    appendVariableValue(value) {
      this.newVariableFormula += ' ' + value;
    },
    appendVariableManualValue() {
      this.newVariableFormula += ' ' + this.newVariableManualValue;
      this.newVariableManualValue = '';
    },
    deleteLastVariableFormulaValue() {
      let formula = this.newVariableFormula.trim();
      if (formula === '') return;
      let tokens = formula.split(' ');
      tokens.pop();
      this.newVariableFormula = tokens.join(' ');
    },
    async saveVariable() {
      if (this.newVariableName.trim() === '' || this.newVariableFormula.trim() === '') {
        Swal.fire('Error', 'El nombre de la variable y la fórmula no pueden estar vacíos.', 'error');
        return;
      }
      try {
        const token = VueCookies.get('jwt');
        const existingVariable = this.variables.find(variable => variable.name === this.newVariableName);

        const variableData = {
          name: this.newVariableName,
          formula: this.newVariableFormula,
          price: this.prices[this.activeTab].id
        };

        if (existingVariable) {
            await axios.put(`https://api.teamcomunicaciones.com.co/api/v1.0/variables/${existingVariable.id}/`, variableData, { // <-- MIRA LA BARRA AÑADIDA AQUÍ
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          Swal.fire('Actualizado', 'La variable ha sido actualizada exitosamente.', 'success');
        } else {
          await axios.post('https://api.teamcomunicaciones.com.co/api/v1.0/variables', variableData, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          Swal.fire('Guardado', 'La variable ha sido guardada exitosamente.', 'success');
        }

        await this.fetchVariables();
        const modal = bootstrap.Modal.getInstance(document.getElementById('addVariableModal'));
        modal.hide();
      } catch (error) {
        console.error('Error saving variable:', error);
        Swal.fire('Error', 'Hubo un problema al guardar la variable.', 'error');
      }
    },
    async updateVariable(variable) {
      try {
        const token = VueCookies.get('jwt');
        const updatedVariable = {
          id: variable.id,
          name: variable.name,
          formula: variable.formula,
          price: variable.price
        };
        await axios.put(`https://api.teamcomunicaciones.com.co/api/v1.0/variables/${variable.id}`, updatedVariable, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        Swal.fire('Actualizado', 'La variable ha sido actualizada exitosamente.', 'success');
        await this.fetchVariables();
        this.selectedVariable = {};
        const modal = bootstrap.Modal.getInstance(document.getElementById('editVariableModal'));
        modal.hide();
      } catch (error) {
        console.error('Error updating variable:', error);
        Swal.fire('Error', 'Hubo un problema al actualizar la variable.', 'error');
      }
    },
    async deleteVariable() {
      const variableToDelete = this.variables.find(variable => variable.formula === this.newVariableFormula);

      if (!variableToDelete) {
        Swal.fire('Error', 'No se encontró una variable con la fórmula especificada.', 'error');
        return;
      }

      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esto',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        customClass: {
          confirmButton: 'btn-confirm',
          cancelButton: 'btn-cancel'
        },
        buttonsStyling: false
      });

      if (result.isConfirmed) {
        this.isLoading = true;
        try {
          const token = VueCookies.get('jwt');
          await axios.delete(`https://api.teamcomunicaciones.com.co/api/v1.0/variables/${variableToDelete.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          await this.fetchVariables();
          Swal.fire('Eliminado', 'La variable ha sido eliminada.', 'success');
          this.selectedVariable = {};
          const modal = bootstrap.Modal.getInstance(document.getElementById('addVariableModal'));
          modal.hide();
        } catch (error) {
          console.error('Error deleting variable:', error);
          Swal.fire('Error', 'Hubo un problema al eliminar la variable.', 'error');
        } finally {
          this.isLoading = false;
        }
      }
    },
    canAddOperator() {
      const lastChar = this.inputValue.slice(-1);
      return !isNaN(lastChar) && lastChar !== '';
    },
    canAddVariableOperator() {
      const lastChar = this.newVariableFormula.slice(-1);
      return !isNaN(lastChar) && lastChar !== '';
    }
  }
};
</script>