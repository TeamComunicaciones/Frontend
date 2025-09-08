<template>
  <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Bar } from 'vue-chartjs'
// --- LÍNEA DE IMPORTACIÓN CLAVE (LA FORMA CORRECTA) ---
// Importamos cada "pieza" que necesitamos por su nombre.
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  CategoryScale, 
  LinearScale  
} from 'chart.js'

// --- REGISTRO DE COMPONENTES (LA FORMA CORRECTA) ---
// Le decimos a Chart.js qué piezas vamos a usar en nuestro gráfico.
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}
</script>