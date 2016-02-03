Template.engagementsList.onRendered(function () {
  Meteor.subscribe("engagements");
});

Template.engagementsList.helpers({
  engagements : function () {
    return Engagements.find();
  }
});