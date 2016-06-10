Handlebars.registerHelper('momentFormatter', function(date, formatter) {
    if (!date) {
        return undefined;
    }
    return moment(date).format(formatter);
});


Handlebars.registerHelper('userLoggedIn', function(date, formatter) {
        return Meteor.userId() ? true : false;
})
