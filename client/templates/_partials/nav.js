Template.nav.helpers({
  inTrips : function () {
    return Router.current().route.path() == "/";
  },
  inAddTrip : function () {
    console.log(Router.current().route.path());
    return Router.current().route.path() == "/create";
  }
})