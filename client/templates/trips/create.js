Template.tripsCreate.helpers({
  datesMissing : function () {
    return !Session.get("startDate")
      || !Session.get("endDate");
  },
  getStartDate : function () {
    return Session.get("startDate");
  },
  getEndDate : function () {
    return Session.get("endDate");
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
  }
});