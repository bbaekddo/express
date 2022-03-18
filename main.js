const express = require('express');
const app = express();
const {static} = require("express");
const template = require('./lib/template');
const session = require("express-session");
const fileStore = require('session-file-store')(session);
const authRouter = require('./routes/auth');
const pageRouter = require('./routes/page');
const database = require('./lib/db');
const bodyParser = require("body-parser");
const comp = require('compression');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(comp());
app.use(static('public'));
app.use(session({
    secret: 'basck!$@',
    resave: false,
    saveUninitialized: true,
    store: new fileStore()
}));

// 가장 나중에 호춣해야 하는 미들웨어
app.use('/auth', authRouter);
app.use('/pages', pageRouter);

const loginBtn = `<a href="/auth/login">login</a>`;
const logoutBtn = `<a href="/auth/logout">logout</a>`;

// index page
app.get('/', (req, res) => {
    const pageTitle = "Welcome";
    let topicList = [];
    const description = "Hello Node.js!";
    let authUI = '';
    
    if (req.session.is_logined) {
        authUI = `${req.session.nickname} | ${logoutBtn}`;
    } else {
        authUI = loginBtn;
    }
    
    database.query('SELECT * FROM topic', (error, topics) => {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < topics.length; i++) {
                topicList.push(topics[i].title);
            }
            
            req.session.save(err => {
                if (err) throw err;
    
                res.send(template.html(pageTitle, topicList, description, ``, authUI));
            });
        }
    });
});

app.use(function(req, res, next) {
    res.status(404).send("Sorry can't find that!");
});

app.use(function(err, req, res, next) {
    res.status(500).send("Something is broken!");
});

app.listen(3000, () => {
    console.log(`Example app listening on port 3000`);
});