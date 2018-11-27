const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000;
const url = require('url');
var books = require('google-books-search');

var booksList;

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')

    .get('/calc', function (request, response) {
        calcRate(request, response);
    })

    .get('/books', function (request, response) {
        getBooks(request, response);
    })


    .get('/', (req, res) => res.render('pages/index'))    
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

function getBooks(request, response) {
    var param = request.query.param;

    getBookList(param, function (error, results) {

        if (error || results == null) {
            response.status(500).json({
                success: false,
                data: error
            });
        } else {
            var List = results;
            var data = [];

            for (var i = 0; i < List.length; i++) {
                var obj = List[i];

                var valueToPush = {}; 
                valueToPush["title"] = obj.title;
                valueToPush["author"] = obj.authors[0];
                valueToPush["copyright"] = obj.publishedDate.substring(0,4);
                //valueToPush["description"] = obj.description;
                data.push(valueToPush);
            }

            var params = { data: data };
            response.render('pages/results', params);

        }
    });
}

function getBookList(param, callback) {

    books.search(param, function (error, results) {
        if (!error) {
            //console.log(results);
            callback(null, results);
        } else {
            console.log(error);
        }
    });
} 


