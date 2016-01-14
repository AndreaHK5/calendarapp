// DateTime helpers

UI.registerHelper("getMonth", function (unixTime) {
  return moment.unix(unixTime).format('MMMM');
});

UI.registerHelper("getYear", function (unixTime) {
  return moment.unix(unixTime).year();
});

UI.registerHelper("getFormattedDate", function (unixTime) {
  return moment.unix(unixTime).format("dddd MMM DD YYYY");
});

// TODO - consider do this in the html?
// consider this as a helper - this is very specialised for a single html
// TODO improve this handler
UI.registerHelper("getDaysInMonth", function (unixTime) {
  var result = [];
  var startDay;
  var totalDays = moment.unix(unixTime).daysInMonth();
  var lastDayOfMonth = moment([moment.unix(unixTime).year(), moment.unix(unixTime).month(), totalDays]);
  if(moment().isBefore(lastDayOfMonth) && moment().month() == lastDayOfMonth.month()) {
    startDay = moment().date();
    for (var j = 0; j< moment().day(); j ++) {
      result.push({}) 
    }
  } else {
    startDay = 1;
    var firstDayOfMonth = moment([moment.unix(unixTime).year(), moment.unix(unixTime).month(), 1])
    for (var j = 0; j< firstDayOfMonth.day(); j ++) {
      result.push({}) 
    }
  }

  for (var i = startDay; i <= totalDays; i++) {
    result.push({ dayNumber : i, fullDate : moment([moment.unix(unixTime).year(), moment.unix(unixTime).month(), i]).unix()});
  }
  return result;
});


// universal helpers
Template.registerHelper('equals',
  function(v1, v2) {
      return (v1 === v2);
  }
);