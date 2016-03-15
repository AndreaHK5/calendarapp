people = new Mongo.Collection('people');
personTypes = new Mongo.Collection('personTypes');

Schema = Schema ? Schema : {};

Schema.personType = new SimpleSchema({
    title: {
        type: String, //e.g. - customer, partner, press, internal, etc.
        unique: true
    },
    description: {
        type: String
    }
});

// TODO AC ditto, decide what is required or what is not

// images collection and location defined in partner.js

Schema.person = new SimpleSchema({
    personTypeIds: {
        type: [String]  // person can be of more than one type; ids from Schemas.personType
    },
    firstName: {
        type: String
    },
    middleName: {
        type: String,
        optional : true
    },
    lastName: {
        type: String
    },
    prefix: {
        type: String,
        optional : true
    },
    suffix: {
        type: String,
        optional : true
    },
    locations: {
        type: [Schema.entityLocation], //can have more than one location; defined in partner.js
        optional : true
    },
    contactMethodIds: {
        type: [String],  //person can have more than one type of contact method; defined in contactMethods.js
        optional : true
    },
    description: {
        type: String
    },
    images: {
        type: Schema.imageCollection,
        optional : true
    },
    rating: {
        type: Number,
        optional : true
    },
    employedByPartnerId: { //link to the partners model
        type: String,
        optional : true
    },
    // TODO how does this relate to the person type?
    employedTitle: {
        type: String,
        optional : true
    },
    employedByPartnerLocationId: {
        type: String,
        optional : true
    },
    // TODO added flag to identify MS staff OR do we want to make this a different person type?
    isMsStaff : {
        type : Boolean
    },
    // TODO delete after images are implemented
    picture : {
        type : String,
        optional : true
    }
});

people.attachSchema(Schema.person);
personTypes.attachSchema(Schema.personType);

if (Meteor.isServer) {
    people.allow({
        insert : function () {
            return true;
        },
        update : function () {
            return false;
        },
        remove : function () {
            return false;
        }
    });

    personTypes.allow({
        insert : function () {
            return true;
        },
        update : function () {
            return false;
        },
        remove : function () {
            return false;
        }
    });
}

personTypes.before.insert(function(userId, doc) {
    _.extend(doc, {
        createdAt: new Date()
    });
});

people.before.insert(function(userId, doc) {
    _.extend(doc, {
        createdAt: new Date()
    });
});
