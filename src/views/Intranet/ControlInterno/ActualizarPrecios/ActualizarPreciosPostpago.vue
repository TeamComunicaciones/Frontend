<template>
    <div class="container h-100">
        <form >
            <div>
                <SidebarMenu />
                <div class="vld-parent">
                    <loading :active.syn="isLoading" :can-cancel="true"  :is-full-page="fullPage"></loading>
                </div>
                <v-app id="inspire">
                    <v-container v-if="create==true">
                        <h1>{{titulo}}</h1>
                        <div>
                            <label for="name">archivo:</label>
                            <input id="archivoExcel" type="file" @change="subirExcel()">
                            
                        </div>
                        <v-layout column style="height: 90vh">
                            <v-flex md6 style="overflow: auto">
                                <v-data-table v-if="items.length>0" :headers="cabecera" :items="items" class="elevation-1">
                                    <template v-slot:top>
                                        <v-toolbar flat>
                                            <v-toolbar-title>TABLA EXCEl</v-toolbar-title>
                                            <v-divider class="mx-4" inset vertical>
                                            </v-divider>
                                            <v-spacer></v-spacer>
                                            <v-btn color="#E11419" dark class="mb-2" @click=accion_boton >{{titulo_boton}}</v-btn>
                        
                                        </v-toolbar>
                                    </template> 
                                </v-data-table>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <v-container v-if="create==false">
                        <div class="form-group">
                            <label for="exampleInputEmail1">Producto</label>
                            <input type="text" class="form-control" id="product" aria-describedby="emailHelp" placeholder="Nombre circular" readonly v-model.trim="form.product">
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Traduccion</label>
                            <input type="text" class="form-control" id="translate" placeholder="Nombre Stok" v-model.trim="form.stok">
                        </div>
                        <div class="form-check">
                            <label><input type="checkbox" class="form-check-input" id="IVA"> IVA</label>
                        </div>
                        <div class="form-check">
                            <label><input type="checkbox" class="form-check-input" id="ACTIVO"> ACTIVO</label>
                        </div>
                        <v-btn color="#E11419" dark class="mb-2" @click=crearTranslate >CREAR</v-btn>
                        <v-btn color="#E11419" dark class="mb-2" @click=omitirTranslate >OMITIR</v-btn>
                    </v-container>
                </v-app>
            </div>
        </form>
        
    </div>
  
    </template>

    <script>
    import axios from 'axios'
    import readXlsFile from 'read-excel-file'
    import exportFromJSON from 'export-from-json'
    import backendRouter from  '../BackendRouter/BackendRouter'
    import router from '../../router'
    import SidebarMenu from '../SidebarMenu/SidebarMenu.vue'
    import Loading from 'vue-loading-overlay';
    import 'vue-loading-overlay/dist/vue-loading.css';
    
    export default{
        data(){
            return{
                create: true,
                cont: 0,
                titulo: "Precios Equipos Nuevos Postpago",
                items:[],
                cabecera:[],
                titulo_boton: 'TRADUCIR' ,
                accion_boton: this.traducir,
                iva: true,
                form:{
                    product:'',
                    stok:'',
                    iva:'',
                    active:'',
                },
                isLoading: false,
                fullPage: true
                
            }
        },
        methods:{
            validate(){
                const path = backendRouter.data+'user-validate'
                axios.post(path, {'jwt':this.$cookies.get('jwt')}).then((response)=>{
                    console.log('check')
                })
                .catch((error)=>{
                    router.push('/login')
                    this.$swal(error.response.data.detail)
                    
                })
            },
            subirExcel(){
                this.cabecera=[
                    {text:'Equipo', value:'0'},
                    {text:'costo', value:'1'},
                    {text:'0 a 5 meses', value:'2'},
                    {text:'6 a 23 meses', value:'3'},
                    {text:'mayor a 24 meses', value:'4'},
                ]
                const input = document.getElementById("archivoExcel");
                readXlsFile(input.files[0]).then((rows) =>{
                    this.items = rows
                })
            },
            traducir(){
                this.titulo_boton = 'paso2'
                this.accion_boton = this.descargarExcel
                const tempData = this.items
                this.items = []
                this.isLoading = true
                this.cabecera=[
                            {text:'Producto', value:'0'},
                            {text:'Costo Actual', value:'1'},
                            {text:'Precio Publico Sin Iva', value:'2'},
                            {text:'Subdistribuidor Sin Iva', value:'3'},
                            {text:'Free Mobile Store', value:'4'},
                            {text:'Cliente 0 A 5 Meses Sin Iva', value:'5'},
                            {text:'Cliente 6 A 23 Meses Sin Iva', value:'6'},
                            {text:'Cliente Mayor A 24 Meses Sin Iva', value:'7'},
                            {text:'Cliente Descuento Kit Prepago Sin Iva', value:'8'},
                            {text:'Distritados Sin Iva', value:'9'},
                            {text:'Premium Sin Iva', value:'10'},
                            {text:'Tramitar Sin Iva', value:'11'},
                            {text:'People Sin Iva', value:'12'},
                            {text:'Cooservunal Sin Iva', value:'13'},
                            {text:'Fintech Oficinas Team Sin Iva', value:'14'},
                            {text:'Fintech Zonificacion Sin Iva', value:'15'},
                            {text:'Oficina Movil Sin Iva', value:'16'},
                            {text:'Eliana Rodas', value:'17'},
            
                        ]
                const path = backendRouter.data+'translateProductsPostpago/translate'
                axios.post(path, tempData).then((responser)=>{
                    this.create = responser.data.validate
                    this.items = responser.data.data
                    this.isLoading = false
                    if (this.create == false){
                        this.form.product= this.items[this.cont][0]
                         
                        
                    }
                })
           
          
                
                
            },
            crearTranslate(){
                var checkboxIva = document.getElementById("IVA")
                var checkboxActive = document.getElementById("ACTIVO")
                if (checkboxIva.checked == true){
                    this.form.iva = "1"
                }else{
                    this.form.iva = "0"
                }
                if (checkboxActive.checked == true){
                    this.form.active = "1"
                }else{
                    this.form.active = "0"
                }
                this.form.product = this.items[this.cont][0]

                const data = {
                    'equipo': this.items[this.cont][0],
                    'stok': this.form.stok,
                    'iva' : this.form.iva,
                    'active' : this.form.active
                }

                const path = backendRouter.data+'translateProductsPostpago/admin'
                console.log(data)
                axios.post(path, data).then((responser)=>{
                    this.cont++
                    this.form.product= this.items[this.cont][0]
                    this.form.stok=''
                    checkboxIva.checked = false
                    checkboxActive.checked = false
                    if (this.cont == this.items.length){
                        this.create= true
                        this.cont = 0
                        this.items = []
                        this.titulo_boton = 'TRADUCIR'
                        this.accion_boton = this.traducir
                        this.cabecera=[
                        {text:'Equipo', value:'0'},
                        {text:'costo', value:'1'},
                        {text:'0 a 5 meses', value:'2'},
                        {text:'6 a 23 meses', value:'3'},
                        {text:'mayor a 24 meses', value:'4'},
                        ]
                    }else{
                        this.form.product= this.items[this.cont][0]
                        this.form.stok=''
                    }
                })
                .catch((error)=>{
                    this.$swal(error.response.data.detail)
                })
            },
            omitirTranslate(){
                this.cont++
                
                if (this.cont == this.items.length){
                        this.create= true
                        this.cont = 0
                        this.items = []
                        this.titulo_boton = 'TRADUCIR'
                        this.accion_boton = this.traducir
                        this.cabecera=[
                            {text:'Equipo', value:'0'},
                            {text:'con IVA', value:'1'},
                            {text:'Descuento', value:'2'},
                            {text:'-IVA +Descuento', value:'3'},
                            {text:'Total', value:'4'},
                            {text:'Descuento agente', value:'5'},
                            {text:'Precio - IVA', value:'6'},
                            {text:'Precio + IVA', value:'7'},
            
                        ]
                }else{
                    this.form.product= this.items[this.cont][0]
                    this.form.stok=''
                }
            },
            descargarExcel(){
                
                const data = this.items;
                const fileName = 'download';
                const exportType = exportFromJSON.types.xls
                exportFromJSON({data, fileName, exportType})
            }
        },
        created(){
            // this.validate()
            
        },
        components: {
            SidebarMenu,
            Loading
        },
    }
    
    </script>
    
    <style>
    
    </style>