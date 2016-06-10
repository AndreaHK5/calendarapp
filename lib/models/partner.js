partners = new Mongo.Collection('partners');
partnerTypes = new Mongo.Collection('partnerTypes');

Schema = Schema ? Schema : {};

// TODO AC do we want to enforce the uniqueness here?
Schema.partnerType = new SimpleSchema({
    title: {
        type: String, //e.g. - Publisher, Developer, Distributor, Marketing, etc.
        unique: true
    },
    description: {
        type: String
    }
});

Schema.entityLocation = new SimpleSchema({
    title: {
       type: String
    },
    addressOne: {
        type: String
    },
    addressTwo: {
        type: String,
        optional: true
    },
    addressThree: {
        type: String,
        optional: true
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    postalCode: {
        type: String
    },
    country: {
        type: String
    },
    longitude: {
        type: String,
        optional: true
    },
    latitude: {
        type: String,
        optional: true
    },
    isPrimaryLocation: {
        type: Boolean,
        defaultValue : false
    }
});

Schema.imageCollection = new SimpleSchema({
    icon: {
        type: String, //these are all URLs,
        optional: true
    },
    thumbnail: {
        type: String,
        optional: true
    },
    small: {
        type: String,
        optional: true
    },
    medium: {
        type: String,
        optional: true
    },
    large: {
        type: String,
        optional: true
    },
    jumbotron: {
        type: String,
        optional: true
    },
    pageBackground: {
        type: String,
        optional: true
    },
    url : {
        type : String
    }
});

Schema.partner = new SimpleSchema({
    partnerTypeIds: {
        type: [String]  //can be more than one type of partner
    },
    companyName: {
        type: String
    },
    locations: {
        type: [Schema.entityLocation] //can have more than one location
    },
    contactMethods: {
        type: [String], //partner can have more than one type of contact method; these are ids from contractType
        optional : true
    },
    description: {
        type: String
    },
    images: {
        type: [Schema.imageCollection],
        optional : true
    },
    legalStatus: {
        type: String,  // e.g. - corporation, LLC, sole-proprietorship
        optional: true
    },
    stockSymbol: {
        type: String,
        optional: true
    },
    womanOwned: {
        type: Boolean,
        optional: true
    },
    smallBusiness: {
        type: Boolean,
        optional: true
    },
    mediumBusiness: {
        type: Boolean,
        optional: true
    },
    largeBusiness: {
        type: Boolean,
        optional: true
    },
    yearsBusinessStarted: {
        type: Date,
        optional: true
    },
    rating: {
        type: Number,
        optional: true
    },
    // TODO products have a [String] of developers and publishers.
    events: {
        type: [String], //array of eventIds from the events document type; e.g. = alpha release, beta release, rc, preview, store release, etc.
        optional : true
    }
});

partners.attachSchema(Schema.partner);
partnerTypes.attachSchema(Schema.partnerType);

if (Meteor.isServer) {
    partners.allow({
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

    partnerTypes.allow({
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

partnerTypes.before.insert(function(userId, doc) {
    _.extend(doc, {
        createdAt: new Date(),
        createdBy: userId
    });
});

partners.before.insert(function(userId, doc) {
    _.extend(doc, {
        createdAt: new Date(),
        createdBy: userId
    });
});
