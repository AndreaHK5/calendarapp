Meteor.publish('pastDeveloperVisits', function () {
  return developerVisits.find({visitEndDate: {$lt: new Date()}});
});

Meteor.publish('presentDeveloperVisits', function () {
  return developerVisits.find({visitStartDate: {$lt: new Date()}, visitEndDate: {$gt: new Date()}});
});

Meteor.publish('futureDeveloperVisits', function () {
  return developerVisits.find({visitStartDate: {$gt: new Date()}});
});

Meteor.publish('developerVisit', function(_id){
  check(_id, String);
  return developerVisits.find({_id: _id});
});

Meteor.publish('myTrips', function () {
  var user = Meteor.users.findOne(this.userId);
  if (!user) return [];

  var _mapExists = userMapping.findOne({newEmail: user.profile.email});
  var _mappedEmail = (_mapExists != undefined) ? _mapExists.oldEmail : user.profile.email;

  return developerVisits.find({engineers: {$elemMatch: {Email: _mappedEmail}}});
});

Meteor.publish('trip', function (_id) {
  check(_id, String);
  return developerVisits.find(_id);
});

Meteor.publish('userMapping', function(){
  return userMapping.find();
});