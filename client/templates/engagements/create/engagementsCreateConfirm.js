Template.engagementsCreateConfirm.onRendered(function(){
  var myDiv = getPlaceholder();
  myDiv.height($(window).height() - $(".confirm-jumbo").height());
  TweenLite.to(myDiv,0.8, {height: 0});
});

Template.engagementsCreateConfirm.events({
  "click .save-event" : function (event) {
    event.preventDefault();
    var eventL = Session.get("engagementDetails");
    eventL.startDate = Session.get('startDate');
    eventL.endDate = Session.get('endDate');  
    saveEngagement(eventL, function (err, res) {
      if (err) {
        sAlert.error("Woha, something went wrong" + (err));
      } else {
        // TODO the format is starting to be used quite frequently - research a global helper
        var start = moment.unix(res.startDate).format("dddd MMM DD");
        var end = moment.unix(res.endDate).format("dddd MMM DD");
        sAlert.success("Trip " +  start + " to " + end + " saved" , { onRouteClose: false } )
        Router.go("engagementsList");
      }
    });
  }
});


// helpers
function getPlaceholder() {
  return $("#animationPlaceholder"); 
}