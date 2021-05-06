<template>
    <section class="cuentahabientes">
        <div class="row">
            <div class="col-md-12 d-flex align-items-stretch grid-margin">
                <div class="row flex-grow">
                    <div class="col-12 grid-margin">
                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">Cuentahabientes</h4>
                                <p class="card-description">Reporte de cuentahabientes </p>
                                 <b-table striped :items="cuentahabientes"></b-table>
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
    name: "cuentahabientes",
    data: () => ({
        cuentahabientes: []
    }),
    beforeMount() {
        axios.get('http://localhost:8888/cuentahabientes')
        .then((response) => {
            const data = response.data
            this.cuentahabientes = data
        })
    }

}
</script>
