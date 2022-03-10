const database = require('./db');

module.exports = {
    html : function (title, fileList, description, control) {
        let indexList = this.list(fileList);
        //language=HTML
        return `
            <!doctype html>
            <html lang="kr">
            <head>
                <title>WEB - ${title}</title>
                <meta charset="utf-8">
            </head>

            <body>
            <h1><a href="/">WEB</a></h1>
            <h3><a href="/author">Author</a></h3>
            <ol>
                ${indexList}
            </ol>
            ${control}
            <h2>${title}</h2>
            <p>
                ${description}
            </p>
            </body>
            </html>
        `;
    },
    list : function (fileList) {
        let listHTML = '';
        fileList.forEach(i => {
            //language=HTML
            listHTML += `<li><a href="/?id=${i}">${i}</a></li>`;
        });
        return listHTML;
    },
    selec : function (authors, author_id) {
        let listSelec = '';
        let sel = '';
        for(let i=0; i<authors.length; i++){
            if (authors[i].id === author_id){
                sel = ` selected`;
                listSelec += `<option value="${authors[i].name}"${sel}>${authors[i].name}</option>`;
            } else{
                listSelec += `<option value="${authors[i].name}">${authors[i].name}</option>`;
            }
        }
        //language=HTML
        return `
            <select name="authors">
                ${listSelec}
            </select>
        `;
    },
    authorSelec : function (author_name) {
        database.query(`SELECT id, name FROM author`, (error, authors) => {
           if (error) {
               throw error;
           } else {
               for (const list of authors) {
                   if (list.name === author_name) {
                       return list.id;
                   }
               }
           }
        });
    },
    authorTable : function (authors) {
        //language=HTML
        let authorTag = `
            <table>
                <tr class="header">
                    <td>ID</td>
                    <td>Name</td>
                    <td>Profile</td>
                    <td>Update</td>
                    <td>Delete</td>
                </tr>
        `;
        
        for (let list of authors) {
            //language=HTML
            authorTag += `
                <tr>
                    <td class="textCenter">${list.id}</td>
                    <td class="textCenter">${list.name}</td>
                    <td>${list.profile}</td>
                    <td class="textCenter"><a href="/updateAuthor?id=${list.id}">update</a></td>
                    <td class="textCenter">
                        <form action="/delete_author" method="post">
                            <input type="hidden" name="id" value="${list.id}">
                            <input type="submit" value="delete">
                        </form>
                    </td>
                </tr>
               `;
        }
        authorTag += "</table>";
        
        return authorTag;
    }
}
