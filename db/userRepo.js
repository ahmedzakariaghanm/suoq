const db = require('./db')
const pool = db.pool;
exports.isExist = (email) => {
    return pool.query(`
        SELECT id FROM users WHERE email = '${email}';
    `).then(r => {
        if(r.length > 0)return true;
        else return false;
    }).catch(e=> {
        throw new Error(e)
    })
}

exports.create = (user) => {
    return pool.query(`
    INSERT INTO users(balance,firstName,lastName,email,password,createdAt,updatedAt) 
    VALUES (${user.balance},'${user.firstName}','${user.lastName}','${user.email}','${user.password}','${user.createdAt}','${user.updatedAt}');
    `).then(r => {
        return {};
    }).catch(e=> {
        throw new Error(e)
    })
}
exports.getOne = (email) => {
    return pool.query(`
        SELECT * FROM users WHERE email = '${email}';
    `).then(r => {
        if(r.length > 0) return r[0];
        else return {};
    }).catch(e=> {
        throw new Error(e)
    })
}