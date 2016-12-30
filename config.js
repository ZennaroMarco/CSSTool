module.exports = {
	database: {
		'connection': {
			'user': 'admin',
		    'password': 'Oracle00',
		    'connectString': 'localhost/xe'
		}
	},
	authorization: {
		'secretKey': 'mysecretsecret',
		'secretKeyExpiresIn': 60*60*24
	},
	mailer: {
		'service': 'Gmail',
		'from': 'welpnext20@gmail.com',
		'password': 'welpnext20'
	}
};