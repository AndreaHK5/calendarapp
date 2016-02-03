Template.engagementsList.onRendered(function () {
  Meteor.subscribe("engagements");
});

Template.engagementsList.helpers({
  events : function () {
    return Engagements.find();
  }
});