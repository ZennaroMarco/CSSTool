var express = require('express');
var neo4j = require('neo4j');

var router = express.Router();
var db = new neo4j.GraphDatabase({
    url: 'http://localhost:7474',
    auth: {username: 'neo4j', password: 'valerio92'},
});

module.exports = router;