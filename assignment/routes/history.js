var express = require('express');
var router = express.Router();
const redis = require('redis');
const aws = require('aws-sdk');

console.log("First page line");


const AWS = require('aws-sdk');
const s3 = new AWS.S3();

// var storedKeys = [];
// const listAllKeys = (params, out = []) => new Promise((resolve, reject) => {
//     s3.listObjectsV2(params).promise()
//         .then(({ Contents, IsTruncated, NextContinuationToken }) => {
//             out.push(...Contents);
//             !IsTruncated ? resolve(out) : resolve(listAllKeys(Object.assign(params, { ContinuationToken: NextContinuationToken }), out));

//         })
//         .catch(reject);
// });

// listAllKeys({ Bucket: 'cab432-tweetz-bucket' })
//     .then(console.log)
//     .catch(console.log);

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
                console.log(item.Key);
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
    // return awskeys;
}
listAllObjectsFromS3Bucket('cab432-tweetz-bucket');


/* GET local history page. */
router.get('/', function (req, res, next) {
    res.render('history');
});

module.exports = router;