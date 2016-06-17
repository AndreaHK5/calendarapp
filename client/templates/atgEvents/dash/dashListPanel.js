Template.atgEventsDashListPanel.onRendered(function () {

	// scroll calendar when the engagement bars are showing 
	this.autorun(function () {
		var onCalendar = Session.get("engagementOnCalendar");
		if (!onCalendar) { return ;}
		Tracker.afterFlush(function () {
			atgEventsAnimations.scrollCalendarToDay($(".calendar-engagement-bar").first().parent().find(".day-box"));
		    $(".calendar-engagement-bar").css("margin-top", $(".day-box").first().outerHeight() + 6);
        })
	});

	// resize when a filter is applied
	this.autorun(function () {
		// these session variables trigger the autotun;
		Session.get("engagementsShowing");
		Session.get("typeFilter");
		Tracker.afterFlush(function () {
			atgEventsAnimations.positionTrayAndCalendar();
		});
	});

	Session.set("engagementOnCalendar", undefined );
	Session.set("engagementToDelete", undefined );
	Session.set("engagementInModal", undefined );
	if (Session.get("filterMessage")) {
		sAlert.info("Make sure to check out the filters (for days with more than one colors)", {timeout: 'none'});
		Session.set("filterMessage", undefined);
	}

});

Template.atgEventsDashListPanel.helpers({
	engagementsOfTheDay : function () {
		var date = Session.get("dayForEventsDetail");
		var query = atgEventsTemplateHelpers.betweenTwoDatesEngagementsQuery(moment(date), moment(date).endOf("Day"));
		var typeFiler = atgEventTypes.findOne({ type : Session.get("typeFilter") } );

		if (typeFiler) {
			query["$and"].push({atgEventTypeId : typeFiler._id});
		}
		var eng = atgEvents.find(query);
		Session.set("engagementsShowing", eng.count());
		if (eng.count() == 0) {
			// in the case the last engagement of the day is deleted
			return;
		}

		return eng;
	},
	getEventDetails : function () {
		return Session.get("engagementToDelete") || Session.get("engagementInModal");
	},
	modalCardColor : function () {
		if (!Session.get("engagementToDelete") && !Session.get("engagementInModal") ) {
			return ;
		}
		return Session.get("engagementToDelete")?
			Session.get("engagementToDelete").atgEventTypeId:
			Session.get("engagementInModal").atgEventTypeId;
	},
	typeFilter : function () {
		return Session.get("typeFilter");
	},
	dayShowing : function () {
		return Session.get("dayForEventsDetail");
	},
    isFilter : function (type) {
        if (!Session.get("typeFilter")) {return true;}
        return type == Session.get("typeFilter");
    },
	getTypesPerDay : function () {
		if (!Session.get("engagementsPerDay") || !Session.get("dayForEventsDetail")) { return ;}
		return _.map(Session.get("engagementsPerDay")[Session.get("dayForEventsDetail")], function (v,k) { return { type: k, count: v}});
	},
	getDetailsCardTemplate : function () {
		if (!Session.get("engagementToDelete") && !Session.get("engagementInModal") ) {
			return ;
		}
		return Session.get("engagementToDelete")?
			atgEventsTemplateHelpers.getTemplateForType(Session.get("engagementToDelete").atgEventTypeId, "detailsCard"):
			atgEventsTemplateHelpers.getTemplateForType(Session.get("engagementInModal").atgEventTypeId, "detailsCard");
	}
});

Template.atgEventsDashListPanel.events({
	"click .select-engagement" : function () {
		setEventOnCalendar(this);
	},
	"click .unselect-engagement" : function () {
		resetEventOnCalendar();
		atgEventsAnimations.scrollCalendarToDay($(".day-box-selected"));
	},
	"click #filter-bar" : function () {
        event.stopPropagation();
        Session.set("typeFilter", undefined);
	},
    "click .type-filter" : function (event) {
        event.stopPropagation();
        if (Object.keys(Session.get("engagementsPerDay")[Session.get("dayForEventsDetail")]).length == 1) {
            return ;
        }
        Session.get("typeFilter") == event.target.attributes.value.value ?
            Session.set("typeFilter", undefined) :
            Session.set("typeFilter", event.target.attributes.value.value);
    },
    "click .clear-filters" : function () {
        Session.set("typeFilter", undefined);
    }
})

// local helpers and variables
var removeClickedEventTime = 3200;
var resetClickedEventTimer;

function setEventOnCalendar(event) {

	Session.set("engagementOnCalendar", event );

	clearTimeout(resetClickedEventTimer);
	resetClickedEventTimer = setTimeout(function() {
		resetEventOnCalendar();
	}, removeClickedEventTime);
}

function resetEventOnCalendar() {
	Session.set("engagementOnCalendar", undefined );
	atgEventsAnimations.scrollCalendarToDay($(".day-box-selected"));
}

