Meteor.startup(function () {

  sAlert.config({
    effect: 'stackslide',
    position: 'bottom',
    timeout: 3000,
    html: false,
    onRouteClose: true,
    stack : {
      spacing: 4,
      limit: 2
    },
    offset: 0
  });

});