Template.calendarDay.onRendered(function(){
  $(".day-box").hover(
    function(){      
      $(this).find(".day-box-top").addClass("day-box-top-hovered");
    },
    function(){
      $(this).find(".day-box-top").removeClass("day-box-top-hovered");
    }
  )

});


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
    sAlert.warning("Let's leave on another day then.")
  },
  "mouseenter .remove-start-date" : function (event) {
    Session.set("hoverResetStartDate", true);
  },
  "mouseleave .remove-start-date" : function (event) {
    Session.set("hoverResetStartDate", false);
  },
  "click .select-day" : function (event) {
    event.preventDefault();
    if (!Session.get("startDate")){
      Session.set("startDate", this.fullDate);
      sAlert.info(
        "Leaving on " + moment.unix(this.fullDate).format("dddd MMM DD") + " it is. Let's pick the return now.");
    } else {
      // check that return date is correct
      if (this.fullDate < Session.get("startDate")) { 
        sAlert.error("Return before going? Dr Who is interested now!");
        return;
      }
      Session.set("endDate", this.fullDate);
      sAlert.info("Back on " + moment.unix(this.fullDate).format("dddd MMM DD") + " sounds cool.");
    }
  },
  "click .same-return-day" : function (event) {
    Session.set("endDate", Session.get("startDate"));
    sAlert.info("One day gig on " + moment.unix(this.fullDate).format("dddd MMM DD") + " will be.");
  },
});