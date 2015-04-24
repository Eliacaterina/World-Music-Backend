var Bcrypt = require('bcrypt');
var Joi = require('joi');

exports.register = function(server, option, next) {


server.route([ 
		{
			//Creating a user
			method: 'POST',
			path:'/users',

			config: {
				handler: function(request, reply){

					var db      =request.server.plugins['hapi-mongodb'].db;
					var newUser =request.payload.user

					Bcrypt.genSalt(10, function(err, salt){
						Bcrypt.hash(newUser.password, salt, function(err, hash) {
							newUser.password = hash;
							var uniqUdrQuery = { 
								$or: [
									{ username: newUser.username },
									{ email:    newUser.email }
							]};

							db.collection('users').count(uniqUdrQuery, function(err, userExist){
								//if user already exists
								if (userExist) {
									return reply({ok: false, msg: 'User is already registered. '});
								}

								//otherwise, create the user

								db.collection('users').insert( newUser, function(err,writeResult ) {
									 if (err) {
				             return reply('Internal MongoDB error', err);
				           } 

				           reply(writeResult);
				        });
				      });  
						})
					});
				}, 
				validate: {
					payload: {
						user: {
							username: Joi.string().min(3).max(20).required(),
							email: Joi.string().email().max(50).required(),
							password: Joi.string().min(5).max(20).required()
						}
					}
				}
			}
		}
	]);
	
	
	next();
};


exports.register.attributes = {
	name: 'users-route',
	version: '0.0.1'
}