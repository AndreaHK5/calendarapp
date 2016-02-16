Template.engagementsCalendar.onRendered(function () {

  Session.set("monthsShowing", getMonths());
  Session.set('hoverMonth', mainHelpers.getTodayDate().toISOString());
  
  // size the calendar to the screen
  Tracker.afterFlush(mainHelpers.positionTrayAndCalendar);

  // on finish rendered to ensure the daybox is tall enough
  this.autorun(function(){ 
    Session.get("newDayRendered");
    Tracker.afterFlush(mainHelpers.adjustDayBoxHeight);
  });

  // scroll to newly created month on DOM
  this.autorun(function () {
    var targetMonth = Session.get("targetMonth");
    if (!targetMonth) { return ;}
    Tracker.afterFlush( function () {
      scrollVertical($('#' + moment(targetMonth).unix() ));
      Session.set("hoverMonth", targetMonth); 
    });
  })

  // fade calendar in
  var calendar = $("#calendar-container");
  calendar.css("opacity", 0);
  TweenLite.to(calendar, 0.7, {ease : Sine.easeIn, opacity: 1});

});

Template.engagementsCalendar.helpers({
  months : function () {
    return Session.get("monthsShowing");
  },
  startDateSelected : function () {
    return Session.get("startDate");
  },
  getShortMonth : function () {
    return moment(Session.get('hoverMonth')).format("MMM").toUpperCase();
  },
  getUnix : function (isoDate) {
    return moment(isoDate).unix();
  },
  firstMonthHovered : function () {
    return Session.get("hoverMonth") == mainHelpers.getTodayDate().toISOString();
  }
});

Template.engagementsCalendar.events({
  "click .add-month" : function (event) {
    event.preventDefault();
    addMonth();
  },
  // TODO scroll next month and scroll prev months are similar, DRY them with helper
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
      if (Session.get("hoverMonth") != mainHelpers.getTodayDate().add(1,'month').startOf('month').toISOString()) { 
        return; 
      }
      myDiv = $('#' + mainHelpers.getTodayDate().unix());
      Session.set("hoverMonth", mainHelpers.getTodayDate().toISOString());
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
  var last = mainHelpers.GetLastMonthShowing();
  var newDate = moment(last.date).add(1, 'month');
  var months = Session.get("monthsShowing")
  months.push({date : newDate.toISOString() });
  Session.set("monthsShowing", months)
  // scroll to newly created month with a reactive variable
  Session.set("targetMonth", newDate.toISOString());
}

function getMonths() {
  var now = mainHelpers.getTodayDate();
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
  var topY = calendar.scrollTop() + div.offset().top - $('#weekday-navbar').height() - $('#site-navbar').height() + 10;
  TweenMax.to(calendar,1, {scrollTo:{y:topY}, ease:Power4.easeOut});
}