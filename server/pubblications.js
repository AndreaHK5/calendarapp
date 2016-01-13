Meteor.publish("all-trips", function(){
  return Trips.find();
});