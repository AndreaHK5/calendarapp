Template.atgQuarterCalendar.onRendered(function () {
    var event = Session.get("newAtgEvent");
    var date;
        if (event && "startDate" in event) {
        date = moment(event.startDate);
    } else {
        date = atgEventsTemplateHelpers.getTodayDate().endOf("Quarter").startOf("Day");
    }

    quarterCounter = $('.quarter').FlipClock(moment(date).quarter(), {
        clockFace: 'Counter'
    });

    yearCounter =$('.year').FlipClock(moment(date).year() - 2000, {
        clockFace: 'Counter'
    });

    atgEventsTemplateHelpers.addValidationsToForm({});
    updateDates(date);
});

var  yearCounter;
var quarterCounter

Template.atgQuarterCalendar.events({
    "click .add-quarter" : function () {
        // adding quarters may throw off the 'end of quarter', as not all quarters have the same amoutn of months
        // therefore the day is recalculated.
        var newDate = moment(Session.get("newAtgEvent").startDate).add(1,"Q").endOf("quarter").startOf("day");
        updateDates(newDate);
    },
    "click .minus-quarter" : function () {
        var newDate = moment(Session.get("newAtgEvent").startDate).add(-1,"Q").endOf("quarter").startOf("day");
        updateDates(newDate);

    },
    "click .add-year" : function () {
        var newDate = moment(Session.get("newAtgEvent").startDate).add(1,"Y").endOf("quarter").startOf("day");
        updateDates(newDate);
    },
    "click .minus-year" : function () {
        var newDate = moment(Session.get("newAtgEvent").startDate).add(-1,"Y").endOf("quarter").startOf("day");
        updateDates(newDate);
    },
});

function updateDates(newDate) {
    atgEventsTemplateHelpers.updateEvent("startDate", newDate.toISOString());
    atgEventsTemplateHelpers.updateEvent("endDate", newDate.endOf("Day").toISOString());
    quarterCounter.setValue(newDate.quarter());
    yearCounter.setValue(newDate.year() - 2000);
}