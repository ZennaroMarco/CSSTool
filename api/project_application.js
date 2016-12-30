var express = require('express');
var oracledb = require('oracledb');
var promise = require('bluebird');

var authorization = require('../middleware/authorization');
var database = require('../middleware/database');
var errors = require('../middleware/errors');

var router = express.Router();

router.get('/api/v1/project_application/:project_id', authorization.authorize(), function(request, response, next) {
    var statement = {
        'sql': 'SELECT a.* ' +
               'FROM APPLICATION a JOIN PROJECTAPPLICATION pa ON pa.APPLICATIONID = a.APPLICATIONID ' +
               'WHERE pa.PROJECTID = :inProjectId',
        'binds': { 
            inProjectId: request.params.project_id
        },
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

router.post('/api/v1/project_application', authorization.authorize(), function(request, response, next) {
    var statement = {
        'sql': 'INSERT INTO PROJECTAPPLICATION ' +
               'VALUES (:inProjectId, :inApplicationId)',
        'binds': { 
            inProjectId: request.body.project_id,
            inApplicationId: request.body.application_id  
        }
    }

    database.fullExecuteStatement(statement)
    .then(function(result) {
        response.status(201).send();
    })
    .catch(function(error) {
        next(error)
    })
});

router.post('/api/v1/project_application/batch', authorization.authorize(), function(request, response, next) {
    var connection;
    var executionPromises = [];
    var statement = {
        'sql': 'INSERT INTO PROJECTAPPLICATION ' +
               'VALUES (:inProjectId, :inApplicationId) ' + 
               'RETURNING PROJECTID, APPLICATIONID ' +
               'INTO :outProjectId, :outApplicationId',
        'options': { outFormat: oracledb.OBJECT }
    }

    database.connect()
    .then(function(connection) {
        this.connection = connection;
        request.body.forEach(function(projectApplication) {
            statement.binds = { 
                inProjectId: projectApplication.project_id,
                inApplicationId: projectApplication.application_id,
                outProjectId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
                outApplicationId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
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
                'PROJECTID': result.value().outBinds.outProjectId[0],
                'APPLICATIONID': result.value().outBinds.outApplicationId[0]
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