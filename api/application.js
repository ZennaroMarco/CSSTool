var express = require('express');
var oracledb = require('oracledb');
var promise = require('bluebird');

var authorization = require('../middleware/authorization');
var database = require('../middleware/database');
var errors = require('../middleware/errors');

var router = express.Router();

router.get('/api/v1/application', authorization.authorize(), function(request, response, next) {
    var statement = {
        'sql': 'SELECT * FROM APPLICATION',
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

router.post('/api/v1/application', authorization.authorize(), function(request, response, next) {
    var statement = {
        'sql': 'INSERT INTO APPLICATION (NAME, DESCRIPTION, OWNER, TECHNOLOGY, BUSINESSAREA) ' +
               'VALUES (:inName, :inDescription, :inOwner, :inTechnology, :inBusinessArea) ' + 
               'RETURNING APPLICATIONID, NAME, DESCRIPTION, OWNER, TECHNOLOGY, BUSINESSAREA ' +
               'INTO :outId, :outName, :outDescription, :outOwner, :outTechnology, :outBusinessArea',
        'binds': { 
            inName: request.body.name,
            inDescription: request.body.description,
            inOwner: request.body.owner,
            inTechnology: request.body.technology,
            inBusinessArea: request.body.business_area,
            outId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
            outName: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
            outDescription: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
            outOwner: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
            outTechnology: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
            outBusinessArea: { type: oracledb.STRING, dir: oracledb.BIND_OUT }    
        },
        'options': { outFormat: oracledb.OBJECT }
    }

    database.fullExecuteStatement(statement)
    .then(function(result) {
        response.status(201).json({
            APPLICATIONID: result.outBinds.outId[0],
            NAME: result.outBinds.outName[0],
            DESCRIPTION: result.outBinds.outDescription[0],
            OWNER: result.outBinds.outOwner[0],
            TECHNOLOGY: result.outBinds.outTechnology[0],
            BUSINESSAREA: result.outBinds.outBusinessArea[0]
        });
    })
    .catch(function(error) {
        next(error)
    })
});

router.post('/api/v1/application/batch', authorization.authorize(), function(request, response, next) {
    var connection;
    var executionPromises = [];
    var statement = {
        'sql': 'INSERT INTO APPLICATION (NAME, DESCRIPTION, OWNER, TECHNOLOGY, BUSINESSAREA) ' +
               'VALUES (:inName, :inDescription, :inOwner, :inTechnology, :inBusinessArea) ' + 
               'RETURNING APPLICATIONID ' +
               'INTO :outId',
        'options': { outFormat: oracledb.OBJECT }
    }

    database.connect()
    .then(function(connection) {
        this.connection = connection;
        request.body.forEach(function(application) {
            statement.binds = { 
                inName: application.name,
                inDescription: application.description,
                inOwner: application.owner,
                inTechnology: application.technology,
                inBusinessArea: application.business_area,
                outId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
            }
            executionPromises.push(database.executeStatement(connection, statement));
        });

        return promise.all(executionPromises.map(function(promise) {
            return promise.reflect();
        }))
    })
    .filter(function(promise) {
        return promise.isFulfilled();
    })
    .then(function(results) {
        var ids = [];
        results.forEach(function(result) {
            ids.push({
                'APPLICATIONID': result.value().outBinds.outId[0]
            });
        });

        database.closeConnection(this.connection);

        if (ids.length > 0)
            response.status(201).json(ids);
        else
            next(new errors.BadRequestError());
    })
    .catch(errors.InternalServerError, function(error) {
        next(error);
    })
    .catch(function(error) {
        database.closeConnection(this.connection);
        next(error);
    })
});

module.exports = router;