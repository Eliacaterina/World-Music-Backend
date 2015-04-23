var Auth =require('./auth'); //allows us use the auth.js file

exports.register = function(server, options, next) {	
	
server.route([
		{
			//get all songs from a specific country
			method: 'GET',
			path:'/songs/{country}',
			handler: function(request, reply){
				var db =request.server.plugins['hapi-mongodb'].db;
				var country = encodeURIComponent(request.params.country)

				db.collection('songs').find( {country: country }).toArray(function(err, songs) {
					if (err) { 
            return reply('Internal MongoDB error', err);
				  }

					reply(songs);
				});
			}
		},
		{
			//add a new song
			method: 'POST',
			path: '/songs',
			
			config: {
					handler: function(request, reply) {
						Auth.authenticated(request, function(result) {
							if (result.authenticated) {
								//if the user is logged in / authenticated, add a song
								var db       = request.server.plugins['hapi-mongodb'].db;
								var session  = request.session.get('hapi_twitter_session');
								var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;
								
	              var song = {
									title  : request.payload.song.title,
									url    : request.payload.song.url,
									artist : request.payload.song.artist, 
									country: request.payload.song.country
								};

								db.collection('songs').insert(song, function(err, writeResult) {
									if(err) { 
										return reply('Internal MongoDB error', err); 
									}

									reply(writeResult);
								});

							} else {
								reply(result.message);
							}
		      });
		    },
	    },
	  },
]);



	next();
};



exports.register.attributes = {
  name: 'songs-route',
  version: '0.0.1'
}
							