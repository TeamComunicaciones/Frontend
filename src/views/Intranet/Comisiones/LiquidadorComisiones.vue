<template>
    <div>
        <SidebarMenu :titulo="tituloMenu"/>
        <div class="vld-parent">
            <loading :active.syn="isLoading" :can-cancel="true"  :is-full-page="fullPage"></loading>
        </div>
        <div v-if="create==true" class="table-wrapper m-3 p-3">
            <div style="margin-top: 30px;">
                <input class="" id="archivoExcel" type="file" @change="subirExcel()">
                
            </div>
            <div style="height: 20px;"></div>
            <div>
                <BButton variant="danger" v-if="items.length > 0" color="#E11419" dark class="mb-2" @click=accion_boton >{{titulo_boton}}</BButton>
            </div>
            <table>
                <thead>
                    <tr>
                        <th v-for="j in titulos">{{ j }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in items">
                        <td v-for="j in row">{{ j }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
    </div>
</template>
  
<script>
    import axios from 'axios'
    import SidebarMenu from '@/components/Intranet/SidebarMenu/SidebarMenu.vue'
    import backendRouter from '@/components/BackendRouter/BackendRouter';
    import Loading from 'vue-loading-overlay';
    import readXlsFile from 'read-excel-file';
    import * as XLSX from 'xlsx';
    export default{
        data(){
            return{
                tituloMenu: 'Liquidar comisiones',
                create: true,
                excel: [],
                cont: 0,
                titulo: "Liquidador Comisiones",
                items:[],
                cabecera:[],
                
                titulo_boton: 'CALCULAR COMISION' ,
                accion_boton: this.calcular,
                isLoading: false,
                fullPage: true,
            }
        },
        components:{
            SidebarMenu,
            Loading,
        },
        methods:{
            descargar(){         
                const data = this.items;
                const fileName = 'download.xlsx';
                const workbook = XLSX.utils.book_new();
                const worksheet = XLSX.utils.json_to_sheet(data)
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
                XLSX.writeFile(workbook, fileName)
            },
            calcular(){
                this.isLoading = true
                const path = backendRouter.data + 'calcular-comisiones'
                axios.post(path, {data: this.items}).then((response)=>{
                    this.$swal('Calculos realizados con exito')
                    this.isLoading = false
                    this.items = response.data.data
                    for (let titulo in response.data.agregados){
                        this.cabecera.push({ text: response.data.agregados[titulo], value: response.data.agregados[titulo] })
                    }
                })
                this.titulo_boton = 'EXCEL'
                this.accion_boton = this.descargar
            },
            subirExcel(){
                const input = document.getElementById("archivoExcel");
                readXlsFile(input.files[0]).then((rows) =>{
                    const titulos = rows[0];
                    const datos = rows.slice(1);

                    function getUniqueKey(titulo, index, titulos) {
                        let uniqueTitulo = titulo;
                        let counter = 2;
                        while (titulos.slice(0, index).includes(uniqueTitulo)) {
                            uniqueTitulo = `${titulo}${counter}`;
                            counter++;
                        }

                        return uniqueTitulo;
                    }

                    const cabecera = titulos.map((titulo, index) => {
                        const clave = getUniqueKey(titulo, index, titulos);
                        return { text: titulo, value: clave };
                    });

                    
                    this.cabecera = cabecera

                    const listaDiccionarios = datos.map(fila => {
                        const diccionario = {};
                        
                        titulos.forEach((titulo, indice) => {
                            const clave = getUniqueKey(titulo, indice, titulos);
                            diccionario[clave] = fila[indice];
                        });
                        
                        return diccionario;
                    });
                    
                    this.items = listaDiccionarios;
                    console.log('lista datos',this.items)
                })
            },
        }
    }
</script>
  
<style scoped>
    .table-wrapper {
        width: 90%;
        overflow-x: auto;
        height: 500px;
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