Meteor.publish("trips", function(){
  return Trips.find();
});

Meteor.publish("events", function (queryStartDate, queryEndDate) {
	return Events.find();
});