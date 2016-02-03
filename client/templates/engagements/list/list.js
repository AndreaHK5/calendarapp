Template.engagementsList.onRendered(function () {
  Meteor.subscribe("events");
});

Template.engagementsList.helpers({
  events : function () {
    return Events.find();
  }
});