Template.nav.helpers({
  inTrips : function () {
    return Router.current().route.path() == "/";
  },
  inAddTrip : function () {
    return Router.current().route.path() == "/create";
  }
});

Template.nav.onRendered(function(){
  // open the dropdown
  $('.right.menu.open').on("click",function(e){
    e.preventDefault();
    $('.ui.vertical.menu').toggle();
  });
  $('.ui.dropdown').dropdown();
  
  $(".vertical a.item").on("click",function(e){
    $('.ui.vertical.menu').toggle();
  });
})
