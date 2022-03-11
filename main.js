const express = require('express');
const tp = require('./lib/template');
const database = require('./lib/db');
const sn = require('sanitize-html');
const bodyParser = require("body-parser");
const comp = require('compression');
const app = express();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(comp());

app.get('/pages/:pageTitle', (req, res) => {
    const pageTitle = req.params.pageTitle;
    let topicList = [];
    
    const control = `
            <p>
                <a href="/create">create</a>
                <a href="/pages/${pageTitle}/update">update</a>
                <form action="/delete" method="post">
                    <input type="hidden" name="id" value="${pageTitle}">
                    <input type="submit" value="delete">
                </form>
            </p>
            `;
    
    database.query('SELECT * FROM topic', (error, topics) => {
        if (error) {
            throw error;
        } else{
            for(let i=0; i<topics.length; i++){
                topicList.push(topics[i].title);
            }
            database.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE title=?`, [pageTitle], (error, data) => {
                //language=HTML
                const desc = `
                    <p>${data[0].description} by ${data[0].name}</p>
                    `;
                
                if (error){
                    throw error;
                } else{
                    res.send(tp.html(pageTitle, topicList, desc, control));
                }
            });
        }
    });
});

app.get('/create', (req, res) => {
    const pageTitle = "Create Index";
    let topicList = [];
    
    const control = ``;
    
    database.query('SELECT * FROM topic', (error, topics) => {
        if (error) {
            throw error;
        } else{
            for(let i=0; i<topics.length; i++){
                topicList.push(topics[i].title);
            }
    
            database.query(`SELECT id, name FROM author`, (error, authors) => {
                if (error) {
                    throw error;
                } else{
                    let authorList = `<select name="authors">`;
                    for (let author of authors) {
                        authorList += `<option value="${author.name}">${author.name}</option>`;
                    }
                    authorList += `</select>`;
                    
                    //language=HTML
                    const description = `
                        <form action="/create" method="post">
                            <p>
                                <input type="text" name="newTitle" placeholder="Title">
                            </p>
                            <p>
                                <textarea name="description" placeholder="Description"></textarea>
                            </p>
                            <p>
                                ${authorList}
                            </p>
                            <p>
                                <input type="submit" name="submit">
                            </p>
                        </form>
                    `;
                    
                    res.send(tp.html(pageTitle, topicList, description, control));
                }
            });
        }
    });
});

app.post('/create', (req, res) => {
    
    const title = req.body.newTitle;
    const saniDesc = sn(req.body.description, {
        allowedTags : ['i', 'b']
    });
    const authorName = req.body.authors;
    let authorId;
    
    database.query(`SELECT id, name FROM author`, (error, authors) => {
        if (error) {
            throw error;
        } else {
            for (const list of authors) {
                if (list.name === authorName) {
                    authorId = list.id;
                }
            }
            
            database.query(`INSERT INTO topic (title, description, created, author_id) VALUES (?, ?, NOW(), ?)`,
                [title, saniDesc, authorId], (error) => {
                    if (error){
                        throw error;
                    } else{
                        res.redirect(`/pages/${title}`);
                    }
                });
        }
    });
});

app.get('/pages/:pageTitle/update', (req, res) => {
    let topicList = [];
    let pageTitle = req.params.pageTitle;
    
    const control = `
            <p>
                <a href="/create">create</a>
                <form action="/delete" method="post">
                    <input type="hidden" name="id" value="${pageTitle}">
                    <input type="submit" value="delete">
                </form>
            </p>
            `;
    
    database.query('SELECT * FROM topic', (error, topics) => {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < topics.length; i++) {
                topicList.push(topics[i].title);
            }
            
            database.query(`SELECT * FROM topic WHERE title=?`, [pageTitle], (error, data1) => {
                if (error) {
                    throw error;
                } else{
                    database.query(`SELECT * FROM author`, (error, data2) => {
                        if (error) {
                            throw error;
                        } else{
                            const description = `
                                    <form action="/pages/${pageTitle}/update" method="post">
                                        <p>
                                            <input type="text" name="upTitle" placeholder="Update Title">
                                        </p>
                                        <p>
                                            <input type="text" name="oldTitle" value="${data1[0].title}" readonly>
                                        </p>
                                        <p>
                                            <textarea name="description">${data1[0].description}</textarea>
                                        </p>
                                        <p>
                                            ${tp.selec(data2, data1[0].author_id)}
                                        </p>
                                        <p>
                                            <input type="submit" name="submit">
                                        </p>
                                    </form>
                                    `;
                            
                            res.send(tp.html(data1[0].title, topicList, description, control));
                        }
                    });
                }
            });
        }
    });
});

app.post('/pages/:pageTitle/update', (req, res) => {
    const newTitle = req.body.upTitle;
    const oldTitle = req.body.oldTitle;
    const description = req.body.description;
    const authorName = req.body.authors;
    
    database.query(`SELECT id FROM author WHERE name=?`, [authorName], (error, data) => {
        if (error) {
            throw error;
        } else{
            database.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE title=?`, [newTitle, description, data[0].id, oldTitle], (error) => {
                if (error) {
                    throw error;
                } else{
                    res.redirect(`/pages/${newTitle}`);
                }
            });
        }
    });
});

app.post('/delete', (req, res) => {
    let title = req.body.id;
    
    database.query(`DELETE FROM topic WHERE title=?`, [title], (error) => {
        if (error) {
            throw error;
        } else{
            res.redirect('/');
        }
    });
});

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
            
            res.send(tp.html(pageTitle, topicList, description, `<p><a href="/create">create</a></p>`));
        }
    });
});

app.listen(3000, () => {
    console.log(`Example app listening on port 3000`);
});