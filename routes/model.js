var express = require('express');
var oracledb = require('oracledb');

var router = express.Router();

oracledb.autoCommit = true;

var connAttrs = {
    'user': 'admin',
    'password': 'Oracle00',
    'connectString': 'localhost/xe'
};

router.get('/api/v1/model', function(req, res) {
    'use strict';

    oracledb.getConnection(connAttrs, function(err, connection) {
        if (err) {
            res.set('Content-Type', 'application/json');
            res.status(500).send(JSON.stringify({
                status: 500,
                message: 'Error connecting to db',
                detailed_message: err.message
            }));
        } else {
            connection.execute('SELECT * FROM MODEL', {}, {
                outFormat: oracledb.OBJECT
            }, function(err, result) {
                if (err) {
                    res.set('Content-Type', 'application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: 'Error getting models',
                        detailed_message: err.message
                    }));
                } else {
                    res.contentType('application/json').status(200);
                    res.send(JSON.stringify(result.rows));
                }

                connection.release(function(err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log('GET /api/v1/model : Connection released');
                    }
                });
            });
        }
    });
});

module.exports = router;
