Template.engagementsCreateDay.onRendered(function(){
  $(".day-box").hover(
    function(){      
      $(this).find(".day-box-top").addClass("day-box-top-hovered");
    },
    function(){
      $(this).find(".day-box-top").removeClass("day-box-top-hovered");
    }
  )

});


Template.engagementsCreateDay.helpers({
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
  hoverResetStartDate : function () {
    return Session.get("hoverResetStartDate");
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
  }
});

Template.engagementsCreateDay.events({
  "mouseenter .select-day" : function (event) {
    // style dates after start date is selected
    Session.set("hoverDay", this.date);
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
      Session.set("startDate", this.date);
      sAlert.info(
        "Leaving on " + moment(this.date).format("dddd MMM DD") + " it is. Let's pick the return now.");
    } else {
      // check that return date is correct
      if (this.date < Session.get("startDate")) { 
        sAlert.error("Return before going? Dr Who is interested now!");
        return;
      }
      Session.set("endDate", this.date);
      sAlert.info("Back on " + moment(this.date).format("dddd MMM DD") + " sounds cool.");
    }
  },
  "click .same-return-day" : function (event) {
    Session.set("endDate", Session.get("startDate"));
    sAlert.info("One day gig on " + moment(this.date).format("dddd MMM DD") + " will be.");
  },
});