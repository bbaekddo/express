const database = require('./db');

module.exports = {
    html : function (title, fileList, description, option, auth) {
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
            
            ${auth}
            
            <h3><a href="/author">Author</a></h3>
            <!--<input type="button" id="authBtn" value="checking..." onclick="
                if (this.value === 'login') {
                    FB.login(function(res){
                        console.log('login => ', res);
                        checkLoginStatus(res);
                    });
                } else {
                    FB.logout(function(res){
                        console.log('logout => ', res);
                        checkLoginStatus(res);
                    });
                }
            ">-->
            <ol>
                ${indexList}
            </ol>
            ${option}

            <!--<script>
                window.fbAsyncInit = function() {
                    FB.init({
                        appId      : '420065332493079',
                        cookie     : true,
                        xfbml      : true,
                        version    : 'v12.0'
                    });

                    FB.AppEvents.logPageView();

                    FB.getLoginStatus(checkLoginStatus);
                };
                
                const checkLoginStatus = (res) => {
                    if (res.status === 'connected'){
                        document.querySelector('#authBtn').value = 'logout';
                    } else{
                        document.querySelector('#authBtn').value = 'login';
                    }
                }

                (function(d, s, id){
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) {return;}
                    js = d.createElement(s); js.id = id;
                    js.src = "https://connect.facebook.net/en_US/sdk.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));
            </script>-->

            <h2>${title}</h2>
            <p>
                ${description}
            </p>
            <img src="/image/hello.jpeg" alt="hello image" style="width: 300px">
            </body>
            </html>
        `;
    },
    list : function (fileList) {
        let listHTML = '';
        fileList.forEach(i => {
            //language=HTML
            listHTML += `<li><a href="/pages/${i}">${i}</a></li>`;
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
