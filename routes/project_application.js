var express = require('express');
var oracledb = require('oracledb');

var router = express.Router();

oracledb.autoCommit = true;

var connAttrs = {
    'user': 'admin',
    'password': 'Oracle00',
    'connectString': 'localhost/xe'
};

router.get('/api/v1/project_application/:project_id', function(req, res) {
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
            connection.execute('SELECT a.NAME, a.DESCRIPTION ' +
            'FROM PROJECT p JOIN PROJECTAPPLICATION pa ON p.PROJECTID = pa.PROJECTID ' +
            'JOIN APPLICATION a ON pa.APPLICATIONID = a.APPLICATIONID ' +
            'WHERE p.PROJECTID = :projectId',
                [req.params.project_id], {
                    outFormat: oracledb.OBJECT
                }, function(err, result) {
                    if (err) {
                        res.set('Content-Type', 'application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: 'Error getting project applications',
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
                            console.log('GET /api/v1/project_application : Connection released');
                        }
                    });
                });
        }
    });
});

router.post('/api/v1/project_application', function(req, res) {
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
            connection.execute('INSERT INTO PROJECTAPPLICATION ' +
                '(PROJECTID, APPLICATIONID) ' +
                'VALUES (:projectId, :applicationId)',
                [req.body.project_id, req.body.application_id], {
                    outFormat: oracledb.OBJECT
                }, function(err, result) {
                    if (err) {
                        res.set('Content-Type', 'application/json');
                        res.status(400).send(JSON.stringify({
                            status: 400,
                            message: err.message.indexOf('ORA-00001') > -1 ? 'Project and application already related' : 'Input error',
                            detailed_message: err.message
                        }));
                    } else {
                        res.status(201).end();
                    }

                    connection.release(function(err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log('POST /api/v1/project_application : Connection released');
                        }
                    });
                });
        }
    });
});

router.post('/api/v1/project_applications', function(req, res) {
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
            var projectId = req.body.project_id;
            var appJsons =req.body.app_ids;

            var query = 'INSERT ALL ';
            appJsons.forEach(function(appJson) {
                query += 'INTO PROJECTAPPLICATION VALUES (';
                query += projectId + ', ';
                query += appJson.id + ') ';
            });
            query += 'SELECT 1 FROM dual';

            connection.execute(query,
                {}, {
                    outFormat: oracledb.OBJECT
                }, function(err, result) {
                    if (err) {
                        res.set('Content-Type', 'application/json');
                        res.status(400).send(JSON.stringify({
                            status: 400,
                            message: 'Input error',
                            detailed_message: err.message
                        }));
                    } else {
                        res.status(201).end();
                    }

                    connection.release(function(err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log('POST /api/v1/project_applications : Connection released');
                        }
                    });
                });
        }
    });
});

module.exports = router;