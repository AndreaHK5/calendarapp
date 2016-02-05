GameTitles = new Mongo.Collection("gameTitles");

gameTitleSchema = new SimpleSchema({
	product: {
		type: String,
		min: 2
	},
	codename: {
		type: String,
		min: 2
	},
});

GameTitles.attachSchema(gameTitleSchema);

GameTitles.before.insert(function(userId, doc) {
	_.extend(doc, {
		createdAt: new Date()
	});
});