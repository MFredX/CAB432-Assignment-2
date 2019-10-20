var express = require('express');
var router = express.Router();

/* POST results - listening. */
router.post('/', function(req, res, next) {
    
    var hashtags = req.body.hashtags;
    var hashtagsArray = hashtags.split(",");

    //Send error page is array is empty
    //FIXME: Correct error page is not loading
    if (!hashtagsArray) { res.status(400).render('error', {error: "Nothing to search!", message: "It looks like you didn't give us any terms to search for."})}
    
    //this is where a lot of the processing will be done

    //TODO: Check cache - if cache has data, send data

    //TODO: Check S3 - if S3 has data, send data

    //TODO: Request tweets for each hastag from Twitter 

    //TODO: Get sentiment analysis for each set of tweets

    //TODO: Convert analysis to charts

    //TODO: Send off to storage - send both the tweets and the analysis with the hashtag as the key to cache and S3 (as a promise)

    //TODO: Display results

    res.status(200).render('results', {hashtags: hashtagsArray});
});

module.exports = router;
