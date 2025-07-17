<template>
    <div>
        <div class="vld-parent">
            <loading :active.syn="isLoading" :can-cancel="true"  :is-full-page="fullPage"></loading>
        </div>
        <div class="p-5">
            <table>
                <tr>
                    <th colspan="3">COMISION SERVICIOS HFC</th>
                </tr>
                <tr>
                    <th>TIPO DE VENTA</th>
                    <th>NO CONVERGENTE</th>
                    <th>CONVERGENTE</th>
                </tr>
                <tr>
                    <td>New - Cross Selling</td>
                    <td contenteditable="true" @input="updatePorcentaje(0, $event)" ref="porcentaje1" >{{  porcentajes[0] }}</td>
                    <td contenteditable="true" @input="updatePorcentaje(1, $event)" ref="porcentaje2" >{{  porcentajes[1] }}</td>
                </tr>
                <tr>
                    <td>Up Selling</td>
                    <td contenteditable="true" @input="updatePorcentaje(2, $event)" ref="porcentaje1" >{{  porcentajes[2] }}</td>
                    <td contenteditable="true" @input="updatePorcentaje(3, $event)" ref="porcentaje1" >{{  porcentajes[3] }}</td>
                </tr>
                <tr>
                    <th colspan="3">ACELERADORES HFC</th>
                </tr>
                <tr>
                    <td>Sencillo red DTH</td>
                    <td contenteditable="true" @input="updatePorcentaje(4, $event)" ref="porcentaje1" >{{  porcentajes[4] }}</td>
                    <td contenteditable="true" @input="updatePorcentaje(5, $event)" ref="porcentaje1" >{{  porcentajes[5] }}</td>
                </tr>
                <tr>
                    <td>Doble - HFC/DTH</td>
                    <td contenteditable="true" @input="updatePorcentaje(6, $event)" ref="porcentaje1" >{{  porcentajes[6] }}</td>
                    <td contenteditable="true" @input="updatePorcentaje(7, $event)" ref="porcentaje1" >{{  porcentajes[7] }}</td>
                </tr>
                <tr>
                    <td>Triple - HFC/DTH</td>
                    <td contenteditable="true" @input="updatePorcentaje(8, $event)" ref="porcentaje1" >{{  porcentajes[8] }}</td>
                    <td contenteditable="true" @input="updatePorcentaje(9, $event)" ref="porcentaje1" >{{  porcentajes[9] }}</td>
                </tr>
            </table>
            <br/>
            <table>
                <tr>
                    <th colspan="4">INCENTIVO CUMPLIMIENTO TOTAL FIJO</th>
                </tr>
                <tr>
                    <th>100%</th>
                    <th>105%</th>
                    <th>110%</th>
                    <th rowspan="2">>125%</th>
                </tr>
                <tr>
                    <th>104,99%</th>
                    <th>109,99%</th>
                    <th>124,99%</th>
                </tr>
                <tr>
                    <td contenteditable="true" @input="updatePorcentaje(10, $event)" ref="porcentaje1" >{{  porcentajes[10] }}</td>
                    <td contenteditable="true" @input="updatePorcentaje(11, $event)" ref="porcentaje1" >{{  porcentajes[11] }}</td>
                    <td contenteditable="true" @input="updatePorcentaje(12, $event)" ref="porcentaje1" >{{  porcentajes[12] }}</td>
                    <td contenteditable="true" @input="updatePorcentaje(13, $event)" ref="porcentaje1" >{{  porcentajes[13] }}</td>
                </tr>
                <tr>
                    <td contenteditable="true" @input="updatePorcentaje(14, $event)" ref="porcentaje1" >{{  porcentajes[14] }}</td>
                    <td contenteditable="true" @input="updatePorcentaje(15, $event)" ref="porcentaje1" >{{  porcentajes[15] }}</td>
                    <td contenteditable="true" @input="updatePorcentaje(16, $event)" ref="porcentaje1" >{{  porcentajes[16] }}</td>
                    <td contenteditable="true" @input="updatePorcentaje(17, $event)" ref="porcentaje1" >{{  porcentajes[17] }}</td>
                </tr>
                <tr>
                    <td >{{  resultados[0] }}</td>
                    <td >{{  resultados[1] }}</td>
                    <td >{{  resultados[2] }}</td>
                    <td >{{  resultados[3] }}</td>
                </tr>
            </table>
            <br/>
            <table>
                <tr>
                    <th colspan="4">INCENTIVO CUMPLIMIENTO TOTAL MOVIL</th>
                </tr>
                <tr>
                    <th>80%</th>
                    <th>90%</th>
                    <th>110%</th>
                    <th rowspan="2">>125%</th>
                </tr>
                <tr>
                    <th>89,99%</th>
                    <th>109,99%</th>
                    <th>124,99%</th>
                </tr>
                <tr>
                    <td contenteditable="true" @input="updatePorcentaje(18, $event)" ref="porcentaje1" >{{  porcentajes[18] }}</td>
                    <td contenteditable="true" @input="updatePorcentaje(19, $event)" ref="porcentaje1" >{{  porcentajes[19] }}</td>
                    <td contenteditable="true" @input="updatePorcentaje(20, $event)" ref="porcentaje1" >{{  porcentajes[20] }}</td>
                    <td contenteditable="true" @input="updatePorcentaje(21, $event)" ref="porcentaje1" >{{  porcentajes[21] }}</td>
                </tr>
                <tr>
                    <td contenteditable="true" @input="updatePorcentaje(22, $event)" ref="porcentaje1" >{{  porcentajes[22] }}</td>
                    <td contenteditable="true" @input="updatePorcentaje(23, $event)" ref="porcentaje1" >{{  porcentajes[23] }}</td>
                    <td contenteditable="true" @input="updatePorcentaje(24, $event)" ref="porcentaje1" >{{  porcentajes[24] }}</td>
                    <td contenteditable="true" @input="updatePorcentaje(25, $event)" ref="porcentaje1" >{{  porcentajes[25] }}</td>
                </tr>
                <tr>
                    <td >{{  resultados[4] }}</td>
                    <td >{{  resultados[5] }}</td>
                    <td >{{  resultados[6] }}</td>
                    <td >{{  resultados[7] }}</td>
                </tr>
            </table>
            <div class="row">
                <div class="col-6">
                    <table>
                        <tr>
                            <th colspan="2">COMISION SERVICIOS FO</th>
                        </tr>
                        <tr>
                            <th>NO CONVERGENTE</th>
                            <th>CONVERGENTE</th>
                        </tr>
                        <tr>
                            <td contenteditable="true" @input="updatePorcentaje(26, $event)" ref="porcentaje1" >{{  porcentajes[26] }}</td>
                            <td contenteditable="true" @input="updatePorcentaje(27, $event)" ref="porcentaje1" >{{  porcentajes[27] }}</td>
                        </tr>
                        <tr>
                            <th colspan="2">*BONO POR VELOCIDAD DE INTERNET*</th>
                        </tr>
                        <tr>
                            <th>Velocidad</th>
                            <th>% Adicional</th>
                        </tr>
                        <tr>
                            <td >VEL_2</td>
                            <td contenteditable="true" @input="updatePorcentaje(28, $event)" ref="porcentaje1" >{{  porcentajes[28] }}</td>
                        </tr>
                        <tr>
                            <td >VEL_3</td>
                            <td contenteditable="true" @input="updatePorcentaje(29, $event)" ref="porcentaje1" >{{  porcentajes[29] }}</td>
                        </tr>
                        <tr>
                            <td >VEL_4</td>
                            <td contenteditable="true" @input="updatePorcentaje(30, $event)" ref="porcentaje1" >{{  porcentajes[30] }}</td>
                        </tr>
                        <tr>
                            <th colspan="2">*BONO POR DURACIÓN DEL CONTRATO*</th>
                        </tr>
                        <tr>
                            <th>Duración</th>
                            <th>% Adicional</th>
                        </tr>
                        <tr>
                            <td >24 Meses</td>
                            <td contenteditable="true" @input="updatePorcentaje(31, $event)" ref="porcentaje1" >{{  porcentajes[31] }}</td>
                        </tr>
                        <tr>
                            <td >36 Meses</td>
                            <td contenteditable="true" @input="updatePorcentaje(32, $event)" ref="porcentaje1" >{{  porcentajes[32] }}</td>
                        </tr>
                        <tr>
                            <td >>= 48 Meses</td>
                            <td contenteditable="true" @input="updatePorcentaje(33, $event)" ref="porcentaje1" >{{  porcentajes[33] }}</td>
                        </tr>
                        <tr>
                            <th colspan="2">BONIFICACION CUMPLIMIENTO FO</th>
                        </tr>
                        <tr>
                            <th>% CUMP MENSUAL</th>
                            <th>BONIFICACION</th>
                        </tr>
                        <tr>
                            <td >0% - 49,9%</td>
                            <td contenteditable="true" @input="updatePorcentaje(34, $event)" ref="porcentaje1" >{{  porcentajes[34] }}</td>
                        </tr>
                        <tr>
                            <td >50% - 79,9%</td>
                            <td contenteditable="true" @input="updatePorcentaje(35, $event)" ref="porcentaje1" >{{  porcentajes[35] }}</td>
                        </tr>
                        <tr>
                            <td >80% - 99,9%</td>
                            <td contenteditable="true" @input="updatePorcentaje(36, $event)" ref="porcentaje1" >{{  porcentajes[36] }}</td>
                        </tr>
                        <tr>
                            <td >100% - 104,9%</td>
                            <td contenteditable="true" @input="updatePorcentaje(37, $event)" ref="porcentaje1" >{{  porcentajes[37] }}</td>
                        </tr>
                        <tr>
                            <td >105% - 109,9%</td>
                            <td contenteditable="true" @input="updatePorcentaje(38, $event)" ref="porcentaje1" >{{  porcentajes[38] }}</td>
                        </tr>
                        <tr>
                            <td >>=110%</td>
                            <td contenteditable="true" @input="updatePorcentaje(39, $event)" ref="porcentaje1" >{{  porcentajes[39] }}</td>
                        </tr>
                    </table>
                </div>
                <div class="col-6">
                    <table>
                        <tr>
                            <th colspan="3">SERVICIO CLOUD</th>
                        </tr>
                        <tr>
                            <th colspan="3">IAAS</th>
                        </tr>
                        <tr>
                            <th>MES</th>
                            <th>NO CONVERGENTE</th>
                            <th>CONVERGENTE</th>
                        </tr>
                        <tr>
                            <td >1</td>
                            <td contenteditable="true" @input="updatePorcentaje(40, $event)" ref="porcentaje1" >{{  porcentajes[40] }}</td>
                            <td contenteditable="true" @input="updatePorcentaje(41, $event)" ref="porcentaje1" >{{  porcentajes[41] }}</td>
                        </tr>
                        <tr>
                            <td >2</td>
                            <td contenteditable="true" @input="updatePorcentaje(42, $event)" ref="porcentaje1" >{{  porcentajes[42] }}</td>
                            <td contenteditable="true" @input="updatePorcentaje(43, $event)" ref="porcentaje1" >{{  porcentajes[43] }}</td>
                        </tr>
                        <tr>
                            <td >3</td>
                            <td contenteditable="true" @input="updatePorcentaje(44, $event)" ref="porcentaje1" >{{  porcentajes[44] }}</td>
                            <td contenteditable="true" @input="updatePorcentaje(45, $event)" ref="porcentaje1" >{{  porcentajes[45] }}</td>
                        </tr>
                        <tr>
                            <td >4</td>
                            <td contenteditable="true" @input="updatePorcentaje(46, $event)" ref="porcentaje1" >{{  porcentajes[46] }}</td>
                            <td contenteditable="true" @input="updatePorcentaje(47, $event)" ref="porcentaje1" >{{  porcentajes[47] }}</td>
                        </tr>
                        <tr>
                            <th colspan="3">SAAS</th>
                        </tr>
                        <tr>
                            <th>MES</th>
                            <th>NO CONVERGENTE</th>
                            <th>CONVERGENTE</th>
                        </tr>
                        <tr>
                            <td >1</td>
                            <td contenteditable="true" @input="updatePorcentaje(48, $event)" ref="porcentaje1" >{{  porcentajes[48] }}</td>
                            <td contenteditable="true" @input="updatePorcentaje(49, $event)" ref="porcentaje1" >{{  porcentajes[49] }}</td>
                        </tr>
                        <tr>
                            <td >2</td>
                            <td contenteditable="true" @input="updatePorcentaje(50, $event)" ref="porcentaje1" >{{  porcentajes[50] }}</td>
                            <td contenteditable="true" @input="updatePorcentaje(51, $event)" ref="porcentaje1" >{{  porcentajes[51] }}</td>
                        </tr>
                        <tr>
                            <td >3</td>
                            <td contenteditable="true" @input="updatePorcentaje(52, $event)" ref="porcentaje1" >{{  porcentajes[52] }}</td>
                            <td contenteditable="true" @input="updatePorcentaje(53, $event)" ref="porcentaje1" >{{  porcentajes[53] }}</td>
                        </tr>
                        <tr>
                            <td >4</td>
                            <td contenteditable="true" @input="updatePorcentaje(54, $event)" ref="porcentaje1" >{{  porcentajes[54] }}</td>
                            <td contenteditable="true" @input="updatePorcentaje(55, $event)" ref="porcentaje1" >{{  porcentajes[55] }}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div style="text-align: center">
            <BButton variant="danger" class="mb-2" @click=guardar >GUARDAR</BButton>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import backendRouter from '@/components/BackendRouter/BackendRouter';
    import Loading from 'vue-loading-overlay';
    export default{
        data(){
            return{
                tituloMenu: 'Tabla comisiones',
                porcentajes: [],
                resultados: [],
                isLoading: false,
                fullPage: true,
            }
        },
        components:{
            Loading,
        },
        methods:{
            updatePorcentaje(index, event){
                this.$set(this.porcentajes, index, event.target.textContent);
                const selection = window.getSelection();
                selection.removeAllRanges();
                const range = document.createRange();
                range.selectNodeContents(event.target);
                range.collapse(false);
                selection.addRange(range);
            },
            guardar(){
                this.isLoading = true
                const path = backendRouter.data + 'porcentajes-comisiones'
                axios.post(path, this.porcentajes).then((response)=>{
                    this.$swal('Guardado con exito')
                    this.getPorcentajes()
                    this.isLoading = false
                })
            },
            getPorcentajes(){
                const path = backendRouter.data + 'porcentajes-comisiones'
                axios.get(path).then((response)=>{
                    this.porcentajes = response.data.comisiones
                })
            },
            sumarPorcentajes(a,b) {
                const porcentaje1 = parseFloat(a.replace('%', ''));
                const porcentaje2 = parseFloat(b.replace('%', ''));
                var total = ''
                if (!isNaN(porcentaje1) && !isNaN(porcentaje2)) {
                    const suma = porcentaje1 + porcentaje2;
                    total = suma.toFixed(2) + '%';
                } else {
                    total = 'Error';
                }
                return total
            },
            totales(){
                this.resultados = [
                    this.sumarPorcentajes(this.porcentajes[10],this.porcentajes[14]),
                    this.sumarPorcentajes(this.porcentajes[11],this.porcentajes[15]),
                    this.sumarPorcentajes(this.porcentajes[12],this.porcentajes[16]),
                    this.sumarPorcentajes(this.porcentajes[13],this.porcentajes[17]),
                    this.sumarPorcentajes(this.porcentajes[18],this.porcentajes[22]),
                    this.sumarPorcentajes(this.porcentajes[19],this.porcentajes[23]),
                    this.sumarPorcentajes(this.porcentajes[20],this.porcentajes[24]),
                    this.sumarPorcentajes(this.porcentajes[21],this.porcentajes[25]),
                ]
            },
        },
        created(){
            this.getPorcentajes()
        } ,
        watch: {
            porcentajes: {
                handler(newValue, oldValue) {
                    this.totales();
                },
                deep: true
            }
        },
    }
</script>

<style scoped>
    table {
        width: 100%;
        border-collapse: collapse;
    }
    th, td {
        border: 1px solid black;
        padding: 8px;
        text-align: center;
        color: black;
    }
    th{
        background-color: rgba(225, 20, 25, 0.7);
    }

</style>