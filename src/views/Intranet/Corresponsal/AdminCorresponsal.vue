<template>
    <div class="container-fluid">
      <SidebarMenu :titulo="tituloMenu" />
  
      <div class="vld-parent">
        <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>
      </div>
  
      <div class="table-wrapper m-3 p-4 bg-white shadow-sm rounded">
        <table class="table">
          <thead class="table-light">
            <tr>
              <th>Sucursal</th>
              <th>Encargado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in sucursales" :key="row.id">
              <td>{{ row }}</td>
              <td>
                <BFormSelect
                  style="max-width: 500px;"
                  :options="users_options"
                  v-model="assignedResponsables[row]"
                  @change="(event) => selectSucursal(row, event)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
<script>
    import SidebarMenu from '@/components/Intranet/SidebarMenu/SidebarMenu.vue'
    import Loading from 'vue-loading-overlay';
    import backendRouter from  '@/components/BackendRouter/BackendRouter'
    import axios from 'axios';
    export default{
        data(){
            return{
                tituloMenu: 'Asignar Corresponsal',
                sucursales: [],
                assignedResponsables: {},
                users: [],
                users_options: [],
                fullPage: true,
                isLoading: false,
            }
        },
        methods:{
            selectSucursal(sucursal, encargado){
                this.isLoading = true
                console.log(sucursal, encargado.target.value)
                const path = backendRouter.data+'assign-responsible'
                const data = {
                    'sucursal': sucursal,
                    'encargado': encargado.target.value
                }
                axios.post(path, data)
                this.isLoading = false
            },
            getData(){
                this.isLoading = true
                const path = backendRouter.data+'encargados-corresponsal'
                const data = {
                    'data': ''
                }
                axios.post(path, data).then((response)=>{
                    console.log(response.data)
                    this.sucursales = response.data.sucursales
                    this.users = response.data.users
                    this.users_options = response.data.users_options
                    this.assignedResponsables = response.data.responsables
                    this.isLoading = false
                }).catch((error)=>{
                    
                    this.isLoading = false
                })
            },
            descargar(){         
                const data = this.items;
                const fileName = 'download.xlsx';
                const workbook = XLSX.utils.book_new();
                const worksheet = XLSX.utils.json_to_sheet(data)
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
                XLSX.writeFile(workbook, fileName)
            },
        },
        components:{
            SidebarMenu,
            Loading,
        },
        created(){
            this.getData()
        },
    }
</script>
<style lang="scss" scoped>
@use './style.scss' as *;
</style>
