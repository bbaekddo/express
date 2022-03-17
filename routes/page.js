const express = require('express');
const router = express.Router();
const database = require("../lib/db");
const template = require("../lib/template");

router.get('/:pageTitle', (req, res) => {
    const pageTitle = req.params.pageTitle;
    let topicList = [];
    
    const control = `
            <p>
                <a href="/topics/create">create</a>
                <a href="/pages/${pageTitle}/update">update</a>
                <form action="/topics/delete" method="post">
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
                    res.send(template.html(pageTitle, topicList, desc, control));
                }
            });
        }
    });
});

router.get('/:pageTitle/update', (req, res) => {
    let topicList = [];
    let pageTitle = req.params.pageTitle;
    
    const control = `
            <p>
                <a href="/topics/create">create</a>
                <form action="/topics/delete" method="post">
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
                                            ${template.selec(data2, data1[0].author_id)}
                                        </p>
                                        <p>
                                            <input type="submit" name="submit">
                                        </p>
                                    </form>
                                    `;
                            
                            res.send(template.html(data1[0].title, topicList, description, control));
                        }
                    });
                }
            });
        }
    });
});

router.post('/:pageTitle/update', (req, res) => {
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

module.exports = router;