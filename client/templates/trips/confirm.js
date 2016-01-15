Template.confirmTrips.helpers({
  getStartDate : function () {
    return Session.get("startDate");
  },
  getEndDate : function () {
    return Session.get("endDate");
  }
});