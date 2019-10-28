const express = require('express');
const router = express.Router();
const redis = require('redis');
const Sentiment = require('sentiment');

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

/* GET local history page. */
router.get('/', async function (req, res, next) {

    let keys = await listAllObjectsFromS3Bucket('cab432-tweetz-bucket');

    let tweets = await getTweetsFromKeys(keys);

    let sentiments = await getSentimentAnalysis(tweets);
    
    keys = keys.map(key => key.substring(10, key.length-17)); //chop off the s3 key formatting

    res.render('history', { keys, sentiments})

});

async function getSentimentAnalysis(tweets) {
    let sentiment = new Sentiment();
    let master = [];

    for (let i = 0; i < tweets.length; i++) {
        let hashtag = 0;
        for (let j = 0; j < tweets[i].length; j++) {
            let tweet = tweets[i][j];
            let result = JSON.stringify(sentiment.analyze(tweet).score);
            hashtag = hashtag + Number(result);
            //hashtag.push(result);
        }
        let avg = Math.round(hashtag / tweets[i].length);

        master.push(avg);
    }

    return master;
}

async function getTweetsFromKeys(awsKeys) {
    let master = [];

    for (let i = 0; i < awsKeys.length; i++) {
        let hashtag = [];
        const params = { Bucket: 'cab432-tweetz-bucket', Key: awsKeys[i]};
        let object = await s3.getObject(params).promise();
        if (object) {
            let objectData = object.Body.toString('utf-8');
            let tweets = JSON.parse(objectData);
            tweets.forEach(tweet => {
                hashtag.push(tweet.text);
            })
        }
        master.push(hashtag);
    }

    return master;
}

async function listAllObjectsFromS3Bucket(bucket) {
    awskeys = [];
    let isTruncated = true;
    let marker;
    while (isTruncated) {
        let params = { Bucket: bucket };
        if (marker) params.Marker = marker;
        try {
            const response = await s3.listObjects(params).promise();
            response.Contents.forEach(item => {
                // console.log(item.Key);
                awskeys.push(item.Key);
            });
            isTruncated = response.IsTruncated;
            if (isTruncated) {
                marker = response.Contents.slice(-1)[0].Key;
            }
        } catch (error) {
            throw error;
        }
    }
    return awskeys;
}
listAllObjectsFromS3Bucket('cab432-tweetz-bucket');


/* GET local history page. */
router.get('/', function (req, res, next) {
    listAllObjectsFromS3Bucket('cab432-tweetz-bucket')

    .then((awskeys) => {
        awskeys.forEach(item => {
            const params = { Bucket: 'cab432-tweetz-bucket', Key: item};
            return new AWS.S3({apiVersion: '2006-03-01'}).getObject(params, (err  , result) =>   {
                if (result) {
                    let objectData = result.Body.toString('utf-8');
                    let tweets = JSON.parse(objectData);
                    tweets.forEach(tweet => {
                        console.log(tweet.text);
                    })
                }
            })
        })
    })
    .then((hello) => {
        console.log(hello);
    });
    
    res.render('history');
});

module.exports = router;