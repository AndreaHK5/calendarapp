Meteor.publish("events", function (queryStartDate, queryEndDate) {
	return Events.find();
});

Meteor.publish("engineers", function(){
  return Engineers.find()
});

Meteor.publish("dams", function(){
  return Dams.find()
});