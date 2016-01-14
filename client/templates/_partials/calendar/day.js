Template.calendarDay.helpers({
  isSelectedStartDate : function () {
    return Session.get("startDate") == this.fullDate;
  },
  isDateInTrip : function (fullDate) {
    //check that start date is selected, end date not selected and that the current hovered date is greater that the date
    return Session.get("startDate")
      && this.fullDate < Session.get("hoverDay")
      && this.fullDate > Session.get("startDate");
  }
});

Template.calendarDay.events({
  // style dates after start date is selected
  "mouseenter .select-day" : function (event) {
    if (! Session.get("startDate")) { return ; }
    Session.set("hoverDay", this.fullDate);
  }
});