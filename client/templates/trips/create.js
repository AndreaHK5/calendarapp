Template.tripsCreate.onRendered(function (){
    Session.set("startDate", undefined);
    Session.set("endDate", undefined);
})

Template.tripsCreate.helpers({
  datesMissing : function () {
    return !Session.get("startDate") || !Session.get("endDate");
  }
});

Template.tripsCreate.events({
  "click .save-trip" : function (event) {
    event.preventDefault();
    saveTrip(Session.get('startDate'), Session.get("endDate"), function (err,res) {
      if (err) {
        console.error(err);
      } else {
        Router.go("tripsIndex");
      }
    });
  },
  "click .reset-trip" : function (event) {
    Session.set("startDate", false);
    Session.set("endDate", false);
  }
});