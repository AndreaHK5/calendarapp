Template.confirmTrips.onRendered(function(){
  var myDiv = getPlaceholder();
  myDiv.height($(window).height() - $(".confirm-jumbo").height());
  TweenLite.to(myDiv,0.8, {height: 0});
});

Template.confirmTrips.helpers({
  getStartDate : function () {
    return Session.get("startDate");
  },
  getEndDate : function () {
    return Session.get("endDate");
  }
});

Template.confirmTrips.events({
  "click .reset-trip" : function (event) {
    var myDiv = getPlaceholder();
    var time = 800; //ms

    TweenLite.to(myDiv,time/1000, {height: $(window).height()});
    setTimeout(function() {
      Session.set("startDate", false);
      Session.set("endDate", false);      
    }, time - 200);
    sAlert.warning("Let's pick new dates!");
  },
  "click .save-trip" : function (event) {
    event.preventDefault();
    saveTrip(Session.get('startDate'), Session.get("endDate"), function (err, res) {
      if (err) {
        console.error(err);
      } else {
        // TODO the format is starting to be used quite frequently - research a global helper
        var start = moment.unix(res.startDate).format("dddd MMM DD");
        var end = moment.unix(res.endDate).format("dddd MMM DD");
        sAlert.success("Trip " +  start + " to " + end + " saved" , { onRouteClose: false } )
        Router.go("tripsIndex");
      }
    });
  }
});


// helpers
function getPlaceholder() {
  return $("#animationPlaceholder");; 
}
