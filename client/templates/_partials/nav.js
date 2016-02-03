Template.nav.helpers({
  inEngagementsList : function () {
    return Router.current().route.getName() == "engagementsList";
  },
  inEngagementCreate : function () {
    return Router.current().route.getName() == "engagementsCreate";
  },
  inEngagementsDash : function () {
    return Router.current().route.getName() == "engagementsDash";
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
