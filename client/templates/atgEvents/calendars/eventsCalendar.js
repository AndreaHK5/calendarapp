Template.atgEventsCalendar.onRendered(function () {

    Session.set("monthsShowing", getMonths());
    Session.set('hoverMonth', atgEventsTemplateHelpers.getTodayDate().toISOString());

    // on finish rendered to ensure the daybox is tall enough to cater for all bubbles inside
    this.autorun(function(){

        // scroll to newly created month on DOM
        var targetMonth = Session.get("targetMonth");
        if (!targetMonth) { return ;}
        Tracker.afterFlush( function () {
            var targetDiv = $('#' + moment(targetMonth).unix());
            if (targetDiv.length == 0 ) {return ;}
            scrollVertical(targetDiv);
            Session.set("hoverMonth", targetMonth);
        });
    });

    atgEventsAnimations.positionTrayAndCalendar();
    $(window).resize(function() {
        atgEventsAnimations.positionTrayAndCalendar();
    });
});

Template.atgEventsCalendar.helpers({
    months : function () {
        return Session.get("monthsShowing");
    },
    getShortMonth : function () {
        return moment(Session.get('hoverMonth')).format("MMM").toUpperCase();
    },
    getUnix : function (isoDate) {
        return moment(isoDate).unix();
    },
    firstMonthHovered : function () {
        return Session.get("hoverMonth") == atgEventsTemplateHelpers.getTodayDate().toISOString();
    }
});

Template.atgEventsCalendar.events({
    "click .add-month" : function (event) {
        event.preventDefault();
        addMonth();
    },
    "click .scroll-next-month" : function () {
        if (!Session.get("hoverMonth")) { return ; }
        var monthAfter = moment(Session.get("hoverMonth")).add(1, 'month').startOf('month');
        var myDiv = $('#' + monthAfter.unix());
        if (!myDiv.length) {
            addMonth();
        } else {
            scrollVertical(myDiv);
            Session.set("hoverMonth", monthAfter.toISOString());
        }
    },
    "click .scroll-prev-month" : function () {
        if (!Session.get("hoverMonth")) { return ; }
        var monthBefore = moment(Session.get("hoverMonth")).add(-1, 'month').startOf('month');
        var myDiv = $('#' + monthBefore.unix());

        if (!myDiv.length ) {
            // no more dates unless we are in the month after the now()
            if (Session.get("hoverMonth") != atgEventsTemplateHelpers.getTodayDate().add(1,'month').startOf('month').toISOString()) {
                return;
            }
            myDiv = $('#' + atgEventsTemplateHelpers.getTodayDate().unix());
            Session.set("hoverMonth", atgEventsTemplateHelpers.getTodayDate().toISOString());
        } else {
            Session.set("hoverMonth", monthBefore.toISOString());
        }

        scrollVertical(myDiv);
    },
    "mouseenter .hovering" : function (event) {
        Session.set("hoverMonth", this.date);
    }
});

// HELPERS 

function addMonth() {
    var last = atgEventsTemplateHelpers.GetLastMonthShowing();
    var newDate = last.add(1, 'month');
    var months = Session.get("monthsShowing")
    months.push({date : newDate.toISOString() });
    Session.set("monthsShowing", months)
    // scroll to newly created month with a reactive variable
    Session.set("targetMonth", newDate.toISOString());
}

function getMonths() {
    var now = atgEventsTemplateHelpers.getTodayDate();
    var result = [];
    result.push({date : now.toISOString()});
    for (var i = 1; i < 3; i++) {
        var newDate = now.add(1, 'month').startOf('month');
        result.push({date : newDate.toISOString()});
    };
    return result;
}


// Animations

function scrollVertical(div) {
    var calendar = $('#calendar-container');
    var topY = calendar.scrollTop() + div.offset().top - $('#weekday-navbar').height() - $('#top-bar').height();
    TweenMax.to(calendar,1, {scrollTop:topY });
}