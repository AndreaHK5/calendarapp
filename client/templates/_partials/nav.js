Template.nav.helpers({
  inTrips : function () {
    return Router.current().route.path() == "/";
  },
  inAddTrip : function () {
    return Router.current().route.path() == "/create";
  }
})