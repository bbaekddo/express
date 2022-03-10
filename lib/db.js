const ms = require('mysql');

let db = ms.createConnection({
    host : 'localhost',
    user : 'daram',
    password : 'Qnpfreh93!',
    database : 'opentutorials'
});
db.connect();
module.exports = db;