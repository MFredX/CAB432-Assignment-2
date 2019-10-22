var Twit = require('twit');
const CONFIG = require("../../config.json");

var T = new Twit({
    consumer_key: CONFIG.twitter_api_key,
    consumer_secret: CONFIG.twitter_api_secret,
    access_token: CONFIG.twitter_access_token,
    access_token_secret: CONFIG.twiiter_access_secret
  })

async function getTweets(params) {
    T.get('search/tweets', { q: 'cloud', count: 2 }, function(err, data, response) {
        console.log(data.statuses);
    });
}

module.exports = {
    getTweets
  };