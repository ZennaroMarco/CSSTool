module.exports = {
    service: 'Gmail',
    from: 'welpnext20@gmail.com',
    pass: 'welpnext20',
    subject: 'Verify your account',
    body: '<html><head><style> body {margin: 0 auto;} ' +
          '#content_wrapper {width: 60%; margin: 0 auto;} ' +
          '#button_wrapper {background: #e60000;width: 25%;height: 8%;margin: 40px auto;text-align: center;line-height: 45px;} ' +
          'a {color: white;text-decoration: none;display: block;width: 100%;height: 100%;} ' +
          '<\/style> <\/head> <body><img src=\"oracle.png\" width=100%> ' +
          '<div id=\"content_wrapper\"><p>Hello {{name}},<\/br> ' +
          'click the button below to verify your account and start using Cloud Candidate Selection Tool!<\/p> ' +
          '<div id=\"button_wrapper\"><a href={{url}}>Verify account<\/a><\/div> ' +
          '<p>Didn\'t you create an account? Don\'t worry, simply you are crazy! :)<\/p> ' +
          '<\/div><\/body><\/html>'
};