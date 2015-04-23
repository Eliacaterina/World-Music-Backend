var Auth =require('./auth'); //allows us use the auth.js file

exports.register = function(server, options, next) {	
	
server.route([
		{
			//get all countries
			method: 'GET',
			path:'/countries',
			handler: function(request, reply){
				var db =request.server.plugins['hapi-mongodb'].db;

				db.collection('countries').find().toArray(function(err, countries) {
					if (err) { 
            return reply('Internal MongoDB error', err);
				  }

					reply(countries);
				});
			}
		},

		]);



	next();
};



exports.register.attributes = {
  name: 'countries-route',
  version: '0.0.1'
}
							