<template>
    <div>
        <div>
            <!-- BOTÓN MENÚ MÓVIL (SIDEBAR) - AHORA ACTIVO -->
            <BButton v-b-toggle.sidebar-no-header class="menuButton d-md-none d-flex" variant="danger">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg>
            </BButton>

            <!-- CONTENIDO DEL SIDEBAR -->
            <BSidebar id="sidebar-no-header" aria-labelledby="sidebar-no-header-title" no-header shadow>
                <template #default="{ hide }">
                <div class="p-3">
                    <h4 id="sidebar-no-header-title">MENÚ</h4>
                    <nav class="mb-3">
                    <BNav vertical>
                        <ul class="menu">
                            <br><br>
                            <li><a class="links" href="/">Inicio</a></li>
                            <li><a class="links" href="/asi-somos">Así somos</a></li>
                            <li><a class="links" href="/tienda">Tienda</a></li>
                            <li><a class="links" href="/contactanos">Contáctanos</a></li>
                            
                            <!-- Botones para móvil -->
                            <li class="mt-4"><BButton variant="outline-danger" class="w-100" to="/consulta-pdv">Consulta PDV</BButton></li>
                            <li><BButton variant="danger" class="w-100 mt-2" to="/login">Inicio de Sesión</BButton></li>
                        </ul>
                    </BNav>
                    </nav>
                    <BButton variant="danger" class="closeMenu" block @click="hide">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </BButton>
                </div>
                </template>
            </BSidebar>
        </div>
      <div id="contactos_container" class="card">
            <div  class="row ">
                <!-- ICONOS CORREGIDOS -->
                <p class="col-3 contactos"> <i class="bi bi-telephone-fill"></i> (4) 6046679</p>
                <p class="col-6 contactos"> <i class="bi bi-envelope-fill"></i> info@teamcomunicaciones.com</p>
                <p class="col-1">
                    <a class="contactos" target="_blank" href="https://www.facebook.com/profile.php?id=100063664486789">
                        <i class="bi bi-facebook"></i>
                    </a>
                </p>
                <p class="col-1">
                    <a class="contactos" target="_blank" href="https://www.instagram.com/teamcomunicacionesclaro/?hl=es-la">
                        <i class="bi bi-instagram"></i>
                    </a>
                </p>
                <p class="col-1">
                    <a class="contactos" target="_blank" href="https://www.youtube.com/channel/UCMSAXcm2b4alOnpw_AzUC1g">
                        <i class="bi bi-youtube"></i>
                    </a>
                </p>
            </div>
        </div>
        <div id="logo_menu" class="row pb-3 align-items-center">
            <a class="col-12 col-md-3" href="/"><img class="img-fluid" :src="getImageUrl('logo.png')" alt="logo"/></a>
            
            <!-- Menú de navegación para escritorio - SE HAN QUITADO LAS CLASES DE OCULTAMIENTO -->
            <nav class="col-md-9 d-flex justify-content-end align-items-center flex-wrap">
                <a class="links" href="/">Inicio</a>
                <a class="links" href="/asi-somos">Así somos</a>
                <a class="links" href="/tienda">Tienda</a>
                <a class="links" href="/contactanos">Contáctanos</a>
                
                <div class="button-group">
                    <BButton to="/consulta-pdv" variant="outline-danger" class="btn-custom">Consulta PDV</BButton>
                    <BButton to="/login" variant="danger" class="btn-custom">Inicio de Sesión</BButton>
                </div>
            </nav>
        </div>
    </div>
</template>

<script>
 // No es necesario importar los componentes de B-V-N si están registrados globalmente en main.js
  export default{
    data() {
        return {
            menuServicios: false,
            logo:'',
        };
    },
    name: 'LandingMenu',
    methods: {
        menuServ() {
            this.menuServicios = !this.menuServicios;
        },
    },
    setup(){
        const getImageUrl = (name) => {
            return new URL(`../../../assets/${name}`, import.meta.url).href
        }
        return {getImageUrl }
    },
    // No es necesario el bloque 'components' si están registrados globalmente
}
</script>

<style scoped>
  .contactos{
        color: gray;
        text-decoration: none;
        font-size: 12px;
    }
  .links{
    text-decoration: none;
    color: black;
    font-size: 14px;
    font-weight: 500;
    padding: 8px 16px;
    transition: color 0.3s ease;
  }
  .links:hover {
    color: #E11419;
  }
  .menu-servicio-on{
    display: block;
  }
  .menu-servicio-off{
    display: none;
  }
  .centrar{
    display: flex; 
    flex-direction: column; 
    align-items: center;
    justify-content: end;
  }

.menuButton{
    position: absolute;
    top: 80px;
    left: 20px;
    z-index: 999;
}

.menu{
    list-style: none;
    padding-left: 0; 
}

.menu li {
    margin-bottom: 1rem;
}

.submenu{
  list-style: none;
}

.submenu a{
    font-size: 15px;
    color: black;
    text-decoration: none;
}

.closeMenu{
    position: absolute;
    bottom: 20px;
    right: 20px;
}

/* Estilos para los nuevos botones */
.button-group {
    margin-left: 24px;
    display: flex;
    gap: 12px;
}

.btn-custom {
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.3s ease;
    white-space: nowrap;
}

/* Ajustes para BButton */
.btn-danger {
  background-color: #E11419 !important;
  border-color: #E11419 !important;
}

.btn-outline-danger {
    color: #E11419 !important;
    border-color: #E11419 !important;
}

.btn-outline-danger:hover {
    color: #fff !important;
    background-color: #E11419 !important;
    border-color: #E11419 !important;
}
  
</style>

