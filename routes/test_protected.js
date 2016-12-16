var express = require('express');
var oracledb = require('oracledb');
var jwt = require('jsonwebtoken');

var router = express.Router();
var secretKey = 'mysecretsecret';

oracledb.autoCommit = true;

var connAttrs = {
    'user': 'admin',
    'password': 'Oracle00',
    'connectString': 'localhost/xe'
};

router.get('/api/v1/test_protected', function(req, res) {
    var token;
    var payload;

    if (!req.headers.authorization) {
        return res.status(401).send({message: 'You are not authorized'});
    }

    token = req.headers.authorization.split(' ')[1];

    try {
        payload = jwt.verify(token, secretKey);
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            res.status(401).send({message: 'Token Expired'});
            // redirect to login page
        } else {
            res.status(401).send({message: 'Authentication failed'});
            // redirect to login page
        }

        return;
    }

    oracledb.getConnection(
        connAttrs, function(err, connection){
            if (err) {
                res.set('Content-Type', 'application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: 'Error connecting to db',
                    detailed_message: err.message
                }));
            }

            connection.execute(
                'select * ' +
                'from CCSTUSER',
                {}, {
                    outFormat: oracledb.OBJECT
                }, function(err, results){
                    if (err) {
                        res.set('Content-Type', 'application/json');
                        res.status(400).send(JSON.stringify({
                            status: 400,
                            message: err.message.indexOf('ORA-00001') > -1 ? 'Application already exists' : 'Input error',
                            detailed_message: err.message
                        }));
                    } else {
                        res.status(200).json(results.rows);
                    }

                    connection.release(function(err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log('POST /api/v1/test_protected : Connection released');
                        }
                    });
                }
            );
        }
    );
});

module.exports = router;