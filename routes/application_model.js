var express = require('express');
var oracledb = require('oracledb');

var router = express.Router();

oracledb.autoCommit = true;

var connAttrs = {
    'user': 'admin',
    'password': 'Oracle00',
    'connectString': 'localhost/xe'
};

router.post('/api/v1/application_model', function(req, res) {
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
            connection.execute('INSERT INTO APPLICATIONMODEL ' +
                'VALUES (:applicationId, :modelId)',
                [req.body.application_id, req.body.model_id], {
                    outFormat: oracledb.OBJECT
                }, function(err, result) {
                    if (err) {
                        res.set('Content-Type', 'application/json');
                        res.status(400).send(JSON.stringify({
                            status: 400,
                            message: err.message.indexOf('ORA-00001') > -1 ? 'Application and model already related' : 'Input error',
                            detailed_message: err.message
                        }));
                    } else {
                        res.status(201).end();
                    }

                    connection.release(function(err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log('POST /api/v1/application_model : Connection released');
                        }
                    });
                });
        }
    });
});

module.exports = router;