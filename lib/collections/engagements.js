Engagements = new Mongo.Collection("engagements");

engagementsSchema = new SimpleSchema({
	startDate: {
		type: Date,
		min: 0
	},
	endDate: {
		type: Date,
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
	platform : {
		type : String,
		min : 3,
		optional : true
	},
	visiting : {
		type : Object,
		optional : true
	},
	"visiting.location" : {
		type : String
	},
	"visiting.name" : {
		type : String
	},	
	engineersGoing : {
		type : [Object],
		minCount: 1
	},
	"engineersGoing.$.id": {
        type: String,
		minCount : 6
    },
	dam : {
		type : Object
	},
	"dam.id" : {
		type: String,
		min : 6
	},
	gameTitle : {
		type : Object,
		optional : true
	},
	"gameTitle.id" : {
		type: String,
		min : 6
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
		createdAt: new Date(),
		createdBy: userId
	});
});