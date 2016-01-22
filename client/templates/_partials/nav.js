Template.nav.helpers({
  inTrips : function () {
    return FlowRouter.getRouteName() == "home";
  },
  inAddTrip : function () {
    return FlowRouter.getRouteName() == "create";
  },
  inEventsIndex : function () {
    return FlowRouter.getRouteName() == "events";
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
