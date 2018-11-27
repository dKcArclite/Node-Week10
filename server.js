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

var defaultOptions = {
    // Google API key
    key: null,
    // Search in a specified field
    field: null,
    // The position in the collection at which to start the list of results (startIndex)
    offset: 0,
    // The maximum number of elements to return with this request (Max 40) (maxResults)
    limit: 30,
    // Restrict results to books or magazines (or both) (printType)
    type: 'all',
    // Order results by relevance or newest (orderBy)
    order: 'relevance',
    // Restrict results to a specified language (two-letter ISO-639-1 code) (langRestrict)
    lang: 'en'
};

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
                if (obj.title != undefined)
                {
                    valueToPush["title"] = obj.title;
                }
                else
                {
                    valueToPush["title"] = 'No title listed';
                }                

                if (obj.authors != undefined && obj.authors[0] != undefined)
                {
                    valueToPush["author"] = obj.authors[0];
                }
                else
                {
                    valueToPush["author"] = 'Author Unknown';
                }

                if (obj.publishedDate != undefined && obj.publishedDate.substring(0, 4) != undefined) {
                    valueToPush["copyright"] = obj.publishedDate.substring(0, 4);
                }
                else {
                    valueToPush["author"] = 0000;
                }
                
                //valueToPush["copyright"] = obj.publishedDate.substring(0,4);
                //valueToPush["description"] = obj.description;
                data.push(valueToPush);
            }

            var params = { data: data };
            response.render('pages/results', params);

        }
    });
}

function getBookList(param, callback) {

    books.search(param, defaultOptions, function (error, results) {
        if (!error) {
            //console.log(results);
            callback(null, results);
        } else {
            console.log(error);
        }
    });
} 


