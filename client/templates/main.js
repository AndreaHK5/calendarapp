// DateTime helpers

UI.registerHelper("getMonth", function (unixTime) {
  return moment.unix(unixTime).format('MMMM');
});

UI.registerHelper("getYear", function (unixTime) {
  return moment.unix(unixTime).year();
});

// TODO - consider do this in the html?
// consider this as a helper - this is very specialised for a single html
// TODO improve this handler
UI.registerHelper("getDaysInMonth", function (unixTime) {
  var result = [];
  var startDay;
  var totalDays = moment.unix(unixTime).daysInMonth();
  var lastDayOfMonth = moment([moment.unix(unixTime).year(), moment.unix(unixTime).month(), totalDays]);
  console.log(lastDayOfMonth);
  if(moment().isBefore(lastDayOfMonth) && moment().month() == lastDayOfMonth.month()) {
    startDay = moment().date();
    for (var j = 0; j< moment().day(); j ++) {
      result.push({day: 99, show : false}) 
    }
  } else {
    startDay = 1;
  }

  for (var i = startDay; i <= totalDays; i++) {
    result.push({ dayNumber : i , show: true});
  }
  return result;
});