uploads = new Meteor.Collection('uploads');

uploads.before.insert(function(userId, doc) {
    _.extend(doc, {
        createdAt: new Date()
    });
});