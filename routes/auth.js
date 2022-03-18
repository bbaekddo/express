const express = require('express');
const router = express.Router();
const database = require("../lib/db");
const template = require("../lib/template");

const authData = {
    email: 'guest1',
    password: 'password1',
    nickname: 'hello'
}

router.get('/login', (req, res) => {
    const pageTitle = "WEB - Login";
    let topicList = [];
    const control = ``;
    
    database.query('SELECT * FROM topic', (error, topics) => {
        if (error) {
            throw error;
        } else{
            for(let i=0; i<topics.length; i++){
                topicList.push(topics[i].title);
            }
            //language=HTML
            const description = `
                <form action="/auth/login" method="post">
                    <p>
                        <input type="text" name="email" placeholder="Email">
                    </p>
                    <p>
                        <input type="password" name="password" placeholder="password">
                    </p>
                    <p>
                        <input type="submit" value="login">
                    </p>
                </form>
            `;
            
            res.send(template.html(pageTitle, topicList, description, control, ``));
        }
    });
});

router.post('/login', (req, res) => {
    console.log(req.session);
    
    const email = req.body.email;
    const password = req.body.password;
    if (email === authData.email && password === authData.password) {
        req.session.is_logined = true;
        req.session.nickname = authData.nickname;
        req.session.save(err => {
            if (err) throw err;
            res.redirect('/');
        })
    } else {
        res.redirect('/auth/login');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/');
    });
});

module.exports = router;
