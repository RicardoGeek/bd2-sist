const cassandra = require('cassandra-driver')

const client = new cassandra.Client({
    keyspace: 'sist_keyspace',
    contactPoints: ['localhost'],
    localDataCenter: 'datacenter1'
})

const operaciones = async (usuario) => {
    const query = 'select * from cuenta_usuario_transaccion where id_usuario = ? ALLOW FILTERING'
    const result = await client.execute(query, [usuario], { prepare: true })

    const movements = await Promise.all(result.rows.map(async (move) => {
        return {
            cuenta: await getCuenta(move.id_cuenta),
            resumen: move.resumen,
            transaccion: move.id_transaccion
        }
    }))

    return movements
}

const instituciones = async () => {
    const query = 'select * from institucion'
    const result = await client.execute(query)

    const insts = result.rows.map((inst) => {
        return {
            id: inst.id,
            nombre: inst.nombre,
            short: inst.logo.replace('.jpg', '')
        }
    })

    return insts
}

const instituciones_transacciones = async (instId) => {
    const query = 'SELECT * FROM transaccion_institucion where id_institucion = ' + instId + ' ALLOW FILTERING' 
    const index = await client.execute(query)

    const items = await Promise.all(index.rows.map(async (item) => {
        const query2 = 'SELECT * FROM transaccion WHERE id = ' + item.id_transaccion
        const trx = await client.execute(query2)
        return trx.rows[0]
    }))

    return items
}

const cuentahabientes = async () => {
    const query = 'select * from usuario'
    const users = await client.execute(query)

    return users.rows
}

const movimientosMes = async (mes, year, usuario) => {
    const query = 'select id_transaccion, id_usuario from cuenta_usuario_transaccion where id_usuario = ' + usuario + ' ALLOW FILTERING'
    const movimientos = await client.execute(query)
    
    const trxIds = movimientos.rows.map((item) => item.id_transaccion)

    const query2 = 'select * from transaccion where id IN ('+trxIds.join(',')+') AND fecha < ? AND fecha > ? ALLOW FILTERING'
    const fecha1 = year + '-' + mes + '-01'
    const fecha2 = year + '-' + mes + '-31'
    const trxs = await client.execute(query2, [fecha2, fecha1], { prepare: true })

    return trxs.rows
}

const getCuenta = async (idCuenta) => {
    const query = 'SELECT * FROM cuenta WHERE id = '+idCuenta
    const result = await client.execute(query)
        .catch((error) => {
            console.log(error)
            return -1
        })

    return result.rows[0].numero_cuenta
}

module.exports = {
    operaciones,
    instituciones,
    instituciones_transacciones,
    cuentahabientes,
    movimientosMes
}