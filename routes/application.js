var express = require('express');
var neo4j = require('neo4j');

var router = express.Router();
var db = new neo4j.GraphDatabase({
    url: 'http://localhost:7474',
    auth: {username: 'neo4j', password: 'valerio92'},
});

router.get('/api/v1/application', function(req, res) {
    var query = [
        'MATCH (a:Application)',
        'RETURN a',
    ].join('\n');

    db.cypher(query, function(err, results) {
        if (err) {
            res.send(err);
        } else {
            res.json(results);
        }
    })
});

router.post('/api/v1/application', function(req, res) {
    var query = [
        'CREATE (a:Application {name: {name}})',
        'RETURN a',
    ].join('\n');

    var params = {
        name: req.body.name,
    };

    db.cypher({
        query: query,
        params: params,
    }, function(err, results) {
        if (err) {
            res.send(err);
        } else {
            res.json(results);
        }
    })
});

router.delete('/api/v1/application/:name', function(req, res) {
    var query = [
        'MATCH (a:Application {name: {name}})',
        'DETACH DELETE a',
    ].join('\n');

    var params = {
        name: req.params.name,
    };

    db.cypher({
        query: query,
        params: params,
    }, function(err, results) {
        if (err) {
            res.send(err);
        } else {
            res.json(results);
        }
    })
});

module.exports = router;