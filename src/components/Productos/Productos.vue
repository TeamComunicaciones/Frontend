<template>
    <div class="textos">
        <SidebarMenu/>
        <div class="vld-parent">
            <loading :active.syn="isLoading" :can-cancel="true"  :is-full-page="fullPage"></loading>
        </div>
        <h1 > Productos</h1>
        <div>
            <b-card title="Formulario" class="formulario-card">
                <b-form>
                    <b-form-group label="Archivo">
                    <input type="file" ref="fileInput" @change="handleFileChange">
                    </b-form-group>

                    <b-form-group label="Título">
                    <b-input type="text" v-model="formulario.titulo" required class="form-control"></b-input>
                    </b-form-group>

                    <b-form-group label="Detalle">
                    <b-textarea v-model="formulario.detalle" required class="form-control"></b-textarea>
                    </b-form-group>

                    <b-form-group label="Valor">
                    <b-input type="number" v-model="formulario.valor" required class="form-control"></b-input>
                    </b-form-group>

                    <b-button variant="danger" @click="subirImagen">Subir Imagen</b-button>
                </b-form>
            </b-card>
        </div>
        <div class="row m-4">
            <div v-for="plan in planes" :key="plan.id" class="col-6">
                <div class="card">
                    <div class="row">
                        <img class="col-4" v-bind:src="plan.img" style="width: 200px; height: 200px;"/>
                        <div class="col-6 row">
                            <h2> {{ plan.titulo }}</h2>
                            <h3> {{ plan.detalle }}</h3>
                            <h4> {{ formatoMoneda(plan.precio)}}</h4>
                        </div>
                        <div class="col-1">
                            <button @click="editar(plan.id)">
                                <BIconPencilSquare/>
                            </button>  
                            <button @click="deleteImage(plan.id)">
                                <BIconTrash/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import SidebarMenu from '../SidebarMenu/SidebarMenu.vue'
    import backendRouter from '../BackendRouter/BackendRouter';
    import Loading from 'vue-loading-overlay';
    import axios from 'axios';
    import { 
        BIconPencilSquare,
        BIconTrash,
    } from 'bootstrap-vue'
    export default{
        data(){
            return{
                formulario: {
                    titulo: null,
                    detalle: null,
                    valor: null,
                },
                imagen: null,
                isLoading: true,
                fullPage: true,
                planes: [],
            }
        },
        methods: {
            formatoMoneda(valor) {
                const resultado = parseFloat(valor).toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                })
                return resultado
            },
            getProductos(){
                const path = backendRouter.data+'productos'
                axios.get(path).then((response)=>{
                    
                    response.data.data.map(plan =>{
                        
                        plan.img = require(`@/assets/productos/${plan.img}`)
                        this.planes.push({id:plan.id, img:plan.img, titulo:plan.titulo, detalle:plan.detalle, precio:plan.precio}) 
                    })
                    this.isLoading = false
                })
            },
            editar(id){
                console.log(id)
            },
            deleteImage(id){
                this.isLoading = true
                const path = backendRouter.data+'deleteImagen'
                axios.post(path, {'id': id, 'carpeta': 'productos'})
                this.getProductos()
            },
            handleFileChange() {
                this.imagen = this.$refs.fileInput.files[0];
                console.log(this.imagen)
            },
            subirImagen(){
                this.isLoading = true
                const path = backendRouter.data+'guardarImagen'
                console.log('subiendo imagen')
                const formData = new FormData();
                formData.append('imagen', this.imagen);
                formData.append('carpeta', 'productos')
                formData.append('titulo', this.formulario.titulo)
                formData.append('detalle', this.formulario.detalle)
                formData.append('valor', this.formulario.valor)
                axios.post(path, formData)
                this.getProductos()
            },
            
        },
        created(){
            this.getProductos()
        },
        components: {
            SidebarMenu,
            Loading,
            BIconPencilSquare,
            BIconTrash,
        },
    }
</script>

<style scoped>
    .textos{
        color: black; 
        text-align: center;
    }
    .red{
        background-color: red;
    }
</style>
  