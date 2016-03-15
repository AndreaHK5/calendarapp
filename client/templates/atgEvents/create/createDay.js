Template.eventsCreateDay.onRendered(function(){
  $(".day-box").hover(
    function(){      
      $(this).find(".day-box-top").addClass("day-box-top-hovered");
    },
    function(){
      $(this).find(".day-box-top").removeClass("day-box-top-hovered");
    }
  )
});


Template.eventsCreateDay.helpers({
  isSelectedStartDate : function () {
    return Session.get("startDate") == this.date;
  },
  isDateInTrip : function () {
    //check that start date is selected, end date not selected and that the current hovered date is greater that the date 
    lastDay = Session.get("endDate") ? Session.get("endDate") :  Session.get("hoverDay")
    return Session.get("startDate")
      && this.date <= lastDay
      && this.date > Session.get("startDate");
  },
  isHoveredDate : function () {
    return Session.get("startDate")
      && this.date == Session.get("hoverDay");
  },
  isStartDateAndHovered : function () {
      return Session.get("startDate") == this.date
        && this.date == Session.get("hoverDay");
  },
  isBeforeStartSate : function () {
    if (!Session.get("startDate")){
      return false;
    } else {
      return this.date < Session.get("startDate");
    }
  },
  dayNumber : function (isoDate) {
    return moment(isoDate).date();
  },
  getActiveClass : function () {
    return Session.get("atgEventTypeId") ? "active-day" : "";
  }
});

Template.eventsCreateDay.events({
  "mouseenter .active-day.select-day" : function (event) {
    // style dates after start date is selected
    Session.set("hoverDay", this.date);
  },
  "mouseleave .active-day.selected-and-hover-day" : function (event) {
    // style dates after start date is selected
    Session.set("hoverDay", false);
  },
  "click .top-message" : function (event) {
    // guard to prevent resetting from another date
    if (Session.get("startDate") != this.date) {
      return;
    }
    Session.set("startDate", false);
    sAlert.warning("Let's leave on another day then.")
  },
  "click .active-day.select-day" : function (event) {
    event.preventDefault();
    if (!Session.get("startDate")){
      Session.set("startDate", this.date);
      sAlert.info(
        "Starting on " + moment(this.date).format("dddd MMM DD") + " it is. Let's pick the end date now.");
    } else {
      // check that return date is correct
      if (this.date < Session.get("startDate")) { 
        sAlert.error("End before start? Dr Who is interested now!");
        return;
      }
      prepareEngagementDetail(this.date);
      sAlert.info("Back on " + moment(this.date).format("dddd MMM DD") + " sounds cool.");
    }
  },
  "click .same-return-day" : function (event) {
    prepareEngagementDetail(Session.get("startDate"));
    sAlert.info("One day gig on " + moment(this.date).format("dddd MMM DD") + ", got it.");
  },
});

/**
 * sets endDate, prepares eventDetails, scrolls out the date container
 * @param endDate
 */
function prepareEngagementDetail(endDate) {
  atgEventsHelpers.scrollOutTop($("#select-dates-container")).then(function () {
    Session.set("endDate", moment(endDate).endOf("day").toISOString());
    Session.set("eventDetails", {});
  })
}