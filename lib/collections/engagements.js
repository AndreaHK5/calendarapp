Engagements = new Mongo.Collection("engagements");

engagementsSchema = new SimpleSchema({
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
	},
	engineersGoing : {
		type : [Object],
		minCount: 1
	},
	"engineersGoing.$.id": {
        type: String
    },
	dam : {
		type : Object
	},
	"dam.id" : {
		type: String
	}
});

Engagements.attachSchema(engagementsSchema);

Engagements.before.insert(function(userId, doc) {
	// custom validation for engineers going and dam
	for (var i = 0; i < doc.engineersGoing.length; i++) {
		if ( Engineers.find({ _id : doc.engineersGoing[i]["id"] }).count() < 1 ) {
			console.log("rejected for engineers" + JSON.stringify(doc));
			return false;
		}
	};

	if ( Dams.find({ _id : doc.dam["id"] }).count() < 1 ) {
		console.log("rejected for dam" + JSON.stringify(doc));
		return false;
	}

	_.extend(doc, {
		createdAt: new Date()
	});
});