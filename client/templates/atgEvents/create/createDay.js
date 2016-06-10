Template.atgEventCreateDay.onRendered(function(){
    Session.set("hoverDay", undefined);
});


Template.atgEventCreateDay.helpers({
    isHovererd : function () {
        return Session.get("hoverDay") == this.date;
    },
    isSelected : function () {
        return Session.get("newAtgEvent").startDate == this.date;
    },
    isHighlighted : function () {
        // is hovered
        if (Session.get("newAtgEvent").startDate
            && this.date <= Session.get("hoverDay")
            && this.date > Session.get("newAtgEvent").startDate) { return true; }
        if(this.date == Session.get("hoverDay")) {return true;}
        // is start
        if(Session.get("newAtgEvent").startDate == this.date) {return true;}
        // is between start and hover

        return false;
    },
    dayNumber : function (isoDate) {
        return moment(isoDate).date();
    },
});

Template.atgEventCreateDay.events({
    "mouseenter .day-box" : function (event) {
        Session.set("hoverDay", this.date);
    },
    "mouseenter .reset-starting-date" : function (event){
        event.stopPropagation();
        Session.set("hoverDay", undefined);
    },
    "mouseleave .reset-starting-date" : function (event){
        event.stopPropagation();
        Session.set("hoverDay", this.date);
    },
    "click .reset-starting-date" : function (event) {
        event.stopPropagation();
        // guard to prevent resetting from another date
        var newEvent = Session.get("newAtgEvent");
        if (newEvent.startDate != this.date) {
            return;
        }
        atgEventsTemplateHelpers.updateEvent("startDate", undefined);
        sAlert.warning("Let's leave on another day then.")
        Session.set("hoverDay", undefined);
    },
    "click .day-box" : function (event) {
        var newEvent = Session.get("newAtgEvent");
        if (!newEvent.startDate){
            atgEventsTemplateHelpers.updateEvent("startDate", this.date);
            sAlert.info(
                "Starting on " + moment(this.date).format("dddd MMM DD") + " it is. Let's pick the end date now.");
        } else {
            // check that return date is correct
            if (this.date < Session.get("newAtgEvent").startDate) {
                sAlert.error("End before start? Dr Who is interested now!");
                Session.set("hoverDay", undefined);
                return;
            }
            prepareEngagementDetail(this.date);
            sAlert.info("Back on " + moment(this.date).format("dddd MMM DD") + " sounds cool.");
        }
    },
    "click .same-return-day" : function () {
        if(!Session.get("newAtgEvent").startDate) { return; }
        prepareEngagementDetail(Session.get("newAtgEvent").startDate);
        sAlert.info("One day gig on " + moment(this.date).format("dddd MMM DD") + ", got it.");
    },
});

/**
 * sets endDate, prepares eventDetails, scrolls out the date container
 * @param endDate
 */
function prepareEngagementDetail(endDate) {
    atgEventsAnimations.slideOutTop($("#slidable-container")).then(function () {
        atgEventsTemplateHelpers.updateEvent("endDate", moment(endDate).endOf("day").toISOString());
        // todo find a better way to reference an enum in create.js!!
        Session.set("currentStep", atgEventsTemplateHelpers.createSteps.details);
        Session.set("slideInBottom", true);
    })
}