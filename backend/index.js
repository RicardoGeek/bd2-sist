const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true, strict: false }))
app.use(express.json())

const transacciones = require('./transacciones')

app.post('/transaccion', async (req, res) => {

    const { origen, destino, monto} = req.body

    const result = await transacciones.crearTransaccion({
        origen,
        destino,
        monto
    })

    res.status(200).send(result)
})

app.listen(8888, () => {
    console.log('App started on port 8888')
})