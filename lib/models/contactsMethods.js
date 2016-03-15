contactMethods = new Mongo.Collection('contactMethods');
contactMethodTypes = new Mongo.Collection('contactMethodTypes');

Schema = {};

Schema.contactMethodType = new SimpleSchema({
    name: {
        type: String //e.g. - phone, cell, email, web, etc.
    },
    description: {
        type: String
    }
});

Schema.contactMethod = new SimpleSchema({
    contactMethodTypeId: {
        type: String
    },
    value: {
        type: String //e.g. - +1 (123) 234-3456, person@company.com, etc.
    },
    primaryContact: {
        type: Boolean
    },
    doNotUse: {
        type: Boolean // partner or person opted out of communication for this contact method
    }
});

contactMethods.attachSchema(Schema.contactMethod);
contactMethodTypes.attachSchema(Schema.contactMethodType);

if (Meteor.isServer) {
    contactMethods.allow({
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