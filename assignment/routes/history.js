var express = require('express');
var router = express.Router();
const redis = require('redis');


/* GET local history page. */
router.get('/', function (req, res, next) {
    res.render('history');
});

module.exports = router;