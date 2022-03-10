const ms = require('mysql');

let db = ms.createConnection({
    host : '127.0.0.1',
    user : 'daram',
    password : 'Qnpfreh93!',
    database : 'opentutorials'
});
db.connect();
module.exports = db;