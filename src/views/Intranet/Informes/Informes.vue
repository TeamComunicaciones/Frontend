<template>
    <div class="textos" style="width: 100%; margin: 0px; padding: 30px;">
        <div class="vld-parent">
            <loading :active.syn="isLoading" :can-cancel="true"  :is-full-page="fullPage"></loading>
        </div>
        <div style="margin-top: 10px;">
            <b-button-group>
                <b-button @click="semana">Semana</b-button>
                <b-button @click="mes">Mes</b-button>
                <b-button @click="trimestre">Trimestre</b-button>
                <b-button @click="anual">Año</b-button>
                <b-button @click="personalizado">Personalizada</b-button>
            </b-button-group>
        </div>
        <div class="row">
            <div class="col-5">
                <b-form-datepicker 
                    id="example-datepicker1" 
                    v-model="date_init" 
                    class="m-2"
                    size="sm"
                    :disabled="disable_date"
                ></b-form-datepicker>
            </div>
            <div class="col-5">
                <b-form-datepicker 
                    id="example-datepicker2" 
                    v-model="date_end" 
                    class="m-2"
                    size="sm"
                    :disabled="disable_date"
                ></b-form-datepicker>
            </div>
            <div class="col-2">
                <b-button class="m-2" size="sm" variant="danger" :disabled="disable_date" @click="confirmar">Confirmar</b-button>
            </div>
        </div>
        <div class="" style="margin-left: 20px;">
            <div class="row">
                <div class="col-md-4 col-sm-12">
                    <div class="tarjeta">
                        <div class="titulo">Ventas Netas de {{periodo }}</div>
                        <div class="numero-grande">{{ ultimo_valor }}</div>
                        <div>
                            <div class="row" style="width: 200px;">
                                <div class="texto-segundo-renglon col-4" :style="{ color: colorDelta, backgroundColor: colorFondo  }">{{delta}} </div>
                                <div class="texto-segundo-renglon col-8">último día vs mediana</div>
                            </div>
                        </div>
                    </div>
                    <div class="tarjeta">
                        <div class="titulo">Top 5 productos {{periodo }}</div>
                        <br/>
                        <table class="mi-tabla">
                            <thead>
                                <tr>
                                    <th style="font-size: 12px">Nombre</th>
                                    <th style="font-size: 12px">Cantidad</th>
                                    <th style="font-size: 12px">Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in productos" :key="index">
                                    <td style="font-size: 12px">{{ item.Nombre }}</td>
                                    <td style="font-size: 12px">{{ formatNumber(item.Cantidad) }}</td>
                                    <td style="font-size: 12px">{{ formatoMoneda(item.PrecioVenta) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="col-8">
                    <div class="tarjeta2">
                        <canvas ref="barChartCanvas"></canvas>
                    </div>
                    <div class="tarjeta2 p-2">
                        <canvas ref="pieChartCanvas"></canvas>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</template>
  
<script>
import backendRouter from '@/components/BackendRouter/BackendRouter';
import Loading from 'vue-loading-overlay';
import axios from 'axios';
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  CategoryScale, 
  LinearScale 
} from 'chart.js'

  export default{
    data(){
      return{
        tituloMenu:"Estadísticas",
        date_init : '',
        date_end : '',
        disable_date : true,
        delta : 0,
        median: 0,
        ultimo_valor: 0,
        periodo: '',
        colorDelta: '#fff',
        colorFondo: '#fff',
        isLoading: true,
        fullPage: true,
        chart: null,
        label : [],
        data: [],
        productos: [],
        chartPie: null,
        pieChartData: {
            labels: [],
            datasets: [{
            data: [],
            backgroundColor: [],
            hoverBackgroundColor: [],
            }],
        },
        
        
       
      }
    },
    methods:{
        generateColors(count) {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const color = this.getRandomColor();
            colors.push(color);
        }
        return colors;
        },
        getRandomColor() {
            const redComponent = Math.floor(Math.random() * 256);
            const greenComponent = Math.floor(Math.random() * 50);
            const blueComponent = Math.floor(Math.random() * 50);
            return `rgba(${redComponent},${greenComponent},${blueComponent}, 0.65)`;
        },
        renderChartPie() {
            if (this.chartPie) {
            this.chartPie.destroy();
        }
            const ctx = this.$refs.pieChartCanvas.getContext('2d');
            this.chartPie = new Chart(ctx, {
                type: 'pie',
                data: this.pieChartData,
                options: {
                    title: {
                        display: true,
                        text: 'Ventas X Ubicaciones',
                        fontSize: 16,
                    },
                    maintainAspectRatio: false,
                    responsive: true,
                    legend: {
                        display: false,
                    },
                    tooltips: {
                        callbacks: {
                        label: (tooltipItem, data) => {
                            const label = data.labels[tooltipItem.index];
                            const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                            return `${label}: $${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
                        },
                        },
                    },
                }
            });
        },
        renderChart() {
        if (this.chart) {
            this.chart.destroy();
        }
        const ctx = this.$refs.barChartCanvas.getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
            labels: this.label,
            datasets: [
                {
                label: 'Ventas Netas',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: this.data,
                },
            ],
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
            scales: {
                yAxes: [
                {
                    ticks: {
                    beginAtZero: true,
                    callback: function (value, index, values) {
                    return '$' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                  },
                    },
                },
                ],
            },
            tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                return '$' + tooltipItem.yLabel.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
              },
            },
          },
          plugins: {
            datalabels: {
              anchor: 'end',
              align: 'end',
              formatter: function (value, context) {
                return '$' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
              },
            },
          },

            },
        });
        },
        formatNumber(number) {
            return number.toLocaleString();
        },
        formatoMoneda(valor) {
            const resultado = parseFloat(valor).toLocaleString('es-CO', {
                style: 'currency',
                currency: 'COP',
            })
            return resultado
        },
        formatearFecha(fecha) {
            const year = fecha.getFullYear();
            const month = ('0' + (fecha.getMonth() + 1)).slice(-2);
            const day = ('0' + fecha.getDate()).slice(-2);
            return `${year}-${month}-${day}`;
            },
        semana(){
            const fecha = new Date();
            this.date_end = this.formatearFecha(fecha)
            fecha.setDate(fecha.getDate() - 7);
            this.date_init = this.formatearFecha(fecha)
            this.disable_date = true
            this.confirmar()
        },
        mes(){
            const fecha = new Date();
            this.date_end = this.formatearFecha(fecha)
            fecha.setMonth(fecha.getMonth() - 1);
            this.date_init = this.formatearFecha(fecha)
            this.disable_date = true
            this.confirmar()
        },
        trimestre(){
            const fecha = new Date();
            this.date_end = this.formatearFecha(fecha)
            fecha.setMonth(fecha.getMonth() - 3);
            this.date_init = this.formatearFecha(fecha)
            this.disable_date = true
            this.confirmar()
        },
        anual(){
            const fecha = new Date();
            this.date_end = this.formatearFecha(fecha)
            fecha.setFullYear(fecha.getFullYear() - 1);
            this.date_init = this.formatearFecha(fecha)
            this.disable_date = true
            this.confirmar()
        },
        personalizado(){
            this.disable_date = false
        },
        confirmar(){
            this.isLoading = true
            const path = backendRouter.data+'informes'
            const data = {
                start: this.date_init,
                end: this.date_end,
            }
            axios.post(path, data).then((response)=>{
                this.delta = response.data.delta
                this.ultimo_valor = response.data.ultimoValor
                this.median = response.data.median
                this.periodo = response.data.periodo
                this.colorDelta = response.data.color
                this.label = response.data.label
                this.data = response.data.values
                this.productos = response.data.productos
                this.pieChartData.labels = response.data.labelPie
                this.pieChartData.datasets[0].data = response.data.valuesPie
                this.pieChartData.datasets[0].backgroundColor = this.generateColors(response.data.cantidadPie)
                this.pieChartData.datasets[0].hoverBackgroundColor = this.generateColors(response.data.cantidadPie)
                if (response.data.color == '#f4511e'){
                    this.colorFondo = `rgba(244, 81, 30, 0.2)`
                }
                else{
                    this.colorFondo = `rgba(192, 202, 51, 0.2)`
                }
                this.isLoading = false
                this.renderChart()
                this.renderChartPie()
            })
        },

    },
    created(){
        this.semana()
    },
    components: {
        Loading
    },
    beforeDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  },
  }
  </script>
  
  <style>
  .textos{
    color: black; 
    text-align: center;
  }
  .tarjeta {
      padding: 30px;
      width: 300px;
      border-radius: 15px;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border: 2px solid rgba(0, 0, 0, 0.1);
      align-items: center;
      box-shadow: 0 5px 9px rgba(0, 0, 0, 0.1);
    }
    .tarjeta2 {
      border-radius: 15px;
      height: 350px;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border: 2px solid rgba(0, 0, 0, 0.1);
      align-items: center;
      box-shadow: 0 5px 9px rgba(0, 0, 0, 0.1);
    }

    .numero-grande {
      font-size: 35px;
      font-weight: bold;
    }

    .texto-segundo-renglon {
      display: flex;
      text-align: center;
      justify-content: center;
      font-size: 12px;
      margin-top: 10px;
      height: 20px;
      padding: 0px;
    }
    .titulo {
        font-weight: bold;
        font-family: sans-serif;
        color: #273B50;
    }
    .mi-tabla {
        padding: 10px;
        border-collapse: collapse;
         width: 100%;
    }

    .mi-tabla th, .mi-tabla td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    }

    .mi-tabla th {
    background-color: #f2f2f2;
    }
  
  </style>