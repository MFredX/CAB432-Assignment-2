const express = require('express');
const router = express.Router();
//Test Comment
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

module.exports = router;
