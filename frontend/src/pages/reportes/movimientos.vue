<template>
    <section class="movimientos">
        <div class="row">
            <div class="col-md-12 d-flex align-items-stretch grid-margin">
                <div class="row flex-grow">
                    <div class="col-12 grid-margin">
                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">Movimientos</h4>
                                <p class="card-description">Reporte de movimientos por cuentahabiente por mes.</p>
                                <form class="forms-sample" v-on:submit.prevent>
                                    <b-form-group label="CUI Del Cuentahabiente" label-for="cui">
                                        <b-form-input type="text" id="cui" v-model="cui" placeholder="CUI..."></b-form-input>
                                    </b-form-group>
                                    <b-form-group label="Año" label-for="Año">
                                        <b-form-input type="number" id="Año" v-model="year" placeholder="Año..."></b-form-input>
                                    </b-form-group>
                                    <b-form-group label="Mes" label-for="Mes">
                                        <b-form-input type="number" id="Mes" v-model="mes" placeholder="Mes..."></b-form-input>
                                    </b-form-group>
                                    <b-button type="submit" variant="success" class="mr-2" @click="buscar()">Buscar</b-button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12 d-flex align-items-stretch grid-margin">
                <div class="row flex-grow">
                    <div class="col-12 grid-margin">
                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">Resultados</h4>
                                <b-table striped :items="movimientos"></b-table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </section>
</template>

<script>
import axios from 'axios'

export default {
    name: "movimientos",
    data: () => ({
        cui: null,
        year: null,
        mes: null,
        movimientos: []
    }),
    methods: {
        buscar() {
            axios.get('http://localhost:8888/cuentahabientes/'+this.cui+'/'+this.mes+'/'+this.year)
            .then((response) => {
                const data = response.data
                this.movimientos = data
            })
        }
    }
}
</script>
