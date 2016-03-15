
UI.registerHelper("getFormattedDate", function (unixDate) {
    return formateDateHelper(unixDate);
});

UI.registerHelper("getQuarter", function (unixDate) {
    return moment(unixDate).quarter();
});


UI.registerHelper("getYear", function (unixDate) {
    return moment(unixDate).year();
});

UI.registerHelper("getPersonData", function (id) {
    var person = people.findOne({_id : id});
    if (!person) {return ;}
    // this is required to update the sematic UP pop up
    Session.set("popupAdded", new Date());
    return person;
});

UI.registerHelper("getAtgEventTypeName", function (atgEventTypeId) {
    if (atgEventTypeId) {
        return atgEventTypes.findOne({_id : atgEventTypeId}).type;
    }
});

// these are the microsoft colors. once they are
var microsoftColors = [ "rgb(141,46,136)", "rgb(15,62,157)", "rgb(140,198,0)",
    "rgb(255,242,0)", "rgb(255,190,0)", "rgb(0,113,188)", "rgb(255,83,0)",
    "rgb(255,0,0)", "rgb(255,0,151)"];


// TODO put colorMap and templateMap together, turn this into a prototype so the entries are not repeated, put this into a setting file
var templateMap = {
    createDetails : {
        "engagement" : "engagementsCreateDetails",
        "out of office" : "oofCreateDetails",
        "product launch": "plCreateDetails",
    },
    detailsCard : {
        "engagement": "engagementDetailsCard",
        "out of office": "oofDetailsCard",
        "product launch": "plDetailsCard"
    },
    briefCard : {
        "engagement": "engagementBriefCard",
        "out of office": "oofBriefCard",
        "product launch" : "plBriefCard"
    },
    calendar : {
        "engagement": "atgEventsCalendar",
        "out of office": "atgEventsCalendar",
        "product launch" : "atgQuarterCalendar"
    },
    editCalendar : {
        "engagement": "twoDatesPicker",
        "out of office": "twoDatesPicker",
        "product launch" : "atgQuarterCalendar"
    }
};
var colorMap =  {
    "engagement" : "rgb(0,174,239)",
    "out of office" : "rgb(0,166,0)",
    "product launch" : "rgb(255,138,0)"
};

UI.registerHelper("getEngagementTypeColor", function (engagementType) {
    // safe method in case a new type is provided
    if (engagementType == null) {
        return;
    }
    // the ID may be passed in.
    var atgEventType = atgEventTypes.findOne({ _id : engagementType});
    if (atgEventType){
        engagementType = atgEventType.type;
    }
    engagementType = engagementType.toLowerCase();

    return colorMap[engagementType];

    // TODO include random color mapping again?
    //var color = microsoftColors.shift() || "#"+((1<<24)*Math.random()|0).toString(16);
});


// universal helpers
Template.registerHelper('equals',
    function(v1, v2) {
        return (v1 === v2);
    }
);

var formateDateHelper = function (unixDate) {
    return moment(unixDate).format("ddd MMM DD");
}

