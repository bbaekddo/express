/*
const tp = require('./template');
const database = require('./db');
const qs = require("querystring");
const sn = require("sanitize-html");

/!*exports.home = function (request, response, options) {
    const pageTitle = "Welcome";
    const description = "Hello Node.js!";
    let topicList = [];
    
    database.query('SELECT * FROM topic', (error, topics) => {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < topics.length; i++) {
                topicList.push(topics[i].title);
            }
    
            response.writeHead(200);
            response.end(tp.html(pageTitle, topicList, description, options));
        }
    });
}*!/

exports.page = function (request, response, pageTitle, options) {
    let topicList = [];
    
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
                    <p>${data[0].description}</p>
                    <p>by ${data[0].name}</p>
                `;
                
                if (error){
                    throw error;
                } else{
                    response.writeHead(200);
                    response.end(tp.html(pageTitle, topicList, desc, options));
                }
            });
        }
    });
}

exports.create = function (request, response, options) {
    let pageTitle = "Create Index";
    let topicList = [];
    
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
                        <form action="/process_create" method="post">
                            <p>
                                <input type="text" name="textline" placeholder="Title">
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
                    
                    response.writeHead(200);
                    response.end(tp.html(pageTitle, topicList, description, options));
                }
            });
        }
    });
}

exports.create_process = function (request, response) {
    let create_body = '';
    
    request.on('data', (data) => {
        create_body += data;
    });
    request.on('end', () => {
        const post = qs.parse(create_body);
        const title = post.textline;
        const sanitizedDesc = sn(post.description, {
            allowedTags : ['i', 'b']
        });
        const authorName = post.authors;
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
                    [title, sanitizedDesc, authorId], (error) => {
                        if (error){
                            throw error;
                        } else{
                            response.writeHead(302, {Location: `/?id=${title}`});
                            response.end();
                        }
                    });
            }
        });
    });
}

exports.update = function (request, response, pageTitle, options) {
    let topicList = [];
    
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
                                    <form action="/process_update" method="post">
                                        <p>
                                            <input type="text" name="id" placeholder="Update Title">
                                        </p>
                                        <p>
                                            <input type="text" name="textline" value="${data1[0].title}" readonly>
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
                    
                            response.writeHead(200);
                            response.end(tp.html(data1[0].title, topicList, description, options));
                        }
                    });
                }
            });
        }
    });
}

exports.update_process = function (request, response) {
    let update_body = '';
    
    request.on('data', (data) => {
        update_body += data;
    });
    request.on('end', () => {
        const post = qs.parse(update_body);
        const newTitle = post.id;
        const oldTitle = post.textline;
        const desc = post.description;
        const authorName = post.authors;
        
        database.query(`SELECT id FROM author WHERE name=?`, [authorName], (error, data) => {
            if (error) {
                throw error;
            } else{
                database.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE title=?`, [newTitle, desc, data[0].id, oldTitle], (error) => {
                    if (error) {
                        throw error;
                    } else{
                        response.writeHead(302, {Location: `/?id=${newTitle}`});
                        response.end();
                    }
                });
            }
        });
    });
}

exports.delete = function (request, response) {
    let delete_body = '';
    
    request.on('data', (data) => {
        delete_body += data;
    });
    request.on('end', () => {
        let post = qs.parse(delete_body);
        let id = post.id;
        
        database.query(`DELETE FROM topic WHERE title=?`, [id], (error) => {
            if (error) {
                throw error;
            } else{
                response.writeHead(302, {Location: `/`});
                response.end();
            }
        });
    });
}*/
