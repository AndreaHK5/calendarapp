atgEvents = new Mongo.Collection('atgEvents');
atgEventTypes = new Mongo.Collection('atgEventTypes');

var Schema = Schema ? Schema : {};

//Utility = {};
//Utility.enum = Utility.enum || {};
//
//Utility.enum.atgEventTypes = {
//    Engagement: 1,
//    Oof: 2,
//    Meeting: 3,
//};

Schema.atgEventTypes = new SimpleSchema({
    type : {
        type: String, // MTG, OOF, Engagement
        unique : true
    },
    description : {
        type : String,
        optional : true
    },
    icon : {
        type : String
    },
    eventSchema : {
        type : String // this will be the required schema for the event, enforced at validation with Meteor method
    }
})


Schema.atgEvents = new SimpleSchema({
    atgEventTypeId : {
        type : String // ID of the type
    },
    startDate: {
        "type": "Date"
    },
    endDate: {
        "type": "Date"
    },
    eventDetails : {
        type : Object, // this is gonna be checked against the schema in the atgEventType
        blackbox : true
    }
})

atgEventTypes.attachSchema(Schema.atgEventTypes);
atgEvents.attachSchema(Schema.atgEvents);

atgEvents.before.insert(function(userId, doc) {
    _.extend(doc, {
        createdAt: new Date(),
        createdBy: userId
    });
});