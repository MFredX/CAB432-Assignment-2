var express = require('express');
var router = express.Router();
const redis = require('redis');

const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

/* GET local history page. */
router.get('/', async function (req, res, next) {

    let keys = await listAllObjectsFromS3Bucket('cab432-tweetz-bucket');

    let tweets = await getTweetsFromKeys(keys);

    

    // console.log('KEYS: ', keys)
    // console.log('tweets: ', tweets)

    res.render('history', { keys })

    // listAllObjectsFromS3Bucket('cab432-tweetz-bucket').then((awskeys) => {

    // }).then((obj)=> {
    //     console.log(obj.master);
    //     res.render('history', {keys: obj.awskeys});

    // });

    // .then((data) => {
    //     res.render('history', {keys: data});
    // });

    // .then((awskeys) => {
    //     let all = [];

    //     awskeys.forEach(item => {
    //         let hashtagData = [];

    //         const params = { Bucket: 'cab432-tweetz-bucket', Key: item};

    //         new AWS.S3({apiVersion: '2006-03-01'}).getObject(params, (err  , result) =>   {
    //             if (result) {
    //                 let objectData = result.Body.toString('utf-8');
    //                 let tweets = JSON.parse(objectData);
    //                 tweets.forEach(tweet => {
    //                     //console.log(tweet.text);
    //                     hashtagData.push(tweet.text);
    //                 })
    //             }
    //         })
    //         let fullHashtagData = {hashtag: item, data: hashtagData};
    //         all.push(fullHashtagData);
    //     })
    //     console.log(all);
    // })
});

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