var express = require('express');
var router = express.Router();

/* GET local history page. */
router.get('/', function (req, res, next) {
    res.render('history');
});

module.exports = router;