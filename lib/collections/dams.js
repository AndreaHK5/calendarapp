Dams = new Mongo.Collection("dams");

// for the time being dams are the same as engineers, they are expected to diverge
damSchema = new SimpleSchema({
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

Dams.attachSchema(damSchema);

Dams.before.insert(function(userId, doc) {
	_.extend(doc, {
		createdAt: new Date()
	});
});