Template.tripsCreate.onRendered(function () {
  // form is cleared at render. Move this code outside this handler in case we prefer 
  //the form to remain populated (logic will be required in order to wipe that) 
  Session.set('months', getMonths());
  Session.set('startDate', {});
  Session.set('hoverMonth',{});
});

Template.tripsCreate.helpers({
  months : function () {
    return Session.get("months");;
  }
});

Template.tripsCreate.events({
  "click .add-month" : function (event) {
    event.preventDefault();
    // TODO improve this method
    var months = Session.get("months");
    var last = 
      _.max(months, 
        function (month) { return month.date }
      );
    var newDate = moment.unix(last.date).add(1, 'month').unix();
    months.push({date : newDate});
    Session.set("months", months);
  },
  "click .save-trip" : function (event) {
    event.preventDefault();

    saveTrip(Session.get('startDate'), function (err,res) {
      if (err) {
        console.error(err);
      } else {
        Router.go("tripsIndex");
      }
    });
  },
  "click .select-day" : function (event) {
    event.preventDefault();
    Session.set('startDate', this.fullDate);
  },
  // TODO scroll next month and scroll prev months are similar, DRY them with helper
  "click .scroll-next-month" : function () {
    if (!Session.get("hoverMonth")) { return ; } 
    var monthAfter = moment.unix(Session.get("hoverMonth")).add(1, 'month').unix();
    var myDiv = $('#' + monthAfter);
    if (!myDiv.length) { return ;}
    var topY = myDiv.offset().top - $(".navbar-fixed-top").height() - $("#weekday-navbar").height() ;
    // TODO green sock here
    window.scrollTo(0, topY);
    Session.set("hoverMonth", monthAfter);
  },
    "click .scroll-prev-month" : function () {
    if (!Session.get("hoverMonth")) { return ; } 
    var monthAfter = moment.unix(Session.get("hoverMonth")).add(-1, 'month').unix();
    var myDiv = $('#' + monthAfter);
    if (!myDiv.length) { return ;}
    var topY = myDiv.offset().top - $(".navbar-fixed-top").height() - $("#weekday-navbar").height();
    // TODO green sock here
    window.scrollTo(0, topY);
    Session.set("hoverMonth", monthAfter);
  },
  "mouseenter .hovering" : function (event) {
    Session.set("hoverMonth", this.date);
  }
});

Template.tripsCreate.rendered = function () {
  //Affix initialisation  
  $('#weekday-navbar').affix({
      offset: {
        // TODO find a cleaner way to get the top offset
          top: $(".navbar-fixed-top").outerHeight() + $("#banner").height() - parseInt($("#banner").css('marginTop').replace("px", ""))
      }
  });
  //Scrollspy initialisation  
  $('body').scrollspy({ target: '#myScrollspy' });
};


// helper
function getMonths() {
  var now = moment();
  var result = [];
  result.push({date : now.unix()});
  for (var i = 1; i < 3; i++) {
    var newDate = now.add(1, 'month');
    result.push({date : newDate.unix()});
  };
  return result; 
}