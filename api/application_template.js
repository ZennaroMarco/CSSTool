var express = require('express');
var oracledb = require('oracledb');
var promise = require('bluebird');

var authorization = require('../middleware/authorization');
var database = require('../middleware/database');
var errors = require('../middleware/errors');

var router = express.Router();

router.post('/api/v1/application_template', authorization.authorize(), function(request, response, next) {
    var statement = {
        'sql': 'INSERT INTO APPLICATIONTEMPLATE ' +
               'VALUES (:inApplicationId, :inTemplateId)',
        'binds': { 
            inApplicationId: request.body.application_id,
            inTemplateId: request.body.template_id  
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

router.post('/api/v1/application_template/batch', authorization.authorize(), function(request, response, next) {
    var connection;
    var executionPromises = [];
    var statement = {
        'sql': 'INSERT INTO APPLICATIONTEMPLATE ' +
               'VALUES (:inApplicationId, :inTemplateId) ' + 
               'RETURNING APPLICATIONID, TEMPLATEID ' +
               'INTO :outApplicationId, :outTemplateId',
        'options': { outFormat: oracledb.OBJECT }
    }

    database.connect()
    .then(function(connection) {
        this.connection = connection;
        request.body.forEach(function(applicationTemplate) {
            statement.binds = { 
                inApplicationId: applicationTemplate.application_id,
                inTemplateId: applicationTemplate.template_id,
                outApplicationId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
                outTemplateId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
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
                'APPLICATIONID': result.value().outBinds.outApplicationId[0],
                'TEMPLATEID': result.value().outBinds.outTemplateId[0]
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