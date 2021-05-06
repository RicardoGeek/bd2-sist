<template>
    <section class="ops">
        <div class="row">
            <div class="col-md-12 d-flex align-items-stretch grid-margin">
                <div class="row flex-grow">
                    <div class="col-12 grid-margin">
                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">Operaciones</h4>
                                <p class="card-description">Reporte de operaciones realizadas por un cuentahabiente</p>
                                <form class="forms-sample" v-on:submit.prevent>
                                    <b-form-group label="CUI Del Cuentahabiente" label-for="cui">
                                        <b-form-input type="text" id="cui" v-model="cui" placeholder="CUI..."></b-form-input>
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
                                <b-table striped :items="trxs"></b-table>
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
    name: "operaciones",
    data: () => ({
        cui: null,
        trxs: []
    }),
    methods: {
        buscar() {
           axios.get('http://localhost:8888/transaccion/' + this.cui)
           .then((response) => {
               const result = response.data
               this.trxs = result
           })
        }
    }
}
</script>
