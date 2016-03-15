
// TODO will we stil need the collection engineers? can we delete and use people?
engineers = new Mongo.Collection('engineers');

engineerSchema = new SimpleSchema({
	name: {
		type: String
	},
	email: {
		type: String
	},
	externalId: {
		type: String,
		optional: true
	},
	type: {
		type: String // possible value: atg, studio, dam
	},
	picture: {
		type: String,
		min: 1,
		optional : true
	},
});

engineers.attachSchema(engineerSchema);


// removed to use Meteor methods rather than allows
// if (Meteor.isServer) {
// 	engineers.allow({
// 		insert : function () {
// 			return true;
// 		},
// 		update : function () {
// 			return true;
// 		},
// 		remove : function () {
// 			return true;
// 		}
// 	});
// }

engineers.before.insert(function(userId, doc) {
	_.extend(doc, {
		createdAt: new Date()
	});
});