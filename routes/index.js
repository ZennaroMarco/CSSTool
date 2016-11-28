var express = require('express');
var neo4j = require('neo4j');

var router = express.Router();
var db = new neo4j.GraphDatabase({
    url: 'http://localhost:7474',
    auth: {username: 'neo4j', password: 'valerio92'},
});

router.get('/api/todos', function(req, res) {
    var query = [
        'CREATE (user:User {username: {username}, job: {job}})',
        'RETURN user',
    ].join('\n');

    var params = {
        username: 'Valerio',
        job: 'Developer',
    };

    db.cypher({
        query: query,
        params: params,
    }, function (err, results) {
        if (err) {
            res.send(err);
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
