var nodemailer = require('nodemailer');

var mailConfig = require('../config/mail');

function prepare() {
    return nodemailer.createTransport({
        service: mailConfig.service,
        auth: {
            user: mailConfig.from,
            pass: mailConfig.pass
        }
    });
}

function send(to, body, name, url) {
    var transporter = prepare();

    var sender = transporter.templateSender({
        html: body
    }, {
        from: mailConfig.from,
        subject: mailConfig.subject
    });

    sender({
        to: to
    }, {
        name: name,
        url: url
    });
}

module.exports.send = send;