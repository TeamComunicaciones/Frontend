import { createRouter, createWebHistory } from 'vue-router'

// Rutas Pagina Main
import PublicPage from '@/views/MainPage/PublicPage/PublicPage.vue'
import AsiSomos from '@/views/MainPage/AsiSomos/AsiSomos.vue'
import Tienda from '@/views/MainPage/Tienda/Tienda.vue'
import Contactanos from '@/views/MainPage/Contactanos/Contactanos.vue'
import Login from '@/views/MainPage/Login/Login.vue'

// Rutas Intranet
import Home from '@/views/Intranet/Home/Home.vue'
import Permisos from '@/views/Intranet/SuperAdmin/Permisos/Permisos.vue'
import Informes from '@/views/Intranet/Informes/Informes.vue'
import ActualizarPrecios from '@/views/Intranet/ControlInterno/ActualizarPrecios/ActualizarPrecios.vue'
import AdministrarTraducciones from '@/views/Intranet/ControlInterno/ActualizarPrecios/AdministrarTraducciones.vue'
import ListaPreciosFormulas from '@/views/Intranet/ControlInterno/ActualizarPrecios/ListaPreciosFormulas.vue'
import Comisiones from '@/views/Intranet/Comisiones/Comisiones.vue'
import Liquidador from '@/views/Intranet/Comisiones/LiquidadorComisiones.vue'
import ListaPreciosPrepago from '@/views/Intranet/Comercial/ListaPrecios/ListaPreciosPrepago.vue'
import CargarDatosCorresponsal from '@/views/Intranet/Corresponsal/CargarDatosCorresponsal.vue'
import InformeAdminCorresponsal from '@/views/Intranet/Corresponsal/InformeAdmin.vue'
import AdminCorresponsal from '@/views/Intranet/Corresponsal/AdminCorresponsal.vue'
import Cuadre from '@/views/Intranet/Cajero/Caja/Cuadre.vue'
import CrearUsuarios from '@/views/Intranet/Administrador/CrearUsuarios.vue'
import ListaNegra from '@/views/Intranet/ControlInterno/ActualizarPrecios/ListaNegra.vue';
import PoliticasPrivacidad from '@/views/MainPage/Documentation/PrivacyPolicy.vue'; 
import TratamientoDatos from '@/views/MainPage/Documentation/DataTreatment.vue';
import ActaForm from '@/views/Intranet/Informes/ActaForm.vue';
import ActasList from '@/views/Intranet/Informes/ActasList.vue';
import patchNotes from '@/views/Intranet/Informes/patchNotes.vue';
import UploadImage from '@/views/Intranet/Administrador/UploadImage.vue';
import Tesoreria from '@/views/Intranet/Corresponsal/Tesoreria.vue'




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rutas Main Page
     {
    path: '/tesoreria',
    name: 'Tesoreria',
    component: Tesoreria
     },
    {
      path: '/',
      name: 'Landing',
      component: PublicPage
    },
    {
      path: '/politicas-privacidad',
      name: 'Politica de Privacidad',
      component: PoliticasPrivacidad
    },
    {
      path: '/tratamiento-datos',
      name: 'Tratamiento de datos',
      component: TratamientoDatos
    },
    {
      path: '/asi-somos',
      name: 'Así somos',
      component: AsiSomos
    },
    {
      path: '/tienda',
      name: 'Tienda',
      component: Tienda
    },
    {
      path: '/contactanos',
      name: 'Contactanos',
      component: Contactanos
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    //Rutas Intranet
    {
      path: '/lista-negra',
      name: 'ListaNegra',
      component: ListaNegra
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,  
    },
    {
      path: '/permisos',
      name: 'permisos',
      component: Permisos,
    },
    {
      path: '/informes',
      name: 'Informes',
      component: Informes
    },
    {
      path: '/actualizar-equipos-prepagos',
      name: 'Actualizar equipos prepago',
      component: ActualizarPrecios
    },
    {
      path: '/administrar-traducciones',
      name: 'Administrar traducciones',
      component: AdministrarTraducciones
    },
    {
      path: '/formulas-prepago',
      name: 'Formulas prepagos',
      component: ListaPreciosFormulas
    },
    {
      path: '/comisiones',
      name: 'Comisiones',
      component: Comisiones
    },
    {
      path: '/liquidador-comisiones',
      name: 'Liquidador',
      component: Liquidador
    },
    {
      path: '/lista-precios-prepago',
      name: 'Lista precios prepago',
      component: ListaPreciosPrepago
    },
    {
      path: '/cargar-datos-corresponsal',
      name: 'Cargar datos corresponsal',
      component: CargarDatosCorresponsal
    },
    {
      path: '/informe-admin-corresponsal',
      name: 'Informe corresponsal',
      component: InformeAdminCorresponsal
    },
    {
      path: '/admin-corresponsal',
      name: 'Admin corresponsal',
      component: AdminCorresponsal
    },
    {
      path: '/cuadre-caja',
      name: 'Cuadre caja',
      component: Cuadre
    },
    {
      path: '/usuarios',
      name: 'Crear usuarios',
      component: CrearUsuarios
    },
     {
      path: '/subir-imagen',
      name: 'Subir imagen',
      component: UploadImage
    },
    { path: '/actas', component: ActasList },
    { path: '/actas/nueva', component: ActaForm },
    { path: '/actas/:id/editar', component: ActaForm },   
    { path: '/patch-notes', component: patchNotes }  

  ],
})

export default router