if (Meteor.isClient) {
    // all helpers for use in Templates are encapsulated in an object for reference
    atgEventsHelpers = {}

    // helpers for front end controllers

    atgEventsHelpers.getTodayDate = function() {
        return moment().startOf('day');
    }

    atgEventsHelpers.GetLastMonthShowing = function () {
        var months = Session.get("monthsShowing");
        var maxUnix = lodash.map(months, function (m) { return moment(m.date).unix()})
        return moment.unix(lodash.max(maxUnix));
    }

    atgEventsHelpers.betweenTwoDatesEngagementsQuery = function (queryStartDate, queryEndDate) {
        return { $and :[
            {
                "startDate" : {$lte :  queryEndDate.toISOString() }
            },
            {
                "endDate" : {$gte : queryStartDate.toISOString()  }
            }
        ]
        };
    }

    atgEventsHelpers.betweenDatesAndTypeEngagementsQuery = function (queryStartDate, queryEndDate, type) {
        var query = atgEventsHelpers.betweenTwoDatesEngagementsQuery(queryStartDate, queryEndDate);
        query[$and].push({type : type});
        return query;
    }

    /**
     * pass in true to keep the event type
     * @param keepEventType
     */
    atgEventsHelpers.resetSessionForCreate = function (keepEventType) {
        Session.set("startDate", undefined);
        Session.set("endDate", undefined);
        Session.set("eventDetails", undefined);
        Session.set("formValid", undefined);
        Session.set("eventRelationshipIds", undefined);
        if (!keepEventType){
            Session.set("atgEventTypeId", undefined);
        }
    };

    atgEventsHelpers.resetSessionForDash = function () {
        Session.set("startDate", undefined);
        Session.set("endDate", undefined);
        Session.set("typeFilter", undefined);
        Session.set("dayForEventsDetail", undefined);
        Session.set("eventRelationshipIds", undefined);
        Session.set("createEngagementMode", undefined);
        Session.set("atgEventTypeId", undefined);
    };

    atgEventsHelpers.datesMissing = function () {
        return !Session.get("startDate") || !Session.get("endDate");
    }

    atgEventsHelpers.updateEventDetails = function(field, value) {
        var engagement = Session.get("eventDetails");
        engagement[field] = value;
        Session.set("eventDetails", engagement);
    };

    atgEventsHelpers.updateEventRelationsipIds = function (field, value) {
        var relIds = Session.get("eventRelationshipIds");
        if (!relIds) {
            relIds = {};
        }
        relIds[field] = value;
        Session.set("eventRelationshipIds", relIds);
    };

    //  +++++++++++++++++++++ INJECTION SERVICES

    // accepts both ID and type
    atgEventsHelpers.getTemplateForType = function (type, templateType) {

        var atgEventType = atgEventTypes.findOne({ _id : type});
        var typename;
        if (atgEventType){
            typename = atgEventType.type;
        } else {
            typename = type;
        }

        if (!typename) { return; }

        if (!(templateType in templateMap) || !(typename.toLowerCase() in templateMap[templateType]))  {
            var msg = "template " + templateType + " not mapped for " + templateType;
            console.log(msg);
            throw new Meteor.Error(msg);
        }

        return templateMap[templateType][typename.toLowerCase()];
    }


    // ++++++++++++++++ DASHBOARD ANIMATIONS ++++++++++++

    var slidingTime = 0.6;

    var getUsableHeight = function () {
        var navbarHeigt = getAllNavbarsHeight();
        var totalHeight = $(window).height();
        return totalHeight - navbarHeigt;
    }

    var getAllNavbarsHeight = function () {
        return $('#top-bar').height() + $('#weekday-navbar').height();
    };

    atgEventsHelpers.positionTrayAndCalendar = function() {
        var calendar = $("#calendar-container");
        var selectDateContainer = $("#select-dates-container");
        var bottomTray = $("#dayengagements-container");
        var usableAreaHeight = getUsableHeight();
        if (bottomTray.length != 0) {
            var cardsTotalHeight = $("#cards-container").height();
            var bottomTrayHeight = Math.min(usableAreaHeight / 2, cardsTotalHeight );
            mainAreaHeight = usableAreaHeight - bottomTrayHeight;
            bottomTray.css("height", bottomTrayHeight);

            // Animations!
            // calendar
            TweenMax.to(calendar, slidingTime, { height : mainAreaHeight});
            // bottom tray
            bottomTray.css("top", $(window).height() );
            TweenMax.to(bottomTray, slidingTime, { top : usableAreaHeight - bottomTrayHeight + getAllNavbarsHeight() });
            bottomTray.css("visibility", "visible");
            $('#cards-viewport').height(bottomTrayHeight)
        } else {
            selectDateContainer.css("top",$('#top-bar').height());
            calendar.css("height", usableAreaHeight);
        }
        return jQuery.Deferred().resolve().promise();
    }

    atgEventsHelpers.hideEventsContainer = function() {
        var calendar = $("#calendar-container");
        var bottomTray = $("#dayengagements-container");
        if (bottomTray.length == 0 ) {
            return jQuery.Deferred().resolve().promise();
        }
        var deferred = jQuery.Deferred();
        var usableAreaHeight = getUsableHeight();
        TweenMax.to(calendar, slidingTime, { height : usableAreaHeight});
        TweenMax.to(bottomTray, slidingTime, {
            top : $(window).height(),
            onComplete : function () {
                Session.set("dayForEventsDetail", undefined);
                deferred.resolve();
            }
        });
        return deferred.promise();
    }

    atgEventsHelpers.resizeTrayAndCalendar = function () {
        var calendar = $("#calendar-container");
        var bottomTray = $("#dayengagements-container");
        var usableAreaHeight = getUsableHeight();
        if (bottomTray.length == 0) {
            calendar.css("height", usableAreaHeight);
            return ;
        }
        var cardsTotalHeight = $("#cards-container").height();
        var bottomTrayHeight = Math.min(usableAreaHeight / 2, cardsTotalHeight );
        var overflow = bottomTrayHeight == cardsTotalHeight ? "hidden" : "scroll";
        $("#cards-viewport").css("overflow-y", overflow)
        mainAreaHeight = usableAreaHeight - bottomTrayHeight;

        TweenMax.to(calendar, slidingTime, { height : mainAreaHeight});
        TweenMax.to(bottomTray, slidingTime, { top : usableAreaHeight - bottomTrayHeight + getAllNavbarsHeight() });
        TweenMax.to(bottomTray, slidingTime, { height : bottomTrayHeight});
        $('#cards-viewport').height(bottomTrayHeight);
    }

    atgEventsHelpers.scrollCalendarToDay = function (div) {
        if (!div) {return ;}
        var calendar = $('#calendar-container');
        var topY = calendar.scrollTop() + div.offset().top - 2* div.height();
        TweenLite.to(calendar, slidingTime, {scrollTo:{y:topY}, ease:Power2.easeOut});
    }

    atgEventsHelpers.adjustDayBoxHeight = function() {
        var standardDayBoxHeight = 98;
        var requiredHeight = lodash.reduce($('.day-box'),
            function (heightRequired, e) {
                var thisBoxHeight = $(e).find('.engagement-day-top').outerHeight(true) + $(e).find('.engagement-day-bottom').outerHeight(true);
                return Math.max(heightRequired, thisBoxHeight);
            },
            standardDayBoxHeight
        );

        TweenMax.to($('.day-box'), 0.8, { ease: Power4.easeOut, height : requiredHeight });
    }

    // ++++++++++++++++ CREATE AND EDIT ANIMATIONS ++++++++++++

    atgEventsHelpers.showSelectTypeContainer = function () {
        var calendar = $("#select-dates-container");
        var selectType = $("#select-type-container");
        $("#calendar-container").css("overflow-y","hidden");
        calendar.css("top", $('#top-bar').height());
        selectType.css("top", $('#top-bar').height() - selectType.outerHeight());
        selectType.css("display", "block");
        TweenMax.to(calendar, slidingTime, { top : $('#top-bar').height() + selectType.outerHeight()});
        TweenMax.to(selectType, slidingTime, {top : $('#top-bar').height()});
    }

    atgEventsHelpers.hideSelectTypeContainer = function () {
        var calendar = $("#select-dates-container");
        var selectType = $("#select-type-container");
        $("#calendar-container").css("overflow-y","scroll")
        if (!selectType) {
            return jQuery.Deferred().resolve().promise();
        }

        var deferred = jQuery.Deferred();
        TweenMax.to(calendar, slidingTime, { top : $('#top-bar').height()});
        TweenMax.to(selectType, slidingTime, {
            top : $('#top-bar').height() - selectType.outerHeight(),
            onComplete : function () {
                deferred.resolve();
            }
        });
        return deferred.promise();
    };

    /**
     * scrolls out the div passed in
     * @returns { promise }
     */
    atgEventsHelpers.scrollOutTop = function (targetDiv) {
        if (!targetDiv || targetDiv.length == 0) {
            return jQuery.Deferred().resolve().promise();
        }

        var deferred = jQuery.Deferred();
        TweenMax.to(targetDiv, slidingTime, {
            top : $('#top-bar').height() - targetDiv.outerHeight(),
            onComplete : function () {
                deferred.resolve();
            }
        });
        return deferred.promise();
    };

    /**
     * scrolls out the div passed in
     * @returns { promise }
     */
    atgEventsHelpers.scrollOutBottom = function (targetDiv) {
        if (!targetDiv || targetDiv.length == 0) {
            return jQuery.Deferred().resolve().promise();
        }

        var deferred = jQuery.Deferred();
        TweenMax.to(targetDiv, slidingTime, {
            top : $(window).height(),
            onComplete : function () {
                deferred.resolve();
            }
        });
        return deferred.promise();
    };

    /**
     * scroll in the target div form the bottom
     * @param targetDiv
     * @returns {promise}
     */
    atgEventsHelpers.scrollInBottom = function (targetDiv) {
        if (!targetDiv || targetDiv.length == 0) {
            return jQuery.Deferred().resolve().promise();
        }
        targetDiv.css("height", getUsableHeight());
        targetDiv.css("top",$(window).height());
        var deferred = jQuery.Deferred();
        TweenMax.to(targetDiv, slidingTime, {
            top : $('#top-bar').height(),
            onComplete : function () {
                deferred.resolve();
            }
        });
        return deferred.promise();
    };

    /**
     * sizes the target div to the screen and scrolls it in form the top
     * @param targetDiv
     * @returns {promise}
     */
    atgEventsHelpers.scrollInTop = function (targetDiv) {
        if (!targetDiv || targetDiv.length == 0) {
            return jQuery.Deferred().resolve().promise();
        }
        targetDiv.css("height", getUsableHeight());
        targetDiv.css("top",- $(window).height());
        var deferred = jQuery.Deferred();
        TweenMax.to(targetDiv, slidingTime, {
            top : $('#top-bar').height(),
            onComplete : function () {
                deferred.resolve();
            }
        });
        return deferred.promise();
    };
}