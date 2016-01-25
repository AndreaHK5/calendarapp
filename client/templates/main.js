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
}

