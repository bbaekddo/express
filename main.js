const express = require('express');
const app = express();
const {static} = require("express");
const template = require('./lib/template');
const topicRouter = require('./routes/topic');
const pageRouter = require('./routes/page');
const loginRouter = require('./routes/login');
const database = require('./lib/db');
const bodyParser = require("body-parser");
const cookie = require('cookie');
const comp = require('compression');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(comp());
app.use(static('public'));
// app.use('/topics', topicRouter);
// app.use('/pages', pageRouter);
app.use('/login', loginRouter);

// Login check
const loginBtn = `<a href="/login">login</a>`;
const logoutBtn = `<a href="/logout">logout</a>`;
function authIsOwner(req, res) {
    let isOwner = false;
    let cookies = {};
    if (req.headers.cookie) {
        cookies = cookie.parse(req.headers.cookie);
    }
    if (cookies.email === 'guest1' && cookies.password === 'password1') {
        isOwner = true;
    }
    
    return isOwner;
}

// index page
app.get('/', (req, res) => {
    const pageTitle = "Welcome";
    let topicList = [];
    const description = "Hello Node.js!";
    const isOwner = authIsOwner(req, res);
    
    database.query('SELECT * FROM topic', (error, topics) => {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < topics.length; i++) {
                topicList.push(topics[i].title);
            }
            
            if (isOwner === true) {
                res.send(template.html(pageTitle, topicList, description, `<p><a href="/topics/create">create</a></p>`, logoutBtn));
            } else{
                res.send(template.html(pageTitle, topicList, description, `<p><a href="/topics/create">create</a></p>`, loginBtn));
            }
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