const db = require('./db')
const connection = db.connection;
const pool = db.pool;
exports.create = (request) => {
    return new Promise((resolve,reject) => {
        return connection.beginTransactionAsync()
    .then(function() {
        return connection.queryAsync(`INSERT INTO requests(productId, userId, status, createdAt, updatedAt)   
        VALUES (${request.productId}, ${request.userId}, false,'${request.createdAt}','${request.updatedAt}');`);
    }).then(function() {
        return connection.queryAsync(`UPDATE users SET balance = ${request.newBalance} WHERE id = ${request.userId};`);
    }).then(function() {
        connection.commit();
        resolve({})
    }).error(function(e) {
        connection.rollback();
        reject(e)
    });
    })
}
exports.getAll = (userId) => {
    return pool.query(`
        SELECT * FROM requests WHERE userId = ${userId};
    `).then(r => {
        return r;
    }).catch(e=> {
        throw new Error(e)
    })
}
exports.getOne = (id) => {
    return pool.query(`
        SELECT * FROM requests WHERE id = ${id};
    `).then(r => {
        if(r.length > 0) return r[0];
        else return {};
    }).catch(e=> {
        throw new Error(e)
    })
}
exports.deliver = (requestId) => {
    return pool.query(`
        UPDATE requests SET status = true WHERE id = ${requestId}
    `).then(r => {
        return {};
    }).catch(e=> {
        throw new Error(e)
    })
}

exports.cancelRequest = (requestId, newBalance, userId) => {
    return new Promise((resolve,reject) => {
        return connection.beginTransactionAsync()
    .then(function() {
        return connection.queryAsync(`DELETE FROM requests WHERE id = ${requestId};`);
    }).then(function() {
        return connection.queryAsync(`UPDATE users SET balance = ${newBalance} WHERE id = ${userId};`);
    }).then(function() {
        connection.commit();
        resolve({})
    }).error(function(e) {
        connection.rollback();
        reject(e)
    });
    })
}