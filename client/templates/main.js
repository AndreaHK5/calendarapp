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
  return moment(unixDate).format("dddd MMM DD");
}

// helpers for front end controllers
if (Meteor.isClient) {
  getTodayDate = function() {
    return moment().startOf('day');
  }

  mainGetLastMonthShowing = function () {
    var months = Session.get("monthsShowing");
    var last =  _.max(months, 
        function (month) { return moment(month.date).unix() }
    );
    return last;
  }

  betweenTwoDatesEventsQuery = function (queryStartDate, queryEndDate) {
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
}

