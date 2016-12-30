var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var errors = require('./middleware/errors');

var user = require('./api/user');
var application = require('./api/application');
var template = require('./api/template');
var applicationTemplate = require('./api/application_template');
var project = require('./api/project');
var projectApplication = require('./api/project_application');

var app = express();

app.disable('etag');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', user);
app.use('/', application);
app.use('/', template);
app.use('/', applicationTemplate);
app.use('/', project);
app.use('/', projectApplication);

app.use(function(request, response, next) {
	next(new errors.NotFoundError());
});

app.use(function(error, request, response, next) {
	response.locals.message = error.message;
	response.locals.error = request.app.get('env') === 'development' ? error : {};
	response.status(error.statusCode).json(error);
});

module.exports = app;