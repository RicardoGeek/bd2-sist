<template>
    <section class="instituciones">
        <div class="row">
            <div class="col-md-12 d-flex align-items-stretch grid-margin">
                <div class="row flex-grow">
                    <div class="col-12 grid-margin">
                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">Instituciones</h4>
                                <p class="card-description">Reporte de instituciones bancarias</p>
                                <b-table striped :items="instituciones"></b-table>
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
    name: "instituciones",
    data: () => ({
        instituciones: []
    }),
    beforeMount() {
        axios.get('http://localhost:8888/instituciones')
        .then((response) => {
            const data = response.data
            this.instituciones = data
        })
    }
}
</script>
