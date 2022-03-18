const express = require('express');
const router = express.Router();
const template = require("../lib/template");
const cookieParser = require('cookie-parser');

express().use(cookieParser());

router.get('/', (req, res) => {
    const pageTitle = "Login Page";
    const topicList = [];
    const blank = ``;
    const description = `
        <form action="/login/process" method="post">
            <p>
                <input type="text" name="email" placeholder="email">
            </p>
            <p>
                <input type="text" name="password" placeholder="password">
            </p>
            <p>
                <input type="submit" name="submit">
            </p>
        </form>
        `;
    
    res.send(template.html(pageTitle, topicList, description, blank, blank));
});

router.post('/process', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    if (email === 'guest1' && password === 'password1') {
        res.cookie('emailCookie', email, { expires: new Date(Date.now() + 600000), httpOnly: true });
        res.cookie('passwordCookie', password, { expires: new Date(Date.now() + 600000), httpOnly: true });
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

router.get('/out', (req, res) => {
    const cookies = req.cookies;
    const email = cookies.emailCookie;
    const password = cookies.passwordCookie;
    
    res.cookie('emailCookie', email, { maxAge: 0 });
    res.cookie('passwordCookie', password, { maxAge: 0 });
    res.redirect('/');
});


module.exports = router;