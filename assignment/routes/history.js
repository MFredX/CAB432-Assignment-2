var express = require('express');
var router = express.Router();
const redis = require('redis');

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

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