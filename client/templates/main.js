// UI helpers

UI.registerHelper("getMonth", function (unixTime) {
  return moment.unix(unixTime).format('MMMM');
});

UI.registerHelper("getYear", function (unixTime) {
  return moment.unix(unixTime).year();
});

UI.registerHelper("getFormattedDate", function (unixDate) {
  return formateDateHelper(unixDate);
});





// These helpers and setting serve and allow to get colors for the legend and the difference events types.
Session.set("eventsMap", {
    "vacation" : "rgb(0,174,239)",
    "engagement" : "rgb(0,166,0)"
});

// these are the microsoft colors. once they are 
var microsoftColors = [ "rgb(0,113,188)", "rgb(141,46,136)", "rgb(15,62,157)", "rgb(140,198,0)",
                    "rgb(255,242,0)", "rgb(255,190,0)", "rgb(255,138,0)", "rgb(255,83,0)",
                    "rgb(255,0,0)", "rgb(255,0,151)"];

UI.registerHelper("getEventTypeColor", function (eventType) {
  // safe method in case a new type is provided
  var eventTypeMap = Session.get("eventsMap");
  eventType = eventType.toLowerCase(); 
  if (!(eventType in eventTypeMap)) {
    var color = microsoftColors.shift();
    eventTypeMap[eventType] = color;
    Session.set("eventsMap", eventTypeMap);
    return color;
  }
  return eventTypeMap[eventType];
});






// universal helpers
Template.registerHelper('equals',
  function(v1, v2) {
      return (v1 === v2);
  }
);

var formateDateHelper = function (unixDate) {
  return moment.unix(unixDate).format("dddd MMM DD");
}

// helpers for front end controllers
if (Meteor.isClient) {
  getTodayDate = function() {
    return moment().startOf('day');
  }

  betweenTwoDatesEventsQuery = function (queryStartDate, queryEndDate) {
    return { $and :[{startDate : {$lte :  queryEndDate }},{endDate : {$gte : queryStartDate}}]}
  } 
}

