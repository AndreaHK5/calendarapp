Template.calendar.onRendered(function () {
  // form is cleared at render. Move this code outside this handler in case we prefer 
  //the form to remain populated (logic will be required in order to wipe that) 
  Session.set('months', getMonths());
  Session.set('hoverMonth', getTodayDate().unix());
  //TweenMax.set(, {opacity:0.2});
});

Template.calendar.helpers({
  months : function () {
    return Session.get("months");
  },
  startDateSelected : function () {
    return Session.get("startDate");
  }
});

Template.calendar.events({
  "click .add-month" : function (event) {
    event.preventDefault();
    addMonth();
  },
  // TODO scroll next month and scroll prev months are similar, DRY them with helper
  "click .scroll-next-month" : function () {
    if (!Session.get("hoverMonth")) { return ; } 
    var monthAfter = moment.unix(Session.get("hoverMonth")).add(1, 'month').unix();
    var myDiv = $('#' + monthAfter);
    if (!myDiv.length) { 
      addMonth();
    } else {
      var topY = myDiv.offset().top - $("#site-navbar").height() - $("#weekday-navbar").height();
      scrollVertical(topY);
      Session.set("hoverMonth", monthAfter);
      updateNavigationArrows();      
    }
  },
  "click .scroll-prev-month" : function () {
    if (!Session.get("hoverMonth")) { return ; } 
    var monthBefore = moment.unix(Session.get("hoverMonth")).add(-1, 'month').unix();
    var myDiv = $('#' + monthBefore);
    if (!myDiv.length) { return ;}
    var topY = myDiv.offset().top - $("#site-navbar").height() - $("#weekday-navbar").height();
    scrollVertical(topY);
    // window.scrollTo(0, topY);
    Session.set("hoverMonth", monthBefore);

    updateNavigationArrows();
  },
  "mouseenter .hovering" : function (event) {
    Session.set("hoverMonth", this.date);
    updateNavigationArrows();
  }
});

// helpers 
// TODO how to make helpers not in global? IFFE an module load at top?

function scrollVertical(topY) {
  TweenMax.to(window,1, {scrollTo:{y:topY}, ease:Power4.easeOut});
} 

function addMonth() {
  var months = Session.get("months");
  var last = 
    _.max(months, 
      function (month) { return month.date }
    );
  var newDate = moment.unix(last.date).add(1, 'month').unix();
  months.push({date : newDate});
  Session.set("months", months);
  updateNavigationArrows();
  // scroll to newly created month...
  // TODO this is a terrible workaround, need a promise on the div creation (on rendered?)
  setTimeout(function(){
    var myDiv = $('#' + newDate);
    var topY = myDiv.offset().top - $("#site-navbar").height() - $("#weekday-navbar").height() ;
    scrollVertical(topY);
    Session.set("hoverMonth", newDate);
    updateNavigationArrows();    
  },100)
}


var updateNavigationArrows = function () {
  // is there anohter month before
  var anotherMonthBefore = moment.unix(Session.get("hoverMonth")).add(-1, 'month').unix();
  var myDiv = $('#' + anotherMonthBefore);
  (!myDiv.length) ? $(".scroll-prev-month").addClass("scroll-arrow-inactive") : $(".scroll-prev-month").removeClass("scroll-arrow-inactive");
}

function getMonths() {
  var now = getTodayDate();
  var result = [];
  result.push({date : now.unix()});
  for (var i = 1; i < 3; i++) {
    var newDate = now.add(1, 'month');
    result.push({date : newDate.unix()});
  };
  return result; 
}


function getTodayDate(){
  return moment().startOf('day');
}