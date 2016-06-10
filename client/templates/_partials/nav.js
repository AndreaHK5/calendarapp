Template.nav.onRendered(function(){
  $('.right.menu.open').on("click",function(e){
    e.preventDefault();
    $('.ui.vertical.menu').toggle();
  });
  $('.ui.dropdown').dropdown();
  $(".vertical a.item").on("click",function(e){
    $('.ui.vertical.menu').toggle();
  });
})

Template.nav.events({
  "click .navigate" : function (e) {
      atgEventsAnimations.slideOutBottom("#slidable-container").then(function () {
        Session.set("sliInTop", true);
        Router.go($(e.target).attr("val"));
      })
  }
});
