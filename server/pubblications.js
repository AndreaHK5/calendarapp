Meteor.publish("engagements", function (queryStartDate, queryEndDate) {
	return Engagements.find();
});

Meteor.publish("engineers", function(){
  return Engineers.find()
});

Meteor.publish("dams", function(){
  return Dams.find()
});

Meteor.publish("gameTitles", function(){
  return GameTitles.find()
});