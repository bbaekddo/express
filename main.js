const express = require('express');
const app = express();
const {static} = require("express");
const template = require('./lib/template');
const topicRouter = require('./routes/topic');
const pageRouter = require('./routes/page');
const database = require('./lib/db');
const bodyParser = require("body-parser");
const comp = require('compression');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(comp());
app.use(static('public'));
app.use('/topics', topicRouter);
app.use('/pages', pageRouter);

// index page
app.get('/', (req, res) => {
    const pageTitle = "Welcome";
    let topicList = [];
    const description = "Hello Node.js!";
    
    database.query('SELECT * FROM topic', (error, topics) => {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < topics.length; i++) {
                topicList.push(topics[i].title);
            }
            
            res.send(template.html(pageTitle, topicList, description, `<p><a href="/topics/create">create</a></p>`));
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