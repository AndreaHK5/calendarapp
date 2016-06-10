Template.atgEvents.onRendered(function () {
    $(".icon.select-type").popup();
    atgEventsAnimations.sizePageConteiners();

    $(window).resize(function() {
        atgEventsAnimations.positionTrayAndCalendar(true);
    });

    this.autorun(function () {
        var queryStartDate = atgEventsTemplateHelpers.getTodayDate();
        var queryEndDate = atgEventsTemplateHelpers.GetLastMonthShowing().endOf('month');
        var atgEventsPerDay = {};
        atgEvents.find(atgEventsTemplateHelpers.betweenTwoDatesEngagementsQuery(queryStartDate, queryEndDate))
            .forEach(function (e) {
                // startign form the beginning of the engagement or of the query (and same for ending)
                var startLoop = moment.max(moment(e.startDate).startOf("Day"), moment(queryStartDate));
                var endLoop = moment.min(moment(e.endDate), moment(queryEndDate));
                var type = atgEventTypes.findOne({ _id : e.atgEventTypeId })["type"];
                // traverse all days and add the event to the single day map
                for(var m = startLoop; !m.isAfter(endLoop);  m.add(1, 'days')) {
                    var isoDay = m.toISOString();
                    // initailize objects if not present
                    if (! (isoDay in atgEventsPerDay)) { atgEventsPerDay[isoDay] = {}; }
                    if (! (type in atgEventsPerDay[isoDay])) { atgEventsPerDay[isoDay][type] = 0 }
                    atgEventsPerDay[isoDay][type] ++;
                }
            });
        Session.set("engagementsPerDay", atgEventsPerDay);
    })
});

Template.atgEvents.helpers({
    getAllTypes : function () {
        return atgEventTypes.find();
    },
    showDayEventsDetail : function () {
        return Session.get("dayForEventsDetail");
    }
});


var eventsShowing = false;

Template.atgEvents.events({
    "click #create-button" : function () {
        $(".ui.popup").remove()
        if (eventsShowing) {
            hideTypes();
        } else {
            showTypes();
        }
        eventsShowing = !eventsShowing;
    },
    "click .select-type": function () {
        $(".ui.popup").remove()
        var id = this._id;
        eventsShowing = false;
        atgEventsAnimations.hideEventsContainer().then(function () {
            Session.set("atgEventTypeId", id);
            sAlert.info("Let's talk dates then.");
            Router.go("atgEventCreate", {_id : id});
        })
    }
});

function showTypes() {
    var animationTime = 0.2;
    $("#types-container").css("bottom", parseInt($("#create-button").css("bottom")) -  $("#types-container").outerHeight()/2 + $("#create-button").outerHeight()/2);
    // preparation for the bubbles
    $("#types-container img").css("opacity", 0);
    $("#types-container img").css("top", 50);

    TweenLite.to( $("#create-button .plus.icon"), animationTime , { rotation : 180 });
    $("#types-container").css("display", "block");
    var tl = new TimelineLite();
    tl.staggerTo("#types-container img", animationTime, {opacity: 1, top: 0 }, 0.05);
}

function hideTypes() {
    var animationTime = 0.2;
    var tl = new TimelineLite();
    tl.staggerTo("#types-container img", animationTime, {opacity: 0, top: 50 , onComplete: function () {
        $("#types-container").css("display", "none");
    }}, 0.05);
    TweenLite.to( $("#create-button  .plus.icon"), animationTime , { rotation : 0 });
}
