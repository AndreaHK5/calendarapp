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
    // first experience messages
    Session.set("showWelcome", true);
    Session.set("filterMessage", true);
    Session.set("moreMonthsMessage", true);
    Session.set("navigationCreateMessage", true);
});


Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL"
});