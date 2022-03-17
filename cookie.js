const http = require('http');
const cookie = require('cookie');

http.createServer((req, res) => {
    let cookies = {};
    if (req.headers.cookie !== undefined) {
        cookies = cookie.parse(req.headers.cookie);
    }
    res.writeHead(200, {
        'Set-Cookie': ['yummy_cookie=choco',
            `tasty_cookie=strawberry; Max-Age=${10}`,
            'Secure=secureCookie; Secure',
            `HttpOnly=httpOnly; HttpOnly; Max-Age=${10}; Path=/cookie`,
            'Path=path; Path=/path'
        ]
    })
    console.log('Success');
    res.end('Cookie!');
}).listen(3000)