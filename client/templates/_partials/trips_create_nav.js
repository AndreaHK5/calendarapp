Template.tripsCreateNav.onRendered(function(){
  var siteNavbarHeight = $("#site-navbar").height();
  $('#weekday-navbar').css("margin-top", siteNavbarHeight);
});