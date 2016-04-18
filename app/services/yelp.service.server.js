var oauthSignature = require('oauth-signature');
var n = require('nonce')();
var request = require('request');
var qs = require('querystring');
var lodash = require('lodash');

module.exports = function(app) {
    app.get('/api/search/grocery/:name/:location', searchGroceryStores);
    app.get('/api/business/grocery/:groceryId', searchSpecificGroceryStore);



    /* Function for yelp search call
     * ------------------------
     * search_parameters: object with params to search
     * callback: callback(error, response, body)
     */
    function request_yelp_search(search_parameters, callback) {
        /* The type of request */
        var httpMethod = 'GET';
        /* The url we are using for the request */
        var url = 'http://api.yelp.com/v2/search';
         
        /* Default Fruit Rating App Parameters */
            var default_parameters = {
            sort: '0',
            "category_filter": 'grocery'
        };
        /* Oauth Required Parameters */
            var required_parameters = {
                oauth_consumer_key: process.env.YELP_CONSUMER_KEY,
                oauth_token: process.env.YELP_TOKEN,
                oauth_nonce : n(),
                oauth_timestamp : n().toString().substr(0,10),
                oauth_signature_method : 'HMAC-SHA1',
                oauth_version : '1.0'
        };
        /* Parameters are combined in order of importance */
        var parameters = lodash.assign(default_parameters, search_parameters, required_parameters);

        /* We set our secrets here */
        var consumerSecret = process.env.YELP_CONSUMER_SECRET;
        var tokenSecret = process.env.YELP_TOKEN_SECRET;

        /* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
        /* Note: This signature is only good for 300 seconds after the oauth_timestamp */
        var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

        /* We add the signature to the list of parameters */
        parameters.oauth_signature = signature;

        /* Then we turn the paramters object, to a query string */
        var paramURL = qs.stringify(parameters);

        /* Add the query string to the url */
        var apiURL = url+'?'+paramURL;

        /* Then we use request to send make the API Request */
        request(apiURL, function(error, response, body){
            return callback(error, response, body);
        });

    }

            /* Function for yelp search call
             * ------------------------
             * search_parameters: object with params to search
             * callback: callback(error, response, body)
             */
    function request_yelp_business(business, callback) {
        /* The type of request */
        var httpMethod = 'GET';

        /* The url we are using for the request */
        var url = 'https://api.yelp.com/v2/business/' + business + "?";

        /* Default Fruit Rating App Parameters (none) */
        //var default_parameters = {};

        /* Oauth Required Parameters */
        var required_parameters = {
            oauth_consumer_key: process.env.YELP_CONSUMER_KEY,
            oauth_token: process.env.YELP_TOKEN,
            oauth_nonce: n(),
            oauth_timestamp: n().toString().substr(0, 10),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_version: '1.0'
        };

        /* Parameters are combined in order of importance */
        var parameters = lodash.assign(required_parameters);

        /* We set our secrets here */
        var consumerSecret = process.env.YELP_CONSUMER_SECRET;
        var tokenSecret = process.env.YELP_TOKEN_SECRET;

        /* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
        /* Note: This signature is only good for 300 seconds after the oauth_timestamp */
        var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, {encodeSignature: false});

        /* We add the signature to the list of parameters */
        parameters.oauth_signature = signature;

        /* Then we turn the paramters object, to a query string */
        var paramURL = qs.stringify(parameters);


        /* Add the query string to the url */
        var apiURL = url + paramURL;

        /* Then we use request to send make the API Request */
        request(apiURL, function (error, response, body) {
            return callback(error, response, body);
        });
    }


        /* Yelp API Services */

    function searchGroceryStores(req, res) {

        var search_parameters = {
            "term": req.params.name,
            "location": req.params.location
        };

        function callback(error, response, body) {
            if (error) {
                console.error(error);
            }

            if (body !== "undefined") {
                res.json(JSON.parse(body));
            }
        }

        request_yelp_search(search_parameters, callback);
    }

    function searchSpecificGroceryStore(req, res) {

        var search_parameters = req.params.groceryId;

        function callback(error, response, body) {
            if (error) {
                console.error(error);
            }

            if (body !== "undefined") {
                res.json(JSON.parse(body));
            }
        }

        request_yelp_business(search_parameters, callback);
    }


};