Template.tripsIndex.onRendered(function () {
  Meteor.subscribe("events");
});

Template.tripsIndex.helpers({
  events : function () {
    return Events.find();
  }
});