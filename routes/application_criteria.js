var express = require('express');
var oracledb = require('oracledb');

var router = express.Router();

oracledb.autoCommit = true;

var connAttrs = {
    'user': 'admin',
    'password': 'Oracle00',
    'connectString': 'localhost/xe'
};

router.get('/api/v1/application_criteria/:application_id', function(req, res) {
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
            connection.execute('SELECT a.NAME, a.DESCRIPTION, cn.NAME, cn.DESCRIPTION, cv.VALUE ' +
                'FROM ((APPLICATIONCRITERIA ac JOIN APPLICATION a ON ac.APPLICATIONID = a.APPLICATIONID) ' +
                'JOIN CRITERIANAME cn ON cn.CRITERIANAMEID = ac.CRITERIANAMEID) ' +
                'JOIN CRITERIAVALUE cv ON cv.CRITERIAVALUEID = ac.CRITERIAVALUEID ' +
                'WHERE a.APPLICATIONID = :applicationId',
                [req.params.application_id], {
                outFormat: oracledb.OBJECT
            }, function(err, result) {
                if (err) {
                    res.set('Content-Type', 'application/json');
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: 'Error getting application criteria',
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
                        console.log('GET /api/v1/application_criteria : Connection released');
                    }
                });
            });
        }
    });
});

router.post('/api/v1/application_criteria', function(req, res) {
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
            connection.execute('INSERT INTO APPLICATIONCRITERIA ' +
                '(APPLICATIONID, CRITERIANAMEID, CRITERIAVALUEID) ' +
                'VALUES (:applicationId, :critNameId, :critValueId)',
                [req.body.application_id, req.body.criteria_name_id, req.body.criteria_value_id], {
                    outFormat: oracledb.OBJECT
                }, function(err, result) {
                    if (err) {
                        res.set('Content-Type', 'application/json');
                        res.status(400).send(JSON.stringify({
                            status: 400,
                            message: err.message.indexOf('ORA-00001') > -1 ? 'Application, criteria name and value already related' : 'Input error',
                            detailed_message: err.message
                        }));
                    } else {
                        res.status(201).end();
                    }

                    connection.release(function(err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log('POST /api/v1/application_criteria : Connection released');
                        }
                    });
                });
        }
    });
});

module.exports = router;