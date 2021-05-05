const cassandra = require('cassandra-driver')

const client = new cassandra.Client({
    keyspace: 'sist_keyspace',
    contactPoints: ['localhost'],
    localDataCenter: 'datacenter1'
})

const crearTransaccion = async (transaccion) => {
    const { origen, destino, monto } = transaccion

    const idCuentaOrigen = await getCuentaId(origen)
    const idCuentaDestino = await getCuentaId(destino)

    const idUsuarioOrigen = await getUsuarioByCuenta(idCuentaOrigen)
    const idUsuarioDestino = await getUsuarioByCuenta(idCuentaDestino)

    const _disponible = await disponible(idUsuarioOrigen)

    const institucionOrigen = await getInstitucion(origen)
    const institucionDestino = await getInstitucion(destino)

    console.log(institucionOrigen)
    console.log(institucionDestino)
    
    let credito
    let debito
    let result

    console.log(_disponible)
    if(_disponible - parseInt(monto)> 0) {
        result = 'success'
        debito = await create({
            monto,
            tipo: 'DEBITO',
            institucion: institucionOrigen,
            cuenta: idCuentaOrigen,
            usuario: idUsuarioOrigen
        })
    
        credito = await create({
            monto,
            tipo: 'CREDITO',
            institucion: institucionDestino,
            cuenta: idCuentaDestino,
            usuario: idUsuarioDestino
        })
    } else {
        result = 'sin-fondos'
        debito = await create({
            monto,
            tipo: 'DEBITO FALLIDO',
            institucion: institucionOrigen,
            cuenta: idCuentaOrigen,
            usuario: idUsuarioOrigen
        })
    
        credito = await create({
            monto,
            tipo: 'CREDITO FALLIDO',
            institucion: institucionDestino,
            cuenta: idCuentaDestino,
            usuario: idUsuarioDestino
        })
    }
    

    return {
        result,
        debito,
        credito
    }
}


// PRIVATES
const create = async (trx) => {
    const { monto, tipo, institucion, cuenta, usuario } = trx

    const nextTrxId = await getNextId('transaccion')
    const nextTrxInstId = await getNextId('transaccion_institucion')
    const nextCutId = await getNextId('cuenta_usuario_transaccion')
    const auth = Math.random().toString(36).substring(7).toUpperCase()

    const trxQuery = 'INSERT INTO transaccion(id, autorizacion, fecha, monto, tipo) VALUES(?, ?, ?, ?, ?)'
    await client.execute(trxQuery, [nextTrxId, auth, new Date(), monto, tipo], {prepare: true})
        .catch((error) => {
            console.log(error)
            return -1
        })
    
        
    const trxInstQuery = 'INSERT INTO transaccion_institucion (id, id_institucion, id_transaccion) VALUES(?, ?, ?)'
    await client.execute(trxInstQuery, [nextTrxInstId, institucion, nextTrxId], {prepare: true})
        .catch((error) => {
            console.log(error)
            return -1
        })

    const cutQuery = 'INSERT INTO cuenta_usuario_transaccion (id, id_cuenta, id_transaccion, id_usuario, resumen) VALUES(?, ?, ?, ?, ?)'
    const resumen = tipo + ': ' + monto
    await client.execute(cutQuery, [nextCutId, cuenta, nextTrxId, usuario, resumen], { prepare: true })
        .catch((error) => {
            console.log(error)
            return -1
        })
    
    return {
        trx: nextTrxInstId,
        trx_inst: nextTrxInstId,
        cut: nextCutId
    }
}

const getCuentaId = async (numeroCuenta) => {
    const query = 'SELECT * FROM cuenta WHERE numero_cuenta = \''+numeroCuenta+'\' ALLOW FILTERING'
    const result = await client.execute(query)
        .catch((error) => {
            console.log(error)
            return -1
        })
    console.log(result)
    return result.rows[0].id
}

const getUsuarioByCuenta = async (idCuenta) => {
    const query = 'SELECT * FROM usuario_cuenta where id_cuenta = '+idCuenta+' ALLOW FILTERING'
    const result = await client.execute(query)
        .catch((error) => {
            console.log(error)
            return -1
        })

    return result.rows[0].id_usuario.toString()
}

const getInstitucion = async (numeroCuenta) => {
    const regex = new RegExp(/([0-9]*)([A-Za-z&]*)(AH|MQ|MD)/gm)
    const institucion = regex.exec(numeroCuenta)[2]

    const query = 'SELECT * FROM institucion WHERE logo = \''+institucion+'.jpg\'  ALLOW FILTERING'

    const result = await client.execute(query)
        .catch((error) => {
            console.log(error)
            return -1
        })
    
    return result.rows[0].id
}

const getNextId = async (table) => {
    const query = 'SELECT max(id) as last_id FROM ' + table;

    const result = await client.execute(query)
        .catch((error) => {
            console.log(error)
            return -1
        })
    
    const lastId = parseInt(result.rows[0].last_id, 10)
    return (lastId + 1)
}

const disponible = async (usuario) => {
    const query = 'SELECT id, resumen FROM cuenta_usuario_transaccion WHERE id_usuario = ? ALLOW FILTERING'

    const result = await client.execute(query, [usuario], {prepare: true})
        .catch((error) => {
            console.log(error)
            return -1
        })
    
    const values = result.rows
    values.sort((a, b) => {
        return a.id - b.id;
    })

    var saldo = values.reduce((i, cosa) => {
        if(typeof i == 'object') {
            if(i.resumen.indexOf('DEBITO FALLIDO: ') != -1 || i.resumen.indexOf('CREDITO FALLIDO: ') != -1) {
                i = 0
            } else if(i.resumen.indexOf('DEBITO: ') != -1 || i.resumen.indexOf('CREDITO: ') != -1) {
                i = i.resumen.replace('DEBITO: ', '').replace('CREDITO: ', '')
            }
        } 

        if(cosa.resumen.indexOf('DEBITO: ') != -1) {
            return parseInt(i) - parseInt(cosa.resumen
                .replace('DEBITO: ', '')
                .replace('DEBITO FALLIDO: ', '')
                .replace('CREDITO: ', '')
                .replace('CREDITO FALLIDO: ', ''))
        }

        if(cosa.resumen.indexOf('CREDITO: ') != -1) {
            return parseInt(i)  + parseInt(cosa.resumen
                .replace('DEBITO: ', '')
                .replace('DEBITO FALLIDO: ', '')
                .replace('CREDITO: ', '')
                .replace('CREDITO FALLIDO: ', '')) 
        }
        return 0 + parseInt(i)    
    })

    
    return (saldo > 0) ? saldo: 0
}

module.exports = {
    crearTransaccion
}