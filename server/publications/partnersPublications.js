Meteor.publish('developers', function () {
    return partners.find({
        partnerTypeIds : partnerTypes.findOne({title : "Developer"})["_id"]
    });
});

Meteor.publish('publishers', function () {
    return partners.find({
        partnerTypeIds : partnerTypes.findOne({title : "Publisher"})["_id"]
    });
});