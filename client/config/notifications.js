Meteor.startup(function () {

  sAlert.config({
    effect: '',
    position: 'bottom',
    timeout: 3000,
    html: false,
    onRouteClose: true,
    stack : {
      spacing: 4,
      limit: 3
    },
    offset: 0
  });

});