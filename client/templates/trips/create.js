


Template.tripsCreate.onRendered(function () {
  // form is cleared at render. Move this code outside this handler in case we prefer 
  //the form to remain populated (logic will be required in order to wipe that) 
  Session.set('months', getMonths());
  Session.set('startDate', {});
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
    Session.set('startDate', this.fullDate.unix());
    console.log("works");
  }
});

// helper
function getMonths() {
  var now = moment();
  var result = [];
  result.push({date : now.unix()});
  for (var i = 1; i < 3; i++) {
    var newDate = now.add(1, 'month')
    result.push({date : newDate.unix()});
  };
  return result; 
}