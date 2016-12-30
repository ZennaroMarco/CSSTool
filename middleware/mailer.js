var nodemailer = require('nodemailer');

var config = require('../config');

function prepare() {
    return nodemailer.createTransport({
        service: config.mailer.service,
        auth: {
            user: config.mailer.from,
            pass: config.mailer.password
        }
    });
}

function sendVerificationEmail(to, name, url) {
    var transporter = prepare();

    var sender = transporter.templateSender({
        html: '<html><head><style> body {margin: 0 auto;} ' +
              '#content_wrapper {width: 60%; margin: 0 auto;} ' +
              '#button_wrapper {background: #e60000;width: 25%;height: 8%;margin: 40px auto;text-align: center;line-height: 45px;} ' +
              'a {color: white;text-decoration: none;display: block;width: 100%;height: 100%;} ' +
              '<\/style> <\/head> <body><img src=\"oracle.png\" width=100%> ' +
              '<div id=\"content_wrapper\"><p>Hello {{name}},<\/br> ' +
              'click the button below to verify your account and start using Cloud Candidate Selection Tool!<\/p> ' +
              '<div id=\"button_wrapper\"><a href={{url}}>Verify account<\/a><\/div> ' +
              '<p>Didn\'t you create an account? Don\'t worry, simply you are crazy! :)<\/p> ' +
              '<\/div><\/body><\/html>'
    }, {
        from: config.mailer.from,
        subject: 'Verify your account'
    });

    sender({
        to: to
    }, {
        name: name,
        url: url
    });
}

module.exports = {sendVerificationEmail};