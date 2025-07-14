<template>
    <div>
      <Carrito/>
      <MenuLanding/>
      <BCarousel controls>
            <BCarouselSlide  :img-src="getImageUrl('slide1-2.jpeg')" />
            <BCarouselSlide  :img-src="getImageUrl('slide2-2.jpeg')" />
            <BCarouselSlide  :img-src="getImageUrl('slide3-2.jpeg')" />
      </BCarousel>
        <div class="p-5">
          <h4 class="textos"> 
            <b>{{ titulo1 }} <br> {{ titulo2 }}</b>
          </h4>
          <p class="textos"> {{ queHacemos1 }} </p>
          <p class="textos"> {{ queHacemos2 }} </p>
        </div>
        <div class="p-5 tarjeta_asisomos">
          <div class="row">
            <img class="col-md-6 imagen" :src="getImageUrl(imgProposito)" alt="">
            <div class="col-md-6">
              <h2 class="textos3"><b>{{ tituloProposito }}</b></h2>
              <br>
              <p class="textos2">{{ textoProposito }}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <h2 class="textos3"><b>{{ tituloValores }}</b></h2>
              <br>
              <ul>
                <li style="color: black; text-align:start;" v-for="item in textoValores">{{ item }}</li>
              </ul>
            </div>
            <img class="col-md-6 imagen" :src="getImageUrl(imgValores)" alt="">
          </div>
          <div class="row">
            <img class="col-md-6 imagen" :src="getImageUrl(imgHistoria)" alt="">
            <div class="col-md-6">
              <h2 class="textos3"><b>{{ tituloHistoria }}</b></h2>
              <br>
              <p class="textos2" v-for="item in textoHistoria">{{ item }}</p>
            </div>
          </div>
        </div>
        <div class="p-5 tarjeta_asisomos">
          <img class="imagen col-12" :src="getImageUrl(imgComplementaria)" alt="">
        </div>
    </div>
</template>
  
  <script>
    import MenuLanding from '../MenuLanding/MenuLanding.vue'
    import Carrito from '@/components/MainPage/Carrito/Carrito.vue'
    export default{
      components:{  
        MenuLanding,
        Carrito,
      },
      setup(){
        const getImageUrl = (name) => {
            var nombreUrl = 'logo.png'
            return new URL(`../../../assets/${name}`, import.meta.url).href
        }
        return {getImageUrl }
      },
      data(){
        return{
            slide: 0,
            slide2: 0,
            sliding: null,
            slidesData:[
                {id:1, caption:'', text:'', img:'slide1-2.jpeg'},
                {id:1, caption:'', text:'', img:'slide2-2.jpeg'},
                {id:1, caption:'', text:'', img:'slide3-2.jpeg'},
            ],
            titulo1: 'Conectamos a las personas por medio de las telecomunicaciones',
            titulo2: '¿Qué hacemos?',
            queHacemos1: 'Brindamos la mejor asesoría y atención para la compra de equipos, tecnología, servicios hogar o de empresas; contamos con un personal altamente calificado y dispuesto a ayudarte en todo lo que necesites, en nuestros Centros de Ventas y Servicios tendrás la mejor experiencia de compra con el servicio de alta calidad.',
            queHacemos2: 'Hacemos presencia en Antioquía, Boyacá, Chocó y Eje Cafetero; con la intención de acortar distancias, llevando la mejor señal para personas, familias y empresas.',
            imgProposito: 'proposito.jpeg',
            tituloProposito: 'Nuestro propósito',
            textoProposito: 'Estamos seguros de que la tecnología genera calidad de vida y nos conecta; nuestro compromiso es entregarte soluciones tecnológicas que te permiten avanzar.',
            imgValores: 'valores.jpeg',
            tituloValores: 'Nuestros Valores',
            textoValores: [
              'Comprometidos con el servicio',
              'Siempre decimos la verdad',
              'Ponemos atención a las necesidades de las personas',
              'Siempre buscamos ser mejores',
              'Somos agradecidos con todas las personas',
              'Nunca nos damos por vencidos',
            ],
            imgHistoria: 'historia.jpeg',
            tituloHistoria: 'Nuestra Historia',
            textoHistoria: [
              'Somos un agente comercial de Claro quien dispone de la red de mayor cobertura en Colombia. Sus constantes inversiones en tecnología e innovación, nos llevan a donde están nuestros clientes para que puedan conectarse con los que más quieren. Llegamos al 99% de los municipios del país con la red móvil del operador para que nuestros clientes puedan compartir sus mejores historias, incluso desde una montaña. Conectar 31 millones de clientes móviles demuestra que casi la mitad de las líneas en Colombia son de usuarios Claro que disfrutan nuestro respaldo y cobertura.',
              'Claro tiene 8.842 antenas propias en todo el país para que una llamada o una foto pueda llegar a más lugares en todo Colombia. En los últimos 20 años ha invertido US$15.000 millones por esto, en más del 60% de las cabeceras municipales, solo hay cobertura 4G de Claro.',
              'Llegamos a las 32 capitales del país, 1.119 municipios y 2.300 poblaciones para que se conecten con sus seres especiales desde ese lugar que tanto disfrutan.',
            ],
            imgComplementaria: 'complementaria.jpeg',
        }
      }
    }
  </script>
  
  <style scoped>

  .textos{
    color: black; 
    text-align: center;
  }
  .textos2{
    color: black; 
    text-align: start;
    font-size: 20px;
  }
  .textos3{
    color: black; 
    text-align: start;
  }
  ul li {
    text-align: left; /* Alinea el texto a la izquierda */
    font-size: 20px;
  }
  .tarjeta_asisomos{
    max-width: 1200px;
    margin: 0 auto;
  }
  .imagen{
    height: auto;
    object-fit: contain;
  }
  
  </style>
  