Template.engagementsDashListPanel.onRendered(function () {
	// size the calendar and the tray at render
	Tracker.afterFlush(mainHelpers.positionTrayAndCalendar)

	// scroll calendar when the engagement bars are showing 
	this.autorun(function () {
		var onCalendar = Session.get("engagementOnCalendar");
		if (!onCalendar) { return ;}
		Tracker.afterFlush(function () {
			mainHelpers.scrollCalendarToDay($(".calendar-engagement-bar").first().parent().find(".day-box"));
		})
	})

	// resize when a filter is applied
	this.autorun(function () {
		Session.get("engagementsShowing");
		Tracker.afterFlush(function () {
			mainHelpers.resizeTrayAndCalendar();
		});
	});

	Session.set("engagementOnCalendar", undefined );
	Session.set("engagementToDelete", undefined );

})

Template.engagementsDashListPanel.helpers({
	engagementsOfTheDay : function () {
		var date = Session.get("dayForEventsDetail");
		var query = mainHelpers.betweenTwoDatesEngagementsQuery(moment(date), moment(date));
		var typeFiler = Session.get("typeFilter");
		if (typeFiler) {
			query["$and"].push({type : typeFiler});
		}
		var engagements = Engagements.find(query);
		Session.set("engagementsShowing", engagements.count());
		return engagements;
	},
	getEventDetails : function () {
		return Session.get("engagementToDelete");
	},
	modalCardColor : function () {
		var engagement = Session.get("engagementToDelete");
		if (!engagement) { return ;}
		return engagement.type;
	},
	typeFilter : function () {
		return Session.get("typeFilter");
	},
	dayShowing : function () {
		return Session.get("dayForEventsDetail");
	},

})

Template.engagementsDashListPanel.events({
	"click .close-day-container" : function (event) {
		mainHelpers.hideEventsContainer();
	},
	"click .select-engagement" : function () {
		setEventOnCalendar(this);
	},
	"click .unselect-engagement" : function () {
		resetEventOnCalendar();
		mainHelpers.scrollCalendarToDay($(".day-box-selected"));
	},
	"click .clear-type-filter" : function (event) {
		Session.set("typeFilter", undefined);;
	},
	"click .delete-engagement" : function (event) {
		// stop hovering animations		
		var engagementId = this._id;
		var engagement = Engagements.findOne(engagementId);
		Session.set("engagementToDelete", engagement);

		$('.basic.modal').modal({ 
			onApprove : removeEngagementCallback,
			onDeny : function () {
				return true;
			}
		})
		.modal('show');

		function removeEngagementCallback() {
			removeEngagement(engagementId, engagementRemovalHandler)			
		}

		engagementRemovalHandler = function (err, res) {
			Session.set("engagementToDelete", undefined);
			if (err) {
				sAlert.error("Woha, somethign went wrong trying to delete " + engagement.title + ", " + err.error);
			} else {
				sAlert.success("Engagement " + engagement.title + " deleted");
				var date = Session.get("dayForEventsDetail");
				if (Engagements.find(mainHelpers.betweenTwoDatesEngagementsQuery(moment(date), moment(date))).count() == 0) {
					// if no more engagements at this date, close the list panel 
					$('.basic.modal').remove()
					mainHelpers.hideEventsContainer();
				} else {
					mainHelpers.resizeTrayAndCalendar();
				}
			}
		}
	}
})

// local helpers and variables
var removeClickedEventTime = 3200;
var resetClickedEventTimer;

function setEventOnCalendar(event) {
	var engagementOnCalendar = {
		startDate: event.startDate,
		endDate: event.endDate,
		type: event.type,
		_id: event._id
	}
	Session.set("engagementOnCalendar", engagementOnCalendar );

	clearTimeout(resetClickedEventTimer);
	resetClickedEventTimer = setTimeout(function() {
		resetEventOnCalendar();
	}, removeClickedEventTime);
}

function resetEventOnCalendar() {
	Session.set("engagementOnCalendar", undefined );
	mainHelpers.scrollCalendarToDay($(".day-box-selected"));
}

