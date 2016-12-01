var express = require('express');
var oracledb = require('oracledb');

var router = express.Router();

oracledb.autoCommit = true;

var connAttrs = {
    'user': 'admin',
    'password': 'Oracle00',
    'connectString': 'localhost/xe'
};

router.get('/api/v1/application', function(req, res) {
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
            connection.execute('SELECT * FROM APPLICATION', {}, {
                outFormat: oracledb.OBJECT
            }, function(err, result) {
                if (err) {
                    res.set('Content-Type', 'application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: 'Error getting applications',
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
                        console.log('GET /api/v1/application : Connection released');
                    }
                });
            });
        }
    });
});

router.post('/api/v1/application', function(req, res) {
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
            connection.execute('INSERT INTO APPLICATION (NAME, DESCRIPTION, OWNER, TECHNOLOGY, BUSINESSAREA) ' +
                    'VALUES (:name, :description, :owner, :technology, :businessArea)',
                    [req.body.name, req.body.description, req.body.owner, req.body.technology, req.body.business_area], {
                outFormat: oracledb.OBJECT
            }, function(err, result) {
                if (err) {
                    res.set('Content-Type', 'application/json');
                    res.status(400).send(JSON.stringify({
                        status: 400,
                        message: err.message.indexOf('ORA-00001') > -1 ? 'Application already exists' : 'Input error',
                        detailed_message: err.message
                    }));
                } else {
                    res.status(201).end();
                }

                connection.release(function(err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log('POST /api/v1/application : Connection released');
                    }
                });
            });
        }
    });
});

router.delete('/api/v1/application/:application_id', function(req, res) {
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
            connection.execute('DELETE FROM APPLICATION ' +
                'WHERE APPLICATIONID = :applicationId', [req.params.application_id], {
                outFormat: oracledb.OBJECT
            }, function(err, result) {
                if (err || result.rowsAffected === 0) {
                    res.set('Content-Type', 'application/json');
                    res.status(400).send(JSON.stringify({
                        status: 400,
                        message: err ? 'Input error' : 'Application does not exist',
                        detailed_message: err ? err.message : ''
                    }));
                } else {
                    res.status(204).end();
                }

                connection.release(function(err) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log('DELETE /api/v1/application : Connection released');
                    }
                });
            });
        }
    });
});

module.exports = router;