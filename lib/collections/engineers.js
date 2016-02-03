Engineers = new Mongo.Collection("engineers");

engineerSchema = new SimpleSchema({
	name: {
		type: String,
		min: 4
	},
	email: {
		type: String,
		min: 4
	},
	picture: {
		type: String,
		min: 1
	},
});

Engineers.attachSchema(engineerSchema);

Engineers.before.insert(function(userId, doc) {
	_.extend(doc, {
		createdAt: new Date()
	});
});