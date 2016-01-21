Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.route("/",{
  name: "tripsIndex"
});

Router.route("/create", {
  name: "tripsCreate"
});

Router.route("/events", {
  name: "eventsIndex"
});