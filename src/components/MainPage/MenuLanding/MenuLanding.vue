<template>
    <div>
        <div>
            <!-- <BButton v-b-toggle.sidebar-no-header class="menuButton d-md-none d-flex" variant="danger"> 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg></BButton> -->
            <!-- <b-sidebar id="sidebar-no-header" aria-labelledby="sidebar-no-header-title" no-header shadow>
                <template #default="{ hide }">
                <div class="p-3">
                    <h4 id="sidebar-no-header-title">MENU</h4>
                    <nav class="mb-3">
                    <b-nav vertical>
                        <ul class="menu">
                            <br><br>
                            <li><a class="col-2 links" href="/">Inicio</a></li>
                            <li ><a class="col-2 links" href="/asi-somos">Así somos</a></li>
                            <li ><a class="col-1 links" href="/tienda">Tienda</a></li>
                            <li ><a class="col-2 links" href="/contactanos">Contáctanos</a></li>
                            
                        </ul>
                    </b-nav>
                    </nav>
                    <b-button variant="danger" class="closeMenu" block @click="hide">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </b-button>
                </div>
                </template>
            </b-sidebar> -->
        </div>
      <div id="contactos_container" class="card">
            <div  class="row ">
                <p class="col-3 contactos"> <IBiTelephone />(4) 6046679</p>
                <p class="col-6 contactos"> <IBiEnvelope /> info@teamcomunicaciones.com</p>
                <p class="col-1">
                    <a class="contactos" target="_blank" href="https://www.facebook.com/profile.php?id=100063664486789">
                        <IBiFacebook />
                    </a>
                </p>
                <p class="col-1">
                    <a class="contactos" target="_blank" href="https://www.instagram.com/teamcomunicacionesclaro/?hl=es-la">
                        <IBiInstagram />
                    </a>
                </p>
                <p class="col-1">
                    <a class="contactos" target="_blank" href="https://www.youtube.com/channel/UCMSAXcm2b4alOnpw_AzUC1g">
                        <IBiYoutube/>
                    </a>
                </p>
            </div>
        </div>
        <div id="logo_menu" class="row pb-3">
            
            <a class="col-12 col-md-3" href="/"><img class="img-fluid" :src="getImageUrl('logo.png')" alt="logo"/></a>
            <div class="row col-9 d-md-flex d-flex" style="justify-content: flex-end;">
                <a class="col-2 links" href="/">Inicio</a>
                <a class="col-2 links" href="/asi-somos">Así somos</a>
                <a class="col-1 links" href="/tienda">Tienda</a>
                <a class="col-2 links" href="/contactanos">Contáctanos</a>
            </div>
        </div>
    </div>
</template>
  
<script>
// import { 
// BIconEnvelope,
// BIconFacebook,
// BIconInstagram,
// BIconPhone,
// BIconPhoneFill,
// BIconYoutube
//   } from 'bootstrap-vue'
  export default{
    data() {
        return {
            menuServicios: false,
            logo:'',
        };
    },
    name: 'LandingMenu',
    comments: {
        
    },
    methods: {
        menuServ() {
            this.menuServicios = !this.menuServicios;
        },

    },
    setup(){
        const getImageUrl = (name) => {
            var nombreUrl = 'logo.png'
            return new URL(`../../../assets/${name}`, import.meta.url).href
        }
        return {getImageUrl }
    },
    components: { 
        // BIconPhoneFill, BIconEnvelope, BIconFacebook, BIconInstagram, BIconYoutube, BIconPhone 
    },
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
      font-size: 12px;
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

  .btn-danger {
  background-color: #E11419;
  border-color: #E11419;
}

.menuButton{
    position: absolute;
    top: 80px;
    left: 20px;
    z-index: 999;
}

.menu{
    list-style: none;
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
  
</style>
  