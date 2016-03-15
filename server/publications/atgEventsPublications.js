Meteor.publish("atgEvents", function () {
	return atgEvents.find();
});

Meteor.publish("atgEventTypes", function () {
    // projection added in order to NOT include the schema in the publication
	return atgEventTypes.find({},{type : 1, description : 1, eventSchema : 0});
});