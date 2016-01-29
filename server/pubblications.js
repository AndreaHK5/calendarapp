Meteor.publish("events", function (queryStartDate, queryEndDate) {
	return Events.find();
});