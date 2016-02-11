UI.registerHelper("getFormattedDate", function (unixDate) {
  return formateDateHelper(unixDate);
});


// These helpers and setting serve and allow to get colors for the legend and the difference engagement types.
Session.set("engagementsTypesColorMap", {
    "vacation" : "rgb(0,174,239)",
    "engagement" : "rgb(0,166,0)"
});

// these are the microsoft colors. once they are 
var microsoftColors = [ "rgb(0,113,188)", "rgb(141,46,136)", "rgb(15,62,157)", "rgb(140,198,0)",
                    "rgb(255,242,0)", "rgb(255,190,0)", "rgb(255,138,0)", "rgb(255,83,0)",
                    "rgb(255,0,0)", "rgb(255,0,151)"];

UI.registerHelper("getEngagementTypeColor", function (engagementType) {
  // safe method in case a new type is provided
  if (engagementType == null) {
    return;
  }
  var map = Session.get("engagementsTypesColorMap");
  engagementType = engagementType.toLowerCase(); 
  if (!(engagementType in map)) {
    // generate random color when the standard ones are finished
    var color = microsoftColors.shift() || "#"+((1<<24)*Math.random()|0).toString(16);
    map[engagementType] = color;
    Session.set("engagementsTypesColorMap", map);
    return color;
  }
  return map[engagementType];
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
  mainHelpers = {}

  // helpers for front end controllers

  mainHelpers.getTodayDate = function() {
    return moment().startOf('day');
  }

  mainHelpers.GetLastMonthShowing = function () {
    var months = Session.get("monthsShowing");
    var last =  _.max(months, 
        function (month) { return moment(month.date).unix() }
    );
    return last;
  }

  mainHelpers.betweenTwoDatesEngagementsQuery = function (queryStartDate, queryEndDate) {
    return { $and :[
                  {
                    startDate : {$lte :  new Date (queryEndDate.toISOString()) }
                  },
                  {
                    endDate : {$gte : new Date (queryStartDate.toISOString())  }
                  }
                ]
              };
  }

  mainHelpers.betweenDatesAndTypeEngagementsQuery = function (queryStartDate, queryEndDate, type) {
    var query = mainHelpers.betweenTwoDatesEngagementsQuery(queryStartDate, queryEndDate);
    query[$and].push({type : type});
    return query;
  }

  // animations

  var slidingTime = 0.6;

  var getUsableHeight = function () {
    var navbarHeigt = getNavbarHeight();
    var totalHeight = $(window).height();
    return totalHeight - navbarHeigt;    
  }

  var getNavbarHeight = function () {
    return $('#site-navbar').height() + $('#weekday-navbar').height()
  }

  mainHelpers.positionTrayAndCalendar = function() {
    var calendar = $("#calendar-container");
    var bottomTray = $("#dayengagements-container");
    var usableAreaHeight = getUsableHeight();
    calendar.css("top", getNavbarHeight());
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
      TweenMax.to(bottomTray, slidingTime, { top : usableAreaHeight - bottomTrayHeight + getNavbarHeight() });
      bottomTray.css("visibility", "visible");
      $('#cards-viewport').height(bottomTrayHeight)

    } else {
      mainAreaHeight = usableAreaHeight;
      calendar.css("height", mainAreaHeight);
    } 
  }

  mainHelpers.hideEventsContainer = function() {
    // this needs to be a promise in order for the caller to update on finish
    var calendar = $("#calendar-container");
    var bottomTray = $("#dayengagements-container");
    var usableAreaHeight = getUsableHeight();
    TweenMax.to(calendar, slidingTime, { height : usableAreaHeight});    
    TweenMax.to(bottomTray, slidingTime, { 
      top : $(window).height(),
      onComplete : function () {
        Session.set("dayForEventsDetail", undefined);     
      }
    });
  }

  mainHelpers.resizeTrayAndCalendar = function () {
    var calendar = $("#calendar-container");
    var bottomTray = $("#dayengagements-container");
    var usableAreaHeight = getUsableHeight();
    if (bottomTray.length == 0) { return ; }
    var cardsTotalHeight = $("#cards-container").height();
    var bottomTrayHeight = Math.min(usableAreaHeight / 2, cardsTotalHeight );
    var overflow = bottomTrayHeight == cardsTotalHeight ? "hidden" : "scroll";
    $("#cards-viewport").css("overflow-y", overflow)
    mainAreaHeight = usableAreaHeight - bottomTrayHeight;
    
    TweenMax.to(calendar, slidingTime, { height : mainAreaHeight});
    TweenMax.to(bottomTray, slidingTime, { top : usableAreaHeight - bottomTrayHeight + getNavbarHeight() });
    TweenMax.to(bottomTray, slidingTime, { height : bottomTrayHeight});
    $('#cards-viewport').height(bottomTrayHeight);
  }

  mainHelpers.scrollCalendarToDay = function (div) {
    if (!div) {return ;}
    var calendar = $('#calendar-container');  
    var topY = calendar.scrollTop() + div.offset().top - 2* div.height();
    TweenLite.to(calendar, slidingTime, {scrollTo:{y:topY}, ease:Power2.easeOut});
  }
}

