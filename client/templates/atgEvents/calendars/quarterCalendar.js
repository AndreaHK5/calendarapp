Template.atgQuarterCalendar.onRendered(function () {
    if (!Session.get("startDate")) {
        Session.set("startDate", atgEventsHelpers.getTodayDate().endOf("Quarter").startOf("Day").toISOString());
    }

    quarterCounter = $('.quarter').FlipClock(moment(Session.get("startDate")).quarter(), {
        clockFace: 'Counter'
    });


    yearCounter =$('.year').FlipClock(moment(Session.get("startDate")).year(), {
        clockFace: 'Counter'
    });
});

var  yearCounter;
var quarterCounter

Template.atgQuarterCalendar.helpers({
    showProceedButton : function () {
        return Router.current().route.getName() != "eventEdit"
    }
});

Template.atgQuarterCalendar.events({
    "click .add-quarter" : function () {
        var newDate = moment(Session.get("startDate")).add(1,"Q");
        updateDates(newDate);
    },
    "click .minus-quarter" : function () {
        var newDate = moment(Session.get("startDate")).add(-1,"Q");
        updateDates(newDate);

    },
    "click .add-year" : function () {
        var newDate = moment(Session.get("startDate")).add(1,"Y");
        updateDates(newDate);
    },
    "click .minus-year" : function () {
        var newDate = moment(Session.get("startDate")).add(-1,"Y");
        updateDates(newDate);
    },
    "click .confirm-date" : function() {
        Session.set("endDate", moment(Session.get("startDate")).endOf("Day").toISOString());
        Session.set("eventDetails", {});
    }
});


function updateDates(newDate) {
    Session.set("startDate", newDate.toISOString());
    quarterCounter.setValue(newDate.quarter());
    yearCounter.setValue(newDate.year());
    // means we are in edit mode
    if (Router.current().params._id) {
        Session.set("endDate", newDate.endOf("Day").toISOString());
    }
}