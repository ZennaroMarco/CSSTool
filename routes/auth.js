var express = require('express');
var oracledb = require('oracledb');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var router = express.Router();
var secretKey = 'mysecretsecret';

oracledb.autoCommit = true;

var connAttrs = {
    'user': 'admin',
    'password': 'Oracle00',
    'connectString': 'localhost/xe'
};

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

            insertUser(user, function(err, user) {
                var payload;

                if (err)
                    res.status(500).end();
                else {
                    payload = {
                        userid: user.id,
                        name: user.name,
                        email: user.email
                    };

                    res.status(200).json({
                        user: user,
                        token: jwt.sign(payload, secretKey, {expiresIn: 60*60*24})
                    });
                }
            });
        });
    });
});

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
                    'select * ' +
                    'from CCSTUSER ' +
                    'where EMAIL = :email', {
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
                                            res.status(401).send({message: 'Invalid email or password'});
                                        else {
                                            payload = {
                                                userid: user.id,
                                                name: user.name,
                                                email: user.email
                                            };

                                            res.status(200).json({
                                                user: user,
                                                token: jwt.sign(payload, secretKey, {expiresIn: 60*60*24})
                                            });
                                        }
                                    }
                                });
                            } else {
                                res.status(401).send({message: 'Invalid email or password'});
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

function insertUser(user, callback) {
    oracledb.getConnection(
        connAttrs, function(err, connection){
            if (err)
                return callback(err);

            connection.execute(
                'insert into CCSTUSER ( ' +
                '   NAME, ' +
                '   EMAIL, ' +
                '   PASSWORD ' +
                ') ' +
                'values (' +
                '    :name, ' +
                '    :email, ' +
                '    :password ' +
                ') ' +
                'returning ' +
                '   USERID, ' +
                '   NAME, ' +
                '   EMAIL ' +
                'into ' +
                '   :rid, ' +
                '   :rname, ' +
                '   :remail', {
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
                        connection.release();
                        return callback(err);
                    }

                    callback(null, {
                        id: results.outBinds.rid[0],
                        name: results.outBinds.rname[0],
                        email: results.outBinds.remail[0]
                    });

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

module.exports = router;