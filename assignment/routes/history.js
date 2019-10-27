const express = require('express');
const router = express.Router();
const redis = require('redis');
const Sentiment = require('sentiment');

const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

/* GET local history page. */
router.get('/', async function (req, res, next) {

    let keys = await listAllObjectsFromS3Bucket('cab432-tweetz-bucket');

    let tweets = await getTweetsFromKeys(keys);

    let sentiments = await getSentimentAnalysis(tweets);

    res.render('history', { keys, sentiments})

});

async function getSentimentAnalysis(tweets) {
    let sentiment = new Sentiment();
    console.log('in getsentimentanalysis')
    let master = [];

    for (let i = 0; i < tweets.length; i++) {
        let hashtag = [];
        for (let j = 0; j < tweets[i].length; j++) {
            let tweet = tweets[i][j];
            let result = JSON.stringify(sentiment.analyze(tweet).score);
            hashtag.push(result);
        }

        master.push(hashtag);
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

module.exports = router;