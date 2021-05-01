
const db = require('./db')
const pool = db.pool;
exports.getAll = (balance) => {
    return pool.query(`
        SELECT * FROM products WHERE price <= '${balance}';
    `).then(r => {
        return r;
    }).catch(e=> {
        throw new Error(e)
    })
}
exports.getOne = (id) => {
    return pool.query(`
        SELECT * FROM products WHERE id = ${id};
    `).then(r => {
        if(r.length > 0) return r[0];
        else return {};
    }).catch(e=> {
        throw new Error(e)
    })
}