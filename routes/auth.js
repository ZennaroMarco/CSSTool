var express = require('express');
var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var base64url = require('base64url');
var moment = require('moment');
var mailer = require('../functions/mailer');

var mailConfig = require('../config/mail');

var router = express.Router();
var secretKey = 'mysecretsecret';

oracledb.autoCommit = true;

var connAttrs = {
    'user': 'admin',
    'password': 'Oracle00',
    'connectString': 'localhost/xe'
};

function auth() {
    return function(req, res) {
        var token;
        var payload;

        if (!req.headers.authorization)
            return res.status(401).send({message: 'You are not authorized'});

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
    }
}

router.post('/api/v1/login', function(req, res) {
    oracledb.getConnection(
        connAttrs, function(err, connection) {
            if (err) {
                res.set('Content-Type', 'application/json');
                res.status(500).send(JSON.stringify({
                    status: 500,
                    message: 'Error connecting to db',
                    detailed_message: err.message
                }));
            } else {
                connection.execute(
                    'SELECT * ' +
                    'FROM CCSTUSER ' +
                    'WHERE EMAIL = :email', {
                        email: req.body.email.toLowerCase()
                    }, {
                        outFormat: oracledb.OBJECT
                    }, function(err, results){
                        if (err) {
                            res.set('Content-Type', 'application/json');
                            res.status(500).send(JSON.stringify({
                                status: 500,
                                message: 'Error getting user',
                                detailed_message: err.message
                            }));
                        } else {
                            if (results.rows.length > 0) {
                                var user = results.rows[0];

                                bcrypt.compare(req.body.password, user.PASSWORD, function(err, pwMatch) {
                                    var payload;

                                    if (err)
                                        res.status(500).end();
                                    else {
                                        if (!pwMatch)
                                            res.status(401).send({message: 'Invalid password'});
                                        else {
                                            if (user.VERIFIED == 1) {
                                                payload = {
                                                    email: user.EMAIL
                                                };

                                                res.status(201).json({
                                                    user: {
                                                        name: user.NAME,
                                                        email: user.EMAIL
                                                    },
                                                    token: jwt.sign(payload, secretKey, {expiresIn: 60*60*24})
                                                });
                                            } else {
                                                res.status(201).json({
                                                    user: {
                                                        name: user.NAME,
                                                        email: user.EMAIL
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                            } else {
                                res.status(401).send({message: 'Invalid email'});
                            }
                        }

                        connection.release(function(err) {
                            if (err) {
                                console.error(err.message);
                            } else {
                                console.log('POST /api/v1/login : Connection released');
                            }
                        });
                    });
            }
        }
    );
});

router.post('/api/v1/verify', function(req, res) {
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
            var token = base64url(crypto.randomBytes(128));
            var expirationDate = moment().add(3, 'days').format('DD-MMM-YY H:mm:ss');

            connection.execute('MERGE INTO TOKEN t ' +
            'USING ( ' +
            'SELECT :userId USERID, ' +
            ':token VALUE, ' +
            'TO_TIMESTAMP(:expirationDate, \'dd-mon-yy hh24:mi:ss\') EXPIRESAT ' +
            'FROM DUAL) d ' +
            'ON (t.USERID = d.USERID) ' +
            'WHEN MATCHED THEN ' +
            'UPDATE SET t.VALUE = d.VALUE, t.EXPIRESAT = d.EXPIRESAT ' +
            'WHEN NOT MATCHED THEN ' +
            'INSERT (USERID, VALUE, EXPIRESAT) VALUES (d.USERID, d.VALUE, d.EXPIRESAT)',
                [req.body.user_id, token, expirationDate], {
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
                        var to = req.body.email;
                        var body = mailConfig.body;
                        var name = req.body.name;
                        var url = req.protocol + '://' + req.get('Host') +
                            req.originalUrl + '/' + token;

                        mailer.send(to, body, name, url);
                        res.status(201).end();
                    }

                    connection.release(function(err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log('POST /api/v1/verify : Connection released');
                        }
                    });
                });
        }
    });
});

router.get('/api/v1/verify/:token', function(req, res) {
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
            connection.execute('UPDATE ' +
                '(SELECT u.VERIFIED, u.EMAIL, u.NAME FROM ' +
                'CCSTUSER u JOIN TOKEN t ON u.USERID = t.USERID ' +
                'WHERE t.VALUE = :verificationToken AND CURRENT_TIMESTAMP <= t.EXPIRESAT) up ' +
                'SET up.VERIFIED = 1 ' +
                'RETURNING up.EMAIL, up.NAME ' +
                'INTO :remail, :rname', {
                    verificationToken: req.params.token,
                    remail: {
                        type: oracledb.STRING,
                        dir: oracledb.BIND_OUT
                    },
                    rname: {
                        type: oracledb.STRING,
                        dir: oracledb.BIND_OUT
                    }
                }, function(err, result) {
                    if (err) {
                        res.set('Content-Type', 'application/json');
                        res.status(500).send(JSON.stringify({
                            status: 500,
                            message: 'Error verifying user',
                            detailed_message: err.message
                        }));
                    } else {
                        if (result.outBinds.remail[0] != undefined) {
                            var payload = {
                                email: result.outBinds.remail[0]
                            };

                            res.status(201).json({
                                user: {
                                    name: result.outBinds.rname[0],
                                    email: result.outBinds.remail[0]
                                },
                                token: jwt.sign(payload, secretKey, {expiresIn: 60*60*24})
                            });
                        } else {
                            res.set('Content-Type', 'application/json');
                            res.status(400).send(JSON.stringify({
                                status: 400,
                                message: 'No user found for this verification token',
                            }));
                        }
                    }

                    connection.release(function(err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log('GET /api/v1/verify/:token : Connection released');
                        }
                    });
                });
        }
    });
});

