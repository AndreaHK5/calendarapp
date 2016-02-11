Template.engagementsDashListPanel.onRendered(function () {
	setTimeout(function() {
		mainHelpers.positionTrayAndCalendar();
	}, 100);
	Session.set("engagementOnCalendar", undefined );
	Session.set("engagementToDelete", undefined );

	// TODO this in recompute calendar and events list container on resize
	// $(window).resize(function(evt) {
	// 	// debounced
 //    	setTimeout(function () {
	//     	adjustEventsContainer();
 //    	},150)
 //  	});
})

Template.engagementsDashListPanel.helpers({
	engagementsOfTheDay : function () {
		var date = Session.get("dayForEventsDetail");
		if (engagementContainerShowing) {
			adjustEventsContainer();
		}
		var query = mainHelpers.betweenTwoDatesEngagementsQuery(moment(date), moment(date));
		var typeFiler = Session.get("typeFilter");
		if (typeFiler) {
			query["$and"].push({type : typeFiler});
		}
		return Engagements.find(query);
	},
	isSelectedEvent : function (id) {
		if(!Session.get("engagementOnCalendar")) { return }
		return Session.get("engagementOnCalendar")._id == id;
	},
	isCreator : function () {
		return Meteor.user() && this.createdBy == Meteor.userId();
	},
	getEventDetails : function () {
		return Session.get("engagementToDelete");
	},
	typeFilter : function () {
		return Session.get("typeFilter");
	},
	dayShowing : function () {
		return Session.get("dayForEventsDetail");
	},

})

Template.engagementsDashListPanel.events({
	"mouseenter .hover-engagement" : function () {
		if (!useHover) {return;} 
		var targetEvent = this;
		if (hoovering) {
			// another engagement has been hovered, so no need to wait to make the animation appear
			setEventOnCalendar(targetEvent);
		} else {
			// first engagement to be shown, on hover we wait to show
			showHoveredEventTimer = setTimeout(function() {
				hoovering = true;
				setEventOnCalendar(targetEvent);
			}, hooverDebounceTime);
		}

	},
	"mouseleave .hover-engagement" : function () {
		if (!useHover) {return;} 
		// this is required if the hover is to another card rather than to the calendar
		resetEventOnCalendar();
	},
	"mouseleave #dayengagements-container" : function () {
		hoovering = false;
		if (!useHover) {return;} 
		// this is required if the hover is to another card rather than to the calendar
		resetEventOnCalendar();
	},
	"click .close-day-container" : function (event) {
		mainHelpers.hideEventsContainer();
	},
	"click .select-engagement" : function () {
		useHover = false;
		hoovering = false;
		clearTimeout(showHoveredEventTimer);
		setEventOnCalendar(this);
	},
	"click .unselect-engagement" : function () {
		useHover = true;
		hoovering = false;
		clearTimeout(showHoveredEventTimer);
		resetEventOnCalendar();
		scrollCalendarToSelectedDay();
	},
	"click #calendar-container" : function () {
		resetEventOnCalendar();
	},
	"click .delete-engagement" : function (event) {
		// stop hovering animations
		hoovering = false;

		
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
					adjustEventsContainer();
				}
			}
		}
	}
})

// local helpers and variables

var engagementContainerShowing = false;
// if the user starts clicking on engagments turn off hoovering
var useHover = true;
// if we are already hoovering on something, do not debounce
var hoovering = false;
var animationTime = 0.4;
var hooverDebounceTime = 1200;
var removeClickedEventTime = 3200;
var showHoveredEventTimer;
var resetClickedEventTimer;



function setEventOnCalendar(event) {
	// resetEventOnCalendar();
	var engagementOnCalendar = {
		startDate: event.startDate,
		endDate: event.endDate,
		type: event.type,
		_id: event._id
	}
	Session.set("engagementOnCalendar", engagementOnCalendar );
	setTimeout(function() {
		scrollCalendarToDiv($(".calendar-engagement-bar").first().parent().find(".day-box"));
		//TweenMax.allTo($(".calendar-engagement-bar"), 0.1, {opacity:1}, 0.02);
	}, 10);
	clearTimeout(resetClickedEventTimer);
	resetClickedEventTimer = setTimeout(function() {
		resetEventOnCalendar();
	}, removeClickedEventTime);
}

function resetEventOnCalendar() {
	useHover = true;
	clearTimeout(showHoveredEventTimer);
	Session.set("engagementOnCalendar", undefined );
	scrollCalendarToSelectedDay();
}

function resetSelectedDay() {
	Session.set("dayForEventsDetail", undefined);
}


// Animations

function showEventsContainer() {
	var calendar = $('#calendar-container');
	var engagementsContainer = $('#dayengagements-container');
	var totalHeight = getTotalHeight();
	var engagementsHeight = Math.min(engagementsContainer.height() , totalHeight / 2);
	var calendarHeight = totalHeight - engagementsHeight; 
	// set height of calendar to window and add scroll
	// plus adjust margin bottom for semantic
	calendar.css("height", totalHeight);
	calendar.css("overflow", "scroll");
	calendar.css("margin-bottom", 0);
	engagementsContainer.css("visibility", "visible");

	// animate up container
	// animate css for calendar

	TweenLite.set(calendar, {height: calendarHeight});
	TweenLite.from(calendar, animationTime, {height: totalHeight});
	
	scrollCalendarToSelectedDay();

	TweenLite.set(engagementsContainer, {height: engagementsHeight});
	TweenLite.from(engagementsContainer, animationTime, { height: 0, 
		onComplete : function () { 
			engagementContainerShowing = true;
		}
	});
}

function adjustEventsContainer() {
	setTimeout(function() {
		var engagementsContainer = $('#dayengagements-container');
		var calendar = $('#calendar-container');
		var totalHeight = getTotalHeight();
		var engagementsHeight = Math.min($('#dayengagements-container').height(), totalHeight / 2);
		var calendarHeight = totalHeight - engagementsHeight; 

		TweenLite.to(calendar,animationTime, {height:calendarHeight});		
		TweenLite.to(engagementsContainer,animationTime, {height:engagementsHeight});
		scrollCalendarToSelectedDay();

	}, 100);

}

function getTotalHeight() {
	return  $(window).height() - $('#site-navbar').height() - $('#weekday-navbar').height();
}

function scrollCalendarToSelectedDay () {
	scrollCalendarToDiv($(".day-box-selected"))
}


function scrollCalendarToDiv(div) {
	if (!div) {return ;}
	var calendar = $('#calendar-container');

	var topY = calendar.scrollTop() + div.offset().top - 2* div.height();
	TweenLite.to(calendar, animationTime, {scrollTo:{y:topY}, ease:Power2.easeOut});	
}
