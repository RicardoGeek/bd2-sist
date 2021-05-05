<template>
  <section class="forms">
    <div class="row">
      <div class="col-md-12 d-flex align-items-stretch grid-margin">
          <div class="row flex-grow">
            <div class="col-12 grid-margin">
              <div class="card">
                <div class="card-body">
                  <h4 class="card-title">Nueva Transaccion</h4>
                  <p class="card-description">Crear una nueva transaccion</p>
                  <form class="forms-sample" v-on:submit.prevent>
                    <b-form-group label="Cuenta Origen" label-for="origen">
                      <b-form-input type="text" id="origen" v-model="origen" placeholder="Cuenta Origen:"></b-form-input>
                    </b-form-group>
                    <b-form-group label="Cuenta Destino" label-for="destino">
                      <b-form-input type="text" id="destino" v-model="destino" placeholder="Cuenta Destino"></b-form-input>
                    </b-form-group>
                    <b-form-group label="Monto" label-for="monto">
                      <b-form-input type="number" id="monto" v-model="monto" placeholder="Monto"></b-form-input>
                    </b-form-group>
                    <b-button type="submit" variant="success" class="mr-2" @click="crearTransaccion()">Guardar</b-button>
                  </form>
                </div>
              </div>
          </div>
          </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable no-console */
import axios from 'axios'

export default {
  name: "dashboard",
  data: () => ({
    origen: null,
    destino: null,
    monto: null
  }),
  methods: {
    crearTransaccion() {
      axios.post('http://localhost:8888/transaccion', {
        origen: this.origen,
        destino: this.destino,
        monto: this.monto
      }).then((response) => {
        const result = response.data
        alert(result.result)
        this.monto = null
        this.destino = null
        this.origen = null
      })
    }
  }
}
</script>

<style scoped></style>
