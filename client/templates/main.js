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

var eventTypeMap = {
    "vacation" : "#00A600",
    "engagement" : "#00AEEF"
}

var otherColors = [ "#8D2E92", "#FFBE00", "#FF0097", "#0071BC"];

UI.registerHelper("getEventTypeColor", function (eventType) {

  // safe method in case a new type is provided
  eventType = eventType.toLowerCase(); 
  if (!(eventType in eventTypeMap)) {
    var color = otherColors.shift();
    eventTypeMap[eventType] = color;
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

  findEvents = function (queryStartDate, queryEndDate) {
    return Events.find({ $and :[{startDate : {$lte :  queryEndDate }},{endDate : {$gte : queryStartDate}}]});
  } 
}

