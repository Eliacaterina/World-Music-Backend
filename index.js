var Hapi = require('hapi');
var server = new Hapi.Server();

server.connection({
	host: '0.0.0.0',
	port: process.env.PORT || 3000, 
	routes: {
		cors: {
      headers: ['Access-Control-Allow-Credentials'],
      credentials: true
    }
	}
});


// dependencies
var plugins = [

	{ register: require('./routes/songs.js') },
	{ register: require('./routes/sessions.js') }, 
	{ register: require('./routes/users.js') },
	{ register: require('./routes/countries.js') },
	{ 
		register: require('hapi-mongodb'),
		options: {
			"url": "mongodb://127.0.0.1:27017/World-Music-Backend",
			"settings": {
				"db": {
					"native_parser": false
				}
			}
		}
	},
	{
		register: require('yar'),
		options: {
			cookieOptions: {
				password: 'password',
				isSecure: false 
			}
		}
	}
];


server.register(plugins, function(err) { //server please recognize the plugins that we have defined 
	if (err) {
		throw err; 
	}

	server.start(function() {
		console.log('info', 'Server running at:' + server.info.uri);
	});
});