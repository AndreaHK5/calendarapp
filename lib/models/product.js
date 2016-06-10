products = new Mongo.Collection('products');
productHealthTrackers = new Mongo.Collection('productHealthTrackers');

Schema = Schema ? Schema : {};

Utility = {};
Utility.enum = Utility.enum || {};


// TODO data collection shoudl be a separate class that refers to a product (or a partner)
// TODO refactor this to have the data and not embed processing in db?
Utility.enum.productHealthTrackerValueType = {
    NUMBER: 1,
    BAR_CHART: 2,
    LINE_CHART: 3,
    PIE_CHART: 3
};

Schema.productHealthTracker = new SimpleSchema({
    title: {
       type: String
    },
    value: {
        type: [String]
    },
    valueType: {
        type: Number // enum value for what this is; e.g. - number, pie chart, bar chart, etc.; Utility.enum.productHealthTrackerValueType;
    },
    history: {
        type: [String]
    }
});

// TODO fix what is required and what is not required and what is min count / max count.

Schema.product = new SimpleSchema({
    title: {
        type: String,
        unique : true
    },
    codeName: {
        type: String,
        unique : true
    },
    description: {
        type: String
    },
    // TODO shoudl this be optional as well?
    team: {
        type: [String], //array of personIds from the persons document type
        optional: true
    },
    images: {
        type: [Schema.imageCollection],
        optional : true
    },
    platforms: {
        type: [String], // array of platformIds from the platform document type
        optional : true
    },
    categories: {
        type: [String], //array of categoryIds from the categories document type
        optional : true
    },
    // TODO shoudl thsi be called be eventIds?
    events: {
        type: [String], //array of eventIds from the events document type; e.g. = alpha release, beta release, rc, preview, store release, etc.
        optional : true
    },
    rating: {
        type: Number,
        optional: true
    },
    developers : {
        type : [String], // array of the partner Id that are involved as developer
        optional : true
    },
    publishers : {
        type : [String], // array of the partner Id that are involved as publisher
        optional : true
    }
});

products.attachSchema(Schema.product);
productHealthTrackers.attachSchema(Schema.productHealthTracker);

if (Meteor.isServer) {
    products.allow({
        insert : function () {
            return true;
        },
        update : function () {
            return true;
        },
        remove : function () {
            return false;
        }
    });

    contactMethodTypes.allow({
        insert : function () {
            return true;
        },
        update : function () {
            return true;
        },
        remove : function () {
            return false;
        }
    });
}

contactMethods.before.insert(function(userId, doc) {
    _.extend(doc, {
        createdAt: new Date()
    });
});

contactMethodTypes.before.insert(function(userId, doc) {
    _.extend(doc, {
        createdAt: new Date()
    });
});






platforms = new Mongo.Collection('platforms');
productCategories = new Mongo.Collection('productCategories');
