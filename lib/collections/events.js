Events = new Mongo.Collection("events");

eventSchema = new SimpleSchema({
	startDate: {
		type: Number,
		min: 0
	},
	endDate: {
		type: Number,
		min: 0
	},
	title: {
		type: String,
		max: 100
	},
	type: {
		type: String,
		max: 100
	},
	description: {
		type: String
	}
});

Events.attachSchema(eventSchema);

Events.before.insert(function(userId, doc) {
	_.extend(doc, {
		createdAt: new Date()
	});
});