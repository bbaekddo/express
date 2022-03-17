const express = require('express');
const router = express.Router();
const template = require("../lib/template");
const cookie = require("../cookie");

// Login check
// const loginBtn = `<a href="/login">login</a>`;
// const logoutBtn = `<a href="/logout">logout</a>`;
// function authIsOwner(req, res) {
//     let isOwner = false;
//     let cookies = {};
//     if (req.headers.cookie) {
//         cookies = cookie.parse(req.headers.cookie);
//     }
//     if (cookies.email === 'guest1' && cookies.password === 'password1') {
//         isOwner = true;
//     }
//
//     return isOwner;
// }

// login page
// router.get('/', (req, res) => {
//     const title = "Login";
//     const topicList = [];
//     const description = "Insert your ID & Password";
//     //language=HTML
//     const options = `
//         <form action="/login/process" method="post">
//             <p><input type="text" name="email" placeholder="email"></p>
//             <p><input type="password" name="password" placeholder="password"></p>
//             <p><input type="submit"></p>
//         </form>
//     `;
//
//     res.send(template.html(title, topicList, description, options, loginBtn));
// });

router.post('/process', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email === 'guest1' && password === 'password1') {
        console.log("Login Success!");
        res.cookie('email', `${email}`, { expires: new Date(Date.now() + 600000), httpOnly: true });
        res.cookie('password', `${password}`, { expires: new Date(Date.now() + 600000), httpOnly: true });
        res.redirect('../');
    } else {
        console.log("Login Fail...");
        res.redirect('/login');
    }
});

/*router.get('/logout', (req, res) => {
    const cookies = req.headers.cookie;
    const emailCookie = cookies.email;
    const passwordCookie = cookies.password;

    res.cookie('email', `${emailCookie}`, { maxAge: 0 });
    res.cookie('password', `${passwordCookie}`, { maxAge: 0 });
    res.redirect('../');
});*/

module.exports = router;
