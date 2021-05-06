<template>
    <section class="balance-instituciones">
        <div class="row">
            <div class="col-md-12 d-flex align-items-stretch grid-margin">
                <div class="row flex-grow">
                    <div class="col-12 grid-margin">
                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">Balance Instituciones</h4>
                                <p class="card-description">Reporte de totales de créditos y débitospara una institución financiera.</p>
                                <form class="forms-sample" v-on:submit.prevent>
                                    <b-form-group label="Institucion" label-for="institucion">
                                        <b-form-select id="institucion" v-model="selected" :options="instituciones"></b-form-select>
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
                                <b-table striped :items="balance"></b-table>
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
    name: "balance-instituciones",
    data: () => ({
        balance: [],
        instituciones: [],
        selected: null
    }),
    beforeMount() { 
        axios.get('http://localhost:8888/instituciones')
        .then((response) => {
            const data = response.data
            const options = data.map((item) => {
                return {
                    value: item.id,
                    text: item.nombre
                }                
            })

            this.instituciones = options
        })
    },
    methods: {
        buscar() {
            axios.get('http://localhost:8888/instituciones/' + this.selected)
            .then((response) => {
                const data = response.data
                this.balance = data
            })
        }
    }
}
</script>
