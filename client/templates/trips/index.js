Template.tripsIndex.onRendered(function () {
  Meteor.subscribe("trips");
});

Template.tripsIndex.helpers({
  trips : function () {
    return Trips.find();
  }
});