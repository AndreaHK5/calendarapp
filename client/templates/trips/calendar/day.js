Template.calendarDay.helpers({
  isSelectedStartDate : function () {
    return Session.get("startDate") == this.fullDate;
  },
  isDateInTrip : function () {
    //check that start date is selected, end date not selected and that the current hovered date is greater that the date 
    lastDay = Session.get("endDate") ? Session.get("endDate") :  Session.get("hoverDay")
    return Session.get("startDate")
      && this.fullDate <= lastDay
      && this.fullDate > Session.get("startDate");
  },
  isHoveredDate : function () {
    return Session.get("startDate")
      && this.fullDate == Session.get("hoverDay");
  },
  isStartDateAndHovered : function () {
      return Session.get("startDate") == this.fullDate
        && this.fullDate == Session.get("hoverDay");
  },
  hoverResetStartDate : function () {
    return Session.get("hoverResetStartDate");
  },
  isBeforeStartSate : function () {
    if (!Session.get("startDate")){
      return false;
    } else {
      return this.fullDate < Session.get("startDate");
    }
  }
});

Template.calendarDay.events({
  "mouseenter .select-day" : function (event) {
    // style dates after start date is selected
    Session.set("hoverDay", this.fullDate);
  },
  "mouseleave .selected-and-hover-day" : function (event) {
    // style dates after start date is selected
    Session.set("hoverDay", false);
  },
  "click .remove-start-date" : function (event) {
    Session.set("startDate", false);
    Session.set("hoverResetStartDate", false);
  },
  "mouseenter .remove-start-date" : function (event) {
    Session.set("hoverResetStartDate", true);
  },
  "mouseleave .remove-start-date" : function (event) {
    Session.set("hoverResetStartDate", false);
  }
});