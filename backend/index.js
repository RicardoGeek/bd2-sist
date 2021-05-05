const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true, strict: false }))
app.use(express.json())

const transacciones = require('./transacciones')
const reportes = require('./reportes')

app.post('/transaccion', async (req, res) => {

    const { origen, destino, monto} = req.body

    const result = await transacciones.crearTransaccion({
        origen,
        destino,
        monto
    })

    res.status(200).send(result)
})

app.get('/transaccion/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params

    const result = await reportes.operaciones(id_usuario)
    res.status(200).send(result)
})

app.get('/instituciones', async (req, res) => {
    const result = await reportes.instituciones()

    res.status(200).send(result)
})

app.get('/instituciones/:id_institucion', async (req, res) => {
    const instId = req.params.id_institucion

    const result = await reportes.instituciones_transacciones(instId)

    res.status(200).send(result)
})

app.get('/cuentahabientes', async (req, res) => {
    const result = await reportes.cuentahabientes()

    res.status(200).send(result)
})

app.get('/cuentahabientes/:user/:mes/:year', async (req, res) => {

    const { mes, year, user } = req.params

    const result = await reportes.movimientosMes(mes, year, user)

    res.status(200).send(result)
})

app.listen(8888, () => {
    console.log('App started on port 8888')
})