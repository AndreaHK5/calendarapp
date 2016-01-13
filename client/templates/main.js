UI.registerHelper("getMonth", function (unixTime) {
  return moment.unix(unixTime).format('MMMM');
});

UI.registerHelper("getYear", function (unixTime) {
  return moment.unix(unixTime).year();
});