var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function(req, res) {
    // The URL I will scrape from, in this case, Anchorman 2.

    url = 'http://www.imdb.com/title/tt1229340/';

    // callback takes three parameters

    request(url, function(error, response, html) {

        // Check for errors
        if (!error) {
            //utilize cheerio library on the returned html, giving us jquery functionality

            var $ = cheerio.load(html);

            //Define varibales we want to capture
            var title, release, rating;
            var json = { title: "", release: "", rating: "" };

            $('.title_wrapper').filter(function() {
                var data = $(this);

                title = data.children().first().text();

                json.title = title;

                $('.reviewCount').filter(function() {
                    var data = $(this);

                    // To get the rating, we can simply just get the .text(), no need to traverse the DOM any further

                    rating = data.text();

                    json.rating = rating;
                });


            });

        }

        fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err) {

            console.log('File successfully written! - Check your project directory for the output.json file');

        });

        // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
        res.send('Check your console!');

    });
});


app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;