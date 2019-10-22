let Twit = require('twit');
let Sentiment = require('sentiment');
const CONFIG = require("../../config.json");

let T = new Twit({
    consumer_key: CONFIG.twitter_api_key,
    consumer_secret: CONFIG.twitter_api_secret,
    access_token: CONFIG.twitter_access_token,
    access_token_secret: CONFIG.twiiter_access_secret
});

let sentiment = new Sentiment();

async function getTweets() {
    T.get('search/tweets', { q: 'cat', count: 2 }, function(err, data, response) {
        let tweets = data.statuses;
        for (let i = 0; i < tweets.length; i++) {
            let result  = JSON.stringify(sentiment.analyze(tweets[i].text).score);
            console.log('result: ' + result + '. Text: ' + tweets[i].text);
            //console.log(JSON.stringify(result));
        }
    });
}

module.exports = {
    getTweets
  };