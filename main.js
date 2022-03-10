const http = require('http');
const tpc = require('./lib/topic');
const aut = require('./lib/author');

let app = http.createServer(function (request, response) {
    let _url = request.url;
    const baseURL = 'http://' + request.headers.host + '/';
    const reqURL = new URL(_url, baseURL);
    const urlSearchParams = reqURL.searchParams;
    const pathName = reqURL.pathname;
    const pageTitle = urlSearchParams.get('id');
    const control1 = `<p><a href="/create">create</a></p>`;
    const control2 = `
        <p>
            <a href="/create">create</a>
            <a href="/update?id=${pageTitle}">update</a>
            <form action="/process_delete" method="post">
                <input type="hidden" name="id" value="${pageTitle}">
                <input type="submit" value="delete">
            </form>
        </p>`;
    const control3 = `<p><a href="/add">create</a></p>`;
    
    if (pathName === '/') {
        // Homepage
        if (pageTitle === null) {
            tpc.home(request, response, control1);
        // Show pages
        } else {
            tpc.page(request, response, pageTitle, control2);
        }
    } else if (pathName === '/create') {
        tpc.create(request, response, control2);
    } else if (pathName === '/process_create') {
        tpc.create_process(request, response);
    } else if (pathName === '/update') {
        tpc.update(request, response, pageTitle,control2);
    } else if (pathName === '/process_update') {
        tpc.update_process(request, response);
    } else if (pathName === '/process_delete') {
        tpc.delete(request, response);
    } else if (pathName === '/author') {
        aut.authorTable(request, response, control3);
    } else if (pathName === '/add') {
        aut.authorAdd(request, response, control3);
    } else if (pathName === '/process_add') {
        aut.add_process(request, response);
    } else if (pathName === '/updateAuthor') {
        aut.updateAuthor(request, response, pageTitle, control3);
    } else if (pathName === '/process_updateAuthor') {
        aut.updateAuthor_process(request, response);
    } else if (pathName === '/delete_author'){
        aut.deleteAuthor(request, response);
    } else{
        response.writeHead(404);
        response.end("Not Found");
    }
});
app.listen(3000);