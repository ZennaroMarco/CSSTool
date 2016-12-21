var express = require('express');
var oracledb = require('oracledb');
var auth = require('./auth');
var mailer = require('../functions/mailer');

var mailConfig = require('../config/mail');

var router = express.Router();

oracledb.autoCommit = true;

var connAttrs = {
    'user': 'admin',
    'password': 'Oracle00',
    'connectString': 'localhost/xe'
};

router.get('/api/v1/test_email', function(req,res) {
    var to = 'russovalerio.92@gmail.com';
    var body = mailConfig.body;
    var name = 'Valerio';
    var url = req.protocol + '://' + req.get('Host') +
        req.originalUrl + '/ciao';

    mailer.send(to, body, name, url);
});

router.get('/api/v1/test_protected', auth.auth(), function(req, res) {
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