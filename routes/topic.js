const express = require('express');
const router = express.Router();
const database = require("../lib/db");
const template = require("../lib/template");
const sn = require("sanitize-html");

router.get('/create', (req, res) => {
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
                            <form action="/topics/create" method="post">
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
                    
                    res.send(template.html(pageTitle, topicList, description, control));
                }
            });
        }
    });
});

router.post('/create', (req, res) => {
    
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

router.post('/delete', (req, res) => {
    let title = req.body.id;
    
    database.query(`DELETE FROM topic WHERE title=?`, [title], (error) => {
        if (error) {
            throw error;
        } else{
            res.redirect('/');
        }
    });
});

router.post('/delete', (req, res) => {
    let title = req.body.id;
    
    database.query(`DELETE FROM topic WHERE title=?`, [title], (error) => {
        if (error) {
            throw error;
        } else{
            res.redirect('/');
        }
    });
});

module.exports = router;
