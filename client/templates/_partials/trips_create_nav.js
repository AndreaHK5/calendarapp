Template.tripsCreateNav.onRendered(function(){
  var siteNavbarHeight = $("#site-navbar").height();
  $('#weekday-navbar').css("margin-top", siteNavbarHeight);
});

Template.tripsCreateNav.helpers({
  showArrows : function () {
    // arrow hidden on events as not working
    return Router.current().route.getName() != "eventsIndex";    
  }
})
