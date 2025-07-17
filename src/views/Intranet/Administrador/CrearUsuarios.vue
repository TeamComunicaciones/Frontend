<template>
    <div>
        <div class="table-wrapper m-3 p-3">
            <BButton variant="danger" class="" @click="showCreateUserModal = true" >Crear Usuario</BButton>
            <table>
            <thead>
                <tr>
                <th>Documento</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Contraseña</th>
                <th>Activo</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                <td>{{ user.document }}</td>
                <td>{{ user.firstName }}</td>
                <td>{{ user.lastName }}</td>
                <td>
                    <BButton variant="danger" class="" @click="resetPassword(user)" >Reset clave</BButton>
                </td>
                <td>
                    <BButton v-if="!user.active" variant="danger" class="" @click="activate(user, true)" >Activar</BButton>
                    <BButton v-if="user.active" variant="danger" class="" @click="activate(user, false)" >Desactivar</BButton>
                </td>
                </tr>
            </tbody>
            </table>

            <div v-if="showCreateUserModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="showCreateUserModal = false">&times;</span>
                <h2>Crear Usuario</h2>
                <form @submit.prevent="createUser">
                <label for="document">Documento:</label>
                <input type="text" v-model="newUser.document" required>

                <label for="firstName">Nombre:</label>
                <input type="text" v-model="newUser.firstName" required>

                <label for="lastName">Apellido:</label>
                <input type="text" v-model="newUser.lastName" required>

                <label for="email">Email:</label>
                <input type="email" v-model="newUser.email" required>

                <BButton type="submit" variant="danger" class="" >Crear</BButton>
                </form>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import backendRouter from  '@/components/BackendRouter/BackendRouter'
    import Loading from 'vue-loading-overlay';
    import { BContainer } from 'bootstrap-vue-next'
    
    export default{
        data(){
            return{
                tituloMenu: "Usuarios",
                isLoading: false,
                fullPage: true,
                users: [],
                showCreateUserModal: false,
                newUser: {
                    document: '',
                    firstName: '',
                    lastName: '',
                    email: ''
                }   
            }
        },
        methods:{
            resetPassword(userId) {
                const data = {
                    type: 'reset',
                    user: userId
                }
                const path = backendRouter.data+'lista-usuarios'
                axios.post(path, data).then((response)=>{
                    this.$swal('clave reiniciada')
                })
                .catch((error)=>{
                    this.$swal(error.response.data.detail)
                })
            },
            activate(userId, activo) {
                const data = {
                    type: 'activate',
                    user: userId
                }
                const path = backendRouter.data+'lista-usuarios'
                axios.post(path, data).then((response)=>{
                    this.validate()
                    if (activo){
                        this.$swal('Usuario activado con exito')
                    }else{
                        this.$swal('Usuario desactivado con exito')
                    }
                })
                .catch((error)=>{
                    this.$swal(error.response.data.detail)
                })
            },
            createUser() {
            const path = backendRouter.data+'lista-usuarios'
                axios.put(path, this.newUser).then((response)=>{
                    this.validate()
                    this.showCreateUserModal = false
                    this.$swal('Usuario creado con exito')
                })
                .catch((error)=>{
                    this.$swal(error.response.data.detail)
                })
            },

            validate(){
                const path = backendRouter.data+'lista-usuarios'
                axios.get(path).then((response)=>{
                    this.users = response.data
                })
                .catch((error)=>{
                    this.$swal(error.response.data.detail)
                })
            },
        },
        created(){  
            this.validate()
        },
        components: {
            Loading,
        },
    }
    </script>

<style scoped>
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}
.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}
.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
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

