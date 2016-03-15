Template.engagementsDashListPanel.onRendered(function () {
	// size the calendar and the tray at render
	Tracker.afterFlush(atgEventsHelpers.positionTrayAndCalendar)

	// scroll calendar when the engagement bars are showing 
	this.autorun(function () {
		var onCalendar = Session.get("engagementOnCalendar");
		if (!onCalendar) { return ;}
		Tracker.afterFlush(function () {
			atgEventsHelpers.scrollCalendarToDay($(".calendar-engagement-bar").first().parent().find(".day-box"));
		})
	})

	// resize when a filter is applied
	this.autorun(function () {
        // these session variables trigger the autotun;
		Session.get("engagementsShowing");
        Session.get("typeFilter");
		Tracker.afterFlush(function () {
			atgEventsHelpers.resizeTrayAndCalendar();
		});
	});

	Session.set("engagementOnCalendar", undefined );
	Session.set("engagementToDelete", undefined );

	Meteor.subscribe("engagements");
	Meteor.subscribe("engineers");
	Meteor.subscribe("dams");
	Meteor.subscribe("developers");
	Meteor.subscribe("publishers");

})

Template.engagementsDashListPanel.helpers({
	engagementsOfTheDay : function () {
		var date = Session.get("dayForEventsDetail");
		var query = atgEventsHelpers.betweenTwoDatesEngagementsQuery(moment(date), moment(date).endOf("Day"));
		var typeFiler = atgEventTypes.findOne({ type : Session.get("typeFilter") } );

		if (typeFiler) {
			query["$and"].push({atgEventTypeId : typeFiler._id});
		}
		var eng = atgEvents.find(query);
		Session.set("engagementsShowing", eng.count());
		if (eng.count() == 0) {
            // in the case the last engagement of the day is deleted
            atgEventsHelpers.resetSessionForDash();
            return;
		}

		return eng;
	},
	getEventDetails : function () {
		return Session.get("engagementToDelete");
	},
	modalCardColor : function () {
		var engagement = Session.get("engagementToDelete");
		if (!engagement) { return ;}
		return engagement.atgEventTypeId;
	},
	typeFilter : function () {
		return Session.get("typeFilter");
	},
	dayShowing : function () {
		return Session.get("dayForEventsDetail");
	},
	getDetailsCardTemplate : function () {
        if (!Session.get("engagementToDelete")) {
            return ;
        }
		return atgEventsHelpers.getTemplateForType(Session.get("engagementToDelete").atgEventTypeId, "detailsCard");
	}

})

Template.engagementsDashListPanel.events({
	"click .close-day-container" : function (event) {
		atgEventsHelpers.hideEventsContainer();
	},
	"click .select-engagement" : function () {
		setEventOnCalendar(this);
	},
	"click .unselect-engagement" : function () {
		resetEventOnCalendar();
		atgEventsHelpers.scrollCalendarToDay($(".day-box-selected"));
	},
	"click .clear-type-filter" : function (event) {
		Session.set("typeFilter", undefined);;
	},
	"click .delete-engagement" : function (event) {
		// stop hovering animations		
		var engagementId = this._id;
		var engagement = atgEvents.findOne(engagementId);
		Session.set("engagementToDelete", engagement);

		$('.delete-engagement-modal').modal({ 
			onApprove : removeEngagementCallback,
			onDeny : function () {
				return true;
			}
		})
		.modal('show');

		function removeEngagementCallback() {
			removeAtgEvent(engagementId, engagementRemovalHandler)
		}

		engagementRemovalHandler = function (err, res) {
			Session.set("engagementToDelete", undefined);
			if (err) {
				sAlert.error("Woha, somethign went wrong trying to delete " + engagement.title + ", " + err.error);
			} else {
				sAlert.success("Engagement " + engagement.eventDetails.title + " deleted");
				var date = Session.get("dayForEventsDetail");
				if (atgEvents.find(atgEventsHelpers.betweenTwoDatesEngagementsQuery(moment(date), moment(date))).count() == 0) {
					// if no more engagements at this date, close the list panel 
					$('.basic.modal').remove()
					atgEventsHelpers.hideEventsContainer();
				} else {
					atgEventsHelpers.resizeTrayAndCalendar();
				}
			}
		}
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
	atgEventsHelpers.scrollCalendarToDay($(".day-box-selected"));
}