router.post('/api/v1/signup', function(req, res) {
    var user = {
        name: req.body.name,
        email: req.body.email
    };
    var unhashedPassword = req.body.password;

    bcrypt.genSalt(10, function(err, salt) {
        if (err)
            res.status(500).end();

        bcrypt.hash(unhashedPassword, salt, function(err, hash) {
            if (err)
                res.status(500).end();

            user.hashedPassword = hash;

            insertUserAndSendEmail(user, function(err, user) {
                var payload;

                if (err)
                    res.status(500).send(JSON.stringify({
                        status: 500,
                        message: err.message.indexOf('ORA-00001') > -1 ? 'User already exists' : 'Input error',
                        detailed_message: err.message
                    }));
                else {
                    var to = user.email;
                    var body = mailConfig.body;
                    var name = user.name;
                    var url = req.protocol + '://' + req.get('Host') +
                        req.originalUrl + '/' + user.verification_token;

                    mailer.send(to, body, name, url);

                    res.status(201).json({
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email
                        }
                    });
                }
            });
        });
    });
});

function insertUserAndSendEmail(user, callback) {
    oracledb.getConnection(
        connAttrs, function(err, connection){
            if (err)
                return callback(err);

            connection.execute(
                'INSERT INTO CCSTUSER (NAME, EMAIL, PASSWORD) ' +
                'VALUES (:name, :email, :password) ' +
                'RETURNING USERID, NAME, EMAIL ' +
                'INTO :rid, :rname, :remail', {
                    name: user.name,
                    email: user.email.toLowerCase(),
                    password: user.hashedPassword,
                    rid: {
                        type: oracledb.NUMBER,
                        dir: oracledb.BIND_OUT
                    },
                    rname: {
                        type: oracledb.STRING,
                        dir: oracledb.BIND_OUT
                    },
                    remail: {
                        type: oracledb.STRING,
                        dir: oracledb.BIND_OUT
                    }
                }, function(err, results){
                    if (err) {
                        callback(err);
                    } else {
                        var userId = results.outBinds.rid[0];
                        var token = base64url(crypto.randomBytes(128));
                        var expirationDate = moment().add(3, 'days').format('DD-MMM-YY H:mm:ss');

                        oracledb.getConnection(connAttrs, function(err2, conn2) {
                            if (err2) {
                                connection.release();
                                return callback(err2);
                            }

                            conn2.execute('INSERT INTO TOKEN ' +
                                'VALUES (:userId, :value, TO_TIMESTAMP(:expiresAt, \'dd-mon-yy hh24:mi:ss\'))',
                                [userId, token, expirationDate], {
                                    outFormat: oracledb.OBJECT
                                }, function(err, result) {
                                    if (err) {
                                        callback(err);
                                    } else {
                                        callback(null, {
                                            id: results.outBinds.rid[0],
                                            name: results.outBinds.rname[0],
                                            email: results.outBinds.remail[0],
                                            verification_token: token
                                        });
                                    }

                                    conn2.release();
                                });
                        });
                    }

                    connection.release(function(err) {
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log('POST /api/v1/signup : Connection released');
                        }
                    });
                });
        }
    );
}

module.exports = {router, auth};