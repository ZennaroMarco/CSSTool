var express = require('express');
var oracledb = require('oracledb');

var authorization = require('../middleware/authorization');
var database = require('../middleware/database');

var router = express.Router();

router.get('/api/v1/project', authorization.authorize(), function(request, response, next) {
    var statement = {
        'sql': 'SELECT * FROM PROJECT',
        'options': { outFormat: oracledb.OBJECT }
    }

    database.fullExecuteStatement(statement)
    .then(function(result) {
        response.status(200).json(result.rows);
    })
    .catch(function(error) {
        next(error)
    })
});

router.post('/api/v1/project', authorization.authorize(), function(request, response, next) {
    var statement = {
        'sql': 'INSERT INTO PROJECT (NAME, DESCRIPTION) ' +
               'VALUES (:inName, :inDescription) ' + 
               'RETURNING PROJECTID, NAME, DESCRIPTION ' +
               'INTO :outId, :outName, :outDescription',
        'binds': { 
            inName: request.body.name,
            inDescription: request.body.description,
            outId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
            outName: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
            outDescription: { type: oracledb.STRING, dir: oracledb.BIND_OUT }    
        },
        'options': { outFormat: oracledb.OBJECT }
    }

    database.fullExecuteStatement(statement)
    .then(function(result) {
        response.status(201).json({
            PROJECTID: result.outBinds.outId[0],
            NAME: result.outBinds.outName[0],
            DESCRIPTION: result.outBinds.outDescription[0]
        });
    })
    .catch(function(error) {
        next(error)
    })
});

module.exports = router;