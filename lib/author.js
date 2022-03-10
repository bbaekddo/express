const tp = require('./template');
const database = require('./db');
const qs = require("querystring");
const sn = require("sanitize-html");
const {page} = require("./topic");

exports.authorTable = function (request, response, options) {
    let topicList = [];
    
    database.query('SELECT * FROM topic', (error, topics) => {
        if (error) {
            throw error;
        } else{
            for(let i=0; i<topics.length; i++){
                topicList.push(topics[i].title);
            }
            database.query(`SELECT * FROM author`, (error, authors) => {
                if (error){
                    throw error;
                } else{
                    const pageTitle = "Author Table";
                    //language=HTML
                    const description = `
                        <style>
                            table{
                                border-collapse: collapse;
                            }
                            td{
                                border: 1px solid;
                                padding: 5px;
                            }
                            .header{
                                text-align: center;
                                font-size: 18px;
                                font-weight: bold;
                            }
                            .textCenter{
                                text-align: center;
                            }
                        </style>
                        ${tp.authorTable(authors)}
                    `;
                    
                    response.writeHead(200);
                    response.end(tp.html(pageTitle, topicList, description, options));
                }
            });
        }
    });
}

exports.authorAdd = function (request, response, options) {
    let pageTitle = "Add Author";
    let topicList = [];
    
    database.query('SELECT * FROM topic', (error, topics) => {
        if (error) {
            throw error;
        } else{
            for(let i=0; i<topics.length; i++){
                topicList.push(topics[i].title);
            }
    
            database.query(`SELECT * FROM author`, (error, authors) => {
                if (error) {
                    throw error;
                } else {
                    //language=HTML
                    const description = `
                        <style>
                            table{
                                border-collapse: collapse;
                            }
                            td{
                                border: 1px solid;
                                padding: 5px;
                            }
                            .header{
                                text-align: center;
                                font-size: 18px;
                                font-weight: bold;
                            }
                            .textCenter{
                                text-align: center;
                            }
                        </style>
                        ${tp.authorTable(authors)}
                        <form action="/process_add" method="post">
                            <p>
                                <input type="text" name="textline" placeholder="Author">
                            </p>
                            <p>
                                <textarea name="description" placeholder="Profile"></textarea>
                            </p>
                            <p>
                                <input type="submit" name="Create">
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

exports.add_process = function (request, response) {
    let create_body = '';
    
    request.on('data', (data) => {
        create_body += data;
    });
    request.on('end', () => {
        let post = qs.parse(create_body);
        let title = post.textline;
        let sanitizedDesc = sn(post.description, {
            allowedTags : ['i', 'b']
        });
        
        database.query(`INSERT INTO author (name, profile) VALUES (?, ?)`,
            [title, sanitizedDesc], (error) => {
                if (error){
                    throw error;
                } else{
                    response.writeHead(302, {Location: `/author`});
                    response.end();
                }
            });
    });
}

exports.updateAuthor = function (request, response, authorId, options) {
    let topicList = [];
    
    database.query('SELECT * FROM topic', (error, topics) => {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < topics.length; i++) {
                topicList.push(topics[i].title);
            }
    
            database.query(`SELECT * FROM author`, (error, authors) => {
                if (error) {
                    throw error;
                } else {
                    let pageTitle = "Update Author";
                    let authName = '';
                    let authProf = '';
    
                    for (let i=0; i<authors.length; i++) {
                        if (authors[i].id ===  Number(authorId)) {
                            authName = authors[i].name;
                            authProf = authors[i].profile;
                        }
                    }
                    
                    //language=HTML
                    const description = `
                        <style>
                            table{
                                border-collapse: collapse;
                            }
                            td{
                                border: 1px solid;
                                padding: 5px;
                            }
                            .header{
                                text-align: center;
                                font-size: 18px;
                                font-weight: bold;
                            }
                            .textCenter{
                                text-align: center;
                            }
                        </style>
                        ${tp.authorTable(authors)}
                        <form action="/process_updateAuthor" method="post">
                            <p>
                                <input type="text" name="textline" placeholder="Update Name">
                            </p>
                            <p>
                                <input type="text" name="oldName" value="${authName}" readonly>
                            </p>
                            <p>
                                <textarea name="description">${authProf}</textarea>
                            </p>
                            <p>
                                <input type="submit" name="Update">
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

exports.updateAuthor_process = function (request, response) {
    let update_body = '';
    
    request.on('data', (data) => {
        update_body += data;
    });
    request.on('end', () => {
        const post = qs.parse(update_body);
        const newName = post.textline;
        const oldName = post.oldName;
        const profile = post.description;
    
        database.query(`UPDATE author SET name=?, profile=? WHERE name=?`, [newName, profile, oldName], (error) => {
            if (error) {
                throw error;
            } else{
                response.writeHead(302, {Location: `/author`});
                response.end();
            }
        });
    });
}

exports.deleteAuthor = function (request, response) {
    let delete_body = '';
    
    request.on('data', (data) => {
        delete_body += data;
    });
    request.on('end', () => {
        let post = qs.parse(delete_body);
        let id = post.id;
        
        database.query(`DELETE FROM topic WHERE author_id=?`, [id], (error) => {
           if (error) {
               throw error;
           } else {
               database.query(`DELETE FROM author WHERE id=?`, [id], (error) => {
                   if (error) {
                       throw error;
                   } else{
                       response.writeHead(302, {Location: `/author`});
                       response.end();
                   }
               });
           }
        });
    });
}