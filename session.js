const express = require('express');
const parseurl = require('parseurl');
const session = require('express-session');
const fileStore = require('session-file-store')(session);
const app = express();

app.use(session({
    secret: 'basck!$@',
    resave: false,
    saveUninitialized: true,
    store: new fileStore()
}));


app.get('/', (req, res, next) => {
    console.log(req.session);
    if (req.session.num === undefined) {
        req.session.num = 1;
    } else {
        req.session.num = req.session.num + 1;
    }
    res.send(`Views : ${req.session.num}`);
});

app.listen(3000, function(){
    console.log('3000!');
});